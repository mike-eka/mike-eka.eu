// Atlas overview map (D3, self-hosted). Fixed layout computed from the data:
// no force simulation, no hard-coded positions. Progressive enhancement —
// without JS (or without D3) the figure stays hidden and the nested list
// below carries the same structure.
//
// Layout (top to bottom):
//   dashed boundary "Reichweite der Re:DIS-Definition"
//     spokes: the pruefragen with art "muster" around the assessment
//     the assessment, framed by a band for the audience (art "rahmen")
//     the hinsichten as columns, each with its cards (any number, wrapped)
//   outside: the neighbours, under the hinsicht they harm (dotted link)
//
// Wide (>= 720 px): spokes on an arc, hinsichten side by side.
// Narrow: spokes in a row above the assessment, hinsichten stacked.
// All colours come from atlas.css (classes lk-*).
(function () {
  "use strict";

  var figur = document.querySelector("[data-landkarte]");
  if (!figur || !window.d3) return;
  var quelle = document.getElementById(figur.getAttribute("data-landkarte"));
  if (!quelle) return;
  var daten = JSON.parse(quelle.textContent);
  var flaeche = figur.querySelector(".atlas-landkarte__flaeche");
  var d3 = window.d3;
  var T = daten.texte || {};

  var GROESSE = { text: 13, klein: 11, titel: 14 };
  var ZEILE = 1.35;
  var RAND = 14;          // margin inside the boundary
  var PAD = 10;           // padding inside boxes
  var ABSTAND = 12;       // gap between boxes

  figur.hidden = false;

  // ---- text helpers ------------------------------------------------------
  var zeichenProPx = null; // width of one character at 1px font size (Sono is monospaced)

  function messeZeichen(svg) {
    var t = svg.append("text").attr("class", "lk-text").style("font-size", "100px").text("MMMMMMMMMM");
    var breite = t.node().getComputedTextLength() / 10 / 100;
    t.remove();
    return breite > 0 ? breite : 0.6;
  }

  function umbrechen(text, breitePx, groesse) {
    var max = Math.max(4, Math.floor(breitePx / (zeichenProPx * groesse)));
    var zeilen = [];
    var aktuell = "";
    String(text || "").split(/\s+/).filter(Boolean).forEach(function (wort) {
      while (wort.length > max) { // hard-split very long words
        if (aktuell) { zeilen.push(aktuell); aktuell = ""; }
        zeilen.push(wort.slice(0, max - 1) + "-");
        wort = wort.slice(max - 1);
      }
      if (!aktuell) aktuell = wort;
      else if ((aktuell + " " + wort).length <= max) aktuell += " " + wort;
      else { zeilen.push(aktuell); aktuell = wort; }
    });
    if (aktuell) zeilen.push(aktuell);
    return zeilen;
  }

  function hoehe(zeilen, groesse) {
    return zeilen.length * groesse * ZEILE;
  }

  // Writes lines starting at top y; returns the block height.
  function schreibe(g, zeilen, x, y, groesse, klasse, anker) {
    var t = g.append("text").attr("class", klasse).style("font-size", groesse + "px");
    if (anker) t.attr("text-anchor", anker);
    zeilen.forEach(function (z, i) {
      t.append("tspan").attr("x", x).attr("y", y + groesse * 0.95 + i * groesse * ZEILE).text(z);
    });
    return hoehe(zeilen, groesse);
  }

  // ---- layout + drawing --------------------------------------------------
  function zeichne() {
    var W = Math.floor(flaeche.clientWidth);
    if (!W) return;
    var breit = W >= 720;

    d3.select(flaeche).selectAll("*").remove();
    var svg = d3.select(flaeche).append("svg")
      .attr("width", W)
      .attr("role", "group")
      .attr("aria-describedby", "atlas-landkarte-hinweis");
    if (zeichenProPx === null) zeichenProPx = messeZeichen(svg);

    // Layers, bottom to top: connectors · audience band · spokes · boxes.
    // Spokes lie above the band, so they visibly cross it into the assessment.
    var ebeneLinien = svg.append("g");
    var ebeneBand = svg.append("g");
    var ebeneSpeichen = svg.append("g");
    var ebeneFlaechen = svg.append("g");

    var spokes = daten.pruefragen.filter(function (q) { return q.art === "muster"; });
    var rahmenFrage = daten.pruefragen.filter(function (q) { return q.art === "rahmen"; })[0];

    // -- boundary label
    var y = 6;
    var grenzeOben = y;
    y += schreibe(ebeneFlaechen, [T.reichweite || ""], RAND, y + 8, GROESSE.klein, "lk-grenze-text") + 22;

    // -- the assessment with its audience band
    var cx = W / 2;
    var rahmenB = Math.min(breit ? 320 : W - 2 * RAND, 340);
    var bandOben = 28;   // room for the band label
    var bandSeite = 12;
    var innenB = rahmenB - 2 * bandSeite;
    var innenTitel = umbrechen(T.einschaetzung, innenB - 2 * PAD, GROESSE.titel);
    var innenZusatz = umbrechen(T.einschaetzung_zusatz, innenB - 2 * PAD, GROESSE.klein);
    var innenH = 2 * PAD + hoehe(innenTitel, GROESSE.titel) + 4 + hoehe(innenZusatz, GROESSE.klein);
    var bandText = umbrechen(
      (rahmenFrage ? rahmenFrage.frage + " · " : "") + (T.publikum || "") + ": " + (T.publikum_verweis || ""),
      rahmenB - 2 * bandSeite, GROESSE.klein
    );
    bandOben = Math.max(bandOben, hoehe(bandText, GROESSE.klein) + 10);
    var rahmenH = bandOben + innenH + bandSeite;

    // -- spokes (only the questions a pattern can fix)
    var n = spokes.length;
    var spokeB, spokeBoxen = [];
    if (breit) {
      spokeB = Math.min(230, (W - 2 * RAND - rahmenB - 80) / 2);
    } else {
      spokeB = n ? (W - 2 * RAND - (n - 1) * 8) / n : 0;
    }
    spokes.forEach(function (q) {
      var zeilen = umbrechen(q.frage, spokeB - 2 * PAD, GROESSE.text);
      spokeBoxen.push({ q: q, zeilen: zeilen, h: hoehe(zeilen, GROESSE.text) + 2 * PAD });
    });
    var maxSpokeH = d3.max(spokeBoxen, function (s) { return s.h; }) || 0;

    var rahmenY; // top of the frame
    if (breit) {
      // arc from left (180°) over the top to right (0°)
      var rx = rahmenB / 2 + spokeB / 2 + 34;
      var ry = rahmenH / 2 + maxSpokeH / 2 + 26;
      var cy = y + maxSpokeH + ry - maxSpokeH / 2; // top spoke touches y
      spokeBoxen.forEach(function (s, i) {
        var a = n === 1 ? Math.PI / 2 : Math.PI - i * Math.PI / (n - 1);
        s.cx = cx + rx * Math.cos(a);
        s.cy = cy - ry * Math.sin(a);
      });
      rahmenY = cy - rahmenH / 2;
      y = Math.max(cy + rahmenH / 2, d3.max(spokeBoxen, function (s) { return s.cy + s.h / 2; }) || 0);
    } else {
      spokeBoxen.forEach(function (s, i) {
        s.cx = RAND + spokeB / 2 + i * (spokeB + 8);
        s.cy = y + maxSpokeH / 2;
        s.h = maxSpokeH;
      });
      rahmenY = y + maxSpokeH + 28;
      y = rahmenY + rahmenH;
    }
    var rahmenX = cx - rahmenB / 2;
    var innenX = rahmenX + bandSeite;
    var innenY = rahmenY + bandOben;
    var innenMitteY = innenY + innenH / 2;

    // band (audience): a frame around the assessment, not a spoke
    var gRahmen = ebeneBand.append("g").attr("class", "lk-publikum");
    gRahmen.append("rect").attr("class", "lk-band")
      .attr("x", rahmenX).attr("y", rahmenY).attr("width", rahmenB).attr("height", rahmenH)
      .attr("rx", 16);
    // band label on the top layer (with a halo, see atlas.css), above the spokes
    schreibe(ebeneFlaechen.append("g").attr("class", "lk-publikum-text"),
      bandText, cx, rahmenY + 5, GROESSE.klein, "lk-band-text", "middle");

    // spokes: from each question into the assessment
    spokeBoxen.forEach(function (s) {
      ebeneSpeichen.append("line").attr("class", "lk-speiche")
        .attr("x1", s.cx).attr("y1", s.cy).attr("x2", cx).attr("y2", innenMitteY);
    });

    var gInnen = ebeneFlaechen.append("g").attr("class", "lk-einschaetzung");
    gInnen.append("rect").attr("class", "lk-kern")
      .attr("x", innenX).attr("y", innenY).attr("width", innenB).attr("height", innenH).attr("rx", 10);
    var ty = innenY + PAD;
    ty += schreibe(gInnen, innenTitel, cx, ty, GROESSE.titel, "lk-titel", "middle") + 4;
    schreibe(gInnen, innenZusatz, cx, ty, GROESSE.klein, "lk-klein", "middle");

    // spoke boxes
    spokeBoxen.forEach(function (s) {
      var g = ebeneFlaechen.append("g").attr("class", "lk-frage");
      g.append("rect").attr("class", "lk-frage-box")
        .attr("x", s.cx - spokeB / 2).attr("y", s.cy - s.h / 2)
        .attr("width", spokeB).attr("height", s.h).attr("rx", 8);
      var textH = hoehe(s.zeilen, GROESSE.text);
      schreibe(g, s.zeilen, s.cx, s.cy - textH / 2, GROESSE.text, "lk-frage-text", "middle");
    });

    // -- hinsichten as columns (wide) or stacked (narrow)
    y += 40;
    var hs = daten.hinsichten;
    var spalten = breit ? hs.length : 1;
    var innenBreite = W - 2 * RAND;
    var spB = (innenBreite - (spalten - 1) * ABSTAND) / spalten;
    var spaltenX = function (i) { return RAND + (breit ? i : 0) * (spB + ABSTAND); };

    // measure every column first
    var spaltenInfo = hs.map(function (h) {
      var kopf = [];
      kopf.push({ zeilen: umbrechen(h.name, spB - 2 * PAD, GROESSE.text), groesse: GROESSE.text, klasse: "lk-titel" });
      kopf.push({ zeilen: umbrechen(h.leitfrage, spB - 2 * PAD, GROESSE.klein), groesse: GROESSE.klein, klasse: "lk-klein" });
      if (!h.schwerpunkt) {
        kopf.push({ zeilen: umbrechen("(" + (T.nicht_schwerpunkt || "") + ")", spB - 2 * PAD, GROESSE.klein), groesse: GROESSE.klein, klasse: "lk-klein" });
      }
      var kopfH = kopf.reduce(function (s, k) { return s + hoehe(k.zeilen, k.groesse) + 2; }, 0);
      var pillen = h.muster.map(function (m) {
        var zeilen = umbrechen(m.titel, spB - 4 * PAD, GROESSE.text);
        var zusatz = m.url ? [] : umbrechen(T.in_vorbereitung || "", spB - 4 * PAD, GROESSE.klein);
        return { m: m, zeilen: zeilen, zusatz: zusatz, h: hoehe(zeilen, GROESSE.text) + hoehe(zusatz, GROESSE.klein) + 2 * 7 };
      });
      var inhaltH = PAD + kopfH + 6 + pillen.reduce(function (s, p) { return s + p.h + 6; }, 0) + PAD - 6;
      return { h: h, kopf: kopf, kopfH: kopfH, pillen: pillen, inhaltH: Math.max(inhaltH, 60) };
    });
    if (breit) {
      var gleich = d3.max(spaltenInfo, function (s) { return s.inhaltH; });
      spaltenInfo.forEach(function (s) { s.inhaltH = gleich; });
    }

    // connector from the assessment to the hinsichten
    var busY = y - 20;
    ebeneLinien.append("line").attr("class", "lk-verbindung")
      .attr("x1", cx).attr("y1", rahmenY + rahmenH).attr("x2", cx).attr("y2", busY);
    if (breit) {
      ebeneLinien.append("line").attr("class", "lk-verbindung")
        .attr("x1", spaltenX(0) + spB / 2).attr("y1", busY)
        .attr("x2", spaltenX(hs.length - 1) + spB / 2).attr("y2", busY);
    }

    var spalteY = y;
    spaltenInfo.forEach(function (s, i) {
      var x = spaltenX(i);
      var top = breit ? spalteY : y;
      s.x = x; s.top = top;
      if (breit) {
        ebeneLinien.append("line").attr("class", "lk-verbindung")
          .attr("x1", x + spB / 2).attr("y1", busY).attr("x2", x + spB / 2).attr("y2", top);
      } else {
        ebeneLinien.append("line").attr("class", "lk-verbindung")
          .attr("x1", cx).attr("y1", busY).attr("x2", cx).attr("y2", top);
        busY = top + s.inhaltH;
      }
      var klassen = "lk-hinsicht" + (s.h.schwerpunkt ? "" : " ist-nebensache") + (s.h.rand ? " ist-rand" : "");
      var g = ebeneFlaechen.append("g").attr("class", klassen);
      g.append("rect").attr("class", "lk-hinsicht-box")
        .attr("x", x).attr("y", top).attr("width", spB).attr("height", s.inhaltH).attr("rx", 12);
      var yy = top + PAD;
      s.kopf.forEach(function (k) {
        yy += schreibe(g, k.zeilen, x + PAD, yy, k.groesse, k.klasse) + 2;
      });
      yy += 6;
      s.pillen.forEach(function (p) {
        var ziel = g;
        if (p.m.url) {
          ziel = g.append("a").attr("href", p.m.url).attr("class", "lk-link");
        }
        var gp = ziel.append("g").attr("class", "lk-muster" + (p.m.url ? "" : " ist-entwurf"));
        gp.append("rect").attr("class", "lk-pille")
          .attr("x", x + PAD).attr("y", yy).attr("width", spB - 2 * PAD).attr("height", p.h).attr("rx", 8);
        var ty2 = yy + 7;
        ty2 += schreibe(gp, p.zeilen, x + 2 * PAD, ty2, GROESSE.text, "lk-muster-text");
        if (p.zusatz.length) schreibe(gp, p.zusatz, x + 2 * PAD, ty2, GROESSE.klein, "lk-klein");
        yy += p.h + 6;
      });
      if (!breit) y = top + s.inhaltH + ABSTAND;
    });
    y = breit ? spalteY + spaltenInfo[0].inhaltH : y - ABSTAND;

    // -- the boundary of the Re:DIS definition
    var grenzeUnten = y + 14;
    ebeneLinien.append("rect").attr("class", "lk-grenze")
      .attr("x", 3).attr("y", grenzeOben).attr("width", W - 6).attr("height", grenzeUnten - grenzeOben)
      .attr("rx", 18);
    y = grenzeUnten + 18;

    // -- neighbours outside, under the hinsicht they harm
    var nachbarn = daten.nachbarn || [];
    if (nachbarn.length) {
      y += schreibe(ebeneFlaechen,
        umbrechen((T.nachbarn || "") + " · " + (T.nachbarn_hinweis || ""), W - 2 * RAND, GROESSE.klein),
        RAND, y, GROESSE.klein, "lk-klein") + 8;
      var nachbarTop = y;
      var stapel = {}; // next free y per column
      nachbarn.forEach(function (nb) {
        var idx = hs.map(function (h) { return h.id; }).indexOf(nb.hinsicht);
        var spalte = breit && idx >= 0 ? idx : 0;
        var x = breit ? spaltenX(spalte) : RAND;
        var bB = breit ? spB : innenBreite;
        var zeilen = umbrechen(nb.name, bB - 2 * PAD, GROESSE.text);
        var hinsicht = idx >= 0 ? hs[idx].name : "";
        var zusatz = breit ? [] : umbrechen("→ " + hinsicht, bB - 2 * PAD, GROESSE.klein);
        var h = hoehe(zeilen, GROESSE.text) + hoehe(zusatz, GROESSE.klein) + 2 * 8;
        var top = breit ? (stapel[spalte] || nachbarTop) : y;
        var g = ebeneFlaechen.append("g").attr("class", "lk-nachbar");
        g.append("rect").attr("class", "lk-nachbar-box")
          .attr("x", x).attr("y", top).attr("width", bB).attr("height", h).attr("rx", 8);
        var ty3 = top + 8;
        ty3 += schreibe(g, zeilen, x + PAD, ty3, GROESSE.text, "lk-nachbar-text");
        if (zusatz.length) schreibe(g, zusatz, x + PAD, ty3, GROESSE.klein, "lk-klein");
        if (breit && idx >= 0 && !stapel[spalte]) {
          // dotted link to the hinsicht it harms, crossing the boundary
          var sp = spaltenInfo[idx];
          ebeneLinien.append("line").attr("class", "lk-schadet")
            .attr("x1", x + bB / 2).attr("y1", top).attr("x2", x + bB / 2).attr("y2", sp.top + sp.inhaltH);
        }
        if (breit) stapel[spalte] = top + h + 6;
        else y = top + h + 6;
      });
      if (breit) y = d3.max(Object.keys(stapel).map(function (k) { return stapel[k]; }));
    }

    svg.attr("height", Math.ceil(y + 4)).attr("viewBox", "0 0 " + W + " " + Math.ceil(y + 4));
  }

  // ---- redraw on width changes and once the web font is in ----------------
  var letzteBreite = 0;
  var takt = null;
  function vielleichtNeu() {
    var w = Math.floor(flaeche.clientWidth);
    if (w === letzteBreite) return;
    letzteBreite = w;
    zeichne();
  }
  zeichne();
  letzteBreite = Math.floor(flaeche.clientWidth);
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      clearTimeout(takt);
      takt = setTimeout(vielleichtNeu, 80);
    }).observe(flaeche);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { zeichenProPx = null; zeichne(); });
  }
})();
