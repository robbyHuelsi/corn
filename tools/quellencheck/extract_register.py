"""Phase 0 of the source-checking pipeline: build the citation register.

Deterministically parse ``src/index.html`` and emit a typed worklist that maps
every footnote (``fn1`` … ``fnN``) to its definition (label + source URLs) and to
every in-text claim block that references it. No web access and no LLM judgement
happen here — this step only enumerates what has to be checked, so the result is
fully reproducible and immune to the footnote-renumbering drift that desynced the
previous manual audit.

Output (written next to ``src/`` under ``tools/quellencheck/out/``):

* ``register.json`` — machine-readable register consumed by the later phases.
* ``register.md``    — human-readable worklist for review.

Run::

    uv run tools/quellencheck/extract_register.py
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path

# Block-level tags whose text content forms one checkable claim unit.
BLOCK_TAGS = {"p", "li", "blockquote", "cite", "figcaption", "td", "th"} | {f"h{n}" for n in range(1, 7)}

# div/span elements are treated as blocks only when they carry one of these
# classes (stat cards and solution highlights split the number and its label
# into sibling elements).
BLOCK_CLASSES = {"stat-value", "stat-label", "solution-highlight-value", "solution-highlight-label"}

# Void elements never receive a matching close tag.
VOID_TAGS = {"br", "img", "hr", "input", "meta", "link", "source", "area", "base", "col", "embed", "wbr"}

# Opening German quote is U+201E (,,); closing may be U+201C, U+201D or a straight
# double quote depending on how the markup was typed.
QUOTE_RE = re.compile(r"„(.+?)[“”\"]", re.DOTALL)

# Numeric/statistical tokens that must match the source verbatim. The class
# uses explicit escapes for en-dash, minus and thin/narrow spaces because those
# exact glyphs appear in the page's numbers (e.g. "27\u201335 %", "200\u2013250 Mrd.").
NUMBER_RE = re.compile(
    "\\d[\\d.,\u2013\u2212\u2009\u202f \\-]*\\s?(?:%|\u20ac|\\$|Prozent|Mrd\\.?|Mio\\.?|Milliarden?|Millionen?)",
)

REF_HREF_RE = re.compile(r"#fn(\d+)$")


@dataclass
class Block:
    """A text-bearing element captured from the HTML, with its footnote refs."""

    open_idx: int
    tag: str
    classes: tuple[str, ...]
    fns: set[int] = field(default_factory=set)
    text_parts: list[str] = field(default_factory=list)
    child_count: int = 0
    in_footnotes: bool = False

    @property
    def text(self) -> str:
        """Return the collapsed text content of the block."""
        return re.sub(r"\s+", " ", "".join(self.text_parts)).strip()

    @property
    def is_leaf(self) -> bool:
        """Return True when no nested block contributed text to this block."""
        return self.child_count == 0


class RegisterParser(HTMLParser):
    """Collect footnote definitions and footnote-referencing claim blocks."""

    def __init__(self) -> None:
        """Initialise parser state."""
        super().__init__(convert_charrefs=True)
        self.tag_stack: list[str] = []
        self.skip_stack: list[bool] = []  # True when inside an fn-ref badge/anchor
        self.block_stack: list[Block] = []
        self.blocks: list[Block] = []
        self._open_counter = 0
        self._footnotes_depth: int | None = None

    # -- helpers --------------------------------------------------------------

    def _is_block(self, tag: str, classes: tuple[str, ...]) -> bool:
        if tag in BLOCK_TAGS:
            return True
        return tag in {"div", "span"} and any(c in BLOCK_CLASSES for c in classes)

    @staticmethod
    def _classes(attrs: list[tuple[str, str | None]]) -> tuple[str, ...]:
        for name, value in attrs:
            if name == "class" and value:
                return tuple(value.split())
        return ()

    @staticmethod
    def _attr(attrs: list[tuple[str, str | None]], key: str) -> str | None:
        for name, value in attrs:
            if name == key:
                return value
        return None

    # -- HTMLParser callbacks -------------------------------------------------

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Track the tag stack, footnotes region, blocks and footnote refs."""
        element_id = self._attr(attrs, "id")
        if element_id == "footnotesCollapse":
            self._footnotes_depth = len(self.tag_stack)

        # A footnote reference: <a href="#fnN"> in the body, or the leading
        # <span class="fn-ref">N</span> inside a definition (ignored there).
        href = self._attr(attrs, "href") or ""
        ref_match = REF_HREF_RE.search(href)
        if ref_match and self.block_stack:
            number = int(ref_match.group(1))
            for block in self.block_stack:  # bubble to all open ancestor blocks
                block.fns.add(number)

        classes = self._classes(attrs)
        if tag not in VOID_TAGS:
            self.tag_stack.append(tag)
            parent_skip = self.skip_stack[-1] if self.skip_stack else False
            self.skip_stack.append(parent_skip or "fn-ref" in classes)

        if self._is_block(tag, classes):
            block = Block(
                open_idx=self._open_counter,
                tag=tag,
                classes=classes,
                in_footnotes=self._footnotes_depth is not None,
            )
            self._open_counter += 1
            if self.block_stack:
                self.block_stack[-1].child_count += 1
            self.block_stack.append(block)
            self.blocks.append(block)

    def handle_endtag(self, tag: str) -> None:
        """Pop the matching open block and bubble its text to the parent."""
        if tag in VOID_TAGS:
            return
        classes_top = self.block_stack[-1].classes if self.block_stack else ()
        if self.block_stack and self._is_block(tag, classes_top) and self.block_stack[-1].tag == tag:
            finished = self.block_stack.pop()
            if self.block_stack:
                self.block_stack[-1].text_parts.extend(finished.text_parts)
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
            self.skip_stack.pop()
        if self._footnotes_depth is not None and len(self.tag_stack) <= self._footnotes_depth:
            self._footnotes_depth = None

    def handle_data(self, data: str) -> None:
        """Append text to the innermost open block, skipping fn-ref badge text."""
        if self.skip_stack and self.skip_stack[-1]:
            return
        if self.block_stack and data.strip():
            self.block_stack[-1].text_parts.append(data)


