---
titel: "Kaperung"
fachbegriff: "TODO"
hinsicht: vertrauen
reihenfolge: 1
veroeffentlicht: false      # Entwurf: wird nicht gebaut
im_framework: false
kurz: "TODO"

minimalpaar:
  muster:    "TODO [[Markierung]]"
  gegenform: "TODO [[Markierung]]"
  hinweis: "TODO"

mittel:
  name: "TODO"
  erklaerung: "TODO"
  test: "TODO"

vier_fragen:
  was:       "TODO"
  fuer_wen:  "TODO"
  vergleich: "TODO"
  hinsicht:  "TODO"

schablone:                  # Stufe „Muster“: was das Muster festlegt
  inhalt:         { status: offen, text: ["TODO", ""] }
  publikum:       { status: offen, text: ["TODO", ""] }
  vergleichsfall: { status: offen, text: ["TODO", ""] }
  hinsicht:       { status: offen, text: ["TODO", ""] }
  urteil:         { status: offen, text: ["TODO", ""] }
  wirkung:        { status: offen, text: ["TODO", ""] }

kippt_an: TODO
einschaetzungen:
  - label: "TODO"
    publikum: "TODO"
    urteil: strittig
    begruendung: "TODO"
    wirkung: keine
  - label: "TODO"
    publikum: "TODO"
    urteil: strittig
    begruendung: "TODO"
    wirkung: keine
grenzfall_frage: "TODO"

etiketten:
  wahrheitsstatus: TODO
  absicht: TODO

normalfall: "TODO"
verwandt: []
spiegelfall: null
anschlussfaecher: []
literatur:
  - "TODO: 1–2 Angaben"
grafik:
  typ: netz
  hinweis: "Erfundenes Schema, kein empirischer Befund."
  knoten:
    - { id: p1, gruppe: publikum, x: 10, y: 20 }
    - { id: p2, gruppe: publikum, x: 10, y: 35 }
    - { id: p3, gruppe: publikum, x: 10, y: 50 }
    - { id: p4, gruppe: publikum, x: 10, y: 65 }
    - { id: p5, gruppe: publikum, x: 10, y: 80 }
    - { id: V,  gruppe: vermittler, x: 45, y: 50, label: "Vermittler" }
    - { id: TT, gruppe: thinktank,  x: 45, y: 15, label: "Thinktank", nur_wenn: "!rueckbindung" }
    - { id: W,  gruppe: vermittler2, x: 45, y: 85, label: "Wissenschaftsjournalismus", nur_wenn: zweiter }
    - { id: e1, gruppe: fach, x: 72, y: 20 }
    - { id: e2, gruppe: fach, x: 84, y: 14 }
    - { id: e3, gruppe: fach, x: 90, y: 38 }
    - { id: e4, gruppe: fach, x: 78, y: 44 }
    - { id: T,  gruppe: thema, x: 84, y: 80, label: "Thema" }
  kanten:
    - { von: [p1,p2,p3,p4,p5], nach: V }
    - { von: V, nach: T }
    - { von: e1, nach: e2 }
    - { von: e2, nach: e3 }
    - { von: e3, nach: e4 }
    - { von: e4, nach: e1 }
    - { von: [e1,e2,e3,e4], nach: T }
    - { von: V, nach: [e1, e4], nur_wenn: rueckbindung }
    - { von: TT, nach: V, nur_wenn: "!rueckbindung" }
    - { von: [p1,p2,p3,p4,p5], nach: W, nur_wenn: zweiter }
    - { von: W, nach: [T, e4], nur_wenn: zweiter }
  schalter:
    - { id: rueckbindung, label: "Vermittler ist an die Fachgemeinschaft rückgebunden", start: true }
    - { id: zweiter, label: "Zweiter, rückgebundener Vermittler", start: false }
  kennzahl:
    label: "Kürzeste Wege Publikum → Thema über den Vermittler"
    von_gruppe: publikum
    nach: T
    ueber: V
  urteile:
    - { wenn: rueckbindung, text: "Vermittlung: Brücke mit Rückbindung", ton: gut }
    - { wenn: "!rueckbindung && kennzahl >= 75", text: "Kaperung: Brücke ohne Rückbindung", ton: warnung }
    - { wenn: sonst, text: "Strittig: ohne Rückbindung, aber kein Nadelöhr", ton: neutral }
---

TODO: Erläuterungstext.
