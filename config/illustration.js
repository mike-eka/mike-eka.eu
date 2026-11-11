// Illustrations on the cards (grafik.typ: illustration, grafik.motiv: …).
// Plain SVG, built at build time from the card's data (no text in here).
// Each illustration comes in two layouts — "quer" (wide screens, print) and
// "hoch" (narrow screens) — and shows the revealed state by default, so the
// page without JavaScript and in print shows the trick uncovered.
// Elements of only one state carry the classes
//   il-nur-vorher   (only before revealing)
//   il-nur-nachher  (only after revealing)
// illustration.js sets .ist-zu on the figure to show the state before; CSS
// (atlas.css, "Illustrations") does the transitions.
"use strict";

const CW = 0.62;   // advance width per px font size (Sono is monospaced; with margin)
const LH = 1.35;   // line height
const MOTIVE = ["sprechblase", "formel", "massstab", "weiche"];

const r = (n) => Math.round(n * 10) / 10;
const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hoehe = (n, g) => n * g * LH;
const breiteVon = (text, g) => String(text).length * g * CW;

// Wraps text to a width; prefers breaking after an existing hyphen, splits
// a word hard only if it does not fit on a line of its own.
function umbrechen(text, breite, g) {
  const max = Math.max(4, Math.floor(breite / (g * CW)));
  const teile = [];
  String(text || "").split(/\s+/).filter(Boolean).forEach((wort) => {
    const st = wort.split("-");
    st.forEach((t, i) => { const s = i < st.length - 1 ? t + "-" : t; if (s) teile.push({ t: s, leim: i > 0 }); });
  });
  const zeilen = [];
  let z = "";
  teile.forEach(({ t, leim }) => {
    const tr = leim ? "" : " ";
    if (z && (z + tr + t).length <= max) { z += tr + t; return; }
    if (z) zeilen.push(z);
    z = "";
    while (t.length > max) { zeilen.push(t.slice(0, max - 1) + "-"); t = t.slice(max - 1); }
    z = t;
  });
  if (z) zeilen.push(z);
  return zeilen;
}

// Text block, top at y; anchor start | middle | end.
function text(zeilen, x, y, g, klasse, anker = "start", extra = "") {
  const ts = zeilen.map((z, i) =>
    `<tspan x="${r(x)}" y="${r(y + g * 0.95 + i * g * LH)}">${esc(z)}</tspan>`).join("");
  return `<text class="${klasse}" font-size="${g}" text-anchor="${anker}"${extra}>${ts}</text>`;
}

function svg(W, H, layout, inhalt) {
  // never wider than 1.15 × its own size, so text does not grow too large
  return `<svg class="il-svg il-${layout}" viewBox="0 0 ${W} ${r(H)}" width="${W}" height="${r(H)}" ` +
    `style="max-width:${Math.round(W * 1.15)}px" aria-hidden="true" focusable="false">${inhalt}</svg>`;
}

// ---- Sprechblase: speech bubble; revealed it is a thought bubble --------
// (tail → three shrinking circles, outline → slightly cloudy)
function wolke(x, y, w, h, schritt) {
  // scalloped outline along the rectangle, bulging outwards (sweep 1, clockwise)
  const pkt = [];
  const seite = (x1, y1, x2, y2) => {
    const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / schritt));
    for (let i = 0; i < n; i++) pkt.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n]);
  };
  seite(x, y, x + w, y); seite(x + w, y, x + w, y + h); seite(x + w, y + h, x, y + h); seite(x, y + h, x, y);
  let d = `M${r(pkt[0][0])},${r(pkt[0][1])}`;
  pkt.forEach((p, i) => {
    const q = pkt[(i + 1) % pkt.length];
    const rad = Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.8;
    d += ` A${r(rad)},${r(rad)} 0 0 1 ${r(q[0])},${r(q[1])}`;
  });
  return d + "Z";
}