def classify(text: str) -> str:
    """Heuristically type a claim block (refined later during verification)."""
    has_quote = bool(QUOTE_RE.search(text))
    has_number = bool(NUMBER_RE.search(text))
    if has_quote:
        return "ZITAT"
    if has_number:
        return "ZAHL"
    return "AUSSAGE"


def extract_quotes(text: str) -> list[str]:
    """Return all German-quoted substrings, longest first."""
    quotes = [re.sub(r"\s+", " ", q).strip() for q in QUOTE_RE.findall(text)]
    return sorted({q for q in quotes if q}, key=len, reverse=True)


def extract_numbers(text: str) -> list[str]:
    """Return all statistical tokens found in the text."""
    return [re.sub(r"\s+", " ", m.group(0)).strip() for m in NUMBER_RE.finditer(text)]


def parse_definitions(blocks: list[Block]) -> dict[int, dict]:
    """Build the footnote-definition map from blocks inside the footnotes area."""
    definitions: dict[int, dict] = {}
    for block in blocks:
        if not block.in_footnotes or block.tag != "p":
            continue
        # The leading badge holds the footnote number as plain text.
        head = block.text.lstrip()
        num_match = re.match(r"(\d+)", head)
        if not num_match:
            continue
        number = int(num_match.group(1))
        label = head[num_match.end() :].strip(" .")
        definitions[number] = {"number": number, "label": label}
    return definitions


