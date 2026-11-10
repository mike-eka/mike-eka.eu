# Atlas: So änderst du …

Der Atlas (`/atlas/`) ist so gebaut, dass Inhalte nur in **YAML- und Markdown-Dateien**
stehen. Für alles in diesem Dokument musst du keine Templates, kein CSS und kein
JavaScript anfassen – mit zwei Ausnahmen: Farben (eine Datei, nur Variablen) und
neue Grafiktypen oder Schablonenfelder (siehe „Grenzen“ am Ende).

```
npm start             # Vorschau unter http://localhost:8080/atlas/
npm run build         # baut nach _site/
npm run check:atlas   # Prüfung vor dem Merge nach main (siehe unten)
```

## Wo steht was?

| Datei | Inhalt |
|---|---|
| `src/_data/atlas/begriffsmodell.yaml` | Titel, Kernsatz, Haltung, Prüffragen, Hinsichten, Wirkungen, Urteile, „Was die Definition offenlässt“ (`offen_gelassen`), Beziehungen (Schema), große Schablone (`schablone_stufen`), Abschnitt „Für wen?“, Schalter `entwuerfe_anzeigen` |
| `src/_data/atlas/beschriftungen.yaml` | alle festen Beschriftungen: Überschriften, Knöpfe, Legenden, Navigation |
| `src/_data/atlas/ueber.yaml`, `anhang.yaml`, `en.yaml` | Texte der Seiten Über, Anhang und der englischen Kurzfassung |
| `src/atlas/muster/*.md` | eine Datei pro Musterkarte (Kopfdaten + Fließtext) |
| `src/css/atlas.css` | Gestaltung; alle Farben als Variablen ganz oben |

Seiten: `/atlas/` (Übersicht mit Landkarte), `/atlas/muster/<datei>/`,
`/atlas/begriffsmodell/`, `/atlas/anhang/`, `/atlas/ueber/`, `/atlas/handout/`,
`/en/atlas/`, dazu `/atlas/atlas.json` und `/atlas/atlas.jsonld`.

## Rezepte

### Neues Muster anlegen

1. Eine bestehende Karte kopieren, z. B. `src/atlas/muster/meinung-als-tatsache.md` →
   `src/atlas/muster/mein-muster.md`. Der Dateiname wird zur Adresse
   (`/atlas/muster/mein-muster/`) und ist die `id` für `schablone_stufen`.
2. In den Kopfdaten anpassen:
   - `titel`, `fachbegriff` (ein englischer Fachbegriff; erscheint auf der englischen Seite), `kurz`
   - `hinsicht`: eine `id` aus `hinsichten` in `begriffsmodell.yaml`
     (`glauben`, `achten`, `vertrauen`, `begruenden`)
   - `reihenfolge`: Position innerhalb der Hinsicht (kleinere Zahl = weiter oben)
   - `veroeffentlicht: false`, solange die Karte ein Entwurf ist
   - `im_framework: true`, wenn sie in der Liste der Grenzfälle erscheinen soll
3. Inhalte: `effekt`, `minimalpaar` (oder `analogie`), `mittel`, `schablone`,
   `kippt_an`, `grenzfall_frage`, `einschaetzungen`, `normalfall`, `verzerrungen`,
   `literatur`, optional `grafik`.
   Darunter, nach dem zweiten `---`, der Fließtext in Markdown (kurz, ohne
   Zwischenüberschriften).
   Aufbau der Karte: Kopf → Minimalpaar bzw. Analogie (ggf. Grafik) → Was sich
   verschlechtert → Grenzfall → Einordnung → Sprachliches Mittel → Normal, weil →
   Verzerrungen → Fließtext → Literatur.
   `schablone` liefert die Kachel „Einordnung“ (Zeilen Inhalt, Vergleich, Hinsicht,
   Wirkung aus `inhalt`, `vergleichsfall`, `hinsicht`, `wirkung`) und die Stufe
   „Muster“ der großen Schablone; dort steuert `status` die Darstellung
   (`muster` = farbig, `offen` = gestrichelt).
   `verzerrungen` ist eine Liste mit `name` und `text`, z. B.
   `- { name: "Halo-Effekt", text: "…" }`. Fehlt sie, meldet der Build das.
   `effekt.hinsichten` ist eine Liste von Hinsicht-IDs, z. B. `[vertrauen, achten]`.
   Die Haupt-Hinsicht (`hinsicht`) steht schon im Badge; die übrigen erscheinen unter
   „Betrifft außerdem:“ (bei keiner weiteren entfällt die Zeile). Unbekannte IDs
   meldet der Build.
