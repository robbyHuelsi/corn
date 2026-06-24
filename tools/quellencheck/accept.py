"""Phase 2 helper: record human-accepted findings into the acceptance ledger.

Once a flagged finding has been reviewed and judged acceptable (e.g. a faithful
translated quote, or a book quote whose URL is only a catalogue page), accept it
here. The pipeline then stops reporting it as an open issue on future runs —
*unless* the underlying claim text or a check verdict changes, in which case the
fingerprint changes and the finding correctly re-surfaces for re-review.

Accept the currently flagged findings of one or more footnotes::

    uv run tools/quellencheck/accept.py --fn 8 9 10 11 14 16 --reason "Mensch-geprüft: ok"

List the ledger::

    uv run tools/quellencheck/accept.py --list
"""

from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime

import verify_deterministic as vd


def load_report() -> list[dict]:
    """Load the latest deterministic report."""
    path = vd.OUT_DIR / "deterministic.json"
    if not path.exists():
        msg = "out/deterministic.json fehlt — bitte zuerst verify_deterministic.py ausführen."
        raise SystemExit(msg)
    return json.loads(path.read_text(encoding="utf-8"))


def load_ledger() -> list[dict]:
    """Load the acceptance ledger (or an empty list)."""
    if not vd.ACCEPTED_PATH.exists():
        return []
    return json.loads(vd.ACCEPTED_PATH.read_text(encoding="utf-8"))


def save_ledger(entries: list[dict]) -> None:
    """Persist the acceptance ledger."""
    vd.ACCEPTED_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")


def accept(fns: list[int], reason: str, by: str) -> None:
    """Accept all claims of the given footnotes (flagged or not) into the ledger.

    Pinning even an unflagged claim is safe: the fingerprint encodes the current
    verdict state, so if the source later changes and a verdict flips, the finding
    re-surfaces automatically.
    """
    report = load_report()
    ledger = load_ledger()
    known = {entry["fingerprint"] for entry in ledger}
    today = datetime.now(UTC).date().isoformat()

    added = 0
    missing: list[int] = []
    for fn in fns:
        items = [item for item in report if item["fn"] == fn]
        if not items:
            missing.append(fn)
            continue
        flagged_here = sum(1 for item in items if vd.is_flagged(item))
        for item in items:
            fingerprint = vd.claim_fingerprint(item)
            if fingerprint in known:
                continue
            ledger.append(
                {
                    "fingerprint": fingerprint,
                    "fn": fn,
                    "type": item["type"],
                    "claim": item["claim"],
                    "was_flagged": vd.is_flagged(item),
                    "open_quotes": [q["quote"] for q in item["quote_checks"] if q["verdict"] != "VERBATIM"],
                    "open_numbers": [n["token"] for n in item["number_checks"] if n["verdict"] != "PRESENT"],
                    "reason": reason,
                    "accepted_by": by,
                    "accepted_at": today,
                },
            )
            known.add(fingerprint)
            added += 1
        print(f"  fn{fn}: {len(items)} Behauptung(en) erfasst, davon {flagged_here} geflaggt.")

    save_ledger(ledger)
    print(f"{added} neue(r) Befund(e) akzeptiert und in {vd.ACCEPTED_PATH.name} gespeichert.")
    if missing:
        print(f"Hinweis: fn{missing} nicht im Register gefunden.")
    print("Aktualisiere deterministischen Bericht …\n")
    vd.main()  # regenerate reports with the new acceptances applied


def show() -> None:
    """Print the current acceptance ledger."""
    ledger = load_ledger()
    if not ledger:
        print("Akzeptanz-Ledger ist leer.")
        return
    print(f"{len(ledger)} akzeptierte Befunde:")
    for entry in ledger:
        print(f"  fn{entry['fn']} [{entry['type']}] ({entry['accepted_at']}): {entry['reason']}")
        print(f"      {entry['claim'][:90]}")


def main() -> None:
    """Parse arguments and dispatch."""
    parser = argparse.ArgumentParser(description="Akzeptanz-Ledger für die Quellenprüfung verwalten.")
    parser.add_argument("--fn", type=int, nargs="+", help="Fußnoten-Nummern, deren offene Befunde akzeptiert werden.")
    parser.add_argument("--reason", help="Begründung der Akzeptanz (Pflicht beim Akzeptieren).")
    parser.add_argument("--by", default="human", help="Name der prüfenden Person (Standard: human).")
    parser.add_argument("--list", action="store_true", help="Aktuelles Ledger anzeigen.")
    args = parser.parse_args()

    if args.list:
        show()
        return
    if not args.fn or not args.reason:
        parser.error("Zum Akzeptieren --fn und --reason angeben (oder --list).")
    accept(args.fn, args.reason, args.by)


if __name__ == "__main__":
    main()
