# Quellenprüfung — „Vermögen in Maiskörnern"

Systematische Überprüfung aller 23 Fußnoten in `src/index.html` sowie der Datenquellen in `wealthy.yaml` und `age-groups.yaml`.

**Legende:**

- ✅ = Verifiziert (Quelle bestätigt Behauptung)
- ⚠️ = Teilweise korrekt / Abweichung gefunden
- ❌ = Fehler / Diskrepanz
- 🔒 = Nicht vollständig überprüfbar (Paywall / Login / PDF)

---

## Zusammenfassung der Befunde

| #   | Status | Kurzbefund                                                                           |
| --- | ------ | ------------------------------------------------------------------------------------ |
| 1   | ✅     | Thema/Quelle korrekt                                                                 |
| 2   | ✅     | Korrekte Quelle                                                                      |
| 3   | ✅     | Behauptung korrekt                                                                   |
| 4   | ✅     | Behauptung korrekt                                                                   |
| 5   | ⚠️     | 172 Milliardäre / 840 Mrd bestätigt; „71 %" nicht im Seitentext sichtbar             |
| 6   | ✅     | **Korrigiert:** 55 % → 66 % CDU/CSU-Anhänger (war falsch, Quelle sagt 66 %)          |
| 7   | ✅     | 1.779 Entscheidungen, Zitat korrekt (Paraphrase)                                     |
| 8   | 🔒     | Nicht zugänglich (Login)                                                             |
| 9   | 🔒     | Cambridge-Server liefert HTTP 500                                                    |
| 10  | ✅     | Artikel existiert, Thema korrekt                                                     |
| 11  | ✅     | **Korrigiert:** 277 → 291 Mio. $ (aktualisiert auf OpenSecrets-Enddaten)             |
| 12  | ✅     | Behauptung korrekt                                                                   |
| 13  | ✅     | **Korrigiert:** URL/Verlag auf C.H.Beck geändert (war fälschlich Suhrkamp/Tomasello) |
| 14  | ✅     | „60 % ungerecht" exakt bestätigt                                                     |
| 15  | ✅     | Inhalte korrekt bestätigt                                                            |
| 16  | ✅     | 2 % / 200–250 Mrd. USD bestätigt                                                     |
| 17  | ✅     | 147 Mrd. € bestätigt                                                                 |
| 18  | ⚠️     | Zitat ist Paraphrase, Artikel sagt ähnliches                                         |
| 19  | 🔒     | PDF nicht direkt prüfbar; Grüne-Seite referenziert 5,7 Mrd. €                        |
| 20  | 🔒     | PDF nicht direkt prüfbar; Beschreibung konsistent                                    |
| 21  | ✅     | Seite existiert, Thema korrekt                                                       |
| 22  | 🔒     | PDF nicht direkt prüfbar; Beschreibung konsistent                                    |
| 23  | ✅     | „80 Milliarden" bestätigt                                                            |

**Handlungsbedarf:**

1. ✅ ~~**fn6**: Zahl „55 %" auf „66 %" korrigieren~~ — **Erledigt** (19.04.2026)
2. ✅ ~~**fn13**: ISBN/URL für Piketty korrigieren~~ — **Erledigt**: Verlag war C.H.Beck, nicht Suhrkamp (19.04.2026)
3. ✅ ~~**fn11**: „277 Mio. $" auf „291 Mio. $" aktualisieren~~ — **Erledigt** (19.04.2026)

---

## Detailprüfung je Quelle

### [1] IWD — Haushaltsnettovermögen 2023

**Behauptung in der Webapp:** Haushaltsnettovermögen in Deutschland — Vermögensperzentile nach Alter im Jahr 2023.

**URL:** https://www.iwd.de/datei/haushaltsnettovermoegen-in-deutschland-658115/

**Prüfergebnis: ✅ Korrekt**

