---
titel: "Doppelter Maßstab"
fachbegriff: "double standard"
hinsicht: begruenden
reihenfolge: 2
veroeffentlicht: true
im_framework: true
kurz: >-
  Ein Maßstab wird bei der einen Sache streng angelegt und bei einer anderen (potenziell wichtigeren Sache) umgekerht angelegt oder gar stillschweigend weggelassen, obwohl beide ihn gleichermaßen erfüllen. Die
  eine erscheint dadurch dringlich, die andere belanglos.

minimalpaar: # zwei Aussagen desselben erfundenen Finanzpolitikers
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
    und einmal gar nicht erwähnt. Stattdessen rücken Wertbegriffe wie
    „Bevormundung“ die zweite Frage in einen anderen Deutungsrahmen (Frame), in dem der
    Maßstab nicht mehr vorkommt.
  test: >-
    Welcher Maßstab wird bei der ersten Sache angelegt? Erfüllt die zweite
    dasselbe Merkmal? Wird der Maßstab dort genannt, oder verschwindet er?

schablone: # Stufe „Muster“
  inhalt: { status: offen, text: ["eine einzelne Aussage –", "oder das Paar?"] }
  vergleichsfall:
    {
      status: muster,
      text: ["ein Paar, das an beide", "denselben Maßstab anlegt"],
    }
  hinsicht: { status: muster, text: ["Warum wir glauben", "· Was wir glauben"] }
  urteil: { status: offen, text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung: { status: muster, text: ["typisch:", "verschlechtern"] }

effekt:
  vorher: >-
    Man könnte beide Fragen am selben Maßstab messen: Was belastet kommende
    Generationen?
  nachher: >-
    Der Maßstab scheint nur für Schulden zu gelten. Klimaschutz erscheint als
    Geschmacksfrage statt als Frage derselben Verantwortung für die Zukunft.
  hinsichten: [begruenden, glauben]

kippt_an: was
grenzfall_frage: "Ist eine einzelne Aussage der Inhalt, oder das Paar?"
einschaetzungen:
  - label: "nur die Aussage zur Schuldenbremse"
    inhalt: "Wir halten an der Schuldenbremse fest, damit unsere Kinder nicht die Rechnung von heute bezahlen."
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

normalfall: >-
  Niemand wendet alle Maßstäbe überall gleich an, und Fälle unterscheiden sich
  oft tatsächlich. Problematisch wird es, wenn ein Maßstab ausdrücklich
  beansprucht und an anderer Stelle stillschweigend fallengelassen wird.
verzerrungen: # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Motiviertes Denken"
    text: "Wir prüfen streng, was unserer Sicht widerspricht, aber nachsichtig, was sie stützt."
  - name: "Eigengruppen-Bevorzugung"
    text: "Wir beurteilen die eigene Seite milder als die andere und merken es selten."
literatur:
  - "Fillmore, C. J. (1982). Frame semantics. In The Linguistic Society of Korea (Hg.), Linguistics in the Morning Calm, 111–137. Seoul: Hanshin."
grafik:
  typ: illustration
  motiv: massstab
  titel: "Ein Maßstab, einmal angelegt"
  links:
    {
      gegenstand: "Schulden",
      blase: "Verantwortung für unsere Kinder!",
      blase_gross: true,
      lineal: true,
    }
  rechts:
    {
      gegenstand: "Klima",
      blase: "Bevormundung",
      blase_gross: false,
      lineal: false,
    }
  marke: "belastet kommende Generationen"
  knopf: "Gleichen Maßstab anlegen"
  vorher: "Nur an eine Sache wird der Maßstab angelegt."
  nachher: "Mit demselben Maßstab erreichen beide dieselbe Marke."
---

Keine der beiden Aussagen ist für sich falsch. Der Schaden entsteht aus
ihrem Verhältnis: Der Maßstab – was heute beschlossen wird, soll kommende
Generationen nicht belasten – wird bei den Schulden beansprucht und beim
Klima nicht erwähnt, obwohl beide Kosten in die Zukunft verschieben. Wer
meint, die Fälle unterschieden sich im entscheidenden Punkt, kann genau hier
widersprechen. Das Muster gibt es in jeder Richtung: Wer Klimaschutz „für
die Generationen nach uns“ fordert und neue Schulden für bedeutungslos
erklärt, macht denselben Fehler.