def main() -> None:
    """Parse the HTML and write register.json and register.md."""
    root = Path(__file__).resolve().parents[2]
    html_path = root / "src" / "index.html"
    out_dir = Path(__file__).resolve().parent / "out"
    out_dir.mkdir(exist_ok=True)

    html = html_path.read_text(encoding="utf-8")
    parser = RegisterParser()
    parser.feed(html)

    blocks = sorted(parser.blocks, key=lambda b: b.open_idx)

    # Footnote definitions: parse the leading span text via regex on raw HTML so
    # the badge number and the linked source URLs are captured precisely.
    definitions = parse_footnote_html(html)

    # Map every body claim block to the footnotes it references.
    leaf_by_idx = {b.open_idx: b for b in blocks if b.is_leaf}
    leaf_order = sorted(leaf_by_idx)

    def context_before(block: Block) -> str:
        prev_idx = [i for i in leaf_order if i < block.open_idx]
        if not prev_idx:
            return ""
        cand = leaf_by_idx[prev_idx[-1]]
        return cand.text if cand.text and not cand.fns else ""

    uses_by_fn: dict[int, list[dict]] = {n: [] for n in definitions}
    seen: set[tuple[int, int]] = set()
    for block in blocks:
        if block.in_footnotes or not block.fns:
            continue
        ctx = context_before(block) if any(c in BLOCK_CLASSES for c in block.classes) else ""
        full = f"{ctx} {block.text}".strip() if ctx else block.text
        for number in sorted(block.fns):
            key = (number, block.open_idx)
            if key in seen:
                continue
            seen.add(key)
            uses_by_fn.setdefault(number, []).append(
                {
                    "tag": block.tag,
                    "classes": list(block.classes),
                    "context_before": ctx,
                    "text": block.text,
                    "full_claim": full,
                    "type": classify(full),
                    "quotes": extract_quotes(block.text),
                    "numbers": extract_numbers(full),
                },
            )

    # Drop redundant <cite> blocks whose text is fully contained in a larger
    # claim block for the same footnote (the blockquote already carries it).
    for number, uses in uses_by_fn.items():
        kept: list[dict] = []
        for use in sorted(uses, key=lambda u: len(u["text"]), reverse=True):
            if any(use["text"] and use["text"] in k["text"] for k in kept):
                continue
            kept.append(use)
        uses_by_fn[number] = sorted(kept, key=lambda u: u["full_claim"])

    register = build_register(definitions, uses_by_fn)
    (out_dir / "register.json").write_text(json.dumps(register, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "register.md").write_text(render_markdown(register), encoding="utf-8")

    n_claims = sum(len(fn["uses"]) for fn in register["footnotes"])
    print(f"Parsed {len(register['footnotes'])} footnotes and {n_claims} in-text claim references.")
    print(f"Wrote {out_dir / 'register.json'}")
    print(f"Wrote {out_dir / 'register.md'}")


def parse_footnote_html(html: str) -> dict[int, dict]:
    """Extract each footnote definition (label + source URLs) from raw HTML."""
    definitions: dict[int, dict] = {}
    # Each definition is <p ... id="fnN"> ... </p>.
    for match in re.finditer(r'<p[^>]*id="fn(\d+)"[^>]*>(.*?)</p>', html, re.DOTALL):
        number = int(match.group(1))
        inner = match.group(2)
        urls = re.findall(r'href="([^"]+)"', inner)
        # Strip tags for the label text.
        label = re.sub(r"<[^>]+>", " ", inner)
        label = re.sub(r"\s+", " ", label).strip()
        label = re.sub(r"^\d+\s*", "", label)  # drop the leading badge number
        definitions[number] = {"number": number, "label": label, "urls": urls}
    return definitions


def build_register(definitions: dict[int, dict], uses_by_fn: dict[int, list[dict]]) -> dict:
    """Assemble the final register structure ordered by footnote number."""
    footnotes = []
    for number in sorted(definitions):
        definition = definitions[number]
        footnotes.append(
            {
                "number": number,
                "label": definition["label"],
                "urls": definition["urls"],
                "uses": uses_by_fn.get(number, []),
            },
        )
    return {"footnotes": footnotes}


def render_markdown(register: dict) -> str:
    """Render the register as a human-readable worklist."""
    lines = ["# Quellen-Register (Phase 0 — automatisch generiert)", ""]
    lines.append(f"Insgesamt {len(register['footnotes'])} Fußnoten. Jede Behauptung wird einzeln geprüft.")
    lines.append("")
    for fn in register["footnotes"]:
        lines.append(f"## fn{fn['number']} — {fn['label']}")
        lines.extend(f"- Quelle: {url}" for url in fn["urls"])
        if not fn["uses"]:
            lines.append("- ⚠️ Keine In-Text-Referenz gefunden (nur Definition).")
        for i, use in enumerate(fn["uses"], 1):
            lines.append(f"- **Behauptung {i}** [{use['type']}]: {use['full_claim']}")
            lines.extend(f"    - Zitat: „{quote}“" for quote in use["quotes"])
            if use["numbers"]:
                lines.append(f"    - Zahlen: {', '.join(use['numbers'])}")
        lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
