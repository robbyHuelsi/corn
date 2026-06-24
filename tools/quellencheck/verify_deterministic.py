"""Phase 3 of the source-checking pipeline: deterministic quote & number checks.

For every claim in the register this step compares the cited material against the
fetched source snapshots **without any LLM judgement**:

* Direct quotes are matched with a three-tier strategy (exact substring →
  normalised substring → longest-common-block fuzzy coverage). German quotes that
  translate a foreign-language source will legitimately score low here and are
  thereby flagged as "needs translation-fidelity check", not as wrong.
* Statistical tokens (percentages, € / $ amounts, ranges) are checked for verbatim
  presence in the source text — this is what deterministically catches the kind of
  "55 % vs 66 %" number error that slipped through the earlier manual audit.

The output (``out/deterministic.json`` / ``out/deterministic.md``) is hard
evidence the human/LLM verification phase builds on; it cannot hallucinate.

Run (after fetch_sources.py)::

    uv run tools/quellencheck/verify_deterministic.py
"""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import asdict, dataclass
from difflib import SequenceMatcher
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent / "out"
SNAPSHOT_DIR = OUT_DIR / "snapshots"
# Human-curated ledger of findings that have been reviewed and accepted, so they
# are no longer reported as flagged on re-runs (see accept.py). Versioned.
ACCEPTED_PATH = Path(__file__).resolve().parent / "accepted.json"

VERBATIM_THRESHOLD = 0.97
CLOSE_THRESHOLD = 0.60

DASHES = "\u2013\u2014\u2212-"
QUOTES = "\u201e\u201c\u201d\"'\u00bb\u00ab\u201a\u2018\u2019"


def normalize(text: str) -> str:
    """Lowercase and canonicalise dashes, quotes and whitespace for matching."""
    text = text.casefold()
    text = re.sub(f"[{re.escape(DASHES)}]", "-", text)
    text = re.sub(f"[{re.escape(QUOTES)}]", "", text)
    text = text.replace("*", "")  # gender asterisks (Bürger*innen)
    return re.sub(r"\s+", " ", text).strip()


@dataclass
class QuoteCheck:
    """Result of matching one quote against the available source snapshots."""

    quote: str
    verdict: str  # VERBATIM | CLOSE | NOT_FOUND
    coverage: float
    snapshot: str | None
    matched_span: str | None


@dataclass
class NumberCheck:
    """Result of checking one statistical token against the source snapshots."""

    token: str
    parts_found: list[str]
    parts_missing: list[str]
    verdict: str  # PRESENT | PARTIAL | ABSENT
    snapshot: str | None


def numeric_parts(token: str) -> list[str]:
    """Split a statistical token into the bare numbers it asserts (ranges → both)."""
    return re.findall(r"\d+(?:[.,]\d+)?", token)


def number_in_source(part: str, source_norm: str) -> bool:
    """Check whether a single number appears in the (normalised) source text."""
    # Accept comma/point decimal interchange and optional thousands separators.
    alt = part.replace(",", ".")
    candidates = {part, alt, part.replace(",", ""), alt.replace(".", "")}
    digits = part.replace(",", "").replace(".", "")
    candidates.add(digits)
    pattern = "|".join(re.escape(c) for c in sorted(candidates, key=len, reverse=True) if c)
    return re.search(rf"(?<!\d)(?:{pattern})(?!\d)", source_norm) is not None


def best_quote_match(quote: str, snapshots: dict[str, str]) -> QuoteCheck:
    """Match a quote against every snapshot, returning the strongest result."""
    quote_norm = normalize(quote)
    best = QuoteCheck(quote=quote, verdict="NOT_FOUND", coverage=0.0, snapshot=None, matched_span=None)
    for name, text in snapshots.items():
        source_norm = normalize(text)
        # Tier 1 & 2: exact / normalised substring.
        if quote in text or quote_norm in source_norm:
            return QuoteCheck(quote=quote, verdict="VERBATIM", coverage=1.0, snapshot=name, matched_span=quote)
        # Tier 3: longest common contiguous block as a coverage ratio.
        matcher = SequenceMatcher(None, quote_norm, source_norm, autojunk=False)
        block = matcher.find_longest_match(0, len(quote_norm), 0, len(source_norm))
        coverage = block.size / len(quote_norm) if quote_norm else 0.0
        if coverage > best.coverage:
            span = source_norm[block.b : block.b + block.size]
            if coverage >= VERBATIM_THRESHOLD:
                verdict = "VERBATIM"
            elif coverage >= CLOSE_THRESHOLD:
                verdict = "CLOSE"
            else:
                verdict = "NOT_FOUND"
            best = QuoteCheck(
                quote=quote,
                verdict=verdict,
                coverage=round(coverage, 3),
                snapshot=name,
                matched_span=span,
            )
    return best


def best_number_check(token: str, snapshots: dict[str, str]) -> NumberCheck:
    """Check a statistical token against every snapshot, returning the best hit."""
    parts = numeric_parts(token)
    best = NumberCheck(token=token, parts_found=[], parts_missing=parts, verdict="ABSENT", snapshot=None)
    for name, text in snapshots.items():
        source_norm = normalize(text)
        found = [p for p in parts if number_in_source(p, source_norm)]
        missing = [p for p in parts if p not in found]
        verdict = "PRESENT" if not missing else "PARTIAL" if found else "ABSENT"
        if len(found) > len(best.parts_found):
            best = NumberCheck(token=token, parts_found=found, parts_missing=missing, verdict=verdict, snapshot=name)
    return best