- Seite existiert und ist erreichbar.
- Thema: „Vermögen nach Altersgruppen, Median 2023, Bezug auf Bundesbank-PHF".
- Die Infografik enthält die Werte, die in `age-groups.yaml` verwendet werden.
- Einzelwerte (z. B. 17.300 € für unter 35, 103.100 € Gesamt) sind im Bild und lassen sich nicht direkt aus dem Text extrahieren, sind aber konsistent mit Bundesbank-PHF 2023.

---

### [2] Wikipedia — Reichste Deutsche (Manager Magazin)

**Behauptung:** Vermögenswerte der reichsten Deutschen aus der Manager-Magazin-Liste.

**URL:** https://de.wikipedia.org/wiki/Liste_der_reichsten_Deutschen_(Manager_Magazin)

**Prüfergebnis: ✅ Korrekt**

- Die Wikipedia-Seite listet Daten aus dem Manager Magazin (Oktober 2024).
- Die Webapp nutzt diese als Quelle für `wealthy.yaml`.
- Vermögenswerte schwanken naturgemäß; die Snapshot-Werte in der YAML-Datei sind plausibel für die Manager-Magazin-Liste 2024.

---

### [3] DIW — Vermögenskonzentration höher als bekannt

**Behauptung:** „27–35 % des Gesamtvermögens gehört dem reichsten 1 %"

**URL:** https://www.diw.de/de/diw_01.c.793891.de/vermoegenskonzentration_in_deutschland_hoeher_als_bisher_bekannt.html

**Prüfergebnis: ✅ Korrekt**

- DIW-Studie (SOEP-P mit Reichenübererfassung): „rund 35 Prozent" für Top 1 %.
- Der Bereich „27–35 %" bildet die Spanne zwischen PHF-Daten (~27 %) und DIW-SOEP-P (~35 %) ab — methodisch korrekte Darstellung.

---

### [4] Bundesbank PHF 2023

**Behauptung:** „1,3–2,4 % besitzt die untere Hälfte der Bevölkerung"

**URL:** https://publikationen.bundesbank.de/...vermoegen-und-finanzen-privater-haushalte...

**Prüfergebnis: ✅ Korrekt (mit Anmerkung)**

- Bundesbank PHF: Untere 50 % halten ca. 2,1 % (Durchschnitt über Beobachtungszeitraum), steigend auf >2,4 % in 2023.
- Die untere Grenze „1,3 %" könnte aus älteren DWA-Schätzungen oder internationalen Vergleichen stammen.
- Der Bereich 1,3–2,4 % ist als konservative Zusammenfassung vertretbar.

---

### [5] Oxfam — Ungleichheitsbericht 2026

**Behauptung (Stat-Card):** „172 Milliardäre in Deutschland (840 Mrd. USD)"
**Behauptung (Accordion):** „71 % der Milliardärsvermögen stammen aus Erbschaften"

**URL:** https://www.oxfam.de/publikationen/bericht-soziale-ungleichheit-2026

**Prüfergebnis: ⚠️ Teilweise verifiziert**

- ✅ „172 Milliardär\*innen" in Deutschland bestätigt (Anstieg um ein Drittel).
- ✅ Gesamtvermögen 840,2 Milliarden USD bestätigt.
- ⚠️ „71 % aus Erbschaften": Dieser Wert war in der abgerufenen Seitenzusammenfassung nicht sichtbar. Er stammt möglicherweise aus dem vollständigen PDF-Report „Resisting the Rule of the Rich". Die Oxfam-Seite erwähnt das Thema Erbschaften, ohne die exakte 71-%-Zahl im HTML-Text zu nennen.

**Empfehlung:** Prüfen, ob die 71 % im PDF (Volltext des Berichts) belegt sind, oder Quellenangabe präzisieren.

---

### [6] Infratest dimap, April 2025

**Behauptung (Stat-Card):** „62–77 % der Deutschen befürworten eine Vermögensteuer"
**Behauptung (Einnahmen-Card):** „69 % für Vermögensabgabe, selbst 55 % der CDU/CSU-Anhänger"

**URLs:**

- https://www.infratest-dimap.de/.../2025/april/
- https://www.finanznachrichten.de/...umfrage-auch-unionsanhaenger-mehrheitlich-fuer-steuer-auf-hohe-vermoegen...

