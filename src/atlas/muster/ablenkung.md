---
titel: "Ablenkung"
fachbegriff: "question shifting"
hinsicht: achten
reihenfolge: 1
veroeffentlicht: true
im_framework: true
kurz: >-
  Auf eine Frage kommt etwas, das wie eine Antwort klingt, aber eine andere
  Frage beantwortet, die relevant klingt aber eigentlich irrelevant ist. Die ursprüngliche Frage gilt danach (für Manche) als behandelt.

minimalpaar:
  frage: "Warum wird die Sanierung der Grundschule erneut verschoben?"
  muster: "[[Wissen Sie, wie viele Schulen die Vorgängerregierung verfallen ließ? Wir haben in dieser Wahlperiode schon drei Turnhallen eröffnet.]]"
  gegenform: "[[Weil die Ausschreibung kein Angebot im Kostenrahmen ergeben hat. Wir schreiben im Frühjahr neu aus.]]"
  hinweis: >-
    Erfundene Stadtratssitzung. Beide Antworten können wahr sein. Der
    Unterschied liegt darin, auf welche Frage eingegangen wird.

mittel:
  name: "Verschiebung der Leitfrage (Question under Discussion)"
  erklaerung: >-
    Jede Äußerung im Gespräch wird als Beitrag zur gerade offenen Frage
    gehört. Diese Erwartung (Relevanzimplikatur) lässt eine Antwort auf eine
    andere Frage so wirken, als gehöre sie zur gestellten.
  test: >-
    Frage-Antwort-Kongruenz: Passt die Antwort zum Fokus der Frage? Lässt sich
    „Warum wird verschoben?“ mit „drei Turnhallen eröffnet“ beantworten?

schablone: # Stufe „Muster“
  inhalt:
    {
      status: muster,
      text: ["Äußerung:", "eine Antwort auf eine andere Frage"],
    }
  vergleichsfall:
    {
      status: offen,
      text: ["eine Antwort auf die Frage –", "oder gar keine Antwort?"],
    }
  hinsicht: { status: muster, text: ["Worauf wir achten", ""] }
  urteil: { status: offen, text: ["ergibt sich aus", "dem offenen Feld"] }
  wirkung: { status: muster, text: ["typisch:", "festhalten"] }

effekt:
  vorher: >-
    Die Frage nach der Sanierung ist gestellt und wartet auf eine Antwort.
  nachher: >-
    Man hat etwas gehört, das wie eine Antwort klingt. Die eigentliche Frage
    gilt als behandelt. Oft wird nicht nachgehakt, auch nicht von
    denen, deren Aufgabe es wäre.
  hinsichten: [achten]

kippt_an: vergleich
grenzfall_frage: "Womit vergleicht man: mit einer echten Antwort oder mit gar keiner?"
einschaetzungen:
  - label: "mit einer Antwort auf die Frage"
    vergleichsfall: "Die Bürgermeisterin nennt den Grund für die Verschiebung."
    urteil: ja
    begruendung: >-
      Die Frage bleibt offen, wirkt aber erledigt. Gegenüber einer echten
      Antwort steht das Publikum schlechter da.
    wirkung: festhalten
  - label: "mit gar keiner Antwort"
    vergleichsfall: "Die Bürgermeisterin schweigt oder verweist auf später."
    urteil: strittig
    begruendung: >-
      Man erfährt etwas Wahres, nur nicht das, was man wissen wollte. Ob man
      schlechter dasteht, hängt davon ab, ob man merkt, dass die Frage offen
      geblieben ist.
    wirkung: keine

normalfall: >-
  Gespräche wechseln ständig das Thema, und manchmal ist die neue Frage
  tatsächlich wichtiger. Problematisch wird es, wenn der Wechsel als Antwort
  auftritt.
verzerrungen: # Kachel „Verzerrungen, die das Muster begünstigen“
  - name: "Kooperationsannahme"
    text: "Wir unterstellen, dass eine Antwort zur gestellten Frage passt, und suchen den Zusammenhang selbst."
  - name: "Begrenzte Aufmerksamkeit"
    text: "Im Gedächtnis bleibt, dass geantwortet wurde, nicht worauf."
literatur:
  - "Roberts, C. (2012). Information structure in discourse: Towards an integrated formal theory of pragmatics. Semantics and Pragmatics 5(6), 1–69."
  - "Grice, H. P. (1975). Logic and conversation. In P. Cole & J. L. Morgan (Hg.), Syntax and Semantics 3: Speech Acts, 41–58. New York: Academic Press."
  - "Clayman, S. & Heritage, J. (2002). The News Interview: Journalists and Public Figures on the Air. Cambridge: Cambridge University Press."
grafik:
  typ: illustration
  motiv: weiche
  titel: "Die Frage wird umgeleitet"
  start: "Warum wird die Sanierung verschoben?"
  ziel_umgeleitet: "Drei Turnhallen eröffnet"
  ziel_eigentlich: "Der Grund für die Verschiebung"
  knopf: "Nachhaken"
  vorher: "Die Weiche lenkt die Frage auf ein anderes Gleis."
  nachher: "Wer nachhakt, stellt die Weiche zurück, und die Frage erreicht ihr Ziel."
---

Ablenkung funktioniert, weil wir im Gespräch annehmen, dass jede Äußerung
zur gerade offenen Frage beiträgt. Wer auf „Warum wird verschoben?“ mit
einer Zahl über Turnhallen antwortet, nutzt diese Erwartung: Das Publikum
sucht den Zusammenhang, den die Antwort nur behauptet. Ob das gelingt, hängt
auch davon ab, ob jemand die Frage festhält. In Interviews und Talkshows
wäre das die Aufgabe der Moderation – oft wird aber höchstens einmal
nachgehakt. So wird aus einer ausgewichenen Frage scheinbar eine
beantwortete.
