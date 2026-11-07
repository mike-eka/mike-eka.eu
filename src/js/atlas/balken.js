// Atlas: bar graphic (grafik.typ: balken), D3. Not coupled to the
// assessments; its own switch chooses the measure (grafik.masse). Per topic
// two bars side by side: coverage (berichterstattung) and the chosen
// measure. Values are written next to the bars, and the second series is
// hatched, so nothing depends on colour alone. Progressive enhancement —
// without JS the table of all values stays.
(function () {
  "use strict";
  var d3 = window.d3;
  if (!d3) return;

  Array.prototype.forEach.call(document.querySelectorAll('[data-grafik="balken"]'), init);

  function init(flaeche) {
    var quelle = document.getElementById(flaeche.getAttribute("data-grafik-daten"));
    var kachel = flaeche.closest("[data-grafik-kachel]");
    if (!quelle || !kachel) return;
    var daten = JSON.parse(quelle.textContent);
    var g = daten.grafik, T = daten.texte || {};
    var masse = g.masse || [];
    var themen = g.themen || [];
    var mass = masse[0] && masse[0].id;

    Array.prototype.forEach.call(kachel.querySelectorAll("[data-nur-js]"), function (el) { el.hidden = false; });
    flaeche.hidden = false;
    var tabelle = kachel.querySelector("[data-grafik-tabelle]");
    if (tabelle) tabelle.open = false;

    var knoepfe = Array.prototype.slice.call(kachel.querySelectorAll("[data-grafik-mass]"));
    knoepfe.forEach(function (b) {
      b.addEventListener("click", function () {
        mass = b.getAttribute("data-grafik-mass");
        knoepfe.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        zeichne();
      });
    });

    var uid = "balken-" + Math.random().toString(36).slice(2, 8);
    var svg = d3.select(flaeche).append("svg").attr("role", "img");
    var defs = svg.append("defs");
    defs.append("pattern").attr("id", uid + "-schraffur")
      .attr("patternUnits", "userSpaceOnUse").attr("width", 6).attr("height", 6)
      .attr("patternTransform", "rotate(45)")
      .call(function (p) {
        p.append("rect").attr("class", "bk-schraffur-grund").attr("width", 6).attr("height", 6);
        p.append("line").attr("class", "bk-schraffur-linie").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 6);
      });
    var inhalt = svg.append("g");
    var W = 0;

    var RAND = 12; // inner margin of the drawing area

    function zeichne() {
      W = Math.floor(flaeche.clientWidth);
      if (!W) return;
      var B = W - 2 * RAND; // drawable width
      var massLabel = (masse.filter(function (m) { return m.id === mass; })[0] || {}).label || "";
      var reihen = [
        { id: "berichterstattung", label: g.reihe_a, klasse: "bk-balken ist-a" },
        { id: mass, label: massLabel, klasse: "bk-balken ist-b", fill: "url(#" + uid + "-schraffur)" },
      ];

      var balkenH = 16, abstandBalken = 4, labelH = 20, abstandThema = 16;
      var legendeH = 2 * 20 + 8;
      var wertB = 44; // room for "100 %"
      var x = d3.scaleLinear().domain([0, 100]).range([0, Math.max(40, B - wertB - 4)]);
      var H = 2 * RAND + legendeH + themen.length * (labelH + 2 * balkenH + abstandBalken + abstandThema) - abstandThema;
      svg.attr("width", W).attr("height", H).attr("viewBox", "0 0 " + W + " " + H);
      inhalt.attr("transform", "translate(" + RAND + "," + RAND + ")");
      inhalt.selectAll("*").remove();

      // legend (also names the series in text)
      reihen.forEach(function (r, i) {
        var lg = inhalt.append("g").attr("transform", "translate(0," + (i * 20) + ")");
        lg.append("rect").attr("class", r.klasse).attr("width", 18).attr("height", 12).attr("y", 2)
          .attr("fill", r.fill || null);
        lg.append("text").attr("class", "bk-text").attr("x", 26).attr("y", 12).text(r.label);
      });

      var y = legendeH;
      themen.forEach(function (t) {
        var gt = inhalt.append("g").attr("transform", "translate(0," + y + ")");
        gt.append("text").attr("class", "bk-thema").attr("y", 14).text(t.name);
        reihen.forEach(function (r, i) {
          var wert = Number(t[r.id]) || 0;
          var by = labelH + i * (balkenH + abstandBalken);
          gt.append("rect").attr("class", "bk-spur").attr("x", 0).attr("y", by).attr("width", x(100)).attr("height", balkenH);
          gt.append("rect").attr("class", r.klasse).attr("x", 0).attr("y", by)
            .attr("height", balkenH).attr("fill", r.fill || null)
            .attr("width", x(wert));
          gt.append("text").attr("class", "bk-wert").attr("x", x(wert) + 6).attr("y", by + 12)
            .text(wert + " %");
        });
        y += labelH + 2 * balkenH + abstandBalken + abstandThema;
      });

      // text alternative: every value in words
      svg.attr("aria-label", [T.balken_alt + ": " + g.reihe_a + " / " + massLabel].concat(themen.map(function (t) {
        return t.name + ": " + t.berichterstattung + " % / " + t[mass] + " %";
      })).join(". "));
    }

    zeichne();
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (Math.floor(flaeche.clientWidth) !== W) zeichne();
      }).observe(flaeche);
    }
  }
})();