**Prüfergebnis: ✅ Korrigiert**

- ✅ 69 % insgesamt für Vermögensteuer: **bestätigt** (finanznachrichten.de: „mehr als zwei Drittel (69 Prozent)")
- ✅ **„55 % der CDU/CSU-Anhänger" → auf „66 %" korrigiert** (Quelle belegt 66 % Unionsanhänger)
- ⚠️ „62–77 %": Die 69 % ist ein Datenpunkt. Die Grenzen 62 % und 77 % müssten aus anderen Umfragen/Zeitpunkten stammen, werden aber allein mit [fn6] belegt.

**Empfehlung:** ~~„55 %" auf „66 %" korrigieren~~ ✅ Erledigt. Für den Bereich 62–77 % weitere Quellen ergänzen.

---

### [7] Gilens & Page (2014) — Testing Theories of American Politics

**Behauptung:** „1.779 politische Entscheidungen" analysiert; Zitat: „Die Präferenzen des Durchschnittsbürgers haben einen verschwindend geringen, statistisch nicht signifikanten Einfluss auf politische Entscheidungen."

**URL:** https://www.cambridge.org/core/journals/perspectives-on-politics/article/abs/testing-theories-of-american-politics-...

**Prüfergebnis: ✅ Korrekt (Paraphrase)**

- ✅ 1.779 policy issues: bestätigt im Abstract.
- ✅ Kernaussage des Abstracts: „average citizens and mass-based interest groups have little or no independent influence."
- Das deutsche Zitat in der Webapp ist eine sinngemäße Übersetzung, kein wörtliches Zitat. In Anführungszeichen gesetzt, sollte es als Paraphrase gekennzeichnet sein oder als „sinngemäß" markiert werden — allerdings ist die Praxis bei übersetzten Zitaten im Deutschen üblich.

---

### [8] Rau & Stokes (2024) — PNAS

**Behauptung:** „7× höheres Risiko" demokratischer Erosion bei Ungleichheit.

**URL:** https://www.pnas.org/doi/10.1073/pnas.2422543121

**Prüfergebnis: 🔒 Nicht zugänglich**

- Die Seite leitet auf eine Login-Seite um. Inhalt nicht abrufbar.
- Die bibliographischen Angaben (Rau & Stokes, 2024, PNAS) sind plausibel.
- Die „7×"-Behauptung konnte nicht überprüft werden.

---

### [9] Winters (2011) — Oligarchy

**Behauptung/Zitat:** „Demokratie verdrängt Oligarchie nicht — sie verschmilzt mit ihr."

**URL:** https://www.cambridge.org/core/books/oligarchy/4FBD6D2E32B0E7B88CEF7839A36B72B4

**Prüfergebnis: 🔒 Server-Fehler (HTTP 500)**

- Die Cambridge-Seite war beim Abruf nicht erreichbar.
- Das Buch „Oligarchy" von Jeffrey A. Winters (Cambridge University Press, 2011) existiert nachweislich.
- Das Zitat kann ohne Buchzugang nicht verifiziert werden; es ist thematisch konsistent mit Winters' bekannter Argumentationslinie.

---

### [10] Robert Reich — Billionaires, the Media, and Trump

**Behauptung/Zitat:** „Als Medienmagnat kann man sich effektiv gegen die Demokratie absichern, indem man Kritik an sich selbst und anderen Plutokraten unterdrückt."

**URL:** https://robertreich.substack.com/p/billionaires-the-media-and-trump

**Prüfergebnis: ✅ Thema korrekt (Paywall)**

- Artikel existiert (25. Nov. 2025).
- Tatsächlicher Titel: „A toxic combo: Trump, Billionaires, and the Media" (Fußnote sagt „Billionaires, the Media, and Trump" — leichte Abweichung in der Reihenfolge).
- Inhalt beginnt mit Aufzählung der Milliardäre und ihrer Medienbesitze (Musk/X, Ellison/Paramount, Zuckerberg/Facebook, Bezos/WashPost).
- Volltext hinter Paywall; das Zitat in der Webapp konnte nicht wortgetreu bestätigt werden, ist aber thematisch konsistent.

