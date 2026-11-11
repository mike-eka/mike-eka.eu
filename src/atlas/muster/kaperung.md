---
titel: "Kaperung"
fachbegriff: "capture of expertise"
hinsicht: vertrauen
reihenfolge: 1
veroeffentlicht: true
im_framework: true
kurz: >-
  Jemand ohne Rückbindung an die Fachgemeinschaft besetzt die Brücke zwischen
  Publikum und Thema und wird als Expert:in gehört.

minimalpaar:
  muster: "Wir sprechen mit Dr. Kessler, [[Experte für Klimafragen]]."
  gegenform: "Wir sprechen mit Dr. Kessler, [[Ökonom bei einem Thinktank, der nicht zur Klimaforschung publiziert]]."
  hinweis: >-
    Erfundene Person, erfundenes Interview. Die Anmoderation entscheidet, als
    was jemand gehört wird. Die Grafik unten zeigt dasselbe als Konstellation.

mittel:
  name: "Autoritätsmarker ohne Deckung"
  erklaerung: >-
    Titel, Fachjargon, Institutsnamen und Zuschreibungen wie „Experte für“
    erzeugen Sachautorität, ohne zu zeigen, in welcher Fachgemeinschaft die
    Person arbeitet und von wem sie korrigiert werden kann.
  test: >-
    Lässt sich nachvollziehen, in welcher Fachgemeinschaft die Person
    publiziert und wer ihr dort widersprechen würde?

