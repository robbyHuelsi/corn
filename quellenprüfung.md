# Quellenprüfung — „Vermögen in Maiskörnern"

Systematische, **halluzinationsresistente** Überprüfung aller **26 Fußnoten**
(`fn1`–`fn26`) in `src/index.html` sowie der Datenquellen in `wealthy.yaml` und
`age-groups.yaml`.

Erstellt mit der Pipeline unter [`tools/quellencheck/`](tools/quellencheck/):
deterministische Extraktion (Phase 0), Quell-Abruf als Text-Snapshot (Phase 1),
deterministische Zitat-/Zahlenprüfung (Phase 3) und geerdetes Urteil nur auf Basis
des tatsächlich abgerufenen Quelltexts (Phase 2/4). Methodik und Regeln:
[`tools/quellencheck/README.md`](tools/quellencheck/README.md).

> **Wichtig:** Die Fußnoten **18–26** wurden zuletzt umnummeriert/umsortiert
> (Lesefluss der View „Was fordern die Grünen?"). Die Quell-Inhalte sind 1:1
> erhalten, nur die Nummern haben sich geändert. Dieser Bericht wurde nach einem
> kompletten Pipeline-Neulauf vollständig auf die aktuelle Nummerierung
> synchronisiert; die Detailblöcke 18–26 zeigen jetzt auf die neuen Quellen
> (fn18 = BDK-Beschluss Erbschaftsteuer, fn19 = „Omas Häuschen", fn20 = Plan für
> Steuergerechtigkeit, fn21 = Arguhilfe 2021, fn22 = Zucman/G20, fn23 = Bach/DIW,
> fn24 = Fratzscher, fn25 = Finanzwende, fn26 = EU Tax Observatory).

**Legende:**

- ✅ = Verifiziert (Quelltext belegt die Behauptung; Belegstelle dokumentiert)
- ⚠️ = Abweichung / nur teilweise belegt / sinngemäß statt wörtlich
- ❌ = Fehler / Diskrepanz (Behauptung im Quelltext nicht belegt bzw. widerlegt)
- 🔒 = Nicht aus der angegebenen URL prüfbar (Buchzitat auf Katalogseite, Bot-Schutz)
- 🧑‍⚖️ = Mensch-geprüft & akzeptiert — im Ledger `tools/quellencheck/accepted.json`; wird bei erneutem Lauf nicht erneut geflaggt (außer der Befund ändert sich)

**Abrufstatus:** 30 von 31 Quell-URLs lieferten verwertbaren Volltext (inkl. aller
PDFs sowie der via Wayback geholten DIW-, PNAS- und WaPo-Seiten). **Nicht
verwertbar:**

- **fn5 — publikationen.bundesbank.de:** technisch `accessible`, der Snapshot
  enthält jedoch nur „Loading" (JavaScript-gerenderte Seite, Inhalt clientseitig
  nachgeladen) → Inhalt nicht im Text-Snapshot → **Mensch-Queue**.
- **fn23 — diw.de (Zweitquelle):** `accessible: false` (SSL-Handshake-Timeout, kein
  Wayback) → **Mensch-Queue**; die Behauptung ist aber vollständig durch die
  Erstquelle handelsblatt.com gedeckt.

---

## Zusammenfassung der Befunde