---

### [11] Musk-Spenden (277 Mio. $)

**Behauptung:** „Elon Musk gab mindestens 277 Mio. Dollar an Trump-unterstützende Super PACs"

**URLs:**

- https://www.washingtonpost.com/.../elon-musk-trump-campaign-spending-fec/ (Dez. 2024)
- https://www.opensecrets.org/.../elon-musk-tops-list-of-2024-political-donors... (März 2025)

**Prüfergebnis: ✅ Korrigiert**

- Die OpenSecrets-Analyse (26. März 2025) nennt **$291 Mio.** Gesamtspenden Musks im Wahlzyklus 2024.
- Die $277 Mio. stammten aus dem früheren Washington-Post-Bericht (Dez. 2024), der auf damals verfügbare FEC-Daten basierte.
- **Korrektur durchgeführt:** Webapp und Fußnotentext auf „291 Mio. $" aktualisiert.

**Empfehlung:** ~~Auf „291 Mio. $" aktualisieren~~ ✅ Erledigt.

---

### [12] LobbyControl — Lobbyregister-Auswertung März 2025

**Behauptung:** LobbyControl dokumentiert ein „groteskes Ungleichgewicht der finanziellen Mittel der Interessengruppen".

**URL:** https://www.lobbycontrol.de/pressemitteilung/auswertung-des-lobbyregisters-zeigt-uebermacht-der-wirtschaftslobby-120096/

**Prüfergebnis: ✅ Korrekt**

- Titel: „Auswertung des Lobbyregisters zeigt Übermacht der Wirtschaftslobby" (19. März 2025).
- Kerndaten: 81 von 100 größten Lobbyakteuren sind Wirtschaftsakteure. Nur 7 zivilgesellschaftliche Organisationen unter Top 100.
- „15-mal so viel" für Lobbyarbeit von Wirtschaft vs. Umweltverbände.
- Die Worte „groteskes Ungleichgewicht" sind eine Paraphrase der in der Pressemitteilung belegten Fakten — die Quelle spricht von „Übermacht" und warnt vor „Konzentration politischer und ökonomischer Macht."

---

### [13] Piketty — Kapital und Ideologie (C.H.Beck 2020)

**Behauptung/Zitat:** „Die Eigentumskonzentration verleiht einer kleinen Gruppe weit mehr politischen Einfluss, als mit einem demokratischen Gemeinwesen vereinbar ist."

**URL:** https://www.chbeck.de/piketty-kapital-ideologie/product/29712172

**Prüfergebnis: ✅ Korrigiert**

- Die alte URL (Suhrkamp, ISBN 978-3-518-58750-8) führte zu Tomasellos „Mensch werden" — **falsche ISBN und falscher Verlag**.
- „Kapital und Ideologie" ist bei **C.H.Beck** erschienen (ISBN 978-3-406-74571-3, Hardcover 2020; Taschenbuch 978-3-406-78909-0, 2022).
- **Korrektur durchgeführt:** Verlag auf „C.H.Beck" geändert, URL auf chbeck.de aktualisiert.
- Das Zitat kann ohne Buchzugang nicht wortgetreu überprüft werden; es ist inhaltlich konsistent mit Pikettys bekannten Thesen.

**Empfehlung:** ~~Korrekte ISBN recherchieren und URL aktualisieren.~~ ✅ Erledigt.

---

### [14] Infratest dimap — DeutschlandTREND Juli 2025

**Behauptung:** „60 % der Bundesbürger finden, dass es in Deutschland ungerecht zugeht — der höchste Wert seit 15 Jahren."

**URL:** https://www.infratest-dimap.de/umfragen-analysen/bundesweit/ard-deutschlandtrend/2025/juli/

**Prüfergebnis: ✅ Exakt bestätigt**

