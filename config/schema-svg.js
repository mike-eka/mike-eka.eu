// Static SVG of the conceptual model, built from begriffsmodell.yaml →
// beziehungen (no JS needed). The audience (Publikum) is drawn as a frame
// around the assessment, not as a box at the end of an arrow.
//
// Positions of the known classes are fixed here (layout is code); labels and
// box properties come from beschriftungen.yaml → anhang. Classes the layout
// doesn't know yet are placed in an extra row at the bottom, so a new
// relation still shows up without a code change.

const esc = (s) =>
  String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const W = 760;
const BOX_W = 176;
const BOX_H = 40;
const PROP_H = 15;
const RAHMEN = "Publikum";
const MITTE = "Einschaetzung";

const POSITION = {
  Vergleichsfall: [380, 48],
  Inhalt: [112, 220],
  Einschaetzung: [380, 220],
  Hinsicht: [648, 220],
  Muster: [112, 420],
  SprachlichesMittel: [380, 470],
  Nachbar: [648, 420],
};

function boxHoehe(eigenschaften) {
  return BOX_H + (eigenschaften ? eigenschaften.length * PROP_H : 0);
}

// Point where the line from the centre of `a` towards `b` leaves box `a`.
function rand(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (!dx && !dy) return { x: a.x, y: a.y };
  const sx = dx ? (a.w / 2) / Math.abs(dx) : Infinity;
  const sy = dy ? (a.h / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: a.x + dx * s, y: a.y + dy * s };
}

module.exports = function schemaSvg(beziehungen, texte, titel) {
  const klassenNamen = (texte && texte.klassen) || {};
  const eigenschaften = (texte && texte.eigenschaften) || {};
  const name = (k) => klassenNamen[k] || k;

  // classes in order of appearance
  const klassen = [];
  (beziehungen || []).forEach((r) => [r.von, r.nach].forEach((k) => { if (!klassen.includes(k)) klassen.push(k); }));

  // boxes (the frame class gets no box of its own)
  const boxen = {};
  let extra = 0;
  klassen.filter((k) => k !== RAHMEN).forEach((k) => {
    let p = POSITION[k];
    if (!p) { p = [112 + (extra % 3) * 268, 560 + Math.floor(extra / 3) * 90]; extra++; }
    boxen[k] = { k, x: p[0], y: p[1], w: BOX_W, h: boxHoehe(eigenschaften[k]) };
  });
  const H = Math.max(520, ...Object.values(boxen).map((b) => b.y + b.h / 2 + 24));

  // the frame around the assessment, if a relation points to the frame class
  const rahmenRel = (beziehungen || []).find((r) => r.nach === RAHMEN && boxen[r.von]);
  let rahmen = null;
  if (rahmenRel) {
    const m = boxen[rahmenRel.von];
    rahmen = { x: m.x - m.w / 2 - 36, y: m.y - m.h / 2 - 38, w: m.w + 72, h: m.h + 38 + 18, rel: rahmenRel };
  }

  const teile = [];
  teile.push(
    `<svg class="atlas-schema" viewBox="0 0 ${W} ${Math.ceil(H)}" role="img" aria-labelledby="schema-titel schema-desc" xmlns="http://www.w3.org/2000/svg">`,
    `<title id="schema-titel">${esc(titel || "Schema")}</title>`,
    `<desc id="schema-desc">${esc((beziehungen || []).map((r) => `${name(r.von)} ${r.label} ${name(r.nach)}`).join(". "))}.</desc>`,
    `<defs><marker id="schema-pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="sc-pfeil"/></marker></defs>`
  );

  // frame first (below the edges)
  if (rahmen) {
    teile.push(
      `<g class="sc-rahmen"><rect x="${rahmen.x}" y="${rahmen.y}" width="${rahmen.w}" height="${rahmen.h}" rx="16"/>`,
      `</g>`
    );
  }

  // edges
  (beziehungen || []).forEach((r) => {
    if (r.nach === RAHMEN || r.von === RAHMEN) return;
    const a = boxen[r.von], b = boxen[r.nach];
    if (!a || !b) return;
    const p1 = rand(a, b), p2 = rand(b, a);
    const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy) || 1;
    let lx, ly, anker = "middle";
    if (Math.abs(dx) < 1) { lx = mx + 8; ly = my + 4; anker = "start"; }
    else {
      // offset perpendicular, upwards; on a slanted edge the text runs away from the line
      let nx = -dy / len, ny = dx / len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      lx = mx + nx * 8; ly = my + ny * 8 + 4;
      if (Math.abs(dy) > 1) anker = nx < 0 ? "end" : "start";
    }
    const klasse = "sc-kante" + (r.von === "Nachbar" ? " ist-nachbar" : "");
    teile.push(
      `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="${klasse}" marker-end="url(#schema-pfeil)"/>`,
      `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anker}" class="sc-kante-text">${esc(r.label)}</text>`
    );
  });

  // frame labels above the edges
  if (rahmen) {
    teile.push(
      `<text x="${rahmen.x + rahmen.w / 2}" y="${rahmen.y + 15}" text-anchor="middle" class="sc-rahmen-titel sc-halo-rahmen">${esc(name(RAHMEN))}</text>`,
      `<text x="${rahmen.x + rahmen.w / 2}" y="${rahmen.y + 29}" text-anchor="middle" class="sc-rahmen-text sc-halo-rahmen">${esc(rahmen.rel.label)} · ${esc((texte && texte.rahmen) || "")}</text>`
    );
  }

  // boxes
  Object.values(boxen).forEach((b) => {
    const klasse = "sc-box" + (b.k === MITTE ? " ist-mitte" : "") + (b.k === "Nachbar" ? " ist-nachbar" : "");
    const x = b.x - b.w / 2, y = b.y - b.h / 2;
    teile.push(`<g class="${klasse}"><rect x="${x}" y="${y}" width="${b.w}" height="${b.h}" rx="8"/>`);
    teile.push(`<text x="${b.x}" y="${y + 25}" text-anchor="middle" class="sc-box-titel">${esc(name(b.k))}</text>`);
    (eigenschaften[b.k] || []).forEach((e, i) => {
      teile.push(`<text x="${b.x}" y="${y + BOX_H + i * PROP_H + 3}" text-anchor="middle" class="sc-box-eigenschaft">${esc(e)}</text>`);
    });
    teile.push(`</g>`);
  });

  teile.push(`</svg>`);
  return teile.join("\n");
};
