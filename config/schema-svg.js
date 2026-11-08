// Static SVG of the conceptual model, built from begriffsmodell.yaml →
// beziehungen (no JS needed). The audience (Publikum) is drawn as a frame
// around the assessment, not as a box at the end of an arrow.
//
// Layout rules, so nothing overlaps:
// - fixed positions for the known classes (layout is code); labels and box
//   properties come from beschriftungen.yaml → anhang
// - edges are orthogonal: straight if the boxes line up, otherwise one bend
//   (first horizontal, then vertical)
// - edge labels sit above a horizontal segment or to the right of a vertical
//   one, never on the line; for edges leaving the framed assessment the
//   label is centred on the part outside the frame
// - the frame's own label sits at its bottom edge, where no edge arrives
// Classes the layout doesn't know yet go into an extra row at the bottom, so
// a new relation still shows up without a code change (it may need a layout
// position here to look tidy).

const esc = (s) =>
  String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const W = 940;
const BOX_W = 210;
const BOX_H = 40;
const PROP_H = 15;
const RAHMEN = "Publikum";
const MITTE = "Einschaetzung";
const RAHMEN_SEITE = 40;   // frame padding left/right of the assessment box
const RAHMEN_OBEN = 18;    // … above
const RAHMEN_UNTEN = 50;   // … below (room for the frame's two label lines)
const LABEL_ABSTAND = 8;   // gap between a line and its label

const POSITION = {
  Vergleichsfall: [470, 56],
  Inhalt: [115, 260],
  Einschaetzung: [470, 260],
  Hinsicht: [825, 260],
  Muster: [115, 450],
  SprachlichesMittel: [115, 600],
};

function boxHoehe(eigenschaften) {
  return BOX_H + (eigenschaften ? eigenschaften.length * PROP_H : 0);
}

const links = (b) => b.x - b.w / 2;
const rechts = (b) => b.x + b.w / 2;
const oben = (b) => b.y - b.h / 2;
const unten = (b) => b.y + b.h / 2;