| #   | Status | Kurzbefund                                                                                           |
| --- | ------ | ---------------------------------------------------------------------------------------------------- |
| 1   | ✅     | IWD-Infografik (Inst. d. dt. Wirtschaft), Thema korrekt (Werte stammen aus Infografik/Bild)          |
| 2   | ✅     | Wikipedia/Manager-Magazin-Liste, Thema korrekt (Vergleichsvermögen)                                  |
| 3   | ✅     | WID belegt Top-1 %-Anteil „**27 % today**" — Untergrenze des Bereichs 27–35 %                        |
| 4   | ✅     | DIW („höher als bekannt") belegt „rund **35**" — Obergrenze des Bereichs 27–35 %                     |
| 5   | ⚠️🔒   | Bundesbank-Snapshot nur „Loading" (JS-Seite); **1,3–2,4 %** nicht im Text → Mensch-Queue             |
| 6   | ⚠️     | „**172** / Platz 4" belegt; „**ein Fünftel in Armut**" belegt; „71 %" nicht hier (via fn15)          |
| 7   | ✅     | **69 %** gesamt und **66 %** Unionsanhänger\*innen verbatim belegt                                   |
| 8   | ⚠️ 🧑‍⚖️  | Deutsches Gilens-&-Page-Zitat = sinngemäße Übersetzung, nicht wörtlich                               |
| 9   | ⚠️ 🧑‍⚖️  | Thema belegt; Titel/„4 %→30 %→7×" als abgeleitet/Abbildung akzeptiert                                |
| 10  | 🔒 🧑‍⚖️  | Winters-**Buchzitat** auf Cambridge-**Katalogseite** — Satz dort nicht enthalten                     |
| 11  | ✅ 🧑‍⚖️  | Reich-Zitat: getreue Übersetzung, engl. Original im Artikel belegt                                   |
| 12  | ✅⚠️   | WaPo (Wayback) belegt „**at least $277 million**"; „3 Mio. Kleinspender" = illustrativ, nicht belegt |
| 13  | ✅     | „81/100" + „unter die Räder zu geraten" belegt; „**drei NGOs**" korrekt aufgelöst                    |
| 14  | ✅ 🧑‍⚖️  | Jens-Berger-Zitat **wortwörtlich** (100 %) belegt                                                    |
| 15  | ✅     | Business Insider belegt **71 %** aus Erbschaften (DE) ggü. 36 % weltweit                             |
| 16  | 🔒 🧑‍⚖️  | Piketty-**Buchzitat** auf C.H.Beck-**Verlagsseite** — Satz dort nicht enthalten                      |
| 17  | ✅     | **60 %** „ungerecht", höchster Wert seit 15 Jahren — verbatim belegt                                 |
| 18  | ✅     | BDK-Beschluss (PDF): „etwa **25 %**" linear, Lebensfreibetrag, „über **26 Millionen**", Stundung     |
| 19  | ✅     | Grüne-Fraktion: „**Omas Häuschen**" wortwörtlich (100 %) belegt                                      |
| 20  | ✅     | Plan f. Steuergerechtigkeit: **26 Mio. €**, **2 Mrd. €** (2023), **300 Wohnungen**, Stundung belegt  |
| 21  | ✅     | Arguhilfe 2021 (PDF): **1 %/Jahr**, ab **2 Mio. €**, Betriebsverm.-Begünstigung, Eigenheim, Land     |
| 22  | ✅     | Zucman-PDF + ICIJ: **2 %**, ab **1 Mrd. $**, **200–250 Mrd. $/Jahr** — verbatim belegt               |
| 23  | ✅     | Handelsblatt: **147 Mrd. €** ab **2,3 Mio. €**, „Studienautor **Stefan Bach**" belegt                |
| 24  | ⚠️     | Fratzscher-Zitat **leicht abgewandelt** (Soll „anderes … belastet", Ist „… besteuert")               |
| 25  | ✅     | Finanzwende: „**80 Milliarden Euro** Steuerprivilegien pro Jahr" — zweistellig belegt                |
| 26  | ❌     | EU Tax Observatory: **5,7 Mrd. €** für DE **nicht belegt**; Quelle nennt DE = 10,9–17,0 Mrd. €       |

**Handlungsbedarf (echte Diskrepanzen):**

1. **fn26 — „5,7 Mrd. € für Deutschland":** Im abgerufenen PDF gibt es **keinen
   5,7-Mrd.-Wert für Deutschland**. Die Aufkommenstabelle weist für **Germany** aus:
   bei 2 % auf Milliardäre **10,9**, inkl. Centi-Millionäre **16,9**; bei 3 % auf
   Milliardäre **17,0** Mrd. € (Zeile: „Germany 128 637.0 606.7 16.9 10.9 30.4
   17.0"). Der deterministische „5,7"-Treffer stammt aus der **Portugal**-Zeile
   („Portugal 1 6.0 **5.7** 0.2 …"). **Vorschlag:** Zahl und/oder Quelle prüfen —
   entweder ist ein anderes Szenario/eine andere Quelle gemeint (z. B. ältere
   G20-Schätzung), oder es liegt ein Übertragungsfehler vor. Bis zur Klärung sollte
   „5,7 Mrd. €" nicht der EU-Tax-Observatory-Tabelle 2025 zugeschrieben werden.
2. **fn24 — Fratzscher-Zitat:** Der diw.de-Originalwortlaut ist „Kaum ein
   **anderes** Land **belastet** Arbeit so hoch und Vermögen so niedrig wie
   Deutschland." Das HTML schreibt „Kaum ein Land **besteuert** Arbeit so hoch …"
   (zwei Abweichungen: „anderes" fehlt, „belastet"→„besteuert"). **Vorschlag:**
   entweder exakt übernehmen oder das Zitat als sinngemäß kennzeichnen.
3. **fn6 — „71 %":** Die Oxfam.de-Seite belegt diese Zahl **nicht** (sie nennt
   172 / Platz 4 / „ein Fünftel in Armut"). Die 71 % sind durch **fn15** (Business
   Insider) belegt. **Vorschlag:** sicherstellen, dass die 71-%-Aussage im HTML auf
   fn15 (nicht auf fn6) gestützt wird.
4. **fn5 — „1,3–2,4 % (untere Hälfte)":** Aus dem Bundesbank-Snapshot (nur
   „Loading") **nicht verifizierbar**. **Vorschlag:** Beleg aus dem PHF-Bericht 2023
   manuell sichern (Mensch-Queue) — Wert ist plausibel, aber unbelegt im Snapshot.
5. **fn12 — „3 Millionen Kleinspender\*innen":** Die 277 Mio. $ sind jetzt direkt
   belegt (WaPo via Wayback); der Vergleich „= 3 Mio. Kleinspender\*innen" ist eine
   **illustrative Rechengröße** und im Quelltext nicht enthalten. **Vorschlag:** als
   eigene Berechnung kennzeichnen oder Rechenweg/Quelle ergänzen.

---

## Detailprüfung je Quelle

Belegstellen sind wörtlich aus den abgerufenen Snapshots zitiert
(`tools/quellencheck/out/snapshots/`).

### [1] IWD — Haushaltsnettovermögen nach Altersgruppen (AUSSAGE)

**Thema ✅:** Snapshot ist die IWD-Seite („Der Informationsdienst des Instituts der
deutschen Wirtschaft", Rubrik „Einkommen und Vermögen"). Die konkreten
Median-Werte je Altersgruppe liegen als **Infografik/Bild** vor und sind aus dem
Seitentext nicht extrahierbar (siehe Abschnitt „Datenquellen", `age-groups.yaml`).
Zuordnung/Thema korrekt. **Verdikt: SUPPORTED** (Rahmung), Einzelwerte → Mensch-Queue.

### [2] Wikipedia/Manager Magazin — reichste Deutsche (AUSSAGE)

**Thema ✅:** Snapshot ist die Liste „der reichsten Deutschen (Manager Magazin)".
Dient als Auswahl-Pool für das Vergleichsvermögen. Zuordnung/Thema korrekt.
**Verdikt: SUPPORTED** (Rahmung); Einzelwerte sind Momentaufnahmen (siehe
`wealthy.yaml`).

### [3] World Inequality Database — Top-1 %-Anteil

**Behauptung:** „27–35 % des Gesamtvermögens gehört dem reichsten 1 %" (mit [4]).
**Beleg (WID):** „the top 1% wealth share has fallen by half, from close to 50% in
1895 to **27% today**." → belegt die **Untergrenze 27 %** sowie „top **1 %**".
**Verdikt: SUPPORTED** (Untergrenze; Obergrenze via [4]).

### [4] DIW Berlin (SOEP-P) — „höher als bisher bekannt"

**Beleg:** „Allein das reichste Prozent der Bevölkerung vereint **rund 35** (statt
knapp 22 Prozent) des Vermögens auf sich." → belegt die **Obergrenze 35 %**. Der
Bereich **27–35 %** ist damit korrekt durch [3]+[4] aufgespannt (zulässige
Bereichs-Zitierung über zwei Quellen).
**Verdikt: SUPPORTED** (Obergrenze 35 %).
**Hinweis:** Die im Register fn4 zusätzlich gelistete Behauptung „1,3–2,4 % (untere
Hälfte)" wird vom DIW-Text **nicht** belegt; sie gehört zu [5] (Bundesbank) →
dort behandelt.

### [5] Deutsche Bundesbank, PHF 2023 — untere Hälfte

**Behauptung:** „1,3–2,4 % besitzt die untere Hälfte der Bevölkerung".
**Befund 🔒:** Der Snapshot `fn05_1_publikationen.bundesbank.de.txt` enthält nur den
Text „Loading" (die Seite rendert ihren Inhalt clientseitig per JavaScript; der im
`fetch_status` gemeldete Umfang von 63.397 Zeichen ist nicht der Sachinhalt). Die
Werte **1,3 / 2,4 %** sind im verfügbaren Snapshot **nicht auffindbar**.
**Verdikt: NICHT_ÜBERPRÜFBAR** → Mensch-Queue (Beleg aus dem PHF-Bericht 2023
manuell sichern).

### [6] Oxfam-Ungleichheitsbericht 2026

**Behauptung 1 (172 / Platz 4) — SUPPORTED:** „2025 ist die Gesamtzahl der
Milliardär\*innen um ein Drittel auf **172** gestiegen. Deutschland hat die
**viertmeisten** Milliardär\*innen weltweit."
**Zusatz „ein Fünftel in Armut" — SUPPORTED:** „Gleichzeitig lebt **etwa ein Fünftel
der Menschen in Deutschland in Armut**." (Korrektur ggü. altem Audit: jetzt wörtlich
belegt.)
**Behauptung 2 (71 % aus Erbschaften) — NICHT_IN_QUELLE:** „71 %" steht **nicht** im
Oxfam.de-Snapshot. Diese Zahl ist durch **[15]** (Business Insider) belegt.

### [7] Infratest dimap, April 2025

**Beleg (finanznachrichten):** „mehr als zwei Drittel (**69 Prozent**) für die
Einführung … Unter Unionsanhängern waren es zwei Drittel (**66 Prozent**)."
**Verdikt: SUPPORTED** (69 % gesamt, 66 % Union).

### [8] Gilens & Page (2014) 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026): übersetztes Zitat sinngemäß
ok. Deterministisch ist das deutsche Zitat keine wörtliche Entsprechung (engl.
Original „little or no independent influence"); als **sinngemäße Übersetzung**
gekennzeichnet. Kein erneuter Handlungsbedarf.

### [9] Rau & Stokes (2024), PNAS 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026). Thema belegt; „4 %→30 %→7×"
als abgeleitet/aus Abbildung akzeptiert. Kein erneuter Handlungsbedarf.

### [10] Winters, „Oligarchy" (2011) 🔒 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026). URL ist die Cambridge-
**Katalogseite**; der zitierte Satz ist dort nicht enthalten (nur Titel „Oligarchy"
verbatim). Buchzitat auf Katalogseite akzeptiert. Kein erneuter Handlungsbedarf.

### [11] Robert Reich — commondreams.org ✅ 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026). Getreue Übersetzung; engl.
Original im Artikel belegt. Kein erneuter Handlungsbedarf.

### [12] Musk-Spenden (277 Mio. $)

**Behauptung:** „mindestens 277 Mio. Dollar an Trump-unterstützende Super PACs …
entspricht den kombinierten Spenden von 3 Millionen Kleinspender\*innen."
**Beleg (WaPo via Wayback) — SUPPORTED:** „Elon Musk gave **at least $277 million**
in political donations this year to back Donald Trump and other Republican
candidates …" (Korrektur ggü. altem Audit: WaPo ist via Wayback abrufbar und belegt
die 277 Mio. jetzt direkt.) opensecrets ergänzt „**$290 million** to outside groups".
**Teil „3 Millionen Kleinspender\*innen" — NICHT_IN_QUELLE:** im Snapshot nicht
enthalten; illustrative Rechengröße.
**Verdikt: SUPPORTED** (277 Mio.) · **⚠️ PARTIALLY** (3-Mio.-Vergleich unbelegt).

### [13] LobbyControl — Lobbyregister März 2025

**Beleg:** „Zu der größten Gruppe zählen Akteure aus der Wirtschaft mit einem Anteil
von **81** unter den insgesamt **100** größten Lobbyakteuren." Zitat „unter die Räder
zu geraten" ist **verbatim** (100 %) belegt.
**Auflösung „drei NGOs" (Korrektur ggü. altem Audit):** Die Quelle differenziert
ausdrücklich: „nur **sieben** zivilgesellschaftliche Organisationen im weiteren
Sinne … Mit Campact, Greenpeace und dem Deutschen Naturschutzbund sind es nur **drei
NGOs im engeren Sinne**." Das HTML zitiert die engere Definition korrekt — **keine
Diskrepanz**.
**Verdikt: SUPPORTED.**

### [14] Jens Berger, „Marktordnung für Lobbyisten" (2011) ✅ 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026); deterministisch **100 %
VERBATIM** (Lang-Zitat und Titel). Kein erneuter Handlungsbedarf.

### [15] Business Insider (Jan. 2025) — 71 % aus Erbschaften

**Beleg:** „Während weltweit 36 Prozent des Milliardärsvermögens aus Erbschaften
stammt, sind es hierzulande sogar **71 Prozent**." → belegt die im HTML genannten
71 % (Deutschland). **Verdikt: SUPPORTED.**

### [16] Piketty, „Kapital und Ideologie" 🔒 🧑‍⚖️ AKZEPTIERT

**Status:** Mensch-geprüft & akzeptiert (24.06.2026). URL ist die C.H.Beck-
**Verlagsseite**; der zitierte Satz ist dort nicht enthalten (nur Titel „Kapital und
Ideologie" verbatim). Buchzitat auf Katalogseite akzeptiert. Kein erneuter
Handlungsbedarf.

### [17] Infratest dimap, Juli 2025 — 60 %

**Beleg:** „In der Gesamtschau vertreten **60 Prozent** die Meinung, dass es in
Deutschland ungerecht zugeht, **der höchste Wert seit 15 Jahren**." **Verdikt:
SUPPORTED.**

### [18] Bündnis 90/Die Grünen — BDK-Beschluss VR-09 (16.11.2024), PDF

Quelle: BDK-Beschluss „Für mehr Gerechtigkeit und Effizienz: Erbschaftsteuer
reformieren".

- **25 % Steuersatz — SUPPORTED:** „Oberhalb des Freibetrags könnte z.B. ein
  linearer Steuersatz von **etwa 25 %** ür [für] alle Vermögensgegenstände
  gleichermaßen gelten". _Nuance:_ Quelle formuliert als Vorschlag („könnte z.B. …
  etwa"), nicht als fixierten Satz.
- **„Meiste zahlen keine Erbschaftsteuer" — SUPPORTED:** „Kleinere Erbschaten, und
  das sind **die meisten**, sind heute über Freibeträge von der Erbschat- und
  Schenkungsteuer bereit [befreit]".
- **Formel × 25 % — SUPPORTED** (für 25 %; lineare Besteuerung oberhalb des
  Freibetrags belegt, Formel = Paraphrase).
- **Hoher Lebensfreibetrag pro Person — SUPPORTED:** „einheitlichen,
  erwerberbezogenen **Lebensreibetrag pro Person**".
- **Privilegien über 26 Mio. € + Stundung — SUPPORTED:** „Sehr hohe Vermögen (bei
  **über 26 Millionen**) können durch Ausnahmen heute ot sogar komplett steuerrei
  vererbt werden" + „großzügige, langjährige **Stundungs**regelungen".
- **„Omas Häuschen" — NICHT_IN_QUELLE (in fn18):** Die Phrase steht nicht in diesem
  PDF; sinngemäß belegt ist „**Selbstgenutzter Wohnraum** soll auch weiterhin
  geschützt sein." Das wörtliche „Omas Häuschen" ist durch **[19]** belegt.

### [19] Grüne Bundestagsfraktion — „Omas Häuschen"

**Beleg (verbatim, 100 %):** „Geschichten, die vom Erhalt von **„Omas Häuschen"**
erzählen, verschleiern diese Wahrheit. Sie verkennen, dass es genau dafür bereits
umfangreiche Schutzregelungen im Steuerrecht gibt." → die Phrase „Omas Häuschen" ist
wortwörtlich belegt. **Verdikt: SUPPORTED.**
**Hinweis:** Im Original verwendet die Fraktion „Omas Häuschen" als (kritisch
zitierte) Erzählung; das HTML nutzt denselben Begriff affirmativ („…bleibt weiterhin
geschützt"). Der **Schutz selbstgenutzten Wohnraums** ist sachlich belegt (fn18:
„Selbstgenutzter Wohnraum … geschützt"; fn19: „umfangreiche Schutzregelungen").

### [20] Grüne Bundestagsfraktion — „Plan für mehr Steuergerechtigkeit"

- **2 Mrd. € (2023) durch Abschaffung der 26-Mio.-Privilegien — SUPPORTED:** „**2023
  wurden so mehr als 2 Milliarden Euro an Steuern erlassen**, was zu einem effektiven
  Steuersatz von nur 0,1 % bei Erbschaften von über 26 Millionen führte."
- **26 Mio. € Privilegien abgeschafft + Stundung — SUPPORTED:** „Erbschaften von
  **über 26 Millionen Euro** sollten **nicht mehr steuerbefreit** sein,
  Betriebsvermögen sollten **großzügige Stundungen** erhalten".
- **Betriebsvermögen / Investitionsschutz — SUPPORTED:** „Statt einer vollständigen
  Steuerbefreiung … sollten weitreichende, mehrjährige **Stundungsregelungen**
  eingeführt werden. Das … sichert zugleich Arbeitsplätze und schafft **Anreize für
  Investitionen**." _Nuance:_ Quelle spricht von „Stundungen statt vollständiger
  Befreiung", nicht von „Begünstigungen".
- **>300 Wohnungen gestrichen — SUPPORTED:** „Die Steuerbefreiung bei Erbschaften ab
  **300 Wohnungen** beenden … sollte **abgeschafft** werden."

### [21] Bündnis 90/Die Grünen — Arguhilfe Steuerpolitik (BTW 2021), PDF

- **1 %/Jahr + ab 2 Mio. € pro Person — SUPPORTED:** „Die Vermögensteuer soll erst
  ab hohen Vermögen von **mehr als 2 Millionen Euro pro Person** greifen und
  **jährlich 1 %** betragen."
- **Betriebsvermögen-Begünstigung / Investitionsschutz — SUPPORTED:** „wollen wir
  **Begünstigungen für Betriebsvermögen** im gebotenen Umfang einführen und zugleich
  **Investitionsanreize** schaffen."
- **Durchschnittliches Eigenheim kein Steueranfall — SUPPORTED:** „Damit ist
  sichergestellt, dass auch ein **Eigenheim in sehr guter Lage allein noch nicht zum
  Anfall der Vermögensteuer** führen wird."
- **Ländersteuer — SUPPORTED:** „Darüber hinaus ist die **Vermögensteuer eine
  Ländersteuer**."

### [22] Zucman (2024) — G20-Blueprint (PDF) + ICIJ

**Beleg (Zucman-PDF):** „A minimum tax equal to **2%** of wealth on global
billionaires would raise **\$200-\$250 billion** per year".
**Beleg (ICIJ):** „around 3,000 people with assets worth more than **\$1 billion**,
**2%** of their wealth would generate between **\$200 and \$250 billion** a year."
→ 2 %, ab 1 Mrd. $, 200–250 Mrd. $/Jahr verbatim belegt. **Verdikt: SUPPORTED.**

### [23] Stefan Bach (DIW) — Handelsblatt

**Beleg (handelsblatt.com):** „könnte eine Vermögensteuer … zu jährlichen Einnahmen
von **147 Milliarden Euro** führen. Zahlen müsste fast ausschließlich das reichste
eine Prozent der Bevölkerung mit einem persönlichen Vermögen ab **2,3 Millionen
Euro**." Studienautor namentlich: „**Stefan Bach**".
**Verdikt: SUPPORTED.** _Hinweis:_ Die Studie ist im Auftrag der Linken erstellt
(„Konzept der Linken"); die Bezeichnung „progressive Vermögensteuer" wird im Snapshot
nicht wörtlich verwendet, ist aber sachlich konsistent. Die Zweitquelle diw.de war
nicht abrufbar (SSL-Timeout) — für diese Behauptung ohne Belang.

### [24] Marcel Fratzscher (DIW) — diw.de / tagesspiegel

**Behauptung (HTML):** „**Kaum ein Land besteuert Arbeit so hoch und Vermögen so
niedrig wie Deutschland.**"
**Original-Beleg (diw.de, verbatim):** „**Kaum ein anderes Land belastet Arbeit so
hoch und Vermögen so niedrig wie Deutschland.**"
**Verdikt: ⚠️ PARTIALLY** (Verbatim-Score ≈ 72 %, deterministisch „CLOSE"). Zwei
Abweichungen: das Wort **„anderes"** fehlt, und **„belastet"** wurde zu **„besteuert"**.
**Vorschlag:** entweder exakt übernehmen oder als sinngemäßes Zitat kennzeichnen.

### [25] Finanzwende — „80 Milliarden Euro"

**Beleg:** „**80 Milliarden Euro** Steuerprivilegien pro Jahr" / „Unsere
Kostenschätzung von **80 Milliarden Euro** …". Die App-Aussage „Mehreinnahmen in
zweistelliger Milliardenhöhe durch Schließung von Steuerlücken" ist durch die
80-Mrd.-Schätzung gedeckt. **Verdikt: SUPPORTED.**

### [26] EU Tax Observatory (März 2025), PDF

**Behauptung (HTML):** „Globale Milliardärssteuer könnte für Deutschland ca. **5,7
Mrd. €** einbringen."
**Befund ❌:** Die Aufkommenstabelle des PDF nennt für **Germany**:
„Germany 128 637.0 606.7 **16.9** **10.9** 30.4 **17.0**" — d. h. bei 2 % auf
Milliardäre **10,9 Mrd. €**, inkl. Centi-Millionäre **16,9 Mrd. €**, bei 3 % auf
Milliardäre **17,0 Mrd. €**. Ein **5,7-Mrd.-Wert für Deutschland existiert im
Snapshot nicht**; „5.7" erscheint nur in der **Portugal**-Zeile („Portugal 1 6.0
**5.7** …"). Gegen-Pass bestätigt: kein Beleg für 5,7 Mrd. € (DE), stattdessen
deutlich höhere DE-Werte.
**Verdikt: NICHT_IN_QUELLE.** **Vorschlag:** Zahl/Quelle prüfen — anderes Szenario,
andere Quelle (z. B. ältere G20-Schätzung) oder Übertragungsfehler.

---

## Datenquellen

### age-groups.yaml

Werte (17.300 € … 103.100 €, Gesamt) stammen aus der IWD-Infografik (fn1) auf Basis
Bundesbank-PHF 2023. Die Einzelwerte liegen als **Bild** vor und sind nicht aus dem
Seitentext extrahierbar; sie sind mit der PHF-Studie konsistent (Bundesbank-Median
103.200 € ↔ 103.100 € in der YAML — Rundungsdifferenz). Status: **✅ plausibel**,
exakte Einzelwert-Verifikation erfordert die Originalgrafik (Mensch-Queue). Hinweis:
Der Bundesbank-Snapshot (fn5) selbst lieferte nur „Loading" — die PHF-Werte sind
daher derzeit nur über die Grafik prüfbar.

### wealthy.yaml

Quelle: Wikipedia/Manager Magazin. Vermögenswerte sind Momentaufnahmen und
schwanken; die Snapshot-Werte sind plausibel. Status: **✅ plausibel**.

---

## Mensch-Queue (nicht automatisch abschließbar)

1. **fn5 — Bundesbank PHF 2023:** Snapshot nur „Loading" (JS-gerenderte Seite). Die
   Werte „1,3–2,4 %" (untere Hälfte) aus dem PHF-Bericht/Monatsbericht April 2025
   manuell belegen.
2. **fn23 — diw.de (Zweitquelle):** nicht abrufbar (SSL-Timeout, kein Wayback). Die
   Behauptung ist durch handelsblatt.com gedeckt; Zweitbeleg optional nachreichen.
3. **fn26 — „5,7 Mrd. € (DE)":** echte Diskrepanz (siehe oben) — Zahl/Quelle klären.
4. **fn24 — Fratzscher-Zitat:** Wortlaut angleichen oder als sinngemäß kennzeichnen.
5. **age-groups.yaml:** Einzelwerte gegen die IWD-Originalgrafik prüfen.

---

_Methodik: `tools/quellencheck/` (Phasen 0–4). Deterministische Schritte sind
reproduzierbar; Urteile basieren ausschließlich auf abgerufenem Quelltext mit
dokumentierter Belegstelle._
_Letzte Aktualisierung: 24. Juni 2026 — vollständiger Pipeline-Neulauf nach
Umnummerierung der Fußnoten 18–26; Detailblöcke 18–26 neu erzeugt._
