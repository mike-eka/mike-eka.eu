// Machine-readable versions of the Atlas, from the same data as the pages:
//   atlasJson   → /atlas/atlas.json   (model + published cards, for reuse/D3)
//   atlasJsonLd → /atlas/atlas.jsonld (vocabulary as SKOS concepts, classes and
//                 properties from `beziehungen`, cards and their assessments)
// Drafts (veroeffentlicht !== true) are never exported.
const fs = require("fs");
const path = require("path");

// Site address from src/CNAME (the one place it is configured).
function seitenUrl() {
  try {
    const cname = fs.readFileSync(path.join(__dirname, "..", "src", "CNAME"), "utf8").trim();
    if (cname) return `https://${cname}`;
  } catch (e) { /* fall through */ }
  return "";
}

const MUSTER_FELDER = [
  "titel", "fachbegriff", "hinsicht", "inhaltsart", "reihenfolge", "kurz", "effekt", "fall", "minimalpaar", "analogie",
  "mittel", "schablone", "kippt_an", "grenzfall_frage", "einschaetzungen",
  "normalfall", "verzerrungen", "literatur", "grafik",
];

const veroeffentlicht = (alle) => (alle || []).filter((i) => i.data.veroeffentlicht === true);

function atlasJson(bm, alle) {
  const basis = seitenUrl();
  const modell = {};
  ["titel", "untertitel", "kernsatz", "inhalt_hinweis", "haltung", "pruefragen", "publikum_abschnitt", "hinsichten",
    "inhaltsarten", "vergleichsfaelle", "wirkungen", "urteile", "offen_gelassen", "beziehungen"]
    .forEach((k) => { if (bm[k] !== undefined) modell[k] = bm[k]; });
  return {
    quelle: basis + "/atlas/",
    stand: new Date().toISOString().slice(0, 10),
    begriffsmodell: modell,
    muster: veroeffentlicht(alle).map((item) => {
      const m = { id: item.page.fileSlug, url: basis + item.url };
      MUSTER_FELDER.forEach((f) => { if (item.data[f] !== undefined && item.data[f] !== null) m[f] = item.data[f]; });
      return m;
    }),
  };
}

// Id of an inhaltsart ("eine Antwort auf eine Frage" -> "antwort-auf-eine-frage").
const inhaltsartId = (art) => String(art)
  .replace(/^(eine?|ein)\s+/i, "")
  .toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// en: atlas.en (en.yaml), for English labels where it has them.