function sprechblase(g, W) {
  const quer = W >= 500;
  const gr = quer ? 18 : 15;
  const bw = quer ? 440 : 250;
  const pad = quer ? 22 : 16;
  const zeilen = umbrechen(g.text, bw - 2 * pad, gr);
  const th = hoehe(zeilen.length, gr);
  const bh = th + 2 * pad;
  const x0 = (W - bw) / 2, y0 = 14;
  const unten = y0 + bh;
  const zx = x0 + (quer ? 70 : 50); // where the tail / the circles start
  let s = "";
  // outlines: rounded box (before), cloud (after); both filled
  s += `<path class="il-blase il-nur-nachher" d="${wolke(x0, y0, bw, bh, quer ? 34 : 30)}"/>`;
  s += `<rect class="il-blase il-nur-vorher" x="${r(x0)}" y="${r(y0)}" width="${bw}" height="${r(bh)}" rx="18"/>`;
  // tail (before): open path, its fill covers the box's lower edge
  s += `<path class="il-blase il-zipfel il-nur-vorher" d="M${r(zx)},${r(unten - 1.5)} L${r(zx - 26)},${r(unten + 40)} L${r(zx + 34)},${r(unten - 1.5)}"/>`;
  // circles (after): shrinking, one after the other
  [[zx - 2, unten + 20, 9], [zx - 18, unten + 40, 6], [zx - 28, unten + 54, 3.5]].forEach(([cx, cy, rr], i) =>
    (s += `<circle class="il-blase il-kreis il-kreis-${i + 1} il-nur-nachher" cx="${r(cx)}" cy="${r(cy)}" r="${rr}"/>`));
  s += text(zeilen, W / 2, y0 + (bh - th) / 2, gr, "il-text il-blasentext", "middle");
  return svg(W, unten + 64, quer ? "quer" : "hoch", s);
}

// ---- Formel: a board with formulas; revealed the faulty lines are marked --
function formel(g, W) {
  const quer = W >= 500;
  const gf = quer ? 14 : 12;          // formulas
  const ga = quer ? 12 : 11;          // remarks
  const rand = quer ? 10 : 6;
  const innen = quer ? 24 : 12;       // board padding
  const fx = rand + innen;
  // wide: the formula column is as wide as the longest formula (at most 420),
  // the remarks get the rest
  const laengste = Math.max(0, ...(g.zeilen || []).map((z) => breiteVon(z.text, gf)));
  const fBreite = quer ? Math.min(420, Math.ceil(laengste) + 4) : W - 2 * (rand + innen);
  const ax = quer ? fx + fBreite + 18 : fx;      // remarks: right column / below
  const aBreite = quer ? W - rand - innen - ax : fBreite;
  let y = rand + innen;
  let s = "", marken = "";
  (g.zeilen || []).forEach((z) => {
    const zeilen = umbrechen(z.text, fBreite, gf);
    const fh = hoehe(zeilen.length, gf);
    s += text(zeilen, fx, y, gf, "il-text il-formeltext", "start", ` style="white-space:pre"`);
    let zeilenH = fh;
    if (z.fehler) {
      // underline every line of the formula, drawn on when revealed
      zeilen.forEach((zeile, i) => {
        const uy = y + gf * 0.95 + i * gf * LH + 4;
        marken += `<path class="il-strich" pathLength="1" d="M${r(fx - 2)},${r(uy)} L${r(fx + breiteVon(zeile, gf) + 2)},${r(uy)}"/>`;
      });
      const az = umbrechen(z.fehler, aBreite, ga);
      const ay = quer ? y : y + fh + 4;
      marken += text(az, ax, ay, ga, "il-text il-anmerkung il-nur-nachher");
      zeilenH = quer ? Math.max(fh, hoehe(az.length, ga)) : fh + 4 + hoehe(az.length, ga);
    }
    y += zeilenH + (quer ? 14 : 12);
  });
  const H = y - (quer ? 14 : 12) + innen + rand;
  const tafel = `<rect class="il-tafel" x="${rand}" y="${rand}" width="${W - 2 * rand}" height="${r(H - 2 * rand)}" rx="10"/>`;
  return svg(W, H, quer ? "quer" : "hoch", tafel + s + marken);
}

// ---- Massstab: two equal things, a ruler on one; revealed on both --------
function blase(text_, cx, unten, breite, gr, tipX, tipY) {
  const pad = gr * 0.75;
  const zeilen = umbrechen(text_, breite - 2 * pad, gr);
  const th = hoehe(zeilen.length, gr);
  const bh = th + 2 * pad;
  const x0 = cx - breite / 2, y0 = unten - bh;
  let s = `<rect class="il-blase" x="${r(x0)}" y="${r(y0)}" width="${r(breite)}" height="${r(bh)}" rx="12"/>`;
  s += `<path class="il-blase il-zipfel" d="M${r(cx - 9)},${r(unten - 1.5)} L${r(tipX)},${r(tipY)} L${r(cx + 9)},${r(unten - 1.5)}"/>`;
  s += text(zeilen, cx, y0 + pad, gr, "il-text", "middle");
  return { s, bh };
}