4. Wenn die Karte fertig ist: `veroeffentlicht: true`.

Varianten im Minimalpaar:
- Markierungen: `[[so]]` wird hervorgehoben.
- `minimalpaar.frage`: eine Frage über dem Paar; die Fassungen heißen dann
  „Antwort mit dem Muster“ und „Gegenform“. Mit `frage_label` (z. B. `"Ausgangslage"`)
  ersetzt du das Label „Gefragt“; die Fassungen heißen dann „Mit dem Muster“ und „Gegenform“.
- `muster` und `gegenform` dürfen Listen sein (eine Auswahl von Meldungen). Die Zeilen
  werden automatisch ausgerichtet und markiert: Einträge, die nur eine Fassung hat
  („+ zusätzlich“, gegenüber „fehlt hier“), und Einträge, die an derselben Stelle in
  beiden Fassungen verschieden sind („↔ ausgetauscht“).
- `minimalpaar: null` lässt die Kachel weg (z. B. wenn die Karte `analogie` nutzt).

Realer Fall statt Minimalpaar (z. B. Gewichtung & Auslassung): `minimalpaar: null` und
```yaml
fall:
  titel: "…"
  einleitung: "…"
  seiten:                      # zwei Seiten, nebeneinander (schmal untereinander)
    - { titel: "…", text: "…" }
    - { titel: "…", text: "…" }
  quelle: "…"
  hinweis: "…"
```

### Grenzfall ändern oder hinzufügen

Die Kachel „Grenzfall“ zeigt die Frage (`grenzfall_frage`), einen Knopf je Einschätzung
und darunter Wert, Urteil mit Begründung und Wirkung der gewählten Einschätzung (ohne
JavaScript und im Druck alle untereinander). `kippt_an` sagt, welches Feld die
Einschätzungen füllen; es erscheint nicht als eigener Begriff.

```yaml
kippt_an: vergleich          # was | vergleich | hinsicht  (nie fuer_wen: das Publikum ist Rahmen)
grenzfall_frage: "Womit vergleicht man …?"
einschaetzungen:
  - label: "mit einer echten Antwort"      # Text des Knopfs
    vergleichsfall: "…"                     # Feld je nach kippt_an: inhalt | vergleichsfall | hinsicht
    urteil: ja                              # ja | nein | strittig
    begruendung: "…"
    wirkung: festhalten                     # optional: verschlechtern | festhalten | abschotten | keine,
                                            # auch mehrere: [verschlechtern, abschotten]
```

- Beliebig viele Einschätzungen sind möglich; jede wird ein Knopf.
- Die Wirkung erscheint mit Name und Erklärung (aus `wirkungen` in `begriffsmodell.yaml`);
  ohne `wirkung` steht dort der Text aus `schablone.wirkung`.
- Lautet das Urteil `nein`, gibt es keine Wirkung: `wirkung: keine` (oder weglassen).
  Der Build warnt, wenn ein `nein` eine Wirkung trägt.
- Welche Karte die große Schablone auf der Begriffsmodell-Seite zeigt, steht in
  `begriffsmodell.yaml` unter `schablone_stufen.muster`.
- Der Build warnt, wenn `kippt_an` falsch ist oder einer Einschätzung das passende Feld fehlt.

### Text ändern

- Text einer Karte: in `src/atlas/muster/<datei>.md`.
- Kernsatz, Haltung, Prüffragen, „Für wen?“, Hinsichten, „Was die Definition
  offenlässt“ usw.: `begriffsmodell.yaml`.
- Hinsichten: `name` und `erklaerung` (ein Satz, was die Hinsicht umfasst; erscheint
  in Landkarte, Liste und Handout) unter `hinsichten` in `begriffsmodell.yaml`;
  englisch in `en.yaml` unter `hinsichten.<id>.name` / `.erklaerung`.
