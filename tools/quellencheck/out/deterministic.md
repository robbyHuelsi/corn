# Deterministische Prüfung (Phase 3)

## fn1 [AUSSAGE] — In Haushalten, in denen die älteste Person in Deiner Altersgruppe ist, beträgt das mittlere Nettovermögen den unten angezeigten Wert. Passe den Wert an Deine persönliche Situation an — Dein Vermögen bestimmt den Wert eines einzelnen Maiskorns.
- Snapshots: fn01_1_iwd.de.txt

## fn2 [AUSSAGE] — Wähle ein Vergleichsvermögen, das in Maiskörner umgerechnet wird.
- Snapshots: fn02_1_de.wikipedia.org.txt

## fn3 [ZAHL] — 27–35 % des Gesamtvermögens gehört dem reichsten 1 %
- Snapshots: fn03_1_wid.world.txt
- ⚠️ Zahl 27–35 % [PARTIAL]: gefunden ['27'], fehlt ['35']
- ✅ Zahl 1 % [PRESENT]: gefunden ['1'], fehlt []

## fn4 [ZAHL] — 1,3–2,4 % besitzt die untere Hälfte der Bevölkerung
- Snapshots: fn04_1_diw.de.txt
- ⚠️ Zahl 1,3–2,4 % [PARTIAL]: gefunden ['1,3'], fehlt ['2,4']

## fn4 [ZAHL] — 27–35 % des Gesamtvermögens gehört dem reichsten 1 %
- Snapshots: fn04_1_diw.de.txt
- ⚠️ Zahl 27–35 % [PARTIAL]: gefunden ['35'], fehlt ['27']
- ✅ Zahl 1 % [PRESENT]: gefunden ['1'], fehlt []

## fn5 [ZAHL] — 1,3–2,4 % besitzt die untere Hälfte der Bevölkerung
- Snapshots: fn05_1_publikationen.bundesbank.de.txt
- ✅ Zahl 1,3–2,4 % [PRESENT]: gefunden ['1,3', '2,4'], fehlt []

## fn6 [AUSSAGE] — 172 Milliardär*innen in Deutschland — Platz 4 weltweit
- Snapshots: fn06_1_oxfam.de.txt

## fn6 [ZAHL] — 71 % der Milliardär*innenvermögen stammen aus Erbschaften — nicht aus eigener Leistung. Gleichzeitig lebt ein Fünftel der Bevölkerung in Armut.
- Snapshots: fn06_1_oxfam.de.txt
- ❌ Zahl 71 % [ABSENT]: gefunden [], fehlt ['71']

## fn7 [ZAHL] — 69 % der Deutschen befürworten eine Vermögensteuer
- Snapshots: fn07_1_infratest_dimap.de.txt, fn07_2_finanznachrichten.de.txt
- ✅ Zahl 69 % [PRESENT]: gefunden ['69'], fehlt []

## fn7 [ZAHL] — Stabile Zustimmung: 69 % für Vermögensabgabe, selbst 66 % der CDU/CSU-Anhänger*innen
- Snapshots: fn07_1_infratest_dimap.de.txt, fn07_2_finanznachrichten.de.txt
- ✅ Zahl 69 % [PRESENT]: gefunden ['69'], fehlt []
- ✅ Zahl 66 % [PRESENT]: gefunden ['66'], fehlt []

## fn8 [ZITAT] 🧑‍⚖️ AKZEPTIERT — „Die Präferenzen der Durchschnittsbürger*innen haben einen verschwindend geringen, statistisch nicht signifikanten Einfluss auf politische Entscheidungen." — Gilens & Page (2014)
- Snapshots: fn08_1_cambridge.org.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ❌ Zitat (6%, NOT_FOUND): „Die Präferenzen der Durchschnittsbürger*innen haben einen verschwindend geringen, statistisch nicht signifikanten Einfluss auf politische Entscheidungen.“
    - längster Treffer: … statisti…