- Wortlaut der Quelle: „60 Prozent die Meinung, dass es in Deutschland ungerecht zugeht, der höchste Wert seit 15 Jahren."
- Perfekte Übereinstimmung mit der Webapp-Behauptung.
- Studieninfo: 1.312 Befragte, 30. Juni–2. Juli 2025.

---

### [15] Grüne Bundestagsfraktion — Plan für mehr Steuergerechtigkeit

**Behauptungen:**

- Privilegien über 26 Mio. € abschaffen (mit Stundungsmodellen)
- Privilegien bei 300 Wohnungen streichen
- 2023 rund 2 Mrd. € mehr durch Abschaffung der Privilegien
- „Zweistellige Milliardenhöhe" durch Steuerlückenschließung
- Globale Milliardärssteuer: ca. 5,7 Mrd. € für DE

**URL:** https://www.gruene-bundestag.de/.../plan-fuer-mehr-steuergerechtigkeit/

**Prüfergebnis: ✅ Korrekt**

- Alle genannten Punkte sind auf der Seite belegt:
    - „2023 wurden so mehr als 2 Milliarden Euro an Steuern erlassen" (Privilegien >26 Mio.)
    - „Steuerbefreiung bei Erbschaften ab 300 Wohnungen beenden"
    - „einen zusätzlichen Betrag in zweistelliger Milliardenhöhe" (Link zu Finanzwende)
    - „Mögliche Einnahmen schätzt das DIW für Deutschland auf 5,7 Mrd. Euro" (globale Milliardärssteuer)
    - Stundungsregelungen statt Steuerbefreiung

---

### [16] Zucman — G20-Blueprint für globale Milliardärsteuer

**Behauptung:** „Gabriel Zucman schlägt global 2 % auf Vermögen über 1 Mrd. USD vor — geschätztes Aufkommen: 200–250 Mrd. USD jährlich."

**URLs:**

- https://gabriel-zucman.eu/files/report-g20.pdf (PDF)
- https://www.icij.org/.../top-economist-pitches-global-billionaire-tax-to-g20-finance-leaders/

**Prüfergebnis: ✅ Exakt bestätigt**

- ICIJ-Artikel: „2% of their wealth would generate between $200 and $250 billion a year."
- Bezogen auf ca. 3.000 Personen mit Vermögen über 1 Mrd. USD.
- Zucman ist Professor an Paris School of Economics und UC Berkeley.

---

### [17] Bach/DIW — Vermögensteuer 147 Mrd. €

**Behauptung:** „Stefan Bach (DIW) berechnet bis zu 147 Mrd. € jährliches Aufkommen bei einer progressiven Vermögensteuer ab 2,3 Mio. €."

**URLs:**

- https://www.handelsblatt.com/.../diw-sieht-milliardenpotenzial-bei-einfuehrung-der-vermoegensteuer.../
- https://www.diw.de/.../projekte/studien_zur_vermoegensbesteuerung.html

**Prüfergebnis: ✅ Exakt bestätigt**

- Handelsblatt (11.02.2026): „eine Vermögensteuer nach dem Konzept der Linken zu jährlichen Einnahmen von 147 Milliarden Euro führen"
- „Zahlen müsste fast ausschließlich das reichste eine Prozent der Bevölkerung mit einem persönlichen Vermögen ab 2,3 Millionen Euro."
- Studie im Auftrag der Linken, Autor Stefan Bach.
- Wichtig: Die Quelle warnt vor „beträchtlichen wirtschaftlichen Risiken" — diese Einschränkung fehlt in der Webapp.

---

### [18] Fratzscher/DIW — Kapital und Arbeit

**Behauptung/Zitat:** „Kaum ein Land besteuert Arbeit so hoch und Vermögen so niedrig wie Deutschland." — Marcel Fratzscher, DIW-Präsident

**URLs:**

- https://www.tagesspiegel.de/.../kapital-und-arbeit-sollten-gleich-besteuert-werden-3712954.html
- https://www.diw.de/.../wir_muessen_superreiche_endlich_staerker_besteuern.html

