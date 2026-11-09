---
titel: "Meinung als Tatsache"
fachbegriff: "opinion presented as fact"
hinsicht: vertrauen
reihenfolge: 2
veroeffentlicht: true
im_framework: true          # erscheint als Grenzfall auf der Begriffsmodell-Seite
kurz: >-
  Ein Werturteil klingt wie eine Feststellung und wird als entschieden gehört.

effekt:                     # Kachel „Was sich verschlechtert“
  vorher: "Ob Tempo 30 den Innenstädten schadet, ist eine offene Frage. Man wägt Gründe ab."
  nachher: "Die Frage gilt als entschieden. Man ist sich sicherer, als die Belege erlauben, und fragt nicht mehr nach Gründen."
  hinsichten: "Wem wir glauben · Worauf wir achten"

minimalpaar:
  muster:    "Tempo 30 [[macht]] unsere Innenstädte [[kaputt]]."
  gegenform: "[[Ich halte]] Tempo 30 [[für schädlich]] für unsere Innenstädte."
  hinweis: >-
    Erfundene Verkehrsministerin. Die Gegenform ist nicht die „wahre“
    Fassung, sondern der Vergleichsfall.

mittel:
  name: "fehlender Einstellungsmarker"
  erklaerung: >-
    Ohne „ich halte … für“ oder „meiner Ansicht nach“ hat ein Werturteil
    die Form einer Tatsachenbehauptung.
  test: "Passt als Erwiderung „Das stimmt nicht“ oder „Das sehe ich anders“?"

schablone:                  # Stufe „Muster“: was das Muster festlegt
  inhalt:         { status: offen,  text: ["Aussage: eine Wertung,", "die wie eine Tatsache klingt"] }
  vergleichsfall: { status: muster, text: ["dieselbe Aussage mit", "Einstellungsmarker"] }
  hinsicht:       { status: muster, text: ["Wem wir glauben", ""] }
  urteil:         { status: offen,  text: ["ergibt sich aus", "der Stellschraube"] }
  wirkung:        { status: muster, text: ["typisch:", "verschlechtern"] }

# Stellschraube: was | vergleich | hinsicht (nicht fuer_wen – das Publikum
# ist Rahmen jeder Einschätzung). Jede Einschätzung füllt das zugehörige
# Feld (hier: inhalt) und das Urteil.
kippt_an: was
grenzfall_frage: "Ist die ganze Aussage der Inhalt, oder nur ihr Tatsachenanteil?"
einschaetzungen:
  - label: "ganze Aussage"
    inhalt: "Tempo 30 verlängert die Fahrzeiten und macht unsere Innenstädte kaputt."
    urteil: ja
    begruendung: "Der prüfbare Teil leiht der Wertung seine Autorität; sie wirkt wie eine weitere Tatsache."
    wirkung: [verschlechtern, festhalten]
  - label: "nur der Tatsachenanteil"
    inhalt: "Tempo 30 verlängert die Fahrzeiten."
    urteil: nein
    begruendung: "Eine prüfbare Tatsachenbehauptung, gegebenenfalls sogar wahr."
    wirkung: keine

etiketten:
  wahrheitsstatus: unklar
  absicht: unbekannt

normalfall: >-
  Politische Rede ist positionell, und die meisten Zuhörenden wissen das.
verwandt: [kaperung]
spiegelfall: null
literatur:
  - "Kölbel, M. (2004). Faultless Disagreement. Proceedings of the Aristotelian Society 104(1), 53–73."
  - "Lasersohn, P. (2005). Context Dependence, Disagreement, and Predicates of Personal Taste. Linguistics and Philosophy 28(6), 643–686."
grafik: null                # oder: netz / balken (siehe 3.3)
---

Politische Rede ist voller Werturteile, und das ist in Ordnung. Zum Muster
wird ein Werturteil erst, wenn es in der Form einer Tatsachenbehauptung
auftritt: ohne „ich halte … für“, ohne „meiner Ansicht nach“, als schlichter
Aussagesatz. Wer so spricht, legt sich nicht ausdrücklich fest, und wer
zuhört, überhört leicht, dass hier eine Einschätzung vorliegt und keine
Feststellung.

Besonders wirksam ist das, wenn Tatsache und Wertung in einem Satz verbunden
sind. Der prüfbare Teil – die längeren Fahrzeiten – lässt sich bestätigen und
leiht der Wertung seine Glaubwürdigkeit. Hinzu kommt die Autorität des Amtes:
Was eine Ministerin sagt, klingt nach Sachkenntnis, auch wenn es eine
politische Position ist.

Die Unterscheidung ist nicht nur sprachlich. Auch das Äußerungsrecht trennt
Tatsachenbehauptungen, die sich beweisen lassen, von Werturteilen und ordnet
gemischte Äußerungen danach ein, was in ihnen überwiegt. Genau an dieser
Grenze setzt der Grenzfall dieser Karte an.
