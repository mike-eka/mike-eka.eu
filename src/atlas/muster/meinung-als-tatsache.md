---
titel: "Meinung als Tatsache"
fachbegriff: "opinion presented as fact"
hinsicht: vertrauen
reihenfolge: 2
veroeffentlicht: true
im_framework: true          # erscheint als Grenzfall auf der Begriffsmodell-Seite
kurz: >-
  Ein Werturteil klingt wie eine Feststellung und wird als entschieden gehört.

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

vier_fragen:
  was:      "Eine Aussage: eine Wertung in Tatsachenform"
  fuer_wen: "Hängt vom Publikum ab (siehe Grenzfall)"
  vergleich: "Mit der Gegenformulierung"
  hinsicht: "Wem wir glauben · Worauf wir achten"

schablone:                  # Stufe „Muster“: was das Muster festlegt
  inhalt:         { status: muster, text: ["Aussage: eine Wertung,", "die wie eine Tatsache klingt"] }
  publikum:       { status: offen,  text: ["offen:", "hier entsteht der Grenzfall"] }
  vergleichsfall: { status: muster, text: ["dieselbe Aussage mit", "Einstellungsmarker"] }
  hinsicht:       { status: muster, text: ["Wem wir glauben", ""] }
  urteil:         { status: offen,  text: ["offen", ""] }
  wirkung:        { status: muster, text: ["typisch:", "verschlechtern"] }

kippt_an: fuer_wen
einschaetzungen:            # Grenzfall: dieselbe Aussage, zwei Einschätzungen
  - label: "vertraut der Ministerin"
    publikum: "vertraut der Ministerin"
    urteil: ja
    begruendung: "Die offene Frage gilt als erledigt."
    wirkung: verschlechtern
  - label: "kritisch"
    publikum: "kritisch"
    urteil: nein
    begruendung: "Wird als Meinung gehört."
    wirkung: keine
grenzfall_frage: "Wie viele im Publikum müssen betroffen sein, damit es Desinformation ist?"

etiketten:
  wahrheitsstatus: unklar
  absicht: unbekannt

normalfall: >-
  Politische Rede ist positionell, und die meisten Zuhörenden wissen das.
verwandt: [kaperung]
spiegelfall: null
anschlussfaecher: [Linguistik, Rechtswissenschaft, Kommunikationswissenschaft]
literatur:
  - "TODO: 1–2 Angaben"
grafik: null                # oder: netz / balken (siehe 3.3)
---

Längerer Erläuterungstext in Markdown. Hinweis Rechtswissenschaft: Das
Äußerungsrecht unterscheidet ebenfalls zwischen Tatsachenbehauptung und
Werturteil (Formulierung vor Veröffentlichung fachlich prüfen).
