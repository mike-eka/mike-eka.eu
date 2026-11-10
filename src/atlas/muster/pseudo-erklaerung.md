---
titel: "Pseudo-Erklärung"
fachbegriff: "pseudo-explanation"
hinsicht: begruenden
reihenfolge: 1
veroeffentlicht: true
im_framework: true
kurz: >-
  Eine Erklärung wirkt einleuchtend, weil sie etwas Vertrautes auf etwas
  Fremdes überträgt. Die Übertragung trägt aber nicht, und man versteht die
  Sache danach falsch.

minimalpaar: null           # diese Karte hat bewusst keine Gegenform, siehe analogie

analogie:                   # ersetzt auf dieser Karte das Minimalpaar
  aussage: "Der Staat muss sparen, [[denn wie jeder Haushalt kann er nicht dauerhaft mehr ausgeben, als er einnimmt]]."
  hinweis: >-
    Erfundener Satz. Er steht hier nicht für eine Position zur Schuldenbremse,
    sondern für eine Art zu begründen.
  quelle: "Privathaushalt"
  ziel: "Staat"
  zeilen:
    - art: passt
      merkmal: "Bilanz"
      quelle: "Einnahmen, Ausgaben und Schulden lassen sich gegenüberstellen."
      ziel: "Ebenso."
    - art: passt
      merkmal: "Risiko"
      quelle: "Zu hohe Schulden können zur Überschuldung führen."
      ziel: "Zu hohe Schulden können die Zinslast und das Vertrauen der Geldgeber belasten."
    - art: bricht
      merkmal: "Lebensdauer"
      quelle: "Begrenzt: Schulden müssen zu Lebzeiten getilgt werden."
      ziel: "Unbegrenzt: Schulden können immer wieder umgeschuldet werden."
    - art: bricht
      merkmal: "Kreislauf"
      quelle: "Die eigenen Ausgaben fließen an andere ab."
      ziel: "Die eigenen Ausgaben sind das Einkommen von Bürgern und Unternehmen; Kürzungen können die eigenen Einnahmen senken."
    - art: bricht
      merkmal: "Einnahmen"
      quelle: "Lassen sich kaum selbst bestimmen."
      ziel: "Werden über Steuern selbst festgelegt."
  fazit: >-
    Die Schlussfolgerung „muss sparen“ hängt genau an den Zeilen, in denen die
    Analogie bricht. Ob der Staat sparen sollte, ist damit nicht entschieden –
    nur, dass die Analogie es nicht begründet.

mittel:
  name: "Analogie als Begründung (konzeptuelle Metapher: STAAT IST HAUSHALT)"
  erklaerung: >-
    Eine Analogie überträgt Wissen aus einem vertrauten Bereich auf einen
    fremden. Sie überzeugt durch Vertrautheit, nicht durch den Mechanismus
    im Zielbereich.
  test: >-
    An welcher Stelle unterscheiden sich Quelle und Ziel? Hängt die
    Schlussfolgerung an genau dieser Stelle?

schablone:                  # Stufe „Muster“
  inhalt:         { status: muster, text: ["Argument:", "eine Analogie als Begründung"] }
  vergleichsfall: { status: muster, text: ["vorher:", "die Frage gilt als offen"] }
  hinsicht:       { status: offen,  text: ["Was wir glauben –", "oder warum wir glauben?"] }
  urteil:         { status: offen,  text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung:        { status: muster, text: ["typisch:", "verschlechtern, abschotten"] }

effekt:
  vorher: >-
    Man weiß, dass die Frage nach dem richtigen Umgang mit Staatsschulden
    umstritten ist.
  nachher: >-
    Man glaubt, den Grund zu verstehen, und die Frage scheint erledigt. Das
    Gefühl, etwas verstanden zu haben, ersetzt das Verstehen.
  hinsichten: [begruenden, achten]

kippt_an: hinsicht
grenzfall_frage: "Zählt nur, was man glaubt, oder auch, warum man es glaubt?"
einschaetzungen:
  - label: "Was wir glauben"
    hinsicht: "Was wir glauben"
    urteil: nein
    begruendung: >-
      Die Überzeugung, dass sich auch ein Staat nicht grenzenlos verschulden
      kann, ist nicht falsch.
    wirkung: keine
  - label: "Warum wir glauben"
    hinsicht: "Warum wir glauben"
    urteil: ja
    begruendung: >-
      Man glaubt es aus dem falschen Grund und hält den Staat für einen großen
      Haushalt. Alle weiteren Schlüsse stehen damit auf einer falschen
      Grundlage.
    wirkung: [verschlechtern, abschotten]


normalfall: >-
  Analogien sind ein Grundwerkzeug des Erklärens. Problematisch werden sie
  erst, wenn die Schlussfolgerung an der Stelle hängt, an der Quelle und Ziel
  sich unterscheiden.
verzerrungen:                # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Illusion des Erklärungsverständnisses"
    text: "Wir überschätzen, wie gut wir einen Zusammenhang verstehen, besonders wenn er vertraut klingt."
  - name: "Verarbeitungsflüssigkeit"
    text: "Was sich leicht denken lässt, etwa ein Vergleich mit dem eigenen Haushalt, wirkt eher wahr."
literatur:
  - "Lakoff, G. & Johnson, M. (1980). Metaphors We Live By. Chicago: University of Chicago Press."
  - "Rozenblit, L. & Keil, F. (2002). The misunderstood limits of folk science: an illusion of explanatory depth. Cognitive Science 26(5), 521–562."
grafik:
  typ: illustration
  motiv: formel
  titel: "Sieht aus wie eine Herleitung"
  zeilen:
    - { text: "Haushalt: ∀t ≤ T: Einnahmen(t) ≥ Ausgaben(t)" }
    - { text: "Staat ≈ Haushalt", fehler: "Hier bricht die Analogie." }
    - { text: "⇒ Staat: ∀t: Einnahmen(t) ≥ Ausgaben(t)", fehler: "Ein Staat hat kein Lebensende T." }
    - { text: "Σ Schulden → 0   ∫ Wohlstand dt ↑   √Stabilität" }
    - { text: "5 + 3 = 6", fehler: "Sieht aus wie Rechnen, ist keins." }
  knopf: "Nachrechnen"
  vorher: "Formeln wirken wie eine Begründung."
  nachher: "Beim Nachrechnen zeigt sich: Der entscheidende Schritt ist keine Rechnung, sondern eine Behauptung."
---

Pseudo-Erklärungen behaupten oft nichts Falsches. Dass ein Haushalt nicht
dauerhaft mehr ausgeben kann, als er einnimmt, stimmt; falsch ist nur der
Schritt vom Haushalt zum Staat. Deshalb laufen Faktenchecks hier ins Leere.
Der Schaden liegt im Verstehen: Wer die Analogie übernimmt, glaubt einen
Zusammenhang zu kennen, den es so nicht gibt, und fragt nicht mehr nach dem
tatsächlichen Mechanismus – selbst dann, wenn die Schlussfolgerung zufällig
stimmt.
