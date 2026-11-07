// Atlas: network graphic (grafik.typ: netz), D3. Data-driven: nodes, edges,
// conditions, key figure and verdicts all come from the card's `grafik`.
// Logic (conditions, visible network, key figure, verdict) lives in
// netz-logik.js, shared with the build. Progressive enhancement — without
// JS the table of all states stays.
//
// Coupling: `grafik.zustand_aus_einschaetzung` names a state key (e.g.
// rueckbindung); each assessment sets it via its `grafik_zustand`. The
// graphic follows the template's switch (event "atlas:einschaetzung") and
// its own buttons switch the template too. Own switches (`grafik.schalter`)
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
    var schablone = document.querySelector(".atlas-schablone[data-atlas-schalter]");

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
      alle.select("text")
        .text(function (d) { return d.label || ""; })
        .attr("x", function (d) { return d.x > 70 ? px(d) - radius(d.gruppe) - 4 : px(d) + radius(d.gruppe) + 4; })
        .attr("y", function (d) { return py(d) + 4; })
        .attr("text-anchor", function (d) { return d.x > 70 ? "end" : "start"; });
      alle.transition().duration(dauer).style("opacity", 1);

      // result + text alternative
      var kennText = g.kennzahl && r.kennzahl != null ? g.kennzahl.label + ": " + r.kennzahl + " %" : "";
      var urteilText = r.urteil ? r.urteil.text : "";
      if (kennzahlEl) kennzahlEl.textContent = kennText;
      if (urteilEl) {
        urteilEl.textContent = urteilText;
        urteilEl.className = "atlas-grafik__urteil" + (r.urteil && r.urteil.ton ? " ist-" + r.urteil.ton : "");
      }
      svg.attr("aria-label", [T.netz_alt, urteilText, kennText].filter(Boolean).join(". "));
    }

    function groesse() {
      var w = Math.floor(flaeche.clientWidth);
      if (!w || w === W) return false;
      W = w;
      H = Math.round(W < 520 ? W * 0.8 : W * 0.6);
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