function lineal(x, oben, unten, breite, klasse) {
  let s = `<g class="${klasse}"><rect class="il-lineal" x="${r(x)}" y="${r(oben)}" width="${breite}" height="${r(unten - oben)}" rx="2"/>`;
  for (let yy = unten - 10, i = 1; yy > oben + 4; yy -= 10, i++) {
    const l = i % 5 === 0 ? breite * 0.7 : breite * 0.4;
    s += `<line class="il-lineal-strich" x1="${r(x)}" y1="${r(yy)}" x2="${r(x + l)}" y2="${r(yy)}"/>`;
  }
  return s + `</g>`;
}

function massstab(g, W) {
  const quer = W >= 500;
  const L = g.links || {}, R = g.rechts || {};
  const ow = quer ? 140 : 80;                       // object width
  const cxL = quer ? 200 : 95, cxR = quer ? 440 : 205;
  const lw = quer ? 14 : 10;                        // ruler width
  const grGross = quer ? 16 : 12, grKlein = quer ? 12 : 10;
  const bwGross = quer ? 250 : 116, bwKlein = quer ? 130 : 98;
  const go = quer ? 16 : 12;                        // object label size
  // bubbles: their lower edges on one line
  const zipfel = 22;
  const groesse = (o) => (o.blase_gross ? [bwGross, grGross] : [bwKlein, grKlein]);
  const [bwL, grL] = groesse(L), [bwR, grR] = groesse(R);
  const hL = hoehe(umbrechen(L.blase, bwL - 1.5 * grL, grL).length, grL) + 1.5 * grL;
  const hR = hoehe(umbrechen(R.blase, bwR - 1.5 * grR, grR).length, grR) + 1.5 * grR;
  const blasenUnten = 10 + Math.max(hL, hR);
  const marke = blasenUnten + zipfel + 14;
  const boden = marke + (quer ? 130 : 110);
  let s = "";
  const bl = blase(L.blase, cxL, blasenUnten, bwL, grL, cxL - 6, marke - 10);
  const br = blase(R.blase, cxR, blasenUnten, bwR, grR, cxR + 6, marke - 10);
  s += bl.s + br.s;
  // objects (same size), labels inside
  [[cxL, L.gegenstand], [cxR, R.gegenstand]].forEach(([cx, name]) => {
    s += `<rect class="il-gegenstand" x="${r(cx - ow / 2)}" y="${r(marke)}" width="${ow}" height="${r(boden - marke)}" rx="4"/>`;
    s += text(umbrechen(name, ow - 12, go), cx, (marke + boden) / 2 - go * 0.7, go, "il-text", "middle");
  });
  // ground and mark
  const x1 = quer ? 60 : 16, x2 = W - x1;
  s += `<line class="il-boden" x1="${x1}" y1="${r(boden)}" x2="${x2}" y2="${r(boden)}"/>`;
  s += `<line class="il-marke" x1="${x1}" y1="${r(marke)}" x2="${x2}" y2="${r(marke)}"/>`;
  // rulers: left (always), right (only revealed, grows from the ground)
  const luL = cxL - ow / 2 - lw - (quer ? 12 : 6);
  const luR = cxR + ow / 2 + (quer ? 12 : 6);
  if (L.lineal !== false) s += lineal(luL, marke, boden, lw, "il-lineal-gruppe");
  s += lineal(luR, marke, boden, lw, `il-lineal-gruppe il-wachsen${R.lineal ? "" : " il-nur-nachher"}`);
  // legend for the mark below the ground
  const gm = quer ? 12 : 11;
  const ly = boden + 14;
  const mz = umbrechen(g.marke, W - 2 * x1 - 40, gm);
  s += `<line class="il-marke" x1="${x1}" y1="${r(ly + gm * 0.6)}" x2="${x1 + 28}" y2="${r(ly + gm * 0.6)}"/>`;
  s += text(mz, x1 + 36, ly, gm, "il-text il-legende");
  return svg(W, ly + hoehe(mz.length, gm) + 8, quer ? "quer" : "hoch", s);
}

// ---- Weiche: a question on a track; the switch sends it elsewhere -------
function zielBox(zeilen, x, y, w, h, gr, klasse) {
  return `<rect class="il-ziel ${klasse}" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="8"/>` +
    text(zeilen, x + w / 2, y + (h - hoehe(zeilen.length, gr)) / 2, gr, "il-text", "middle");
}

