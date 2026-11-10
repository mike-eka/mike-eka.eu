---
titel: "Gewichtung & Auslassung"
fachbegriff: "selective salience"
hinsicht: achten
reihenfolge: 2
veroeffentlicht: true
im_framework: true
kurz: >-
  Was ausführlich berichtet wird, wirkt wichtig. Was fehlt, wirkt unwichtig.
  So beantwortet die Auswahl eine Frage, die niemand gestellt hat.

minimalpaar:                # muster und gegenform als Listen (Auswahl von Meldungen)
  frage_label: "Ausgangslage"
  frage: "Die Lokalnachrichten einer Woche in einer erfundenen Mittelstadt"
  muster:
    - "Stadtwerke-Manager soll 20.000 Euro angenommen haben"
    - "Bestechungsverdacht: Was die Ermittler bisher wissen"
    - "Kommentar: Wie viel Filz verträgt die Stadt?"
    - "Neue Ampel am Marktplatz"
  gegenform:
    - "Stadtwerke-Manager soll 20.000 Euro angenommen haben"
    - "Bestechungsverdacht: Was die Ermittler bisher wissen"
    - "Kommentar: Wie viel Filz verträgt die Stadt?"
    - "Neue Ampel am Marktplatz"
    - "[[Entwurf der Abwassersatzung: Mehrere Passagen stammen wörtlich aus einem Papier des Branchenverbands]]"
  hinweis: >-
    Alle Meldungen sind erfunden und könnten wahr sein. Die beiden Fassungen
    unterscheiden sich nur in einer Meldung. Einfluss auf Regeln nehmen
    Wirtschaftsverbände ebenso wie Gewerkschaften oder Umweltverbände; die
    Karte gilt für alle gleich.

mittel:
  name: "Relevanzimplikatur auf der Ebene der Agenda"
  erklaerung: >-
    Was berichtet wird, gilt als relevant, was fehlt, als irrelevant. Die
    Auswahl und ihre Platzierung sagen etwas über Wichtigkeit, ohne es
    auszusprechen (Agenda-Setting).
  test: >-
    Was würde man über die Wichtigkeit der Themen schließen, wenn man nur
    diese Auswahl kennt? Und nach welchem Maß wäre das richtig?

schablone:                  # Stufe „Muster“
  inhalt:         { status: muster, text: ["Auswahl:", "welche Meldungen vorkommen"] }
  vergleichsfall: { status: offen,  text: ["gewichtet nach", "welchem Maß?"] }
  hinsicht:       { status: muster, text: ["Worauf wir achten", "· Was wir glauben"] }
  urteil:         { status: offen,  text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung:        { status: muster, text: ["typisch:", "festhalten"] }

effekt:
  vorher: >-
    Ob legale Einflussnahme ähnlich problematisch sein kann wie Bestechung,
    ist eine offene Frage.
  nachher: >-
    Die Frage scheint beantwortet: Was legal ist und nicht berichtet wird,
    gilt als unproblematisch.
  hinsichten: [achten, glauben]

kippt_an: vergleich
grenzfall_frage: "Nach welchem Maß wäre die Auswahl richtig gewichtet?"
einschaetzungen:
  - label: "nach Rechtswidrigkeit"
    vergleichsfall: "Eine Auswahl, die strafbares Handeln vor legalem gewichtet."
    urteil: nein
    begruendung: >-
      Bestechung ist strafbar, die übernommene Passage nicht. Nach diesem
      Maß passt die Gewichtung.
    wirkung: keine
  - label: "nach Zahl der Betroffenen"
    vergleichsfall: "Eine Auswahl, die gewichtet, wie viele Menschen eine Sache betrifft."
    urteil: ja
    begruendung: >-
      Die Satzung betrifft alle, die Gebühren zahlen, der Bestechungsfall
      zunächst wenige. Nach diesem Maß fehlt die wichtigere Meldung.
    wirkung: festhalten
  - label: "nach finanziellem Schaden"
    vergleichsfall: "Eine Auswahl, die gewichtet, um wie viel Geld es geht."
    urteil: strittig
    begruendung: >-
      Der Schaden ist in beiden Fällen unbekannt. Ob die Gewichtung passt,
      lässt sich nach diesem Maß noch nicht sagen.
    wirkung: keine


normalfall: >-
  Jede Berichterstattung wählt aus. Zum Problem wird Gewichtung erst, wenn
  sie stillschweigend eine offene Frage beantwortet.
verzerrungen:                # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Verfügbarkeitsheuristik"
    text: "Was oft berichtet wird und deshalb leicht in den Sinn kommt, halten wir für häufiger und wichtiger."
  - name: "„What you see is all there is“"
    text: "Wir urteilen mit dem, was vor uns liegt, und vermissen nicht, was fehlt."
literatur:
  - "McCombs, M. E. & Shaw, D. L. (1972). The agenda-setting function of mass media. Public Opinion Quarterly 36(2), 176–187."
  - "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication 43(4), 51–58."

grafik:
  typ: balken
  hinweis: "Erfundene Zahlen zur Veranschaulichung, jeweils in Prozent."
  reihe_a: "Anteil an der Berichterstattung"
  masse:
    - { id: betroffene, label: "Anteil an den Betroffenen" }
    - { id: volumen,    label: "Anteil am finanziellen Volumen" }
  themen:
    - { name: "Bestechungsfall",        berichterstattung: 70, betroffene: 5,  volumen: 10 }
    - { name: "Satzungsentwurf",        berichterstattung: 0,  betroffene: 80, volumen: 60 }
    - { name: "Übrige Lokalthemen",     berichterstattung: 30, betroffene: 15, volumen: 30 }
---

Keine Redaktion kann über alles berichten; Auswahl ist die Voraussetzung
jeder Berichterstattung. Aber Auswahl spricht: Was oben steht und mehrfach
vorkommt, erscheint wichtig, was fehlt, unwichtig. Im Beispiel ist jede
Meldung zutreffend. Der Effekt entsteht erst aus dem Gesamtbild: Die Frage,
ob auch legale Einflussnahme ein Problem sein kann, scheint beantwortet,
obwohl sie nie gestellt wurde. Weil die Auswahl von Themen zur
Pressefreiheit gehört, ließe sich dieser Schaden kaum regeln, ohne in sie
einzugreifen.
