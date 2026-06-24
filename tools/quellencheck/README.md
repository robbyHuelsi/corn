# Quellencheck-Pipeline

Halb-automatisierte, **halluzinationsresistente** Prüfung aller Quellenangaben der
Web-App (`src/index.html` + YAML-Daten). Die Pipeline trennt strikt
**deterministische Schritte** (Python, reproduzierbar, kann nicht halluzinieren)
von der **geerdeten Urteilsphase** (LLM/Mensch, aber nur auf Basis des tatsächlich
abgerufenen Quelltexts).

Hintergrund: Frühere rein-LLM-Versuche haben halluziniert (richtige Quellen als
falsch markiert und umgekehrt), weil das Modell aus dem Gedächtnis statt aus der
Quelle urteilte, einen Bestätigungs-Bias hatte und bei Paywalls geraten hat. Diese
Pipeline schließt genau diese drei Lücken.

## Die 5 Prinzipien (State of the Art)

Abgeleitet aus SAFE (DeepMind), VeriScore, MiniCheck, Citation-Enhanced Generation
und „Deterministic Quoting":

1. **Retrieval-grounded, nie aus dem Gedächtnis** — jede Quelle wird abgerufen und
   als Text-Snapshot gespeichert; geurteilt wird nur gegen diesen Text.
2. **Claim Decomposition** — jede Fußnote wird in atomare, einzeln prüfbare
   Behauptungen zerlegt (Zahl / Zitat / Aussage).
3. **Beleg-Zwang** — kein Urteil ohne wörtlich aus dem Snapshot kopierte
   Belegstelle.
4. **Deterministische Zitat- & Zahlenprüfung** — wörtliche Übereinstimmung wird per
   String-Matching geprüft, nicht vom LLM beurteilt.
5. **Pflicht-Abstention + Gegen-Pass** — kein Zugang = `NICHT_ÜBERPRÜFBAR` (kein
   Raten); plus unabhängiger, gegenläufig gerahmter zweiter Durchlauf.

## Phasen & Skripte

| Phase                | Skript                    | Determiniert? | Ausgabe                                          |
| -------------------- | ------------------------- | ------------- | ------------------------------------------------ |
| 0 — Register         | `extract_register.py`     | ✅ ja         | `out/register.json`, `out/register.md`           |
| 1 — Retrieval        | `fetch_sources.py`        | ✅ ja         | `out/snapshots/*.txt`, `out/fetch_status.json`   |
| 3 — Zitat/Zahl       | `verify_deterministic.py` | ✅ ja         | `out/deterministic.json`, `out/deterministic.md` |
| 2 — Geerdetes Urteil | _Protokoll unten_         | ⚠️ LLM/Mensch | `out/verdicts.md`                                |
| 4 — Bericht          | _Zusammenführung_         | ⚠️ LLM/Mensch | `../../quellenprüfung.md`                        |

### Ausführen

```bash
uv run tools/quellencheck/extract_register.py
uv run tools/quellencheck/fetch_sources.py
uv run tools/quellencheck/verify_deterministic.py
# danach: Phase-2-Protokoll (siehe unten) für die geflaggten Behauptungen
```

Voraussetzung: `pypdf` (für PDF-Quellen) — `uv pip install pypdf`.

## Phase 2 — Verifikations-Protokoll (geerdetes Urteil)

Für **jede** Behauptung, die Phase 3 nicht eindeutig als `VERBATIM`/`PRESENT`
bestätigt hat (sowie für jede `AUSSAGE`/Paraphrase), gilt:

**Regeln (nicht verhandelbar):**

1. **Nur Snapshot.** Urteile ausschließlich auf Basis von `out/snapshots/…` der
   referenzierten Fußnote. Kein Vorwissen, keine zweite Websuche zur „Bestätigung".
2. **Beleg-Zwang.** Notiere die **wörtlich kopierte** Belegstelle aus dem Snapshot.
   Findest Du keine, lautet das Urteil `NICHT_IN_QUELLE` — nicht „wahrscheinlich
   korrekt".