function zug(x, y, winkel, klasse) {
  return `<g class="il-zug ${klasse}" transform="translate(${r(x)},${r(y)}) rotate(${r(winkel)})">` +
    `<rect class="il-zug-wagen" x="-13" y="-8" width="26" height="12" rx="3"/>` +
    `<circle class="il-zug-rad" cx="-7" cy="5" r="2.6"/><circle class="il-zug-rad" cx="7" cy="5" r="2.6"/></g>`;
}

// Paths of the weiche as segments: ["L", to] or ["C", c1, c2, to], from a start point.
function pfadD(start, segmente) {
  return `M${r(start[0])},${r(start[1])}` + segmente.map((sg) => sg[0] === "L"
    ? ` L${r(sg[1][0])},${r(sg[1][1])}`
    : ` C${r(sg[1][0])},${r(sg[1][1])} ${r(sg[2][0])},${r(sg[2][1])} ${r(sg[3][0])},${r(sg[3][1])}`).join("");
}
// Points along a path (lines and cubic curves), for the resting train.
function pfadPunkte(start, segmente) {
  const pkt = [start];
  let p0 = start;
  segmente.forEach((sg) => {
    if (sg[0] === "L") { pkt.push(sg[1]); p0 = sg[1]; return; }
    const [, c1, c2, p1] = sg;
    for (let i = 1; i <= 60; i++) {
      const u = i / 60, v = 1 - u;
      pkt.push([0, 1].map((k) => v * v * v * p0[k] + 3 * v * v * u * c1[k] + 3 * v * u * u * c2[k] + u * u * u * p1[k]));
    }
    p0 = p1;
  });
  return pkt;
}
// Position and angle at a distance before the end of a path.
function vorEnde(pkt, abstand) {
  let rest = abstand;
  for (let i = pkt.length - 1; i > 0; i--) {
    const a = pkt[i - 1], b = pkt[i], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len >= rest) {
      const t = (len - rest) / len;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
    }
    rest -= len;
  }
  return [pkt[0][0], pkt[0][1], 0];
}