## fn9 [ZAHL] 🧑‍⚖️ AKZEPTIERT — Eine PNAS-Studie (2024) zeigt: Je ungleicher ein Land, desto höher das Risiko einer autoritären Regierung. Von ca. 4 % in den gleichsten bis zu über 30 % in den ungleichsten Demokratien - also ein etwa 7× höheres Risiko demokratischer Erosion.
- Snapshots: fn09_1_pnas.org.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ✅ Zahl 4 % [PRESENT]: gefunden ['4'], fehlt []
- ✅ Zahl 30 % [PRESENT]: gefunden ['30'], fehlt []

## fn10 [ZITAT] 🧑‍⚖️ AKZEPTIERT — „Demokratie verdrängt Oligarchie nicht — sie verschmilzt mit ihr." — Jeffrey Winters, „Oligarchy“ (2011)
- Snapshots: fn10_1_cambridge.org.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ❌ Zitat (17%, NOT_FOUND): „Demokratie verdrängt Oligarchie nicht — sie verschmilzt mit ihr.“
    - längster Treffer: …demokratie …
- ✅ Zitat (100%, VERBATIM): „Oligarchy“

## fn11 [ZITAT] 🧑‍⚖️ AKZEPTIERT — „Als Medienmagnat*in kann man sich effektiv gegen die Demokratie absichern, indem man Kritik an sich selbst und anderen Plutokraten unterdrückt und Versuche entmutigt, das eigene Vermögen über Steuern abzuschöpfen." — Robert Reich
- Snapshots: fn11_1_commondreams.org.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ❌ Zitat (3%, NOT_FOUND): „Als Medienmagnat*in kann man sich effektiv gegen die Demokratie absichern, indem man Kritik an sich selbst und anderen Plutokraten unterdrückt und Versuche entmutigt, das eigene Vermögen über Steuern abzuschöpfen.“
    - längster Treffer: …s medi…

## fn12 [ZAHL] — Elon Musk gab mindestens 277 Mio. Dollar an Trump-unterstützende Super PACs — das entspricht den kombinierten Spenden von 3 Millionen Kleinspender*innen.
- Snapshots: fn12_2_opensecrets.org.txt
- ❌ Zahl 277 Mio. [ABSENT]: gefunden [], fehlt ['277']
- ✅ Zahl 3 Millionen [PRESENT]: gefunden ['3'], fehlt []

## fn13 [ZITAT] — LobbyControl zeigt anhand des Lobbyregisters, wie sich konzentriertes Vermögen in politischen Einfluss verwandelt: Unter den 100 größten Lobbyakteuren finden sich nur drei NGOs — 81 sind Wirtschaftsakteure. Gesellschaftliche Anliegen ohne finanzstarke Lobby drohen dadurch „unter die Räder zu geraten". LobbyControl fordert deshalb einen Parteispendendeckel, der explizit den Einfluss von finanzstarken Konzernen und Superreichen abschwächt.
- Snapshots: fn13_1_lobbycontrol.de.txt
- ✅ Zitat (100%, VERBATIM): „unter die Räder zu geraten“

## fn14 [ZITAT] 🧑‍⚖️ AKZEPTIERT — „Zwar sind die Grundzüge der politischen Interessenvertretung bereits im Grundgesetz verankert, ein groteskes Ungleichgewicht der finanziellen Mittel der Interessengruppen und eine erschreckende Intransparenz sorgen jedoch dafür, dass finanzstarke Interessen sich in der politischen Welt ein ungleich besseres Gehör verschaffen können." — Jens Berger, „Marktordnung für Lobbyisten" (2011)
- Snapshots: fn14_1_nachdenkseiten.de.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ✅ Zitat (100%, VERBATIM): „Zwar sind die Grundzüge der politischen Interessenvertretung bereits im Grundgesetz verankert, ein groteskes Ungleichgewicht der finanziellen Mittel der Interessengruppen und eine erschreckende Intransparenz sorgen jedoch dafür, dass finanzstarke Interessen sich in der politischen Welt ein ungleich besseres Gehör verschaffen können.“
- ✅ Zitat (100%, VERBATIM): „Marktordnung für Lobbyisten“