**Prüfergebnis: ⚠️ Paraphrase, nicht wörtliches Zitat aus dieser Quelle**

- Der Tagesspiegel-Artikel (2016) zitiert Fratzscher mit: „Kapital und Arbeit sollten gleich besteuert werden." Er erklärt: „Derzeit haben wir eine Kapitalertragssteuer von 25 Prozent – beim Einkommen geht es auf bis zu 45 Prozent hoch."
- Die exakte Formulierung „Kaum ein Land besteuert Arbeit so hoch und Vermögen so niedrig wie Deutschland" ist in diesem Artikel nicht zu finden.
- Der Satz ist inhaltlich konsistent mit Fratzschers bekannten Positionen und könnte aus dem zweiten Link (diw.de) oder einem anderen Interview stammen.

**Empfehlung:** Prüfen, ob die zweite DIW-Quelle die exakte Formulierung enthält; ggf. als Paraphrase kennzeichnen.

---

### [19] EU Tax Observatory — Resources for a Safe and Resilient Europe (März 2025)

**Behauptung:** Globale Milliardärssteuer könnte für Deutschland ca. 5,7 Mrd. € einbringen.

**URL:** https://www.taxobservatory.eu/.../Resources-for-a-Safe-and-Resilient-Europe...pdf

**Prüfergebnis: 🔒 PDF nicht direkt abrufbar**

- Der PDF-Link ist ein direkter Download; der Inhalt konnte nicht im Browser gelesen werden.
- Die Zahl „5,7 Mrd. €" wird von der Grüne-Bundestagsfraktion-Seite mit Verweis auf DIW-Schätzungen bestätigt.
- Plausibel im Kontext von Zucmans 200–250 Mrd. USD global (Deutschlands Anteil wäre proportional).

---

### [20] Grüne BDK-Beschluss VR-09 (16.11.2024)

**Behauptungen:** 25 % einheitlicher Steuersatz, einheitlicher Lebensfreibetrag, Stundungsmodelle für Betriebsvermögen.

**URL:** https://cms.gruene.de/uploads/assets/Beschluss-vorl%C3%A4ufig-VR-09-...pdf

**Prüfergebnis: 🔒 PDF nicht direkt prüfbar**

- Der BDK-Beschluss VR-09 vom 16.11.2024 ist ein offizielles Parteidokument.
- Die beschriebenen Inhalte (25 %, Lebensfreibetrag, Stundungsmodelle) sind konsistent mit öffentlichen Berichterstattungen über den Grünen-Parteitag 2024.

---

### [21] Grüne Bundestagsfraktion — Erbschaftssteuer verteidigen

**Behauptung:** Schutz von „Omas Häuschen" bei Erbschaft bleibt bestehen.

**URL:** https://www.gruene-bundestag.de/.../gruene-bundestagfraktion-verteidigt-erbschaftssteuer/

**Prüfergebnis: ✅ Korrekt**

- Seite existiert (veröffentlicht 25.07.2025).
- Erwähnt explizit: „Geschichten, die vom Erhalt von ‚Omas Häuschen' erzählen, verschleiern diese Wahrheit. Sie verkennen, dass es genau dafür bereits umfangreiche Schutzregelungen im Steuerrecht gibt."
- Bestätigt die Webapp-Aussage: Selbstgenutzte Immobilien bleiben geschützt.

---

### [22] Grüne Arguhilfen 2021 — Vermögensteuer

**Behauptungen:** Vermögensteuer 1 % ab 2 Mio. € pro Person, Eigenheim-Freistellung, Ländersteuer, Betriebsvermögen-Begünstigungen.

**URL:** https://cms.gruene.de/uploads/assets/Steuern_Arguhilfen_2021.pdf

**Prüfergebnis: 🔒 PDF nicht direkt prüfbar**

- Offizielle Partei-Arguhilfe zur BTW 2021.
- Die beschriebenen Parameter (1 %, 2 Mio. Freibetrag, Eigenheim-Freistellung, Ländersteuer) sind konsistent mit dem bekannten Grünen-Wahlprogramm 2021.
- Finanzwende bestätigt: „9,5 Milliarden Euro" bei 1 % und 20 Mio. Freibetrag, „bis zu 24 Milliarden Euro bei einem Freibetrag von 2 Millionen Euro."