// The direct answer lies straight ahead of the question (wide: to the right,
// narrow: below) and is reached by a straight, solid line. The diverting
// answer sits off to the side and is reached by a dashed S-bend that first
// heads towards the direct answer and then turns away - a detour.
function weiche(g, W) {
  const quer = W >= 500;
  const gr = quer ? 13 : 12;
  let s = "", start, sw, astZu, astAuf, zungeZu, zungeAuf, ende;
  if (quer) {
    const sb = 190, sz = umbrechen(g.start, sb - 20, gr);
    const sh = hoehe(sz.length, gr) + 20;
    const eb = 200, ex = W - 10 - eb;                         // direct answer, straight ahead
    const ub = 180;                                           // diverting answer, above and offset
    const ez = umbrechen(g.ziel_eigentlich, eb - 20, gr), uz = umbrechen(g.ziel_umgeleitet, ub - 20, gr);
    const eh = hoehe(ez.length, gr) + 20, uh = hoehe(uz.length, gr) + 20;
    const yo = 12 + uh / 2;                                   // centre of the diverting answer
    const mitte = Math.max(yo + uh / 2 + 22 + eh / 2, 12 + sh / 2);  // the straight line
    sw = [270, mitte];
    const ux = sw[0] + 110;
    start = [10 + sb, mitte];
    s += `<rect class="il-start" x="10" y="${r(mitte - sh / 2)}" width="${sb}" height="${r(sh)}" rx="8"/>`;
    s += text(sz, 10 + sb / 2, mitte - hoehe(sz.length, gr) / 2, gr, "il-text", "middle");
    s += zielBox(ez, ex, mitte - eh / 2, eb, eh, gr, "il-ziel-auf");
    s += zielBox(uz, ux, yo - uh / 2, ub, uh, gr, "il-ziel-zu");
    astAuf = [["L", [ex, mitte]]];
    astZu = [["C", [sw[0] + 60, mitte - 16], [sw[0] + 40, yo], [ux, yo]]];
    zungeAuf = 0;
    zungeZu = -24;
    ende = Math.max(mitte + eh / 2, mitte + sh / 2) + 12;
  } else {
    const sz = umbrechen(g.start, W - 40, gr);
    const sh = hoehe(sz.length, gr) + 20;
    s += `<rect class="il-start" x="10" y="10" width="${W - 20}" height="${r(sh)}" rx="8"/>`;
    s += text(sz, W / 2, 20, gr, "il-text", "middle");
    const cx = W / 2;
    const eb = 180, ub = W - 10 - (cx + 22);                  // diverting answer: right of the line
    const ez = umbrechen(g.ziel_eigentlich, eb - 16, gr), uz = umbrechen(g.ziel_umgeleitet, ub - 16, gr);
    const eh = hoehe(ez.length, gr) + 20, uh = hoehe(uz.length, gr) + 20;
    sw = [cx, 10 + sh + 26];
    const ux = cx + 22, uy = sw[1] + 78;                      // top of the diverting answer
    const ey = uy + uh + 26;                                  // top of the direct answer
    start = [cx, 10 + sh];
    s += zielBox(uz, ux, uy, ub, uh, gr, "il-ziel-zu");
    s += zielBox(ez, cx - eb / 2, ey, eb, eh, gr, "il-ziel-auf");
    astAuf = [["L", [cx, ey]]];
    const um = ux + ub / 2;
    astZu = [["C", [cx + 14, sw[1] + 40], [um, uy - 44], [um, uy]]];
    zungeAuf = 90;
    zungeZu = 62;
    ende = ey + eh + 10;
  }
  const haupt = pfadD(start, [["L", sw]]);
  // the main part and the direct branch on sleepers; the detour without, so
  // its dashes stay clear even small and in print
  const gleis = (pd, klasse) =>
    `<path class="il-schwellen ${klasse}" d="${pd}"/><path class="il-schiene ${klasse}" d="${pd}"/>`;
  s = gleis(haupt, "") + gleis(pfadD(sw, astAuf), "il-ast-auf") +
    `<path class="il-schiene il-ast-zu" d="${pfadD(sw, astZu)}"/>` + s;
  // full paths for the ride of the train (invisible)
  const segZu = [["L", sw], ...astZu], segAuf = [["L", sw], ...astAuf];
  s += `<path class="il-pfad" data-pfad="zu" d="${pfadD(start, segZu)}"/><path class="il-pfad" data-pfad="auf" d="${pfadD(start, segAuf)}"/>`;
  // switch blade, turning around the switch point
  s += `<line class="il-zunge" x1="${r(sw[0])}" y1="${r(sw[1])}" x2="${r(sw[0] + 30)}" y2="${r(sw[1])}" ` +
    `style="transform-origin:${r(sw[0])}px ${r(sw[1])}px;--zu:${r(zungeZu)}deg;--auf:${r(zungeAuf)}deg"/>`;
  s += `<circle class="il-weiche-punkt" cx="${r(sw[0])}" cy="${r(sw[1])}" r="3.5"/>`;
  // trains at rest: just before each target (shown by state)
  const hz = vorEnde(pfadPunkte(start, segZu), 20), ha = vorEnde(pfadPunkte(start, segAuf), 20);
  s += zug(hz[0], hz[1], hz[2], "il-zug-halt il-nur-vorher");
  s += zug(ha[0], ha[1], ha[2], "il-zug-halt il-nur-nachher");
  s += zug(start[0], start[1], 0, "il-zug-fahrt");
  return svg(W, ende, quer ? "quer" : "hoch", s);
}

const ZEICHNER = { sprechblase, formel, massstab, weiche };

// Figure with both layouts, the text alternative and both captions.
// texte: atlas.beschriftungen.grafik (labels for the two states).
function illustration(g, texte) {
  if (!g || !ZEICHNER[g.motiv]) return "";
  const t = texte || {};
  const zeichne = ZEICHNER[g.motiv];
  const alt = (zustand) => [g.titel, zustand].filter(Boolean).join(": ");
  return `<figure class="atlas-illustration il-motiv-${esc(g.motiv)}" data-illustration>` +
    `<div class="il-bild" role="img" aria-label="${esc(alt(g.nachher))}" data-illustration-bild ` +
    `data-alt-vorher="${esc(alt(g.vorher))}" data-alt-nachher="${esc(alt(g.nachher))}">` +
    zeichne(g, 640) + zeichne(g, 300) + `</div>` +
    `<figcaption class="il-unterschriften" aria-live="polite">` +
    `<p class="il-unterschrift il-unterschrift-vorher"><span class="il-zustand">${esc(t.zustand_vorher)}:</span> ${esc(g.vorher)}</p>` +
    `<p class="il-unterschrift il-unterschrift-nachher"><span class="il-zustand">${esc(t.zustand_nachher)}:</span> ${esc(g.nachher)}</p>` +
    `</figcaption></figure>`;
}

// Fields each motif needs (for the build warnings).
const PFLICHT = {
  sprechblase: ["text"],
  formel: ["zeilen"],
  massstab: ["links", "rechts", "marke"],
  weiche: ["start", "ziel_umgeleitet", "ziel_eigentlich"],
};

module.exports = { illustration, MOTIVE, PFLICHT };