## fn15 [ZAHL] — 71 % der Milliardär*innenvermögen stammen aus Erbschaften — nicht aus eigener Leistung. Gleichzeitig lebt ein Fünftel der Bevölkerung in Armut.
- Snapshots: fn15_1_businessinsider.de.txt
- ✅ Zahl 71 % [PRESENT]: gefunden ['71'], fehlt []

## fn16 [ZITAT] 🧑‍⚖️ AKZEPTIERT — „Die Eigentumskonzentration verleiht einer kleinen Gruppe weit mehr politischen Einfluss, als mit einem demokratischen Gemeinwesen vereinbar ist." — Thomas Piketty, „Kapital und Ideologie" (2019)
- Snapshots: fn16_1_chbeck.de.txt
- 🧑‍⚖️ Mensch-geprüft & akzeptiert: Mensch-geprüft (24.06.2026): übersetzte Zitate sinngemäß ok, Buchzitate auf Katalogseite akzeptiert, Thema/Titel/Zuordnung in Ordnung.
- ❌ Zitat (12%, NOT_FOUND): „Die Eigentumskonzentration verleiht einer kleinen Gruppe weit mehr politischen Einfluss, als mit einem demokratischen Gemeinwesen vereinbar ist.“
    - längster Treffer: …demokratischen ge…
- ✅ Zitat (100%, VERBATIM): „Kapital und Ideologie“

## fn17 [ZAHL] — 60 % der Bundesbürger*innen finden, dass es in Deutschland ungerecht zugeht — der höchste Wert seit 15 Jahren (ARD-DeutschlandTREND, Juli 2025).
- Snapshots: fn17_1_infratest_dimap.de.txt
- ✅ Zahl 60 % [PRESENT]: gefunden ['60'], fehlt []

## fn18 [ZAHL] — Allein die Abschaffung der Privilegien über 26 Mio. € hätte 2023 rund 2 Mrd. € mehr eingebracht.
- Snapshots: fn18_1_gruene_bundestag.de.txt
- ✅ Zahl 26 Mio. [PRESENT]: gefunden ['26'], fehlt []
- ✅ Zahl 2 Mrd. [PRESENT]: gefunden ['2'], fehlt []

## fn18 [AUSSAGE] — Betriebsvermögen erhält Begünstigungen zum Schutz von Investitionen.
- Snapshots: fn18_1_gruene_bundestag.de.txt

## fn18 [ZAHL] — Privilegien für Konzern-Erb*innen über 26 Mio. € werden abgeschafft — mit Stundungsmodellen für Liquidität.
- Snapshots: fn18_1_gruene_bundestag.de.txt
- ✅ Zahl 26 Mio. [PRESENT]: gefunden ['26'], fehlt []

## fn18 [AUSSAGE] — Privilegien für große Immobilienbestände (über 300 Wohnungen) werden ebenfalls gestrichen.
- Snapshots: fn18_1_gruene_bundestag.de.txt

## fn19 [ZAHL] — Gabriel Zucman (UC Berkeley) schlägt global 2 % auf Vermögen über 1 Mrd. USD vor — geschätztes Aufkommen: 200–250 Mrd. USD jährlich.
- Snapshots: fn19_1_gabriel_zucman.eu.txt, fn19_2_icij.org.txt
- ✅ Zahl 2 % [PRESENT]: gefunden ['2'], fehlt []
- ✅ Zahl 1 Mrd. [PRESENT]: gefunden ['1'], fehlt []
- ✅ Zahl 200–250 Mrd. [PRESENT]: gefunden ['200', '250'], fehlt []

## fn20 [ZAHL] — Stefan Bach (DIW) berechnet bis zu 147 Mrd. € jährliches Aufkommen bei einer progressiven Vermögensteuer ab 2,3 Mio. €.
- Snapshots: fn20_1_handelsblatt.com.txt, fn20_2_diw.de.txt
- ✅ Zahl 147 Mrd. [PRESENT]: gefunden ['147'], fehlt []
- ✅ Zahl 2,3 Mio. [PRESENT]: gefunden ['2,3'], fehlt []