// Orthogonal route from box a to box b, plus where its label goes.
// `rahmen` (if a is the framed assessment) narrows the label segment to the
// part outside the frame.
function route(a, b, rahmen) {
  const ausRahmen = rahmen && a.k === MITTE;
  if (Math.abs(a.y - b.y) < 1) {
    // horizontal
    const nachRechts = b.x > a.x;
    const x1 = nachRechts ? rechts(a) : links(a);
    const x2 = nachRechts ? links(b) : rechts(b);
    const lx1 = ausRahmen ? (nachRechts ? rahmen.x + rahmen.w : rahmen.x) : x1;
    return {
      punkte: [[x1, a.y], [x2, b.y]],
      label: { x: (lx1 + x2) / 2, y: a.y - LABEL_ABSTAND, anker: "middle" },
    };
  }
  if (Math.abs(a.x - b.x) < 1) {
    // vertical
    const nachUnten = b.y > a.y;
    const y1 = nachUnten ? unten(a) : oben(a);
    const y2 = nachUnten ? oben(b) : unten(b);
    const ly1 = ausRahmen ? (nachUnten ? rahmen.y + rahmen.h : rahmen.y) : y1;
    return {
      punkte: [[a.x, y1], [b.x, y2]],
      label: { x: a.x + LABEL_ABSTAND + 1, y: (ly1 + y2) / 2 + 4, anker: "start" },
    };
  }
  // one bend: horizontal out of a's side, then vertical into b's top/bottom
  const nachRechts = b.x > a.x;
  const nachUnten = b.y > a.y;
  const x1 = nachRechts ? rechts(a) : links(a);
  const y2 = nachUnten ? oben(b) : unten(b);
  const lx1 = ausRahmen ? (nachRechts ? rahmen.x + rahmen.w : rahmen.x) : x1;
  return {
    punkte: [[x1, a.y], [b.x, a.y], [b.x, y2]],
    label: { x: (lx1 + b.x) / 2, y: a.y - LABEL_ABSTAND, anker: "middle" },
  };
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
    if (!p) { p = [115 + (extra % 3) * 355, 760 + Math.floor(extra / 3) * 100]; extra++; }
    boxen[k] = { k, x: p[0], y: p[1], w: BOX_W, h: boxHoehe(eigenschaften[k]) };
  });
  const H = Math.ceil(Math.max(...Object.values(boxen).map((b) => unten(b))) + 30);

  // the frame around the assessment, if a relation points to the frame class
  const rahmenRel = (beziehungen || []).find((r) => r.nach === RAHMEN && boxen[r.von]);
  let rahmen = null;
  if (rahmenRel) {
    const m = boxen[rahmenRel.von];
    rahmen = {
      x: links(m) - RAHMEN_SEITE, y: oben(m) - RAHMEN_OBEN,
      w: m.w + 2 * RAHMEN_SEITE, h: m.h + RAHMEN_OBEN + RAHMEN_UNTEN, rel: rahmenRel, unterBox: unten(m),
    };
  }

  const zahl = (n) => Number(n.toFixed(1));
  const teile = [];
  teile.push(
    `<svg class="atlas-schema" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="schema-titel schema-desc" xmlns="http://www.w3.org/2000/svg">`,
    `<title id="schema-titel">${esc(titel || "Schema")}</title>`,
    `<desc id="schema-desc">${esc((beziehungen || []).map((r) => `${name(r.von)} ${r.label} ${name(r.nach)}`).join(". "))}.</desc>`,
    `<defs><marker id="schema-pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="sc-pfeil"/></marker></defs>`
  );

  // frame (below the edges), its label at the bottom edge
  if (rahmen) {
    const mx = rahmen.x + rahmen.w / 2;
    teile.push(
      `<g class="sc-rahmen"><rect x="${zahl(rahmen.x)}" y="${zahl(rahmen.y)}" width="${zahl(rahmen.w)}" height="${zahl(rahmen.h)}" rx="16"/>`,
      `<text x="${zahl(mx)}" y="${zahl(rahmen.unterBox + 21)}" text-anchor="middle" class="sc-rahmen-titel">${esc(name(RAHMEN))}</text>`,
      `<text x="${zahl(mx)}" y="${zahl(rahmen.unterBox + 37)}" text-anchor="middle" class="sc-rahmen-text">${esc(rahmen.rel.label)} · ${esc((texte && texte.rahmen) || "")}</text>`,
      `</g>`
    );
  }

  // edges with their labels
  (beziehungen || []).forEach((r) => {
    if (r.nach === RAHMEN || r.von === RAHMEN) return;
    const a = boxen[r.von], b = boxen[r.nach];
    if (!a || !b) return;
    const { punkte, label } = route(a, b, rahmen);
    const d = punkte.map(([x, y], i) => `${i ? "L" : "M"}${zahl(x)},${zahl(y)}`).join(" ");
    teile.push(
      `<path d="${d}" class="sc-kante" marker-end="url(#schema-pfeil)"/>`,
      `<text x="${zahl(label.x)}" y="${zahl(label.y)}" text-anchor="${label.anker}" class="sc-kante-text">${esc(r.label)}</text>`
    );
  });

  // boxes
  Object.values(boxen).forEach((b) => {
    const klasse = "sc-box" + (b.k === MITTE ? " ist-mitte" : "");
    const x = links(b), y = oben(b);
    teile.push(`<g class="${klasse}"><rect x="${zahl(x)}" y="${zahl(y)}" width="${b.w}" height="${b.h}" rx="8"/>`);
    teile.push(`<text x="${b.x}" y="${zahl(y + 25)}" text-anchor="middle" class="sc-box-titel">${esc(name(b.k))}</text>`);
    (eigenschaften[b.k] || []).forEach((e, i) => {
      teile.push(`<text x="${b.x}" y="${zahl(y + BOX_H + i * PROP_H + 3)}" text-anchor="middle" class="sc-box-eigenschaft">${esc(e)}</text>`);
    });
    teile.push(`</g>`);
  });

  teile.push(`</svg>`);
  return teile.join("\n");
};