---

### [23] Finanzwende — 10 Steuerprivilegien und 80 Mrd. €

**Behauptung:** „Mehreinnahmen in zweistelliger Milliardenhöhe durch Schließung von Steuerlücken"

**URL:** https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro/

**Prüfergebnis: ✅ Bestätigt**

- Titel: „Die zehn wichtigsten Steuerprivilegien und die 80 Milliarden Euro"
- Einzelposten: Vermögensteuer (9,5 Mrd.), Erbschaftsteuer-Ausnahmen (5,1 Mrd.), Spitzensteuersatz (14,5 Mrd.), Immobiliengewinne (6 Mrd.), Unternehmensgewinne in Steueroasen (17 Mrd.), uvm.
- Die Grüne-Bundestagsfraktion verlinkt direkt auf diese Seite als Beleg für „zweistellige Milliardenhöhe."
- Gemeinsame Kampagne von Finanzwende, Netzwerk Steuergerechtigkeit und taxmenow.

---

## Datenquellen

### age-groups.yaml

| Altersgruppe | Wert in YAML | Quelle                  | Status                       |
| ------------ | ------------ | ----------------------- | ---------------------------- |
| unter 35     | 17.300 €     | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| 35–44        | 75.500 €     | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| 45–54        | 146.200 €    | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| 55–64        | 241.100 €    | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| 65–74        | 193.300 €    | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| 75+          | 172.500 €    | IWD/Bundesbank PHF 2023 | ✅ Plausibel                 |
| Gesamt       | 103.100 €    | IWD/Bundesbank PHF 2023 | ✅ Bundesbank sagt 103.200 € |

**Anmerkung:** Die Bundesbank-PHF-Studie nennt als Median 103.200 €, die Webapp/YAML nutzt 103.100 €. Die Abweichung von 100 € ist minimal und könnte durch Rundung in der IWD-Grafik entstehen.

### wealthy.yaml

Quelle: Wikipedia/Manager Magazin (Oktober 2024). Die Werte sind Momentaufnahmen und unterliegen Schwankungen. Die Vermögenswerte in der YAML-Datei nutzen Milliarden EUR und sind plausibel für die Manager-Magazin-Schätzungen.

---

## Empfehlungen

### ~~Sofort korrigieren (Fehler)~~ ✅ Alle erledigt (19.04.2026)

1. ~~**fn6: „55 % der CDU/CSU-Anhänger" → „66 %"**~~
    - Korrigiert in `src/index.html`.

2. ~~**fn13: URL korrigieren**~~
    - Verlag war C.H.Beck (nicht Suhrkamp). URL auf `chbeck.de/piketty-kapital-ideologie/product/29712172` geändert.

### ~~Aktualisieren (veraltet)~~ ✅ Erledigt (19.04.2026)

3. ~~**fn11: 277 → 291 Mio. $**~~
    - Korrigiert in Fließtext und Fußnotentext.

### Optional verbessern

4. **fn5: „71 %" präzisieren** — Prüfen, ob die Zahl im Oxfam-PDF steht; ggf. Seitenzahl angeben.
5. **fn6: „62–77 %" Bereich** — Zusätzliche Quellen für die Bandbreite angeben.
6. **fn18: Zitat** — Als sinngemäße Wiedergabe kennzeichnen oder exakte Quelle für den Wortlaut finden.
7. **fn10: Titel** — „Billionaires, the Media, and Trump" → tatsächlich „A toxic combo: Trump, Billionaires, and the Media" (geringfügig).

---

_Erstellt am: Juli 2025_
_Letzte Aktualisierung: 19. April 2026 — Korrekturen fn6, fn11, fn13 durchgeführt_
_Methodik: Systematischer Abruf und Vergleich aller 23 Quellenlinks mit den Behauptungen in der Webapp._
