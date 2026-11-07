---
titel: "Gewichtung & Auslassung"
fachbegriff: "TODO"
hinsicht: achten
reihenfolge: 2
veroeffentlicht: false      # Entwurf: wird nicht gebaut
im_framework: false
kurz: "TODO"

effekt:                     # Kachel „Was sich verschlechtert“
  vorher: "TODO"
  nachher: "TODO"
  hinsichten: "TODO"

minimalpaar:
  muster:    "TODO [[Markierung]]"
  gegenform: "TODO [[Markierung]]"
  hinweis: "TODO"

mittel:
  name: "TODO"
  erklaerung: "TODO"
  test: "TODO"

schablone:                  # Stufe „Muster“: was das Muster festlegt
  inhalt:         { status: offen, text: ["TODO", ""] }
  vergleichsfall: { status: offen, text: ["TODO", ""] }
  hinsicht:       { status: offen, text: ["TODO", ""] }
  urteil:         { status: offen, text: ["TODO", ""] }
  wirkung:        { status: offen, text: ["TODO", ""] }

# Stellschraube: was | vergleich | hinsicht (nicht fuer_wen). Jede
# Einschätzung braucht das zugehörige Feld: inhalt | vergleichsfall | hinsicht.
kippt_an: TODO
grenzfall_frage: "TODO"
einschaetzungen:
  - label: "TODO"
    inhalt: "TODO"          # Feldname je nach kippt_an
    urteil: strittig
    begruendung: "TODO"
  - label: "TODO"
    inhalt: "TODO"
    urteil: strittig
    begruendung: "TODO"

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
  typ: balken
  hinweis: "Erfundene Zahlen zur Veranschaulichung."
  reihe_a: "Anteil an der Berichterstattung"
  masse:                       # Schalter: welches Maß ist der Vergleich?
    - { id: betroffene, label: "Anteil an den Betroffenen" }
    - { id: kosten,     label: "Anteil an den Kosten" }
  themen:
    - { name: "TODO Thema A", berichterstattung: 40, betroffene: 10, kosten: 25 }
    - { name: "TODO Thema B", berichterstattung: 10, betroffene: 45, kosten: 30 }
---

TODO: Erläuterungstext.
