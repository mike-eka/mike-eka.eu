// Atlas: network graphic (grafik.typ: netz), D3. Data-driven: nodes, edges,
// conditions, key figure and verdicts all come from the card's `grafik`.
// Logic (conditions, visible network, key figure, verdict) lives in
// netz-logik.js, shared with the build. Progressive enhancement — without
// JS the table of all states stays.
//
// Coupling: `grafik.zustand_aus_einschaetzung` names a state key (e.g.
// rueckbindung); each assessment sets it via its `grafik_zustand`. The
// graphic follows the switch of the "Grenzfall" tile (event
// "atlas:einschaetzung") and its own buttons switch that tile too. Own switches (`grafik.schalter`)
// are checkboxes.
(function () {
  "use strict";
  var d3 = window.d3, L = window.AtlasNetzLogik;
  if (!d3 || !L) return;

  Array.prototype.forEach.call(document.querySelectorAll('[data-grafik="netz"]'), init);

  function init(flaeche) {
    var quelle = document.getElementById(flaeche.getAttribute("data-grafik-daten"));
    var kachel = flaeche.closest("[data-grafik-kachel]");
    if (!quelle || !kachel) return;
    var daten = JSON.parse(quelle.textContent);
    var g = daten.grafik, T = daten.texte || {};
    var key = g.zustand_aus_einschaetzung;
    var zustaende = daten.zustaende || [];
    var schablone = document.querySelector("[data-grenzfall][data-atlas-schalter]"); // the card's borderline case

    // state: own switches + the coupled key
    var zustand = {};
    (g.schalter || []).forEach(function (s) { zustand[s.id] = !!s.start; });
    var aktiv = null;

    // show controls, result line; fold the table away (still available)
    Array.prototype.forEach.call(kachel.querySelectorAll("[data-nur-js]"), function (el) { el.hidden = false; });
    flaeche.hidden = false;
    var tabelle = kachel.querySelector("[data-grafik-tabelle]");
    if (tabelle) tabelle.open = false;

    var knoepfe = Array.prototype.slice.call(kachel.querySelectorAll("[data-grafik-einschaetzung]"));
    var kennzahlEl = kachel.querySelector("[data-grafik-kennzahl]");
    var kennzahl2El = kachel.querySelector("[data-grafik-kennzahl-2]");
    var urteilEl = kachel.querySelector("[data-grafik-urteil]");

    function setzeEinschaetzung(k) {
      var z = zustaende.filter(function (x) { return x.key === k; })[0];
      if (!z) return;
      aktiv = k;
      if (key) zustand[key] = z.werte[key];
      knoepfe.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-grafik-einschaetzung") === k)); });
      aktualisiere();
    }

    knoepfe.forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-grafik-einschaetzung");
        if (schablone && schablone.atlasZeige) schablone.atlasZeige(k); // event comes back
        else setzeEinschaetzung(k);
      });
    });
    document.addEventListener("atlas:einschaetzung", function (e) {
      if (e.target === schablone) setzeEinschaetzung(e.detail.key);
    });
    Array.prototype.forEach.call(kachel.querySelectorAll("[data-grafik-schalter]"), function (cb) {
      zustand[cb.getAttribute("data-grafik-schalter")] = cb.checked;
      cb.addEventListener("change", function () {
        zustand[cb.getAttribute("data-grafik-schalter")] = cb.checked;
        aktualisiere();
      });
    });

    // ---- drawing ----
    var svg = d3.select(flaeche).append("svg").attr("role", "img");
    var ebeneKanten = svg.append("g");
    var ebeneKnoten = svg.append("g");
    var W = 0, H = 0;

    function radius(gruppe) {
      return { publikum: 5, fach: 6, fach_anderes: 6, vermittler: 10, vermittler2: 8, thinktank: 8, thema: 11 }[gruppe] || 6;
    }
    // ---- label placement ----
    var ZEICHEN = 6.6, ZEILE_H = 12, ABSTAND_L = 7; // 11px Sono: ~6.6px per character

    function schneidet(a, b, r) { // segment a–b intersects rectangle r?
      var innen = function (p) { return p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2; };
      if (innen(a) || innen(b)) return true;
      var kanten = [[{ x: r.x1, y: r.y1 }, { x: r.x2, y: r.y1 }], [{ x: r.x2, y: r.y1 }, { x: r.x2, y: r.y2 }],
        [{ x: r.x2, y: r.y2 }, { x: r.x1, y: r.y2 }], [{ x: r.x1, y: r.y2 }, { x: r.x1, y: r.y1 }]];
      var kreuz = function (p, q, s, t) {
        var d = (q.x - p.x) * (t.y - s.y) - (q.y - p.y) * (t.x - s.x);
        if (!d) return false;
        var u = ((s.x - p.x) * (t.y - s.y) - (s.y - p.y) * (t.x - s.x)) / d;
        var v = ((s.x - p.x) * (q.y - p.y) - (s.y - p.y) * (q.x - p.x)) / d;
        return u >= 0 && u <= 1 && v >= 0 && v <= 1;
      };
      return kanten.some(function (k) { return kreuz(a, b, k[0], k[1]); });
    }
    function ueberlappt(r, s) { return r.x1 < s.x2 && r.x2 > s.x1 && r.y1 < s.y2 && r.y2 > s.y1; }

    function beschriftungsPlaetze(netz, pos) {
      var plaetze = {}, belegt = [];
      var punkte = netz.knoten.map(function (k) { return { id: k.id, x: px(k), y: py(k), r: radius(k.gruppe) }; });
      netz.knoten.filter(function (k) { return k.label; }).forEach(function (k) {
        var x = px(k), y = py(k), r = radius(k.gruppe), b = k.label.length * ZEICHEN;
        var kandidaten = [
          { x: x + r + ABSTAND_L, y: y + 4, anker: "start", box: { x1: x + r + ABSTAND_L - 2, x2: x + r + ABSTAND_L + b + 2, y1: y - ZEILE_H / 2 - 2, y2: y + ZEILE_H / 2 + 2 } },
          { x: x - r - ABSTAND_L, y: y + 4, anker: "end", box: { x1: x - r - ABSTAND_L - b - 2, x2: x - r - ABSTAND_L + 2, y1: y - ZEILE_H / 2 - 2, y2: y + ZEILE_H / 2 + 2 } },
          { x: x, y: y - r - 6, anker: "middle", box: { x1: x - b / 2 - 2, x2: x + b / 2 + 2, y1: y - r - 6 - ZEILE_H, y2: y - r - 3 } },
          { x: x, y: y + r + 14, anker: "middle", box: { x1: x - b / 2 - 2, x2: x + b / 2 + 2, y1: y + r + 3, y2: y + r + 16 } },
          // diagonal: lets a label move off an edge that arrives from the side
          { x: x - r - 9, y: y - r - 4, anker: "end", box: { x1: x - r - 9 - b - 2, x2: x - r - 7, y1: y - r - 4 - ZEILE_H, y2: y - r - 1 } },
          { x: x + r + 9, y: y - r - 4, anker: "start", box: { x1: x + r + 7, x2: x + r + 9 + b + 2, y1: y - r - 4 - ZEILE_H, y2: y - r - 1 } },
          { x: x - r - 9, y: y + r + 13, anker: "end", box: { x1: x - r - 9 - b - 2, x2: x - r - 7, y1: y + r + 1, y2: y + r + 15 } },
          { x: x + r + 9, y: y + r + 13, anker: "start", box: { x1: x + r + 7, x2: x + r + 9 + b + 2, y1: y + r + 1, y2: y + r + 15 } },
        ];
        var bester = null;
        kandidaten.forEach(function (c, i) {
          var s = i * 0.1; // slight preference for the order above
          if (c.box.x1 < 0 || c.box.x2 > W || c.box.y1 < 0 || c.box.y2 > H) s += 50;
          netz.kanten.forEach(function (e) {
            var a = { x: px(pos[e.von]), y: py(pos[e.von]) }, z = { x: px(pos[e.nach]), y: py(pos[e.nach]) };
            if (e.von === k.id || e.nach === k.id) {
              // own edge: only count it from just outside the node, since
              // every spot next to the node touches it at the centre
              var innen = e.von === k.id ? a : z, aussen = e.von === k.id ? z : a;
              var len = Math.hypot(aussen.x - innen.x, aussen.y - innen.y) || 1, t = Math.min(1, (r + 6) / len);
              var start = { x: innen.x + (aussen.x - innen.x) * t, y: innen.y + (aussen.y - innen.y) * t };
              if (schneidet(start, aussen, c.box)) s += 3;
              return;
            }
            if (schneidet(a, z, c.box)) s += 3;
          });
          punkte.forEach(function (p) {
            if (p.id === k.id) return;
            if (ueberlappt(c.box, { x1: p.x - p.r, x2: p.x + p.r, y1: p.y - p.r, y2: p.y + p.r })) s += 6;
          });
          belegt.forEach(function (bx) { if (ueberlappt(c.box, bx)) s += 10; });
          if (!bester || s < bester.s) bester = { s: s, c: c };
        });
        plaetze[k.id] = bester.c;
        belegt.push(bester.c.box);
      });
      return plaetze;
    }

    function px(k) { return 14 + (k.x / 100) * (W - 28); }
    function py(k) { return 14 + (k.y / 100) * (H - 28); }

    function aktualisiere() {
      var r = L.auswerten(g, zustand);
      var netz = r.netz;
      var pos = {};
      netz.knoten.forEach(function (k) { pos[k.id] = k; });
      var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var dauer = W && !ruhig ? 300 : 0;

      var kanten = ebeneKanten.selectAll("line").data(netz.kanten, function (d) { return d.id; });
      kanten.exit().transition().duration(dauer).style("opacity", 0).remove();
      kanten.enter().append("line")
        .attr("class", function (d) {
          var a = pos[d.von].gruppe, b = pos[d.nach].gruppe;
          // the intermediary's tie to a field (the "Rückbindung")
          var rueck = (a === "vermittler" && /^fach/.test(b)) || (b === "vermittler" && /^fach/.test(a));
          return "nk-kante" + (rueck ? " ist-rueckbindung" : "") + (a === "thinktank" || b === "thinktank" ? " ist-einfluss" : "");
        })
        .style("opacity", 0)
        .merge(kanten)
        .attr("x1", function (d) { return px(pos[d.von]); }).attr("y1", function (d) { return py(pos[d.von]); })
        .attr("x2", function (d) { return px(pos[d.nach]); }).attr("y2", function (d) { return py(pos[d.nach]); })
        .transition().duration(dauer).style("opacity", 1);

      var knoten = ebeneKnoten.selectAll("g.nk-knoten").data(netz.knoten, function (d) { return d.id; });
      knoten.exit().transition().duration(dauer).style("opacity", 0).remove();
      var neu = knoten.enter().append("g")
        .attr("class", function (d) { return "nk-knoten ist-" + d.gruppe; })
        .style("opacity", 0);
      neu.append("circle");
      neu.append("text").attr("class", "nk-label");
      var alle = neu.merge(knoten);
      alle.select("circle").attr("cx", px).attr("cy", py).attr("r", function (d) { return radius(d.gruppe); });
      // Labels: each one takes the side (right, left, above, below) that
      // crosses the fewest edges, nodes and already placed labels.
      var platz = beschriftungsPlaetze(netz, pos);
      alle.select("text")
        .text(function (d) { return d.label || ""; })
        .attr("x", function (d) { return platz[d.id] ? platz[d.id].x : px(d); })
        .attr("y", function (d) { return platz[d.id] ? platz[d.id].y : py(d); })
        .attr("text-anchor", function (d) { return platz[d.id] ? platz[d.id].anker : "start"; });
      alle.transition().duration(dauer).style("opacity", 1);

      // result + text alternative
      var kennText = g.kennzahl && r.kennzahl != null ? g.kennzahl.label + ": " + r.kennzahl + " %" : "";
      var urteilText = r.urteil ? r.urteil.text : "";
      var kenn2Text = g.kennzahl_2 && r.kennzahl_2 != null ? g.kennzahl_2.label + ": " + r.kennzahl_2 : "";
      if (kennzahlEl) kennzahlEl.textContent = kennText;
      if (kennzahl2El) kennzahl2El.textContent = kenn2Text;
      if (urteilEl) {
        urteilEl.textContent = urteilText;
        urteilEl.className = "atlas-grafik__urteil" + (r.urteil && r.urteil.ton ? " ist-" + r.urteil.ton : "");
      }
      svg.attr("aria-label", [T.netz_alt, urteilText, kennText, kenn2Text].filter(Boolean).join(". "));
    }

    function groesse() {
      var w = Math.floor(flaeche.clientWidth);
      if (!w || w === W) return false;
      W = w;
      H = Math.round(W < 520 ? W * 1.2 : W * 0.6); // taller on narrow screens: more room between labels
      svg.attr("width", W).attr("height", H).attr("viewBox", "0 0 " + W + " " + H);
      return true;
    }

    groesse();
    // start: the assessment selected in the template, else the first one
    var gedrueckt = schablone && schablone.querySelector('[data-ziel][aria-pressed="true"]');
    var start = gedrueckt ? gedrueckt.getAttribute("data-ziel") : (zustaende[0] && zustaende[0].key);
    if (start) setzeEinschaetzung(start); else aktualisiere();

    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (groesse()) aktualisiere(); }).observe(flaeche);
    }
  }
})();