def load_snapshots(fns: list[int], status_by_fn: dict[int, list[dict]]) -> dict[str, str]:
    """Load all available snapshot texts for the given footnote numbers."""
    snapshots: dict[str, str] = {}
    for fn in fns:
        for entry in status_by_fn.get(fn, []):
            name = entry.get("snapshot")
            if name and (SNAPSHOT_DIR / name).exists():
                snapshots[name] = (SNAPSHOT_DIR / name).read_text(encoding="utf-8")
    return snapshots


def is_flagged(item: dict) -> bool:
    """Return True if a claim has any non-VERBATIM quote or non-PRESENT number."""
    return any(q["verdict"] != "VERBATIM" for q in item["quote_checks"]) or any(
        n["verdict"] != "PRESENT" for n in item["number_checks"]
    )


def claim_fingerprint(item: dict) -> str:
    """Stable fingerprint of a finding's *reviewed state*.

    Binds to the footnote, the normalised claim text and the verdict labels of its
    checks (not the coverage floats). If the claim text changes or any verdict
    flips — e.g. the source page changed — the fingerprint changes and the finding
    re-surfaces, so an acceptance can never silently mask a genuinely new problem.
    """
    quote_verdicts = sorted(f"{q['quote']}={q['verdict']}" for q in item["quote_checks"])
    number_verdicts = sorted(f"{n['token']}={n['verdict']}" for n in item["number_checks"])
    payload = "|".join([str(item["fn"]), normalize(item["claim"]), *quote_verdicts, *number_verdicts])
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()[:12]  # noqa: S324 — non-cryptographic id


def load_accepted() -> dict[str, dict]:
    """Load the acceptance ledger keyed by fingerprint."""
    if not ACCEPTED_PATH.exists():
        return {}
    entries = json.loads(ACCEPTED_PATH.read_text(encoding="utf-8"))
    return {entry["fingerprint"]: entry for entry in entries}


def main() -> None:
    """Run deterministic quote and number checks for the whole register."""
    register = json.loads((OUT_DIR / "register.json").read_text(encoding="utf-8"))
    status = json.loads((OUT_DIR / "fetch_status.json").read_text(encoding="utf-8"))
    accepted = load_accepted()

    status_by_fn: dict[int, list[dict]] = {}
    for entry in status:
        status_by_fn.setdefault(entry["fn"], []).append(entry)

    report: list[dict] = []
    for footnote in register["footnotes"]:
        fn = footnote["number"]
        for use in footnote["uses"]:
            snapshots = load_snapshots([fn], status_by_fn)
            quote_checks = [best_quote_match(q, snapshots) for q in use["quotes"]]
            number_checks = [best_number_check(t, snapshots) for t in use["numbers"]]
            item = {
                "fn": fn,
                "type": use["type"],
                "claim": use["full_claim"],
                "snapshots_used": sorted(snapshots),
                "quote_checks": [asdict(q) for q in quote_checks],
                "number_checks": [asdict(n) for n in number_checks],
            }
            item["fingerprint"] = claim_fingerprint(item)
            accepted_entry = accepted.get(item["fingerprint"])
            item["accepted"] = accepted_entry is not None
            item["accepted_reason"] = accepted_entry["reason"] if accepted_entry else None
            report.append(item)

    (OUT_DIR / "deterministic.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "deterministic.md").write_text(render(report), encoding="utf-8")
    print(f"Deterministic checks for {len(report)} claims written to out/deterministic.*")
    _print_flags(report)


def render(report: list[dict]) -> str:
    """Render the deterministic findings as Markdown."""
    icon = {"VERBATIM": "✅", "CLOSE": "⚠️", "NOT_FOUND": "❌", "PRESENT": "✅", "PARTIAL": "⚠️", "ABSENT": "❌"}
    lines = ["# Deterministische Prüfung (Phase 3)", ""]
    for item in report:
        accepted = " 🧑‍⚖️ AKZEPTIERT" if item.get("accepted") else ""
        lines.append(f"## fn{item['fn']} [{item['type']}]{accepted} — {item['claim']}")
        lines.append(f"- Snapshots: {', '.join(item['snapshots_used']) or '— keine —'}")
        if item.get("accepted"):
            lines.append(f"- 🧑‍⚖️ Mensch-geprüft & akzeptiert: {item['accepted_reason']}")
        for q in item["quote_checks"]:
            lines.append(f"- {icon.get(q['verdict'], '?')} Zitat ({q['coverage']:.0%}, {q['verdict']}): „{q['quote']}“")
            if q["verdict"] != "VERBATIM" and q["matched_span"]:
                lines.append(f"    - längster Treffer: …{q['matched_span']}…")
        for n in item["number_checks"]:
            detail = f"gefunden {n['parts_found']}, fehlt {n['parts_missing']}"
            lines.append(f"- {icon.get(n['verdict'], '?')} Zahl {n['token']} [{n['verdict']}]: {detail}")
        lines.append("")
    return "\n".join(lines)


def _print_flags(report: list[dict]) -> None:
    """Print claims needing attention, excluding human-accepted findings."""
    flagged = [item for item in report if is_flagged(item)]
    open_items = [item for item in flagged if not item.get("accepted")]
    accepted_items = [item for item in flagged if item.get("accepted")]
    print(
        f"\n{len(open_items)} offene Auffälligkeit(en); "
        f"{len(accepted_items)} bereits akzeptiert (unterdrückt).",
    )
    for item in open_items:
        bad_q = [q["quote"][:40] for q in item["quote_checks"] if q["verdict"] != "VERBATIM"]
        bad_n = [n["token"] for n in item["number_checks"] if n["verdict"] != "PRESENT"]
        print(f"  fn{item['fn']}: Zitate={bad_q} Zahlen={bad_n}")


if __name__ == "__main__":
    main()
