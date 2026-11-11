---
titel: "Meinung als Tatsache"
fachbegriff: "opinion presented as fact"
hinsicht: vertrauen
reihenfolge: 2
veroeffentlicht: true
im_framework: true # erscheint als Grenzfall auf der Begriffsmodell-Seite
kurz: >-
  Ein Werturteil klingt wie eine Feststellung und wird so als Tatsache gehört.

effekt: # Kachel „Was sich verschlechtert“
  vorher: "Ob Tempo 30 den Innenstädten schadet, ist eine offene Frage."
  nachher: "Die Frage wirkt wie entschieden."
  hinsichten: [vertrauen, achten]

minimalpaar:
  muster: "Tempo 30 verlängert die Fahrzeiten und [[macht]] unsere Innenstädte [[kaputt]]."
  gegenform: "Tempo 30 verlängert die Fahrzeiten, und [[ich halte]] das [[für schädlich]] für unsere Innenstädte."
  hinweis: >-
    Erfundene Verkehrsministerin. Die Gegenform ist nicht die „wahre“
    Fassung, sondern der Vergleichsfall.

mittel:
  name: "fehlender Einstellungsmarker"
  erklaerung: >-
    Ohne „ich halte … für“ oder „meiner Ansicht nach“ hat ein Werturteil
    die Form einer Tatsachenbehauptung.
  test: "Passt als Erwiderung „Das stimmt nicht“ oder „Das sehe ich anders“?"

schablone: # Stufe „Muster“: was das Muster festlegt
  inhalt:
    {
      status: offen,
      text: ["Aussage: eine Wertung,", "die wie eine Tatsache klingt"],
    }
  vergleichsfall:
    { status: muster, text: ["dieselbe Aussage mit", "Einstellungsmarker"] }
  hinsicht: { status: muster, text: ["Wem wir glauben", ""] }
  urteil: { status: offen, text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung: { status: muster, text: ["typisch:", "verschlechtern"] }

# kippt_an (Grenzfall): was | vergleich | hinsicht (nicht fuer_wen – das Publikum
# ist Rahmen jeder Einschätzung). Jede Einschätzung füllt das zugehörige
# Feld (hier: inhalt) und das Urteil.
kippt_an: was
grenzfall_frage: "Was ist der Inhalt: die ganze Aussage oder nur ihr prüfbarer Teil?"
einschaetzungen:
  - label: "die ganze Aussage"
    inhalt: "Tempo 30 verlängert die Fahrzeiten und macht unsere Innenstädte kaputt."
    urteil: ja
    begruendung: >-
      Im Vergleich zur Fassung mit „ich halte … für“ klingt die Wertung wie
      eine zweite Feststellung, gestützt vom prüfbaren Teil davor. Die
      offene Frage gilt als entschieden.
    wirkung: [verschlechtern, festhalten]
  - label: "nur der prüfbare Teil"
    inhalt: "Tempo 30 verlängert die Fahrzeiten."
    urteil: nein
    begruendung: >-
      So schneidet ein Faktencheck die Aussage zu. Der prüfbare Teil ist eine
      gewöhnliche Tatsachenbehauptung. Das Muster steckt aber in der Wertung,
      und die fällt dabei weg.
    wirkung: keine

normalfall: >-
  Politische Rede ist positionell, und die meisten Zuhörenden wissen das.
verzerrungen: # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Autoritätsheuristik"
    text: "Was eine Person mit Amt sagt, klingt nach Sachkenntnis, auch wenn es eine Position ist."
  - name: "Wahrheitseffekt durch Wiederholung"
    text: "Oft gehörte Sätze erscheinen glaubwürdiger, auch wenn sie nur Wertungen sind."
literatur:
  - "Kölbel, M. (2004). Faultless Disagreement. Proceedings of the Aristotelian Society 104(1), 53–73."
  - "Lasersohn, P. (2005). Context Dependence, Disagreement, and Predicates of Personal Taste. Linguistics and Philosophy 28(6), 643–686."
grafik:
  typ: illustration
  motiv: sprechblase
  titel: "Eine Meinung im Gewand einer Tatsache"
  text: "Tempo 30 macht unsere Innenstädte kaputt."
  knopf: "Genauer hinsehen"
  vorher: "Eine Sprechblase: So klingt eine Feststellung."
  nachher: "Eigentlich eine Gedankenblase: eine Meinung, gesprochen wie eine Tatsache."
---

Politische Rede ist voller Werturteile, was prinzipiell in Ordnung ist. Zum Muster
wird ein Werturteil erst, wenn es als schlichter Aussagesatz auftritt, ohne
entsprechende Marker, die es als Meinung kennzeichnen. Besonders wirksam ist das, wenn Tatsache und Wertung
verbunden werden: Ein prüfbarer Teil verleiht der Wertung Glaubwürdigkeit.
Auch das Äußerungsrecht trennt Tatsachenbehauptungen von Werturteilen und
ordnet gemischte Äußerungen danach ein, was in ihnen überwiegt.
