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
| `src/_data/atlas/begriffsmodell.yaml` | Titel, Kernsatz, Haltung, Prüffragen, Hinsichten, Wirkungen, Urteile, Etiketten, Nachbarn, Beziehungen (Schema), große Schablone (`schablone_stufen`), Abschnitt „Für wen?“, Schalter `entwuerfe_anzeigen` |
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
   (`/atlas/muster/mein-muster/`) und ist die `id` für `verwandt`, `spiegelfall` und
   `schablone_stufen`.
2. In den Kopfdaten anpassen:
   - `titel`, `fachbegriff` (erscheint auf der englischen Seite), `kurz`
   - `hinsicht`: eine `id` aus `hinsichten` in `begriffsmodell.yaml`
     (`glauben`, `achten`, `vertrauen`, `begruenden`, `rand`)
   - `reihenfolge`: Position innerhalb der Hinsicht (kleinere Zahl = weiter oben)
   - `veroeffentlicht: false`, solange die Karte ein Entwurf ist
   - `im_framework: true`, wenn sie in der Liste der Grenzfälle erscheinen soll
3. Inhalte: `effekt`, `minimalpaar` (oder `analogie`), `mittel`, `schablone`,
   `kippt_an`, `grenzfall_frage`, `einschaetzungen`, `etiketten`, `normalfall`,
   `verwandt`, `spiegelfall`, `anschlussfaecher`, `literatur`, optional `grafik`.
   Darunter, nach dem zweiten `---`, der Fließtext in Markdown (`## Zwischenüberschrift`
   wird automatisch eine Ebene tiefer gesetzt).
4. Wenn die Karte fertig ist: `veroeffentlicht: true`.

Varianten im Minimalpaar:
- Markierungen: `[[so]]` wird hervorgehoben.
- `minimalpaar.frage`: eine Frage über dem Paar; die Fassungen heißen dann
  „Antwort im Muster“ und „Gegenform“. Mit `frage_label` (z. B. `"Ausgangslage"`)
  ersetzt du das Label „Gefragt“; die Fassungen heißen dann „Muster“ und „Gegenform“.
- `muster` und `gegenform` dürfen Listen sein (eine Auswahl von Meldungen). Einträge,
  die nur eine Fassung hat, werden automatisch markiert.
- `minimalpaar: null` lässt die Kachel weg (z. B. wenn die Karte `analogie` nutzt).

### Grenzfall ändern oder hinzufügen

Ein Grenzfall besteht aus der Stellschraube und den Einschätzungen der Karte:

```yaml
kippt_an: vergleich          # was | vergleich | hinsicht  (nie fuer_wen: das Publikum ist Rahmen)
grenzfall_frage: "Womit vergleicht man …?"
einschaetzungen:
  - label: "mit einer echten Antwort"      # Text des Knopfs
    vergleichsfall: "…"                     # Feld je nach kippt_an: inhalt | vergleichsfall | hinsicht
    urteil: ja                              # ja | nein | strittig
    begruendung: "…"
    wirkung: festhalten                     # optional: verschlechtern | festhalten | abschotten | keine
```

- Beliebig viele Einschätzungen sind möglich; jede wird ein Knopf.
- Trägt mindestens eine Einschätzung `wirkung`, schaltet auch das Wirkungsfeld mit.
- Welche Karte die große Schablone auf der Begriffsmodell-Seite zeigt, steht in
  `begriffsmodell.yaml` unter `schablone_stufen.muster` (und `.nachbar`).
- Der Build warnt, wenn `kippt_an` falsch ist oder einer Einschätzung das passende Feld fehlt.

### Text ändern

- Text einer Karte: in `src/atlas/muster/<datei>.md`.
- Kernsatz, Haltung, Prüffragen, „Für wen?“, Hinsichten usw.: `begriffsmodell.yaml`.
- Über, Anhang, Englisch: `ueber.yaml`, `anhang.yaml`, `en.yaml`.
- Längere Texte stehen in YAML als Block:
  ```yaml
  kurz: >-
    Erste Zeile
    geht hier weiter.
  ```
  Bei Anführungszeichen im Text die typografischen „…“ verwenden oder den Text in
  `"…"` setzen und innere `"` vermeiden.

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

