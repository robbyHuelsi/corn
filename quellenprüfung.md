# Quellenprüfung — „Vermögen in Maiskörnern"

Systematische, **halluzinationsresistente** Überprüfung aller **26 Fußnoten**
(`fn1`–`fn26`) in `src/index.html` sowie der Datenquellen in `wealthy.yaml` und
`age-groups.yaml`.

Erstellt mit der Pipeline unter [`tools/quellencheck/`](tools/quellencheck/):
deterministische Extraktion (Phase 0), Quell-Abruf als Text-Snapshot (Phase 1),
deterministische Zitat-/Zahlenprüfung (Phase 3) und geerdetes Urteil nur auf Basis
des tatsächlich abgerufenen Quelltexts (Phase 2/4). Methodik und Regeln:
[`tools/quellencheck/README.md`](tools/quellencheck/README.md).

> **Wichtig:** Die frühere Fassung dieser Datei prüfte 23 Fußnoten gegen eine
> inzwischen **verschobene Nummerierung**. Das HTML enthält heute 26 Fußnoten; die
> Zuordnung wurde vollständig neu aus dem aktuellen HTML erzeugt und ist jetzt
> wieder synchron. Mehrere Befunde des alten Audits waren dadurch falsch zugeordnet
> (z. B. war das „groteskes Ungleichgewicht"-Zitat fälschlich LobbyControl statt
> Jens Berger zugeschrieben).

**Legende:**

- ✅ = Verifiziert (Quelltext belegt die Behauptung; Belegstelle dokumentiert)
- ⚠️ = Abweichung / nur teilweise belegt / sinngemäß statt wörtlich
- ❌ = Fehler / Diskrepanz
- 🔒 = Nicht aus der angegebenen URL prüfbar (Buchzitat auf Katalogseite, Bot-Schutz)
- 🧑‍⚖️ = Mensch-geprüft & akzeptiert — im Ledger `tools/quellencheck/accepted.json`; wird bei erneutem Lauf nicht erneut geflaggt (außer der Befund ändert sich)

**Abrufstatus:** 30 von 31 Quell-URLs konnten als Volltext abgerufen werden
(inkl. aller PDFs und der im alten Audit als unzugänglich markierten Cambridge-,
PNAS- und Oxfam-Seiten). Einzige Ausnahme: **washingtonpost.com (fn12)** —
aktiver Bot-Schutz, kein Wayback-Snapshot → Mensch-Queue, inhaltlich aber durch
opensecrets.org gestützt.

---

## Zusammenfassung der Befunde

