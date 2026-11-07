// Atlas: logic for the network graphic (grafik.typ: netz). No DOM, no D3.
// Used in the browser by netz.js (window.AtlasNetzLogik) and at build time
// by config/atlas.js (require), so the no-JS table shows exactly what the
// graphic computes.
//
// Conditions (nur_wenn, urteile.wenn) — deliberately minimal:
//   sonst                      always true (use as the last verdict)
//   name                       state value is truthy (e.g. a switch id)
//   !name                      state value is falsy
//   name == wert, name != wert compare with a word or number
//   kennzahl >= 75             also >, <=, <
//   a && b                     all terms must hold
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.AtlasNetzLogik = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var ZAHL = /^-?\d+(\.\d+)?$/;
  var VERGLEICH = /^([A-Za-z_][\w-]*)\s*(==|!=|>=|<=|>|<)\s*([\w.-]+)$/;
  var NAME = /^!?\s*([A-Za-z_][\w-]*)$/;

  function liste(x) {
    return Array.isArray(x) ? x : x == null ? [] : [x];
  }

  function istWahr(v) {
    return v === true || (typeof v === "number" && v !== 0) || (typeof v === "string" && v !== "" && v !== "false");
  }

  function term(t, z) {
    var m = t.match(VERGLEICH);
    if (m) {
      var links = z[m[1]];
      var rechts = ZAHL.test(m[3]) ? Number(m[3]) : m[3];
      switch (m[2]) {
        case "==": return String(links) === String(rechts);
        case "!=": return String(links) !== String(rechts);
        case ">=": return Number(links) >= rechts;
        case "<=": return Number(links) <= rechts;
        case ">": return Number(links) > rechts;
        case "<": return Number(links) < rechts;
      }
    }
    if (t.charAt(0) === "!") return !istWahr(z[t.slice(1).trim()]);
    return istWahr(z[t]);
  }

  function pruefe(bedingung, zustand) {
    if (bedingung == null || bedingung === "") return true;
    var text = String(bedingung).trim();
    if (text === "sonst") return true;
    return text.split("&&").every(function (teil) { return term(teil.trim(), zustand || {}); });
  }

  // Names a condition refers to, and terms it cannot parse (for build warnings).
  function analysiere(bedingung) {
    var namen = [], fehler = [];
    if (bedingung == null || bedingung === "") return { namen: namen, fehler: fehler };
    var text = String(bedingung).trim();
    if (text === "sonst") return { namen: namen, fehler: fehler };
    text.split("&&").forEach(function (teil) {
      var t = teil.trim(), m = t.match(VERGLEICH) || t.match(NAME);
      if (m) namen.push(m[1]); else fehler.push(t);
    });
    return { namen: namen, fehler: fehler };
  }

  // Visible nodes and edges for a state. Edges are expanded from lists
  // (von: [a, b] → nach: [c]) and dropped if an end is hidden.
  function sichtbar(grafik, z) {
    var knoten = (grafik.knoten || []).filter(function (k) { return pruefe(k.nur_wenn, z); });
    var ids = {};
    knoten.forEach(function (k) { ids[k.id] = true; });
    var kanten = [];
    (grafik.kanten || []).forEach(function (k) {
      if (!pruefe(k.nur_wenn, z)) return;
      liste(k.von).forEach(function (a) {
        liste(k.nach).forEach(function (b) {
          if (ids[a] && ids[b]) kanten.push({ von: a, nach: b, id: a + "-" + b });
        });
      });
    });
    return { knoten: knoten, kanten: kanten };
  }

  // Breadth-first search on the undirected graph: distances and the number
  // of shortest paths from s to every node.
  function bfs(netz, s) {
    var nachbarn = {};
    netz.knoten.forEach(function (k) { nachbarn[k.id] = []; });
    netz.kanten.forEach(function (k) {
      nachbarn[k.von].push(k.nach);
      nachbarn[k.nach].push(k.von);
    });
    var dist = {}, sigma = {}, schlange = [s];
    if (!(s in nachbarn)) return { dist: dist, sigma: sigma };
    dist[s] = 0; sigma[s] = 1;
    while (schlange.length) {
      var v = schlange.shift();
      nachbarn[v].forEach(function (w) {
        if (!(w in dist)) { dist[w] = dist[v] + 1; sigma[w] = 0; schlange.push(w); }
        if (dist[w] === dist[v] + 1) sigma[w] += sigma[v];
      });
    }
    return { dist: dist, sigma: sigma };
  }

  // Simplified betweenness (in %): for every node of `von_gruppe`, the share
  // of its shortest paths to `nach` that run through `ueber`; averaged.
  function kennzahl(grafik, netz) {
    var kz = grafik.kennzahl;
    if (!kz) return null;
    var vonV = bfs(netz, kz.ueber);
    var quellen = netz.knoten.filter(function (k) { return k.gruppe === kz.von_gruppe; });
    if (!quellen.length) return null;
    var summe = 0;
    quellen.forEach(function (q) {
      var b = bfs(netz, q.id);
      if (!(kz.nach in b.dist) || !(kz.ueber in b.dist) || !(kz.nach in vonV.dist)) return;
      if (b.dist[kz.ueber] + vonV.dist[kz.nach] === b.dist[kz.nach]) {
        summe += (b.sigma[kz.ueber] * vonV.sigma[kz.nach]) / b.sigma[kz.nach];
      }
    });
    return Math.round((summe / quellen.length) * 100);
  }

  function urteil(grafik, z) {
    var u = (grafik.urteile || []).filter(function (x) { return pruefe(x.wenn, z); });
    return u.length ? u[0] : null;
  }

  // Everything for one state: visible network, key figure, verdict.
  function auswerten(grafik, zustand) {
    var netz = sichtbar(grafik, zustand);
    var k = kennzahl(grafik, netz);
    var z = {};
    Object.keys(zustand || {}).forEach(function (n) { z[n] = zustand[n]; });
    z.kennzahl = k;
    return { netz: netz, kennzahl: k, urteil: urteil(grafik, z) };
  }

  return { pruefe: pruefe, analysiere: analysiere, sichtbar: sichtbar, kennzahl: kennzahl, auswerten: auswerten };
});
