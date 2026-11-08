---
titel: "Doppelter Maßstab"
fachbegriff: "double standard"
hinsicht: begruenden
reihenfolge: 2
veroeffentlicht: true
im_framework: true
kurz: >-
  Ein Maßstab wird bei der einen Sache streng angelegt und bei einer anderen
  stillschweigend weggelassen, obwohl beide ihn gleichermaßen erfüllen. Die
  eine erscheint dadurch dringlich, die andere belanglos.

minimalpaar:                # zwei Aussagen desselben erfundenen Finanzpolitikers
  frage: "Zwei Aussagen desselben Politikers in einer Haushaltsdebatte"
  frage_label: "Ausgangslage"
  muster:
    - "Wir halten an der Schuldenbremse fest, damit unsere Kinder nicht die Rechnung von heute bezahlen."
    - "[[Beim Klimaschutz brauchen wir keine Bevormundung und keine Verbotsorgien.]]"
  gegenform:
    - "Wir halten an der Schuldenbremse fest, damit unsere Kinder nicht die Rechnung von heute bezahlen."
    - "[[Auch beim Klima dürfen wir unseren Kindern keine Rechnung hinterlassen. Wir wollen das mit anderen Mitteln erreichen als mit Verboten.]]"
  hinweis: >-
    Erfundener Politiker. Die Gegenform verlangt keine bestimmte Politik: Man
    kann Verbote weiterhin ablehnen. Sie legt nur an beide Fragen denselben
    Maßstab an. Das Muster funktioniert in jeder politischen Richtung, siehe
    das Spiegelbeispiel im Text unten.

mittel:
  name: "asymmetrische Rahmung"
  erklaerung: >-
    Dieselbe Sorge wird einmal als Verantwortung gerahmt („unsere Kinder“)
    und einmal gar nicht erwähnt. Stattdessen rücken Wertwörter wie
    „Bevormundung“ die zweite Frage in einen anderen Rahmen (Frame), in dem der
    Maßstab nicht mehr vorkommt.
  test: >-
    Welcher Maßstab wird bei der ersten Sache angelegt? Erfüllt die zweite
    dasselbe Merkmal? Wird der Maßstab dort genannt, oder verschwindet er?

schablone:                  # Stufe „Muster“
  inhalt:         { status: offen,  text: ["eine einzelne Aussage –", "oder das Paar?"] }
  vergleichsfall: { status: muster, text: ["ein Paar, das an beide", "denselben Maßstab anlegt"] }
  hinsicht:       { status: muster, text: ["Warum wir glauben", "· Was wir glauben"] }
  urteil:         { status: offen,  text: ["ergibt sich aus", "der Stellschraube"] }
  wirkung:        { status: muster, text: ["typisch:", "verschlechtern"] }

effekt:
  vorher: >-
    Man könnte beide Fragen am selben Maßstab messen: Was belastet kommende
    Generationen?
  nachher: >-
    Der Maßstab scheint nur für Schulden zu gelten. Klimaschutz erscheint als
    Geschmacksfrage statt als Frage derselben Verantwortung für die Zukunft.
  hinsichten: "Warum wir glauben · Was wir glauben"

kippt_an: was
grenzfall_frage: "Ist eine einzelne Aussage der Inhalt, oder das Paar?"
einschaetzungen:
  - label: "nur die Aussage zur Schuldenbremse"
    inhalt: "„Wir halten an der Schuldenbremse fest, damit unsere Kinder nicht die Rechnung von heute bezahlen.“"
    urteil: nein
    begruendung: >-
      Für sich genommen eine vertretbare Position mit nachvollziehbarer
      Begründung.
    wirkung: keine
  - label: "das Paar"
    inhalt: "Beide Aussagen zusammen, ohne dass der Maßstab beim Klima vorkommt."
    urteil: ja
    begruendung: >-
      Derselbe Maßstab gilt einmal und einmal nicht. Das Publikum schließt,
      dass er für das Klima keine Rolle spielt, und ordnet die Frage falsch ein.
    wirkung: verschlechtern
  - label: "das Paar mit benanntem Unterschied"
    inhalt: "Beide Aussagen, dazu eine Begründung, warum das Klima anders zu bewerten sei."
    urteil: strittig
    begruendung: >-
      Wer einen Unterschied benennt, legt den Maßstab offen an. Ob der
      Unterschied trägt, ist dann eine Sachfrage, über die man streiten kann.
    wirkung: keine

etiketten:
  wahrheitsstatus: "nicht wahrheitsfähig"
  absicht: unbekannt

normalfall: >-
  Niemand wendet alle Maßstäbe überall gleich an, und Fälle unterscheiden sich
  oft tatsächlich. Problematisch wird es, wenn ein Maßstab ausdrücklich
  beansprucht und an anderer Stelle stillschweigend fallengelassen wird.
verwandt: [pseudo-erklaerung]
spiegelfall: ablenkung
anschlussfaecher: [Philosophie, Politikwissenschaft, Linguistik]
literatur:
  - "Fillmore, C. J. (1982). Frame semantics. In The Linguistic Society of Korea (Hg.), Linguistics in the Morning Calm, 111–137. Seoul: Hanshin."
grafik: null
---

Ein doppelter Maßstab ist schwer zu bemerken, weil keine einzelne Aussage
falsch ist. Der Schaden entsteht erst aus dem Verhältnis zweier Aussagen:
Ein Maßstab, hier die Belastung kommender Generationen, wird bei der einen
Frage ausdrücklich beansprucht und bei einer anderen nicht einmal erwähnt,
obwohl auch sie diesen Maßstab berührt. Wer beide Aussagen hört, schließt
leicht, dass der Maßstab beim Klima nicht gilt, und ordnet die zweite Frage
anders ein, als er es mit demselben Maßstab täte.

Damit das sichtbar wird, nennt die Karte Maßstab und Merkmal ausdrücklich.
Maßstab: Was heute beschlossen wird, soll kommende Generationen nicht
belasten. Merkmal: Sowohl Schulden als auch unterlassener Klimaschutz
verschieben Kosten in die Zukunft. Wer meint, dass die beiden Fälle sich im
entscheidenden Punkt unterscheiden, kann genau hier widersprechen. Darum
steht der dritte Fall in der Stellschraube.

## Spiegelbeispiel

Dasselbe Muster gibt es in umgekehrter Richtung. Eine erfundene Politikerin
fordert mehr Klimaschutz „für die Generationen nach uns“ und sagt in
derselben Debatte, neue Schulden spielten für die Zukunft keine Rolle.
Auch hier wird derselbe Maßstab einmal beansprucht und einmal fallengelassen.

## Spiegelfall

Die Gegenfrage „Und was ist mit …?“ kann einen doppelten Maßstab aufdecken.
Sie kann aber auch nur von der gestellten Frage ablenken. Ob sie prüft oder
ablenkt, entscheidet sich daran, ob die ursprüngliche Frage danach noch
beantwortet wird.
