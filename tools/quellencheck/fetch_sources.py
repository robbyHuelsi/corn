"""Phase 1 of the source-checking pipeline: retrieve and snapshot every source.

Reads ``out/register.json`` and downloads each source URL into a plain-text
snapshot under ``out/snapshots/``. HTML is reduced to readable text; PDFs are
extracted with pypdf. The raw evidence is stored verbatim so that later phases
judge against the *actual* source text, never against model memory.

Crucially, retrieval is kept strictly separate from judgement: if a URL is not
reachable (paywall, login wall, bot block, server error), it is recorded as
``accessible: false`` and routed to the human-review queue — it is never guessed.
An optional Wayback Machine fallback is attempted for failed fetches.

Run (after extract_register.py)::

    uv run tools/quellencheck/fetch_sources.py
"""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
TIMEOUT = 25
RETRIES = 3  # transient SSL/handshake timeouts (e.g. diw.de) are retried
MIN_USEFUL_CHARS = 400  # below this a 200 response is flagged as suspicious
REQUEST_PAUSE = 1.0  # politeness delay between requests (seconds)

OUT_DIR = Path(__file__).resolve().parent / "out"
SNAPSHOT_DIR = OUT_DIR / "snapshots"

# Tags whose content is not human-readable body text.
DROP_TAGS = {"script", "style", "noscript", "template", "svg", "head"}
# Tags that should introduce a line break in the extracted text.
BREAK_TAGS = {"p", "br", "div", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "blockquote"}


@dataclass
class FetchResult:
    """Outcome of fetching one source URL."""

    fn: int
    url: str
    accessible: bool
    http_status: int | None
    final_url: str | None
    content_type: str | None
    chars: int
    snapshot: str | None
    via_wayback: bool
    note: str
    fetched_at: str


class TextExtractor(HTMLParser):
    """Reduce HTML to readable plain text, dropping scripts/styles/markup."""

    def __init__(self) -> None:
        """Initialise extractor state."""
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._drop_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:  # noqa: ARG002
        """Enter drop mode for non-content tags; emit breaks for block tags."""
        if tag in DROP_TAGS:
            self._drop_depth += 1
        elif tag in BREAK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        """Leave drop mode and emit a break for closing block tags."""
        if tag in DROP_TAGS and self._drop_depth > 0:
            self._drop_depth -= 1
        elif tag in BREAK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        """Collect visible text."""
        if self._drop_depth == 0:
            self.parts.append(data)

    def text(self) -> str:
        """Return collapsed plain text with normalised blank lines."""
        raw = "".join(self.parts)
        raw = re.sub("[ \t\u00a0\u2009\u202f]+", " ", raw)
        raw = re.sub(r"\n[ \t]*", "\n", raw)
        raw = re.sub(r"\n{3,}", "\n\n", raw)
        return raw.strip()


def html_to_text(html: str) -> str:
    """Convert an HTML document to readable plain text."""
    extractor = TextExtractor()
    extractor.feed(html)
    return extractor.text()


def pdf_to_text(data: bytes) -> str:
    """Extract text from PDF bytes using pypdf."""
    from pypdf import PdfReader  # noqa: PLC0415 — lazy import keeps pypdf optional

    reader = PdfReader(BytesIO(data))
    pages = [page.extract_text() or "" for page in reader.pages]
    return re.sub(r"\n{3,}", "\n\n", "\n\n".join(pages)).strip()


def decode(raw: bytes, content_type: str | None) -> str:
    """Decode response bytes using the declared charset, falling back to utf-8."""
    charset = "utf-8"
    if content_type:
        match = re.search(r"charset=([\w-]+)", content_type, re.IGNORECASE)
        if match:
            charset = match.group(1)
    try:
        return raw.decode(charset, errors="replace")
    except LookupError:
        return raw.decode("utf-8", errors="replace")


def http_get(url: str) -> tuple[int, str | None, str | None, bytes]:
    """Perform a GET request, returning (status, content_type, final_url, body)."""
    request = urllib.request.Request(  # known http(s) source URLs only
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
            "Accept-Language": "de,en;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        body = response.read()
        return response.status, response.headers.get("Content-Type"), response.geturl(), body


def http_get_retry(url: str) -> tuple[int, str | None, str | None, bytes]:
    """GET with a few retries to ride out transient SSL/handshake timeouts."""
    last_exc: Exception | None = None
    for attempt in range(RETRIES):
        try:
            return http_get(url)
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError) as exc:
            last_exc = exc
            if isinstance(exc, urllib.error.HTTPError):
                raise  # a real HTTP status (403/404/500) won't change on retry
            time.sleep(1.5 * (attempt + 1))
    raise last_exc or RuntimeError("unreachable")