- Über, Anhang, Englisch: `ueber.yaml`, `anhang.yaml`, `en.yaml`.
- Längere Texte stehen in YAML als Block:
  ```yaml
  kurz: >-
    Erste Zeile
    geht hier weiter.
  ```
  Bei Anführungszeichen im Text die typografischen „…“ verwenden oder den Text in
  `"…"` setzen und innere `"` vermeiden.
- Zitierte Sätze (`inhalt` einer Einschätzung, `minimalpaar.muster`/`gegenform`,
  `minimalpaar.frage` ohne `frage_label`, `analogie.aussage`) ohne eigene
  Anführungszeichen schreiben: Die Seite setzt sie selbst. Der Build warnt sonst.

### Beschriftung ändern

Alle festen Texte (Überschriften wie „Was sich verschlechtert“, Knöpfe, Legenden,
„in Vorbereitung“, die Navigation der Übersicht) stehen in
`src/_data/atlas/beschriftungen.yaml`, geordnet nach Seite bzw. Baustein (`karte`,
`schablone`, `grafik`, `uebersicht`, `begriffsmodell`, `anhang`, `handout` …).
Die Beschriftungen der englischen Seite stehen in `en.yaml` unter `beschriftungen`.

### Farbe ändern

Ganz oben in `src/css/atlas.css` stehen alle Farben als Variablen, z. B.
`--atlas-kern` (Akzent, Linien), `--atlas-kern-text` (Akzent für Text),
`--atlas-hinsicht` (zweite Akzentfarbe), `--atlas-kachel-*` (Töne der Kacheln).
Nur diese Werte ändern. Für Text auf Kacheln mindestens 4,5:1 Kontrast einhalten,
für Linien 3:1 (z. B. mit einem Kontrastrechner prüfen).

### Grafikdaten ändern

Grafiken stehen im Feld `grafik` einer Karte, direkt nach dem Beispiel. `titel` ist die
Überschrift der Kachel (sonst die aus `beschriftungen.yaml → grafik.titel`). Drei Typen gibt es:

- **`typ: netz`** (Kaperung): `knoten` (Koordinaten 0–100, `gruppe`, optional `label`),
  `kanten` (`von`/`nach`, auch als Liste), Bedingungen in `nur_wenn`, eigene `schalter`,
  `kennzahl` und `kennzahl_2`, `urteile` mit `wenn`.
  Bedingungen: Namen von Schaltern oder des Zustands, `!`, `&&`, `==`, `!=`, Vergleiche
  wie `kennzahl >= 75`, und `sonst` als letztes Urteil.
  Kopplung an die Einschätzungen: `zustand_aus_einschaetzung: rueckbindung` und in jeder
  Einschätzung `grafik_zustand: { rueckbindung: klima }`.
- **`typ: balken`** (Gewichtung): `reihe_a: { feld, label }` ist die feste Vergleichsreihe,
  `masse` die Maße, zwischen denen der Schalter wechselt; `themen` mit einem Zahlenwert (in
  Prozent) für `reihe_a.feld` und für jedes Maß, optional `absolut: { feld: Zahl, … }` –
  die absoluten Zahlen stehen dann in Klammern in der Tabelle, im Tooltip und in der
  Textalternative.
- **`typ: illustration`**: eine ruhige Zeichnung mit genau einem Knopf, der den Trick
  aufdeckt. Immer: `motiv`, `titel`, `knopf` (Text des Knopfs), `vorher` und `nachher`
  (die beiden Bildunterschriften; sie sind auch die Textalternative). Je nach Motiv:
  - `motiv: sprechblase` – `text` (der Satz in der Blase); aufgedeckt wird sie zur
    Gedankenblase.
  - `motiv: formel` – `zeilen`: Liste von `{ text, fehler }`; Zeilen mit `fehler` werden
    beim Aufdecken unterstrichen, die Anmerkung steht daneben (schmal: darunter).
  - `motiv: massstab` – `links` und `rechts` je `{ gegenstand, blase, blase_gross, lineal }`,
    `marke`; aufgedeckt steht das Lineal auch rechts.
  - `motiv: weiche` – `start`, `ziel_umgeleitet`, `ziel_eigentlich`; aufgedeckt stellt sich
    die Weiche um.
  Die Zeichnung entsteht beim Build (`config/illustration.js`) in zwei Formaten (quer,
  schmal hochkant). Ohne JavaScript und im Druck zeigt sie den aufgedeckten Zustand mit
  beiden Bildunterschriften. Bei „Bewegung reduzieren“ schaltet sie ohne Animation um.