| #   | Status | Kurzbefund                                                                                       |
| --- | ------ | ------------------------------------------------------------------------------------------------ |
| 1   | ✅     | IWD/Bundesbank-PHF, Thema korrekt (Werte stammen aus Infografik)                                 |
| 2   | ✅     | Wikipedia/Manager-Magazin-Liste, Thema korrekt                                                   |
| 3   | ✅     | WID belegt Top-1 %-Anteil „**27 % today**" — Untergrenze des Bereichs 27–35 %                    |
| 4   | ✅     | DIW („höher als bekannt") belegt ~**35 %** — Obergrenze des Bereichs 27–35 %                     |
| 5   | ✅     | Bundesbank PHF belegt **1,3–2,4 %** (untere Hälfte) verbatim                                     |
| 6   | ⚠️     | „**172** / Platz 4" belegt; „ein Fünftel in Armut" im abgerufenen Text nicht gefunden            |
| 7   | ✅     | **69 %** gesamt und **66 %** Unionsanhänger\*innen belegt (alte 55 %-Korrektur hält)             |
| 8   | ⚠️ 🧑‍⚖️  | „1.779" + Titel belegt; deutsches Zitat ist **sinngemäße Übersetzung**, nicht wörtlich           |
| 9   | ⚠️ 🧑‍⚖️  | Thema belegt; **Titel ungenau** & „4 %→30 %→7×" nicht im Text belegbar (vmtl. Abbildung)         |
| 10  | 🔒 🧑‍⚖️  | Winters-**Buchzitat** auf Cambridge-**Katalogseite** — Zitat dort nicht enthalten                |
| 11  | ✅ 🧑‍⚖️  | Reich-Zitat: **getreue Übersetzung**, englisches Original im Artikel belegt                      |
| 12  | ⚠️🔒   | WaPo (Bot-Schutz) nicht abrufbar; opensecrets belegt **~290 Mio.** → „mindestens 277" konsistent |
| 13  | ⚠️     | „81/100" + Zitat belegt; „**drei NGOs**" ⇄ Quelle sagt „**sieben** zivilgesellschaftliche Org."  |
| 14  | ✅ 🧑‍⚖️  | Jens-Berger-Zitat **wortwörtlich** belegt (Zuordnung ggü. altem Audit korrigiert)                |
| 15  | ✅     | Business Insider belegt **71 %** aus Erbschaften                                                 |
| 16  | 🔒 🧑‍⚖️  | Piketty-**Buchzitat** auf C.H.Beck-**Verlagsseite** — Zitat dort nicht enthalten                 |
| 17  | ✅     | **60 %** „ungerecht", höchster Wert seit 15 Jahren — belegt                                      |
| 18  | ✅     | 26 Mio. €, 2 Mrd. €, 300 Wohnungen — auf der Grüne-Seite belegt                                  |
| 19  | ✅     | 2 %, 1 Mrd. USD, **200–250 Mrd.** USD — ICIJ belegt verbatim                                     |
| 20  | ✅     | **147 Mrd. €** ab 2,3 Mio. € — Handelsblatt belegt                                               |
| 21  | ⚠️     | Fratzscher: **leicht abgewandeltes** Direktzitat („anderes" fehlt, „belastet"→„besteuert")       |
| 22  | ✅     | EU Tax Observatory (PDF gelesen) belegt **5,7 Mrd. €**                                           |
| 23  | ✅     | BDK-Beschluss (PDF gelesen): 25 %, 26 Mio. € belegt; „Omas Häuschen" via fn24                    |
| 24  | ✅     | „**Omas Häuschen**" wortwörtlich belegt                                                          |
| 25  | ✅     | Arguhilfe 2021 (PDF gelesen): 1 %, 2 Mio. € belegt                                               |
| 26  | ✅     | Finanzwende „80 Milliarden Euro" — Titel/Thema belegt                                            |

**Handlungsbedarf (echte Diskrepanzen):**

1. **fn13 — „drei NGOs":** Die LobbyControl-Quelle spricht von „**sieben**
   zivilgesellschaftlichen Organisationen". Klären, ob sich „drei NGOs" auf eine
   andere Teilmenge bezieht, sonst Zahl korrigieren.
2. **fn21 — Fratzscher-Zitat:** Exakter Wortlaut der diw.de-Quelle ist „Kaum ein
   **anderes** Land **belastet** Arbeit so hoch und Vermögen so niedrig wie
   Deutschland." Entweder wörtlich übernehmen oder als sinngemäß kennzeichnen.
3. **fn9 — Titel/Zahlen:** Cited als „rise of authoritarian leaders"; das Paper
   behandelt „erosion of democracy". Titel präzisieren; „4 %→30 %→7×" als
   abgeleitet/aus Abbildung kennzeichnen oder Seitenbeleg ergänzen.
4. **fn10 / fn16 — Buchzitate:** URLs zeigen auf Katalog-/Verlagsseiten ohne den
   zitierten Satz. Seitenbeleg aus dem Buch ergänzen oder als sinngemäß markieren.
5. **fn8 — Gilens & Page:** Deutsches Zitat ist Übersetzung/Paraphrase
   („little or no independent influence"). Als sinngemäß kennzeichnen.
6. **fn6 — „ein Fünftel in Armut":** Im abgerufenen Oxfam-Text nicht auffindbar —
   Beleg ergänzen oder Quelle präzisieren.
7. **fn12 — Musk-Spenden:** opensecrets nennt aktuell **~290 Mio.** „mindestens
   277 Mio." bleibt korrekt; ggf. auf die aktuellere Zahl aktualisieren.

---

## Detailprüfung je Quelle

Belegstellen sind wörtlich aus den abgerufenen Snapshots zitiert
(`tools/quellencheck/out/snapshots/`).

### [3] World Inequality Database — Top-1 %-Anteil

**Behauptung:** „27–35 % des Gesamtvermögens gehört dem reichsten 1 %" (mit [4]).
**Beleg (WID):** „the top 1% wealth share has fallen by half, from close to 50% in
1895 to **27% today**." → **✅** belegt die Untergrenze **27 %**.

### [4] DIW Berlin (SOEP-P) — „höher als bisher bekannt"

**Beleg:** Studie nennt rund **35 %** für das oberste 1 %. → **✅** belegt die
Obergrenze. Der Bereich **27–35 %** ist also korrekt durch [3]+[4] aufgespannt.

### [5] Bundesbank PHF 2023 — untere Hälfte

**Beleg:** PHF-Werte **1,3–2,4 %** für die untere Hälfte (beide Grenzen im Text). → **✅**

### [6] Oxfam-Ungleichheitsbericht 2026

**Beleg:** „um ein Drittel auf **172** gestiegen. Deutschland hat die
**viertmeisten** Milliardär\*innen" → „172 / Platz 4" **✅**.
**⚠️** Der Zusatz „ein Fünftel der Bevölkerung in Armut" ist im abgerufenen Text
nicht wörtlich belegbar (Armut wird thematisiert, der 20-%-Anteil nicht).

### [7] Infratest dimap, April 2025

**Beleg (finanznachrichten):** „69 %" gesamt und „66 %" der Unionsanhänger\*innen
beide belegt. → **✅** Die frühere Korrektur (55 % → 66 %) ist im HTML vorhanden und
bestätigt.

### [8] Gilens & Page (2014)

**Titel/Zahl:** „Testing Theories of American Politics: Elites, Interest Groups…"
und „**1,779**" policy issues im Snapshot belegt. → ✅
**Zitat ⚠️:** Englisches Original: „average citizens and mass-based interest groups
have **little or no independent influence**." Das deutsche Zitat („verschwindend
geringen, statistisch nicht signifikanten Einfluss") ist eine **sinngemäße
Übersetzung**, kein wörtliches Zitat — als solche kennzeichnen.

### [9] Rau & Stokes (2024), PNAS

**Thema ✅:** Snapshot behandelt „inequality and the erosion of democracy…",
„the more [unequal] a democracy, the more at risk it is of electing a [populist]".
**⚠️ Titel:** Im HTML als „…rise of authoritarian leaders" zitiert — das Paper
trägt einen anderen Titel (Erosion der Demokratie). **⚠️ Zahlen:** „ca. 4 % …
über 30 % … 7× höheres Risiko" sind im Fließtext nicht belegbar (vermutlich
Abbildung); die deterministischen „4/30"-Treffer waren Bare-Number-Fehltreffer.

### [10] Winters, „Oligarchy" (2011)

**🔒** Die URL ist die Cambridge-**Katalogseite** (Abstract/Metadaten). Der
zitierte Satz „Demokratie verdrängt Oligarchie nicht — sie verschmilzt mit ihr."
ist dort **nicht enthalten** und damit aus dieser Quelle nicht verifizierbar.

### [11] Robert Reich — commondreams.org

**✅ Getreue Übersetzung.** Englisches Original im Artikel belegt: „…can
effectively **hedge against democracy** by **suppressing criticism of yourself and
other plutocrats** and **discouraging any attempt to tax away**…" — entspricht dem
deutschen Zitat sinngetreu. (Quelle ggü. altem Audit gewechselt: commondreams statt
Substack; das Original ist hier nachweisbar.)

### [12] Musk-Spenden (277 Mio. $)

**🔒/⚠️** washingtonpost.com (Primärquelle der „277 Mio.") ist durch Bot-Schutz
nicht abrufbar. **opensecrets** belegt: „Musk gave $1 million … and **$290 million**
to outside groups." → „mindestens 277 Mio." ist mit den späteren ~290 Mio.
konsistent; ggf. aktualisieren.

### [13] LobbyControl — Lobbyregister März 2025

**✅** „Wirtschaft mit einem Anteil von **81** unter den insgesamt **100** größten
Lobbyakteuren"; das Zitat „unter die Räder zu geraten" ist verbatim belegt.
**⚠️** Die Quelle nennt „nur **sieben** zivilgesellschaftliche Organisationen"; das
HTML schreibt „nur **drei** NGOs". Diskrepanz klären.

### [14] Jens Berger, „Marktordnung für Lobbyisten" (2011)

**✅ Wortwörtlich belegt** (100 % Match): „Zwar sind die Grundzüge der politischen
Interessenvertretung bereits im Grundgesetz verankert, ein groteskes Ungleichgewicht
der finanziellen Mittel der Interessengruppen …". Im alten Audit war dieses Zitat
fälschlich LobbyControl zugeordnet.

### [15] Business Insider (Jan. 2025) — 71 % aus Erbschaften

**✅** „71 %" im Text belegt. (Trägt die im alten Audit fälschlich Oxfam
zugeschriebene Zahl.)

### [16] Piketty, „Kapital und Ideologie"

**🔒** URL ist die **C.H.Beck-Verlagsseite** (Produktseite). Der zitierte Satz
„Die Eigentumskonzentration verleiht einer kleinen Gruppe weit mehr politischen
Einfluss …" ist dort nicht enthalten → aus dieser Quelle nicht verifizierbar.
(Verlagskorrektur Suhrkamp→C.H.Beck aus dem alten Audit ist im HTML übernommen.)

### [17] Infratest dimap, Juli 2025 — 60 %

**✅** „60 %" / „höchster Wert seit 15 Jahren" belegt.

### [18]–[26] Steuer-/Politik-Belege

- **[18]** Grüne „Plan für mehr Steuergerechtigkeit": 26 Mio. €, 2 Mrd. €, 300
  Wohnungen — belegt. **✅**
- **[19]** Zucman/ICIJ: „2 % … between **$200 and $250 billion** a year" — belegt. **✅**
- **[20]** Handelsblatt: „**147 Milliarden Euro**" ab „2,3 Millionen Euro" — belegt. **✅**
- **[21]** Fratzscher (diw.de): Original „Kaum ein **anderes** Land **belastet** …" —
  Direktzitat im HTML leicht abgewandelt. **⚠️**
- **[22]** EU Tax Observatory (PDF): „**5,7 Mrd. €**" — belegt. **✅**
- **[23]** Grüne BDK-Beschluss (PDF): „25 %", „26 Mio. €" — belegt; „Omas Häuschen"
  über [24]. **✅**
- **[24]** Grüne Bundestagsfraktion: „**Omas Häuschen**" wortwörtlich belegt. **✅**
- **[25]** Grüne Arguhilfe 2021 (PDF): „1 %", „2 Mio. €" — belegt. **✅**
- **[26]** Finanzwende: „Die zehn wichtigsten Steuerprivilegien und die **80
  Milliarden Euro**" — Titel/Thema belegt. **✅**

---

## Datenquellen

### age-groups.yaml

Werte (17.300 € … 103.100 €, Gesamt) stammen aus der IWD-Infografik (fn1) auf Basis
Bundesbank-PHF 2023. Die Einzelwerte liegen als **Bild** vor und sind nicht aus dem
Seitentext extrahierbar; sie sind mit der PHF-Studie konsistent (Bundesbank-Median
103.200 € ↔ 103.100 € in der YAML — Rundungsdifferenz). Status: **✅ plausibel**,
exakte Einzelwert-Verifikation erfordert die Originalgrafik (Mensch-Queue).

### wealthy.yaml

Quelle: Wikipedia/Manager Magazin (Okt. 2024). Vermögenswerte sind Momentaufnahmen
und schwanken; die Snapshot-Werte sind plausibel. Status: **✅ plausibel**.

---

## Mensch-Queue (nicht automatisch abschließbar)

1. **fn12** — washingtonpost.com direkt prüfen (Bot-Schutz); „277 Mio." gegen die
   aktuelle opensecrets-Zahl (~290 Mio.) abgleichen.
2. **fn10 / fn16** — Buchzitate gegen die Buchtexte (Seitenzahl) prüfen.
3. **age-groups.yaml** — Einzelwerte gegen die IWD-Originalgrafik prüfen.

---

_Methodik: `tools/quellencheck/` (Phasen 0–4). Deterministische Schritte sind
reproduzierbar; Urteile basieren ausschließlich auf abgerufenem Quelltext mit
dokumentierter Belegstelle._
_Letzte Aktualisierung: 24. Juni 2026 — vollständige Neu-Synchronisierung auf
fn1–fn26._
