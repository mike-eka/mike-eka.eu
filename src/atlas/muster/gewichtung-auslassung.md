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

minimalpaar: null           # diese Karte zeigt einen realen Fall, siehe fall

fall:                       # realer Fall statt Minimalpaar
  titel: "Würdige und unwürdige Opfer"
  einleitung: >-
    Edward S. Herman und Noam Chomsky haben 1988 verglichen, wie die New York
    Times über ermordete Geistliche und Ordensleute berichtete, je nachdem,
    ob die Täter zu einem gegnerischen oder einem verbündeten Staat der USA
    gehörten.
  seiten:
    - titel: "Ein Opfer in einem gegnerischen Staat"
      text: >-
        Der polnische Priester Jerzy Popiełuszko wurde 1984 von der
        kommunistischen Geheimpolizei ermordet. Die New York Times brachte dazu
        78 Artikel, 10 davon auf der Titelseite, und 3 Leitartikel.
    - titel: "Hundert Opfer in verbündeten Staaten"
      text: >-
        Rund 100 Geistliche und Ordensleute wurden zwischen 1964 und 1985 in
        lateinamerikanischen Staaten ermordet, die von den USA unterstützt
        wurden, darunter Erzbischof Óscar Romero und vier US-amerikanische
        Ordensfrauen in El Salvador. Zusammen erhielten sie in der New York
        Times etwa halb so viel Raum wie Popiełuszko, 8 Titelseiten und keinen
        Leitartikel.
  quelle: "Herman & Chomsky (1988), Kapitel 2, Tabelle 2-1"
  hinweis: >-
    Zahlen nach Herman und Chomsky, gemessen in der New York Times. Die
    Studie ist einflussreich und umstritten: Kritiker haben andere Gründe für
    den Unterschied angeführt, etwa die damals ohnehin große Aufmerksamkeit
    für Polen. Sie fasst Fälle aus zwei Jahrzehnten zusammen.

mittel:
  name: "Relevanzimplikatur auf der Ebene der Agenda"
  erklaerung: >-
    Was berichtet wird, gilt als relevant, was fehlt, als irrelevant. Die
    Auswahl und ihre Platzierung sagen etwas über Wichtigkeit, ohne es
    auszusprechen (Agenda-Setting).
  test: >-
    Was würde man über die Wichtigkeit der Fälle schließen, wenn man nur
    diese Berichterstattung kennt? Und nach welchem Maß wäre das richtig?

schablone:
  inhalt:         { status: muster, text: ["Auswahl:", "welche Fälle wie viel Raum bekommen"] }
  vergleichsfall: { status: offen,  text: ["gewichtet nach", "welchem Maß?"] }
  hinsicht:       { status: muster, text: ["Worauf wir achten", ""] }
  urteil:         { status: offen,  text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung:        { status: muster, text: ["typisch:", "festhalten"] }

effekt:
  vorher: >-
    Ob Gewalt gegen Geistliche in verbündeten Staaten ebenso schwer wiegt wie
    in gegnerischen, ist eine offene Frage.
  nachher: >-
    Die eine Gewalt erscheint als Skandal, die andere als Randnotiz. Die
    Verantwortung verbündeter Regierungen gerät aus dem Blick.
  hinsichten: [achten, glauben]

kippt_an: vergleich
grenzfall_frage: "Nach welchem Maß wäre die Berichterstattung richtig gewichtet?"
einschaetzungen:
  - label: "nach Zahl der Opfer"
    vergleichsfall: "Eine Berichterstattung, die sich nach der Zahl der Opfer richtet."
    urteil: ja
    begruendung: >-
      Ein Opfer erhielt mehr Raum als hundert. Nach diesem Maß ist die
      Gewichtung stark verzerrt.
    wirkung: festhalten
  - label: "nach Nachrichtenwert"
    vergleichsfall: "Eine Berichterstattung, die sich nach Bekanntheit und laufender Aufmerksamkeit für ein Land richtet."
    urteil: strittig
    begruendung: >-
      Kritiker verweisen darauf, dass Polen 1984 ohnehin im Fokus stand.
      Ob das den Unterschied erklärt oder selbst Teil der Gewichtung ist,
      ist genau die offene Frage.
    wirkung: keine

normalfall: >-
  Jede Berichterstattung wählt aus. Zum Problem wird Gewichtung erst, wenn
  sie stillschweigend eine offene Frage beantwortet.
verzerrungen:
  - name: "Verfügbarkeitsheuristik"
    text: "Was oft berichtet wird und deshalb leicht in den Sinn kommt, halten wir für häufiger und wichtiger."
  - name: "„What you see is all there is“"
    text: "Wir urteilen mit dem, was vor uns liegt, und vermissen nicht, was fehlt."
literatur:
  - "Herman, E. S. & Chomsky, N. (1988). Manufacturing Consent: The Political Economy of the Mass Media. New York: Pantheon."
  - "McCombs, M. E. & Shaw, D. L. (1972). The agenda-setting function of mass media. Public Opinion Quarterly 36(2), 176–187."

grafik:
  typ: balken
  titel: "Opfer und Berichterstattung im Vergleich"
  hinweis: >-
    Anteile in Prozent, berechnet aus den Zahlen bei Herman & Chomsky (1988)
    für die New York Times. Spaltenzoll (column inches) misst die Länge der
    Berichterstattung.
  reihe_a: { feld: opfer, label: "Anteil an den Opfern" }
  masse:
    - { id: spaltenzoll, label: "Anteil am Umfang der Berichterstattung (Spaltenzoll)" }
    - { id: titelseiten, label: "Anteil an den Titelseiten" }
    - { id: leitartikel, label: "Anteil an den Leitartikeln" }
  themen:
    - name: "Jerzy Popiełuszko (1 Opfer)"
      opfer: 1
      spaltenzoll: 66
      titelseiten: 56
      leitartikel: 100
      absolut: { opfer: 1, spaltenzoll: 1183, titelseiten: 10, leitartikel: 3 }
    - name: "Rund 100 Opfer in Lateinamerika"
      opfer: 99
      spaltenzoll: 34
      titelseiten: 44
      leitartikel: 0
      absolut: { opfer: 100, spaltenzoll: 605, titelseiten: 8, leitartikel: 0 }
---

Keine Redaktion kann über alles berichten; Auswahl ist die Voraussetzung
jeder Berichterstattung. Aber Auswahl spricht: Was oben steht und mehrfach
vorkommt, erscheint wichtig, was fehlt, unwichtig. Herman und Chomsky (1988)
haben das an ermordeten Geistlichen gezeigt: Ein Opfer in einem gegnerischen
Staat erhielt in der New York Times mehr Raum als hundert Opfer in
verbündeten Staaten. Jede einzelne Meldung kann dabei zutreffend sein. Der
Effekt entsteht erst aus dem Gesamtbild. Weil die Auswahl von Themen zur
Pressefreiheit gehört, ließe sich dieser Schaden kaum regeln, ohne in sie
einzugreifen.