## fn21 [ZITAT] — „Kaum ein Land besteuert Arbeit so hoch und Vermögen so niedrig wie Deutschland." — Marcel Fratzscher, DIW-Präsident
- Snapshots: fn21_1_tagesspiegel.de.txt, fn21_2_diw.de.txt
- ⚠️ Zitat (72%, CLOSE): „Kaum ein Land besteuert Arbeit so hoch und Vermögen so niedrig wie Deutschland.“
    - längster Treffer: …t arbeit so hoch und vermögen so niedrig wie deutschland.…

## fn22 [ZAHL] — Globale Milliardärssteuer könnte für Deutschland ca. 5,7 Mrd. € einbringen
- Snapshots: fn22_1_taxobservatory.eu.txt
- ✅ Zahl 5,7 Mrd. [PRESENT]: gefunden ['5,7'], fehlt []

## fn23 [ZAHL] — 25 % einheitlicher Steuersatz
- Snapshots: fn23_1_cms.gruene.de.txt
- ✅ Zahl 25 % [PRESENT]: gefunden ['25'], fehlt []

## fn23 [AUSSAGE] — Die meisten Menschen zahlen durch den hohen Freibetrag gar keine Erbschaftsteuer.
- Snapshots: fn23_1_cms.gruene.de.txt

## fn23 [ZAHL] — Formel: Steuer = (Gesamterbe − Lebensfreibetrag) × 25 %
- Snapshots: fn23_1_cms.gruene.de.txt
- ✅ Zahl 25 % [PRESENT]: gefunden ['25'], fehlt []

## fn23 [AUSSAGE] — Hoher Freibetrag pro Person (lebenslang)
- Snapshots: fn23_1_cms.gruene.de.txt

## fn23 [ZAHL] — Privilegien für Konzern-Erb*innen über 26 Mio. € werden abgeschafft — mit Stundungsmodellen für Liquidität.
- Snapshots: fn23_1_cms.gruene.de.txt
- ✅ Zahl 26 Mio. [PRESENT]: gefunden ['26'], fehlt []

## fn23 [ZITAT] — Wer „Omas Häuschen" erbt und selbst darin wohnt, bleibt weiterhin geschützt.
- Snapshots: fn23_1_cms.gruene.de.txt
- ❌ Zitat (38%, NOT_FOUND): „Omas Häuschen“
    - längster Treffer: …schen…

## fn24 [ZITAT] — Wer „Omas Häuschen" erbt und selbst darin wohnt, bleibt weiterhin geschützt.
- Snapshots: fn24_1_gruene_bundestag.de.txt
- ✅ Zitat (100%, VERBATIM): „Omas Häuschen“

## fn25 [ZAHL] — 1 % / Jahr Steuersatz
- Snapshots: fn25_1_cms.gruene.de.txt
- ✅ Zahl 1 % [PRESENT]: gefunden ['1'], fehlt []

## fn25 [ZAHL] — Ab 2 Mio. € Freibetrag pro Person
- Snapshots: fn25_1_cms.gruene.de.txt
- ✅ Zahl 2 Mio. [PRESENT]: gefunden ['2'], fehlt []

## fn25 [AUSSAGE] — Betriebsvermögen erhält Begünstigungen zum Schutz von Investitionen.
- Snapshots: fn25_1_cms.gruene.de.txt

## fn25 [AUSSAGE] — Ein durchschnittliches Eigenheim führt nicht zum Anfall dieser Steuer.
- Snapshots: fn25_1_cms.gruene.de.txt

## fn25 [AUSSAGE] — Wird als Ländersteuer erhoben.
- Snapshots: fn25_1_cms.gruene.de.txt

## fn26 [AUSSAGE] — Mehreinnahmen in zweistelliger Milliardenhöhe durch Schließung von Steuerlücken
- Snapshots: fn26_1_finanzwende.de.txt