schablone: # Stufe „Muster“
  inhalt:
    { status: offen, text: ["Sprecherposition:", "rückgebunden – an wen?"] }
  vergleichsfall:
    {
      status: muster,
      text: ["dieselbe Brücke mit", "Rückbindung an die Fachgemeinschaft"],
    }
  hinsicht: { status: muster, text: ["Wem wir glauben", ""] }
  urteil: { status: offen, text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung: { status: muster, text: ["typisch:", "abschotten"] }

effekt:
  vorher: >-
    Das Publikum hat einen Weg zur Fachgemeinschaft und kann einschätzen, was
    dort als gesichert gilt.
  nachher: >-
    Eine Einzelstimme erscheint als Stand der Forschung. Echten Fachleuten wird
    künftig weniger geglaubt.
  hinsichten: [vertrauen]

kippt_an: was
grenzfall_frage: "An welche Fachgemeinschaft ist die Person zurückgebunden?"
einschaetzungen:
  - label: "an die Klimaforschung"
    inhalt: "Die Person publiziert in der Klimaforschung und wird dort diskutiert und korrigiert."
    urteil: nein
    begruendung: "Vermittlung: Die Brücke führt tatsächlich zur Fachgemeinschaft."
    wirkung: keine
    grafik_zustand: { rueckbindung: klima }
  - label: "an ein anderes Fach"
    inhalt: "Eine Geologin, die zur Erdgeschichte forscht, beurteilt aktuelle Klimamodelle."
    urteil: strittig
    begruendung: >-
      Die Expertise ist echt, aber im falschen Fach (epistemic trespassing).
      Ob das Publikum schlechter dasteht, hängt davon ab, wie weit ihre
      Methoden hier tragen.
    wirkung: verschlechtern
    grafik_zustand: { rueckbindung: anderes_fach }
  - label: "an keine Fachgemeinschaft"
    inhalt: "Die Person spricht für einen Thinktank und publiziert nicht in der Klimaforschung."
    urteil: ja
    begruendung: "Kaperung: Die Brücke führt ins Leere, wirkt aber wie ein Weg zur Forschung."
    wirkung: abschotten
    grafik_zustand: { rueckbindung: keine }

normalfall: >-
  Ohne Vermittlung geht es nicht. Wissenschaftsjournalismus besetzt dieselbe
  Brückenposition, nur mit Rückbindung an die Fachgemeinschaft.
verzerrungen: # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Autoritätsheuristik"
    text: "Titel, Fachsprache und Institutsnamen genügen oft, um jemandem Sachkenntnis zuzutrauen."
  - name: "Halo-Effekt"
    text: "Wer in einem Bereich kompetent wirkt, dem trauen wir auch in anderen Bereichen Urteilskraft zu."
literatur:
  - "Oreskes, N. & Conway, E. M. (2010). Merchants of Doubt. New York: Bloomsbury."
  - "Ballantyne, N. (2019). Epistemic Trespassing. Mind 128(510), 367–395."
  - "Freeman, L. C. (1977). A Set of Measures of Centrality Based on Betweenness. Sociometry 40(1), 35–41."

grafik:
  typ: netz
  hinweis: "Erfundenes Schema, kein empirischer Befund."
  zustand_aus_einschaetzung: rueckbindung # die gewählte Einschätzung setzt diesen Zustand
  knoten:
    - { id: p1, gruppe: publikum, x: 10, y: 20 }
    - { id: p2, gruppe: publikum, x: 10, y: 35 }
    - { id: p3, gruppe: publikum, x: 10, y: 50 }
    - { id: p4, gruppe: publikum, x: 10, y: 65 }
    - { id: p5, gruppe: publikum, x: 10, y: 80 }
    - { id: V, gruppe: vermittler, x: 42, y: 50, label: "Vermittler" }
    - {
        id: TT,
        gruppe: thinktank,
        x: 42,
        y: 14,
        label: "Thinktank",
        nur_wenn: "rueckbindung == keine",
      }
    - {
        id: W,
        gruppe: vermittler2,
        x: 42,
        y: 88,
        label: "Wissenschaftsjournalismus",
        nur_wenn: zweiter,
      }
    - { id: e1, gruppe: fach, x: 70, y: 18 }
    - { id: e2, gruppe: fach, x: 82, y: 12 }
    - { id: e3, gruppe: fach, x: 90, y: 34 }
    - { id: e4, gruppe: fach, x: 76, y: 40, label: "Klimaforschung" }
    - { id: f1, gruppe: fach_anderes, x: 64, y: 68 }
    - { id: f2, gruppe: fach_anderes, x: 74, y: 62, label: "Geologie" }
    - { id: T, gruppe: thema, x: 88, y: 84, label: "Thema: Klima" }
  kanten:
    - { von: [p1, p2, p3, p4, p5], nach: V }
    - { von: V, nach: T }
    - { von: e1, nach: e2 }
    - { von: e2, nach: e3 }
    - { von: e3, nach: e4 }
    - { von: e4, nach: e1 }
    - { von: [e1, e2, e3, e4], nach: T }
    - { von: f1, nach: f2 }
    - { von: V, nach: [e1, e4], nur_wenn: "rueckbindung == klima" }
    - { von: V, nach: [f1, f2], nur_wenn: "rueckbindung == anderes_fach" }
    - { von: TT, nach: V, nur_wenn: "rueckbindung == keine" }
    - { von: [p1, p2, p3, p4, p5], nach: W, nur_wenn: zweiter }
    - { von: W, nach: [T, e4], nur_wenn: zweiter }
  schalter:
    - {
        id: zweiter,
        label: "Zweiter, rückgebundener Vermittler (z. B. Wissenschaftsjournalismus)",
        start: false,
      }
  kennzahl:
    label: "Kürzeste Wege Publikum → Thema über den Vermittler"
    von_gruppe: publikum
    nach: T
    ueber: V
  kennzahl_2: # Kanten vom Vermittler zu Knoten der Gruppe „fach“
    label: "Verbindungen zur Fachgemeinschaft des Themas"
    von: V
    nach_gruppe: fach
  urteile:
    - {
        wenn: "rueckbindung == klima",
        text: "Vermittlung: Brücke mit Rückbindung",
        ton: gut,
      }
    - {
        wenn: "rueckbindung == anderes_fach",
        text: "Strittig: Rückbindung ans falsche Fach",
        ton: neutral,
      }
    - {
        wenn: "rueckbindung == keine && kennzahl >= 75",
        text: "Kaperung: Brücke ohne Rückbindung",
        ton: warnung,
      }
    - {
        wenn: sonst,
        text: "Strittig: ohne Rückbindung, aber kein Nadelöhr",
        ton: neutral,
      }
---

Zwischen Publikum und Forschung stehen fast immer Vermittler. Das ist kein
Problem, sondern eine wichtiger Kanal zur Wissensvermittlung an die (nicht-wissenschaftliche) Öffentlichkeit. Kaperung
beginnt, wenn jemand diese Brückenposition besetzt, ohne mit der
Fachgemeinschaft auf der anderen Seite verbunden zu sein. Netzwerkanalytisch
gesprochen ist die Betweenness dieselbe wie bei guter
Wissenschaftskommunikation. Entscheidend ist die Rückbindung: ob die Person
von der Fachgemeinschaft zitiert, diskutiert und korrigiert wird. Häufig sind
es Thinktanks, die auf diese Weise Zweifel am menschengemachten Klimawandel
verbreiten (Oreskes & Conway 2010).