function atlasJsonLd(bm, alle, b, en) {
  const basis = seitenUrl();
  const ns = basis + "/atlas/begriffsmodell#";
  const klassenNamen = (b && b.anhang && b.anhang.klassen) || {};
  const id = (art, x) => `atlas:${art}/${x}`;
  const graph = [];

  // the vocabulary as a whole
  graph.push({
    "@id": basis + "/atlas/atlas.jsonld",
    "@type": "skos:ConceptScheme",
    "dct:title": bm.titel,
    "dct:description": bm.kernsatz,
    "dct:source": { "@id": basis + "/atlas/" },
  });

  // classes and object properties from `beziehungen`
  const klassen = [];
  (bm.beziehungen || []).forEach((r) => [r.von, r.nach].forEach((k) => { if (!klassen.includes(k)) klassen.push(k); }));
  klassen.forEach((k) => graph.push({ "@id": `atlas:${k}`, "@type": "rdfs:Class", "rdfs:label": klassenNamen[k] || k }));
  (bm.beziehungen || []).forEach((r) => graph.push({
    "@id": `atlas:${r.id}`,
    "@type": "rdf:Property",
    "rdfs:label": r.label,
    "rdfs:domain": { "@id": `atlas:${r.von}` },
    "rdfs:range": { "@id": `atlas:${r.nach}` },
  }));
  // properties the assessments carry (verdict, effect, reason, wording)
  [["urteil", "Befund"], ["wirkung", "Wirkung"], ["begruendung", "Begründung"], ["text", "Wortlaut"]]
    .forEach(([p, l]) => graph.push({ "@id": `atlas:${p}`, "@type": "rdf:Property", "rdfs:label": l }));
  // property of a card: its kind of content (a concept of the scheme inhaltsarten)
  graph.push({ "@id": "atlas:inhaltsart", "@type": "rdf:Property", "rdfs:label": "Inhaltsart", "rdfs:domain": { "@id": "atlas:Muster" } });

  // vocabulary lists as SKOS concept schemes; `en` (optional) adds an
  // English prefLabel next to the German one (the context's default language)
  const schema = (name, label, eintraege) => {
    graph.push({ "@id": `atlas:${name}`, "@type": "skos:ConceptScheme", "skos:prefLabel": label });
    eintraege.forEach((e) => graph.push({
      "@id": id(name, e.id),
      "@type": "skos:Concept",
      "skos:inScheme": { "@id": `atlas:${name}` },
      "skos:prefLabel": e.en ? [e.name, { "@value": e.en, "@language": "en" }] : e.name,
      ...(e.definition ? { "skos:definition": e.definition } : {}),
    }));
  };
  schema("pruefragen", "Prüffragen", (bm.pruefragen || []).map((q) => ({ id: q.id, name: q.frage, definition: q.erklaerung })));
  schema("hinsichten", "Hinsichten", (bm.hinsichten || []).map((h) => ({ id: h.id, name: h.name, definition: h.erklaerung })));
  schema("wirkungen", "Wirkungen", (bm.wirkungen || []).map((w) => ({ id: w.id, name: w.name, definition: w.erklaerung })));
  schema("urteile", "Befunde", (bm.urteile || []).map((u) => ({ id: u.id, name: u.name })));
  schema("vergleichsfaelle", "Vergleichsfälle", (bm.vergleichsfaelle || []).map((v) => ({ id: v.id, name: v.name })));
  const inhaltsartenEn = (en && en.inhaltsarten) || {};
  schema("inhaltsarten", "Inhaltsarten", (bm.inhaltsarten || []).map((art) => ({ id: inhaltsartId(art), name: art, en: inhaltsartenEn[art] })));

  const hinsichtNachText = (text) => {
    const h = (bm.hinsichten || []).find((x) => x.name === text || x.id === text);
    return h ? { "@id": id("hinsichten", h.id) } : text;
  };
  const zeilen = (f) => (f && f.text ? [].concat(f.text).filter(Boolean).join(" ") : undefined);

  // published cards and their assessments
  veroeffentlicht(alle).forEach((item) => {
    const d = item.data;
    const url = basis + item.url;
    const muster = {
      "@id": url,
      "@type": ["atlas:Muster", "skos:Concept"],
      "skos:prefLabel": d.titel,
      ...(d.fachbegriff ? { "skos:altLabel": { "@value": d.fachbegriff, "@language": "en" } } : {}),
      ...(d.kurz ? { "skos:definition": d.kurz } : {}),
      "atlas:betrifftVorAllem": { "@id": id("hinsichten", d.hinsicht) },
      // only known arts (the build warns about others)
      ...((bm.inhaltsarten || []).includes(d.inhaltsart) ? { "atlas:inhaltsart": { "@id": id("inhaltsarten", inhaltsartId(d.inhaltsart)) } } : {}),
    };
    if (d.mittel && d.mittel.name) {
      muster["atlas:nutzt"] = { "@id": url + "#mittel", "@type": "atlas:SprachlichesMittel", "rdfs:label": d.mittel.name, ...(d.mittel.erklaerung ? { "skos:definition": d.mittel.erklaerung } : {}) };
    }
    graph.push(muster);

    const kipp = (bm.pruefragen || []).find((q) => q.id === d.kippt_an);
    const kippFeld = kipp && kipp.art === "muster" ? kipp.feld : null;
    (d.einschaetzungen || []).forEach((e, i) => {
      const n = i + 1;
      const inhaltText = kippFeld === "inhalt" ? e.inhalt : zeilen(d.schablone && d.schablone.inhalt);
      const vergleichText = kippFeld === "vergleichsfall" ? e.vergleichsfall : zeilen(d.schablone && d.schablone.vergleichsfall);
      const hinsicht = kippFeld === "hinsicht" ? hinsichtNachText(e.hinsicht) : { "@id": id("hinsichten", d.hinsicht) };
      const knoten = {
        "@id": `${url}#einschaetzung-${n}`,
        "@type": "atlas:Einschaetzung",
        "rdfs:label": e.label,
        "atlas:betrifft": {
          "@id": `${url}#inhalt-${n}`,
          "@type": "atlas:Inhalt",
          ...(inhaltText ? { "atlas:text": inhaltText } : {}),
          "atlas:istBeispielFuer": { "@id": url },
        },
        ...(vergleichText ? { "atlas:verglichenMit": { "@type": "atlas:Vergleichsfall", "atlas:text": vergleichText } } : {}),
        "atlas:inHinsicht": hinsicht,
        ...(e.urteil ? { "atlas:urteil": { "@id": id("urteile", e.urteil) } } : {}),
        ...(() => {
          const ws = [].concat(e.wirkung || []).filter((w) => w !== "keine");
          if (!ws.length) return {};
          const refs = ws.map((w) => ({ "@id": id("wirkungen", w) }));
          return { "atlas:wirkung": refs.length === 1 ? refs[0] : refs };
        })(),
        ...(e.begruendung ? { "atlas:begruendung": e.begruendung } : {}),
      };
      graph.push(knoten);
    });
  });

  return {
    "@context": {
      "@language": "de",
      atlas: ns,
      skos: "http://www.w3.org/2004/02/skos/core#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      dct: "http://purl.org/dc/terms/",
    },
    "@graph": graph,
  };
}

module.exports = { atlasJson, atlasJsonLd, seitenUrl };
