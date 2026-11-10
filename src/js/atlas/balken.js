// Atlas: bar graphic (grafik.typ: balken), D3. Not coupled to the
// assessments; its own switch chooses the measure (grafik.masse). Per topic
// two bars side by side: the fixed series (reihe_a: feld, label) and the
// chosen measure. Absolute numbers (themen[].absolut) appear in each bar's
// tooltip and in the text alternative. Values are written next to the bars, and the second series is
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
    var ra = daten.reihe_a || { feld: "berichterstattung", label: g.reihe_a };
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
        { id: ra.feld, label: ra.label, klasse: "bk-balken ist-a" },
        { id: mass, label: massLabel, klasse: "bk-balken ist-b", fill: "url(#" + uid + "-schraffur)" },
      ];

      var balkenH = 16, abstandBalken = 4, abstandThema = 16, zeileH = 16;
      var wertB = 44; // room for "100 %"
      var x = d3.scaleLinear().domain([0, 100]).range([0, Math.max(40, B - wertB - 4)]);
      inhalt.attr("transform", "translate(" + RAND + "," + RAND + ")");
      inhalt.selectAll("*").remove();

      // long labels wrap (measured in the page's font)
      var legende = reihen.map(function (r) { return umbrechen(r.label, B - 26, "bk-text"); });
      var namen = themen.map(function (t) { return umbrechen(t.name, B, "bk-thema"); });
      var legendeH = legende.reduce(function (s, z) { return s + Math.max(1, z.length) * zeileH + 4; }, 0) + 8;
      var H = 2 * RAND + legendeH + themen.reduce(function (s, t, i) {
        return s + namen[i].length * zeileH + 4 + 2 * balkenH + abstandBalken + abstandThema;
      }, 0) - abstandThema;
      svg.attr("width", W).attr("height", H).attr("viewBox", "0 0 " + W + " " + H);

      // legend (also names the series in text)
      var ly = 0;
      reihen.forEach(function (r, i) {
        var lg = inhalt.append("g").attr("transform", "translate(0," + ly + ")");
        lg.append("rect").attr("class", r.klasse).attr("width", 18).attr("height", 12).attr("y", 2)
          .attr("fill", r.fill || null);
        schreibe(lg.append("text").attr("class", "bk-text"), legende[i], 26, 12);
        ly += Math.max(1, legende[i].length) * zeileH + 4;
      });

      var y = legendeH;
      themen.forEach(function (t, ti) {
        var gt = inhalt.append("g").attr("transform", "translate(0," + y + ")");
        schreibe(gt.append("text").attr("class", "bk-thema"), namen[ti], 0, 14);
        var labelH = namen[ti].length * zeileH + 4;
        reihen.forEach(function (r, i) {
          var wert = Number(t[r.id]) || 0;
          var by = labelH + i * (balkenH + abstandBalken);
          gt.append("rect").attr("class", "bk-spur").attr("x", 0).attr("y", by).attr("width", x(100)).attr("height", balkenH);
          gt.append("rect").attr("class", r.klasse).attr("x", 0).attr("y", by)
            .attr("height", balkenH).attr("fill", r.fill || null)
            .attr("width", x(wert))
            .append("title").text(t.name + " – " + r.label + ": " + wertText(t, r.id));
          gt.append("text").attr("class", "bk-wert").attr("x", x(wert) + 6).attr("y", by + 12)
            .text(wert + " %");
        });
        y += labelH + 2 * balkenH + abstandBalken + abstandThema;
      });

      // text alternative: every value in words, absolute numbers in brackets
      svg.attr("aria-label", [T.balken_alt + ": " + ra.label + " / " + massLabel].concat(themen.map(function (t) {
        return t.name + ": " + wertText(t, ra.feld) + " / " + wertText(t, mass);
      })).join(". "));
    }

    // Lines of a label that fit the width, measured with a probe text.
    function umbrechen(text, breite, klasse) {
      var probe = inhalt.append("text").attr("class", klasse);
      var zeilen = [], z = "";
      String(text || "").split(/\s+/).filter(Boolean).forEach(function (w) {
        var versuch = z ? z + " " + w : w;
        probe.text(versuch);
        if (z && probe.node().getComputedTextLength() > breite) { zeilen.push(z); z = w; } else z = versuch;
      });
      if (z) zeilen.push(z);
      probe.remove();
      return zeilen;
    }

    // lines as tspans; y = baseline of the first line
    function schreibe(textEl, zeilen, x, y) {
      zeilen.forEach(function (z, i) {
        textEl.append("tspan").attr("x", x).attr("y", y + i * 16).text(z);
      });
    }

    // "66 %" or "66 % (1.183)" when the topic has an absolute number
    function wertText(t, feld) {
      var s = (Number(t[feld]) || 0) + " %";
      var abs = t.absolut && t.absolut[feld];
      if (abs != null) s += " (" + Number(abs).toLocaleString("de-DE") + ")";
      return s;
    }

    zeichne();
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (Math.floor(flaeche.clientWidth) !== W) zeichne();
      }).observe(flaeche);
    }
  }
})();