def wayback_lookup(url: str) -> str | None:
    """Return the closest Wayback Machine snapshot URL, if one exists."""
    api = "https://archive.org/wayback/available?url=" + urllib.parse.quote(url, safe="")
    try:
        status, _ctype, _final, body = http_get(api)
    except (urllib.error.URLError, TimeoutError, OSError):
        return None
    if status != 200:
        return None
    try:
        data = json.loads(body.decode("utf-8", errors="replace"))
    except json.JSONDecodeError:
        return None
    closest = data.get("archived_snapshots", {}).get("closest", {})
    return closest.get("url") if closest.get("available") else None


def slugify(fn: int, idx: int, url: str) -> str:
    """Build a stable snapshot filename for a footnote/URL pair."""
    host = urllib.parse.urlparse(url).netloc.replace("www.", "")
    host = re.sub(r"[^a-z0-9.]+", "_", host.lower())
    return f"fn{fn:02d}_{idx}_{host}.txt"


def body_to_text(content_type: str | None, url: str, body: bytes) -> str:
    """Convert a downloaded body to text based on content type / extension."""
    is_pdf = (content_type and "pdf" in content_type.lower()) or url.lower().split("?")[0].endswith(".pdf")
    if is_pdf:
        return pdf_to_text(body)
    return html_to_text(decode(body, content_type))


def fetch_one(fn: int, idx: int, url: str) -> FetchResult:
    """Fetch a single URL, with a Wayback fallback, and snapshot the text."""
    now = datetime.now(UTC).isoformat(timespec="seconds")
    via_wayback = False
    try:
        status, content_type, final_url, body = http_get_retry(url)
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError) as exc:
        status, content_type, final_url, body = None, None, None, b""
        note = f"Primärabruf fehlgeschlagen: {type(exc).__name__}: {exc}"
        wb = wayback_lookup(url)
        if wb:
            try:
                status, content_type, final_url, body = http_get(wb)
                via_wayback = True
                note += " — Wayback-Snapshot genutzt."
            except (urllib.error.URLError, TimeoutError, OSError) as exc2:
                note += f" — Wayback ebenfalls fehlgeschlagen: {type(exc2).__name__}."
                return _unreachable(fn, url, status, note, now)
        else:
            return _unreachable(fn, url, None, note + " — kein Wayback-Snapshot.", now)

    if status != 200 or not body:
        return _unreachable(fn, url, status, f"HTTP {status}, kein verwertbarer Inhalt.", now)

    try:
        text = body_to_text(content_type, final_url or url, body)
    except Exception as exc:  # pypdf / decoding edge cases
        return _unreachable(fn, url, status, f"Textextraktion fehlgeschlagen: {type(exc).__name__}: {exc}", now)

    snapshot_name = slugify(fn, idx, url)
    (SNAPSHOT_DIR / snapshot_name).write_text(text, encoding="utf-8")
    note = "OK"
    if len(text) < MIN_USEFUL_CHARS:
        note = f"⚠️ Sehr wenig Text ({len(text)} Zeichen) — evtl. Paywall/JS-Seite, manuell prüfen."
    return FetchResult(
        fn=fn,
        url=url,
        accessible=True,
        http_status=status,
        final_url=final_url,
        content_type=content_type,
        chars=len(text),
        snapshot=snapshot_name,
        via_wayback=via_wayback,
        note=note,
        fetched_at=now,
    )


def _unreachable(fn: int, url: str, status: int | None, note: str, now: str) -> FetchResult:
    """Build a FetchResult for a source that could not be retrieved."""
    return FetchResult(
        fn=fn,
        url=url,
        accessible=False,
        http_status=status,
        final_url=None,
        content_type=None,
        chars=0,
        snapshot=None,
        via_wayback=False,
        note=note,
        fetched_at=now,
    )


def main() -> None:
    """Fetch all source URLs from the register and write fetch_status.json."""
    register = json.loads((OUT_DIR / "register.json").read_text(encoding="utf-8"))
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

    results: list[FetchResult] = []
    for footnote in register["footnotes"]:
        fn = footnote["number"]
        for idx, url in enumerate(footnote["urls"], 1):
            print(f"fn{fn:02d} [{idx}] {url}")
            result = fetch_one(fn, idx, url)
            flag = "OK " if result.accessible else "FAIL"
            print(f"    -> {flag} {result.note} ({result.chars} chars)")
            results.append(result)
            time.sleep(REQUEST_PAUSE)

    status_path = OUT_DIR / "fetch_status.json"
    status_path.write_text(
        json.dumps([asdict(r) for r in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    ok = sum(1 for r in results if r.accessible)
    print(f"\n{ok}/{len(results)} Quellen abgerufen. Status: {status_path}")
    print(f"Nicht erreichbar (→ Mensch-Queue): {[f'fn{r.fn}' for r in results if not r.accessible]}")


if __name__ == "__main__":
    main()