Grafiken stehen im Feld `grafik` einer Karte. Zwei Typen gibt es:

- **`typ: netz`** (Kaperung): `knoten` (Koordinaten 0–100, `gruppe`, optional `label`),
  `kanten` (`von`/`nach`, auch als Liste), Bedingungen in `nur_wenn`, eigene `schalter`,
  `kennzahl` und `kennzahl_2`, `urteile` mit `wenn`.
  Bedingungen: Namen von Schaltern oder des Zustands, `!`, `&&`, `==`, `!=`, Vergleiche
  wie `kennzahl >= 75`, und `sonst` als letztes Urteil.
  Kopplung an die Einschätzungen: `zustand_aus_einschaetzung: rueckbindung` und in jeder
  Einschätzung `grafik_zustand: { rueckbindung: klima }`.
- **`typ: balken`** (Gewichtung): `reihe_a`, `masse` (Schalter), `themen` mit einem
  Zahlenwert für `berichterstattung` und für jedes Maß.

Der `hinweis` erscheint direkt unter der Grafik. Ohne JavaScript zeigt die Karte die
Daten als Tabelle. Der Build warnt bei unbekannten Namen, unlesbaren Bedingungen oder
fehlenden Werten.

### Entwurf verbergen und Entwürfe insgesamt ausblenden

- Eine Karte verbergen: `veroeffentlicht: false`. Sie wird nicht gebaut und erscheint
  in Landkarte und Liste als „in Vorbereitung“, ohne Link.
- Alle Entwürfe ausblenden: in `begriffsmodell.yaml` `entwuerfe_anzeigen: false`.
  Dann erscheinen Entwürfe nirgends – nicht in Landkarte und Liste, nicht bei
  „verwandt“ oder „Spiegelfall“ – und es bleibt kein leerer Platz.
- Entwürfe stehen nie in Handout, englischer Seite, `atlas.json` oder `atlas.jsonld`.

### Nachbarn hinzufügen

In `begriffsmodell.yaml` unter `nachbarn`:

```yaml
  - id: mein-nachbar
    name: "Name des Nachbarn"
    hinsicht: achten           # in welcher Hinsicht er schadet
    beschreibung: >-
      Ein bis zwei Sätze.
    im_framework: true         # optional: in der Liste der Grenzfälle zeigen
```

Er erscheint in der Landkarte außerhalb der Re:DIS-Grenze, in der Liste, im JSON-LD
und – mit `im_framework: true` – bei den Grenzfällen. Soll er die Nachbar-Stufe der
großen Schablone sein, braucht er zusätzlich `schablone` (wie bei `einschuechterung`)
und muss in `schablone_stufen.nachbar` eingetragen werden.

## Hinweise

- **Nach Änderungen an `config/atlas.js`** (oder anderen Dateien in `config/`) muss der
  Dev-Server neu gestartet werden (`npm start` beenden und neu starten). Er lädt nur
  Änderungen an Inhalten und Templates von selbst nach.
- **`{{` darf im Fließtext der Karten nicht vorkommen.** Der Markdown-Text wird auch
  von Nunjucks verarbeitet; `{{` würde als Platzhalter gelesen und den Build abbrechen.
  Gleiches gilt für `{%`.
- Impressum und Datenschutz: Platzhalter stehen in `[ECKIGEN KLAMMERN]`. Jeder Build
  meldet, wie viele noch offen sind. `platzhalter: true` erst entfernen, wenn alle ersetzt sind.

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
Urteil, Wirkung; Publikum als Rahmen) und die beiden Grafiktypen `netz` und `balken`.
Eine neue Prüffrage, ein weiteres Schablonenfeld oder ein neuer Grafiktyp braucht eine
Codeänderung.