Bei `netz` und `balken` erscheint der `hinweis` direkt unter der Grafik, und ohne
JavaScript zeigt die Karte die Daten als Tabelle. Der Build warnt bei unbekannten Namen,
unlesbaren Bedingungen, fehlenden Werten, unbekanntem `motiv` oder fehlenden Feldern
einer Illustration.

### Entwurf verbergen und Entwürfe insgesamt ausblenden

- Eine Karte verbergen: `veroeffentlicht: false`. Sie wird nicht gebaut und erscheint
  in Landkarte und Liste als „in Vorbereitung“, ohne Link.
- Alle Entwürfe ausblenden: in `begriffsmodell.yaml` `entwuerfe_anzeigen: false`.
  Dann erscheinen Entwürfe nirgends – nicht in Landkarte und Liste – und es bleibt
  kein leerer Platz.
- Entwürfe stehen nie in Handout, englischer Seite, `atlas.json` oder `atlas.jsonld`.

## Hinweise

- **Nach Änderungen an `config/atlas.js`** (oder anderen Dateien in `config/`) muss der
  Dev-Server neu gestartet werden (`npm start` beenden und neu starten). Er lädt nur
  Änderungen an Inhalten und Templates von selbst nach.
- **`{{` darf im Fließtext der Karten nicht vorkommen.** Der Markdown-Text wird auch
  von Nunjucks verarbeitet; `{{` würde als Platzhalter gelesen und den Build abbrechen.
  Gleiches gilt für `{%`.
- Impressum und Datenschutz: Platzhalter stehen in `[ECKIGEN KLAMMERN]`. Jeder Build
  meldet, wie viele noch offen sind. `platzhalter: true` erst entfernen, wenn alle ersetzt sind.

- **Drucken:** Alle Atlas-Seiten haben ein Druck-CSS (in `atlas.css`, Abschnitt
  „Print“): ohne Menü, Sprachschalter und Footer, oben Seitentitel und Adresse
  (`druckkopf: true`, für das Handout abgeschaltet), Kacheln untereinander;
  interaktive Teile erscheinen wie ohne JavaScript, das Schema im Anhang auf einer
  Querformatseite.
- **Wertebereiche** von Urteil und Wirkung (Übersicht, Anhang) kommen aus `urteile`
  und `wirkungen` in `begriffsmodell.yaml`; der Zusatz „keine, wenn …“ aus
  `beschriftungen.yaml → uebersicht.wirkung_zusatz`.

## Prüfung vor dem Merge nach main

```
npm run check:atlas
```

Vorher den Dev-Server beenden (unter Windows sperrt er sonst Dateien in `_site/`).
Das Skript baut neu und prüft:

1. Build ohne Warnungen (außer dem Platzhalter-Hinweis)
2. alle internen Links und Anker lösen auf
3. keine externen Requests (Skripte, Styles, Bilder, iframes, CSS)
4. keine `TODO`, kein `PRÜFEN` und keine `[PLATZHALTER]` auf veröffentlichten Seiten
   und in den JSON-Ausgaben; keine `TODO`/`PRÜFEN` in den Atlas-Daten und in
   veröffentlichten Karten

Nur wenn alles grün ist (Exit-Code 0), nach `main` mergen.

## Grenzen (bewusst)

Im Code angelegt sind die Felder der Schablone (Inhalt, Vergleichsfall, Hinsicht,
Urteil, Wirkung; Publikum als Rahmen), die Grafiktypen `netz`, `balken` und
`illustration` und deren vier Motive. Eine neue Prüffrage, ein weiteres Schablonenfeld,
ein neuer Grafiktyp oder ein neues Motiv braucht eine
Codeänderung.