3. **Abstention.** Ist der Snapshot nicht verfügbar (`accessible: false`) oder eine
   reine Katalog-/Verkaufsseite ohne den zitierten Inhalt → `NICHT_ÜBERPRÜFBAR`
   und ab in die Mensch-Queue. Niemals raten.
4. **Übersetzte Zitate (zwei Stufen).** Deutsches Zitat aus fremdsprachiger Quelle:
   (a) Original-Wortlaut im Snapshot verbatim belegen, (b) Übersetzungstreue
   beurteilen. Stimmt (a) nicht, ist es kein Zitat dieser Quelle.
5. **Bereiche über mehrere Quellen.** Ein Bereich („27–35 %") darf von zwei
   Fußnoten gemeinsam belegt sein (Untergrenze Quelle A, Obergrenze Quelle B). Das
   ist korrekt — Phase 3 flaggt es als `PARTIAL`, das Urteil löst es auf.
6. **Kontext-Check.** Halte fest, worum es in der Quelle insgesamt geht, und ob die
   Rahmung der Behauptung dazu passt (nicht aus dem Kontext gerissen).

**Urteilsschema je Behauptung:**

`SUPPORTED` · `PARTIALLY` · `REFUTED` · `NICHT_IN_QUELLE` · `NICHT_ÜBERPRÜFBAR`

## Akzeptanz-Ledger (`accepted.json`)

Damit einmal menschlich geprüfte Befunde bei jedem erneuten Lauf nicht wieder als
„auffällig" auftauchen, werden sie im versionierten Ledger `accepted.json`
festgehalten:

```bash
# Offene Befunde der genannten Fußnoten akzeptieren (mit Begründung):
uv run tools/quellencheck/accept.py --fn 8 10 11 16 --reason "Mensch-geprüft: ok" --by NAME
# Ledger ansehen:
uv run tools/quellencheck/accept.py --list
```

`verify_deterministic.py` unterdrückt akzeptierte Befunde danach in der
„offene Auffälligkeiten"-Liste und markiert sie im Bericht mit 🧑‍⚖️ AKZEPTIERT.

**Sicherheitsnetz:** Der Fingerprint einer Akzeptanz bindet an den **Behauptungstext
plus die Prüf-Verdikte** (`fn + normalisierter Claim + Verdict-Labels`) — _nicht_ an
die Prozentwerte. Ändert sich das Zitat/die Zahl im HTML oder kippt ein Verdikt
(z. B. weil die Quelle sich geändert hat), ändert sich der Fingerprint und der
Befund **erscheint wieder** zur erneuten Prüfung. Eine Akzeptanz kann also nie
stillschweigend einen echten neuen Fehler verdecken.

## Phase 4 — Gegen-Pass & Bericht

- **Gegen-Pass (Bestätigungs-Bias-Bremse):** Jede `SUPPORTED`-Behauptung in einem
  zweiten, frischen Durchlauf gegenläufig prüfen („Suche im Snapshot Belege, dass
  die Aussage NICHT stimmt"). Weicht das Urteil ab → `HUMAN_REVIEW`.
- **Bericht:** Ergebnisse in `../../quellenprüfung.md` zusammenführen, je Behauptung
  mit Urteil, Belegstelle, URL und (bei Zitaten) Verbatim-Score.

## Hinweise

- Snapshots unter `out/snapshots/` sind abgerufene Fremdinhalte und werden **nicht**
  versioniert (siehe `.gitignore`). Versioniert werden Skripte, `register.*`,
  `fetch_status.json`, `deterministic.*`, das Akzeptanz-Ledger `accepted.json`
  und der Bericht.
- Erneut ausführen aktualisiert alles reproduzierbar; ändert sich die
  Fußnoten-Nummerierung im HTML, bleibt das Register automatisch synchron.
