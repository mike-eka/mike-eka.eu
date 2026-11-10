// Eleventy setup for the Atlas (src/atlas/). Registered in eleventy.config.js
// via addPlugin. Holds no content: all texts live in src/_data/atlas/*.yaml
// and src/atlas/muster/*.md.
const yaml = require("js-yaml");
const netzLogik = require("../src/js/atlas/netz-logik.js");
const schemaSvg = require("./schema-svg.js");
const atlasExport = require("./export.js");

const GRAFIK_TYPEN = ["netz", "balken", "illustration"];
const { illustration, MOTIVE, PFLICHT } = require("./illustration");

// Fixed series of a bar graphic: reihe_a { feld, label }; an older plain
// label means the field "berichterstattung".
const reiheA = (g) => {
  const ra = g && g.reihe_a;
  if (ra && typeof ra === "object") return { feld: ra.feld || "berichterstattung", label: ra.label || "" };
  return { feld: "berichterstattung", label: ra || "" };
};

// States of a network graphic coupled to the assessments: one per assessment
// (key = its position, as in the template switch), with its grafik_zustand.
function netzZustaende(grafik, einschaetzungen) {
  const key = grafik && grafik.zustand_aus_einschaetzung;
  return (einschaetzungen || []).map((e, i) => ({
    key: String(i + 1),
    label: e.label,
    werte: key && e.grafik_zustand ? { [key]: e.grafik_zustand[key] } : {},
  }));
}

// Without [[…]] marks, for comparing list entries.
const ohneMarken = (s) => String(s).replace(/\[\[|\]\]/g, "").trim();

const MUSTER_GLOB = "./src/atlas/muster/*.md";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Sort cards by the order of `hinsichten` in begriffsmodell.yaml, then by
// `reihenfolge`, then by title. Unknown hinsicht ids sort last (with a warning).
function sortiereMuster(items) {
  const warned = new Set();
  const rang = (item) => {
    const ids = (item.data.atlas?.begriffsmodell?.hinsichten || []).map((h) => h.id);
    const i = ids.indexOf(item.data.hinsicht);
    if (i === -1 && !warned.has(item.inputPath)) {
      warned.add(item.inputPath);
      console.warn(
        `[atlas] ${item.inputPath}: unbekannte hinsicht "${item.data.hinsicht}" (erlaubt: ${ids.join(", ")})`
      );
    }
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return items.sort(
    (a, b) =>
      rang(a) - rang(b) ||
      (a.data.reihenfolge ?? Number.MAX_SAFE_INTEGER) - (b.data.reihenfolge ?? Number.MAX_SAFE_INTEGER) ||
      String(a.data.titel).localeCompare(String(b.data.titel), "de")
  );
}

const istTodo = (v) => v == null || v === "" || String(v).trim().toUpperCase().startsWith("TODO");

// Content checks, printed as build warnings (the build does not fail).
function pruefeAtlas(items) {
  const bm = items[0]?.data.atlas?.begriffsmodell;
  if (!bm) return;
  const fragen = bm.pruefragen || [];
  const musterFragen = fragen.filter((q) => q.art === "muster");
  const warn = (msg) => console.warn(`[atlas] ${msg}`);

  const wirkungsIds = (bm.wirkungen || []).map((w) => w.id);
  const hinsichtIds = (bm.hinsichten || []).map((h) => h.id);
  for (const item of items) {
    const { kippt_an: kipp, einschaetzungen, veroeffentlicht, effekt, verzerrungen } = item.data;
    const datei = item.inputPath;

    // Values the template itself sets in quotation marks (<q>) must not bring
    // their own: einschaetzungen[].inhalt, minimalpaar.muster / gegenform (as
    // single sentences), minimalpaar.frage (without frage_label), analogie.aussage.
    {
      const { minimalpaar: mp, analogie } = item.data;
      const zitiert = [];
      (einschaetzungen || []).forEach((e, i) => e && zitiert.push([`einschaetzungen ${i + 1} (inhalt)`, e.inhalt]));
      if (mp) {
        if (!Array.isArray(mp.muster) && !Array.isArray(mp.gegenform)) {
          zitiert.push(["minimalpaar.muster", mp.muster], ["minimalpaar.gegenform", mp.gegenform]);
        }
        if (!mp.frage_label) zitiert.push(["minimalpaar.frage", mp.frage]);
      }
      if (analogie) zitiert.push(["analogie.aussage", analogie.aussage]);
      zitiert.filter(([, v]) => typeof v === "string" && /^\s*[„“]/.test(v)).forEach(([wo]) =>
        warn(`${datei}: ${wo} beginnt mit einem Anführungszeichen; die Seite setzt selbst welche (bitte im Text weglassen)`));
    }

    // verzerrungen: a list of { name, text } (tile "Verzerrungen, die das Muster begünstigen")
    if (!Array.isArray(verzerrungen) || !verzerrungen.length) {
      warn(`${datei}: verzerrungen fehlt (Liste mit name und text)`);
    } else {
      verzerrungen.forEach((v, i) => {
        if (!v || istTodo(v.name) || istTodo(v.text)) warn(`${datei}: verzerrungen ${i + 1} braucht name und text`);
      });
    }

    // effekt.hinsichten: a list of hinsicht ids
    if (effekt && effekt.hinsichten != null) {
      if (!Array.isArray(effekt.hinsichten)) {
        warn(`${datei}: effekt.hinsichten muss eine Liste von Hinsicht-IDs sein, z. B. [vertrauen, achten] (erlaubt: ${hinsichtIds.join(", ")})`);
      } else {
        effekt.hinsichten.filter((id) => !hinsichtIds.includes(id)).forEach((id) =>
          warn(`${datei}: effekt.hinsichten enthält die unbekannte Hinsicht "${id}" (erlaubt: ${hinsichtIds.join(", ")})`));
      }
    }

    // Verdict and effect: "nein" means no effect; effects must be known ids.
    (einschaetzungen || []).forEach((e, i) => {
      if (!e) return;
      const wirkungen = [].concat(e.wirkung == null ? [] : e.wirkung).filter((w) => !istTodo(w));
      const echte = wirkungen.filter((w) => w !== "keine");
      if (e.urteil === "nein" && echte.length) {
        warn(`${datei}: Einschätzung ${i + 1} ("${e.label}") hat urteil: nein, aber wirkung: ${echte.join(", ")} (bei nein gibt es keine Wirkung; erwartet: keine)`);
      }
      echte.filter((w) => !wirkungsIds.includes(w)).forEach((w) =>
        warn(`${datei}: Einschätzung ${i + 1} ("${e.label}") hat unbekannte wirkung "${w}" (erlaubt: ${wirkungsIds.join(", ")}, keine)`));
    });

    if (!istTodo(kipp)) {
      const frage = fragen.find((q) => q.id === kipp);
      if (frage && frage.art === "rahmen") {
        warn(`${datei}: kippt_an "${kipp}" ist Rahmen jeder Einschätzung, keine Frage eines Grenzfalls (erlaubt: ${musterFragen.map((q) => q.id).join(", ")})`);
      } else if (!frage || frage.art !== "muster") {
        warn(`${datei}: unbekanntes kippt_an "${kipp}" (erlaubt: ${musterFragen.map((q) => q.id).join(", ")})`);
      } else if (veroeffentlicht === true) {
        (einschaetzungen || []).forEach((e, i) => {
          if (istTodo(e && e[frage.feld])) {
            warn(`${datei}: Einschätzung ${i + 1} ("${e && e.label}") hat kein Feld "${frage.feld}" für den Grenzfall (kippt_an "${kipp}")`);
          }
        });
      }
    }
  }

  // Graphics: known type; for netz the coupling and every condition.
  for (const item of items) {
    const g = item.data.grafik;
    if (!g) continue;
    const datei = item.inputPath;
    if (!GRAFIK_TYPEN.includes(g.typ)) {
      warn(`${datei}: grafik.typ "${g.typ}" unbekannt (erlaubt: ${GRAFIK_TYPEN.join(", ")})`);
      continue;
    }
    if (g.typ === "netz") {
      const key = g.zustand_aus_einschaetzung;
      const bekannt = new Set(["kennzahl", "kennzahl_2", ...(g.schalter || []).map((s) => s.id), ...(key ? [key] : [])]);
      if (key) {
        (item.data.einschaetzungen || []).forEach((e, i) => {
          if (!e.grafik_zustand || e.grafik_zustand[key] == null) {
            warn(`${datei}: Einschätzung ${i + 1} ("${e.label}") hat kein grafik_zustand.${key}`);
          }
        });
      }
      const pruefe = (bedingung, wo) => {
        const { namen, fehler } = netzLogik.analysiere(bedingung);
        fehler.forEach((t) => warn(`${datei}: ${wo}: Bedingung "${t}" nicht lesbar`));
        namen.filter((n) => !bekannt.has(n)).forEach((n) => warn(`${datei}: ${wo}: unbekannter Name "${n}" in "${bedingung}"`));
      };
      (g.knoten || []).forEach((k) => pruefe(k.nur_wenn, `Knoten ${k.id}`));
      (g.kanten || []).forEach((k, i) => pruefe(k.nur_wenn, `Kante ${i + 1}`));
      (g.urteile || []).forEach((u, i) => pruefe(u.wenn, `Urteil ${i + 1}`));
    }
    if (g.typ === "balken") {
      const masse = (g.masse || []).map((m) => m.id);
      (g.themen || []).forEach((t) => {
        [reiheA(g).feld, ...masse].forEach((m) => {
          if (typeof t[m] !== "number") warn(`${datei}: Thema "${t.name}" hat keinen Zahlenwert für "${m}"`);
        });
      });
    }
    if (g.typ === "illustration") {
      if (!MOTIVE.includes(g.motiv)) {
        warn(`${datei}: grafik.motiv "${g.motiv}" unbekannt (erlaubt: ${MOTIVE.join(", ")})`);
      } else {
        ["titel", "knopf", "vorher", "nachher", ...PFLICHT[g.motiv]].forEach((f) => {
          if (g[f] == null || g[f] === "") warn(`${datei}: grafik (${g.motiv}) braucht das Feld "${f}"`);
        });
      }
    }
  }

  const stufen = bm.schablone_stufen || {};
  if (stufen.muster) {
    const karte = items.find((item) => item.page.fileSlug === stufen.muster);
    if (!karte) warn(`schablone_stufen.muster: Karte "${stufen.muster}" gibt es nicht`);
    else if (!(karte.data.einschaetzungen || []).length) warn(`schablone_stufen.muster: Karte "${stufen.muster}" hat keine einschaetzungen`);
  }
}

module.exports = function atlasPlugin(eleventyConfig) {
  // Global data files in YAML (src/_data/atlas/*.yaml -> `atlas.<name>`).
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // All cards, drafts included (for titles of related cards), and the
  // published ones (`veroeffentlicht: true`), which are the only ones built.
  eleventyConfig.addCollection("atlasMusterAlle", (api) => {
    const items = sortiereMuster(api.getFilteredByGlob(MUSTER_GLOB));
    pruefeAtlas(items);
    return items;
  });
  // What readers may see: published cards, plus drafts ("in Vorbereitung")
  // unless begriffsmodell.yaml sets `entwuerfe_anzeigen: false`.
  eleventyConfig.addCollection("atlasMusterSichtbar", (api) => {
    const items = sortiereMuster(api.getFilteredByGlob(MUSTER_GLOB));
    const zeigen = items[0]?.data.atlas?.begriffsmodell?.entwuerfe_anzeigen !== false;
    return zeigen ? items : items.filter((item) => item.data.veroeffentlicht === true);
  });
  eleventyConfig.addCollection("atlasMuster", (api) =>
    sortiereMuster(api.getFilteredByGlob(MUSTER_GLOB).filter((item) => item.data.veroeffentlicht === true))
  );

  // "Tempo 30 [[macht]] …" -> "Tempo 30 <mark>macht</mark> …". Escapes the
  // rest, so the result can be output with `| safe`.
  eleventyConfig.addFilter("markiere", (text) =>
    text == null ? "" : escapeHtml(text).replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>")
  );

  // First entry of a list whose `id` matches, e.g. hinsichten | nachId("achten").
  eleventyConfig.addFilter("nachId", (liste, id) => (liste || []).find((x) => x && x.id === id));

  // Card from a collection by its file name, e.g. "kaperung".
  eleventyConfig.addFilter("musterNachSlug", (items, slug) =>
    (items || []).find((item) => item.page.fileSlug === slug)
  );

  // Cards of one hinsicht, keeping collection order.
  eleventyConfig.addFilter("musterInHinsicht", (items, hinsichtId) =>
    (items || []).filter((item) => item.data.hinsicht === hinsichtId)
  );

  // Data for the overview map (landkarte.js), from the same sources as the
  // list fallback. Returned as JSON that is safe inside <script>.
  eleventyConfig.addFilter("landkarteDaten", (bm, b, alleMuster) => {
    const daten = {
      texte: {
        ...b.uebersicht,
        publikum_rahmen: b.schablone?.publikum_rahmen,
      },
      pruefragen: (bm.pruefragen || []).map(({ id, art, frage }) => ({ id, art, frage })),
      hinsichten: (bm.hinsichten || []).map((h) => ({
        id: h.id,
        name: h.name,
        erklaerung: h.erklaerung,
        hinweis: h.hinweis,
        schwerpunkt: h.schwerpunkt !== false,
        muster: (alleMuster || [])
          .filter((item) => item.data.hinsicht === h.id)
          .map((item) => ({
            titel: item.data.titel,
            url: item.data.veroeffentlicht === true ? item.url : null,
          })),
      })),
      // value ranges of the assessment's two properties
      urteile: (bm.urteile || []).map((u) => u.name),
      wirkungen: (bm.wirkungen || []).map((w) => w.name),
    };
    // the "in Vorbereitung" label only travels along when a draft is shown
    if (!daten.hinsichten.some((h) => h.muster.some((m) => !m.url))) delete daten.texte.in_vorbereitung;
    return JSON.stringify(daten).replace(/</g, "\\u003c");
  });

  // Step 5: schema SVG (Anhang), JSON / JSON-LD exports, build month (Handout).
  eleventyConfig.addFilter("schemaSvg", (beziehungen, texte, titel, zusatzEigenschaften) =>
    schemaSvg(beziehungen, texte, titel, zusatzEigenschaften));

  // Value ranges of the assessment's two properties, from begriffsmodell.yaml
  // (urteile, wirkungen); labels from beschriftungen.yaml → uebersicht.
  // { urteil: { label, werte }, wirkung: { label, werte, zusatz } }
  eleventyConfig.addFilter("wertebereiche", (bm, b) => {
    const u = (b && b.uebersicht) || {};
    return {
      urteil: { label: u.urteil, werte: (bm.urteile || []).map((x) => x.name).join(" · ") },
      wirkung: { label: u.wirkung, werte: (bm.wirkungen || []).map((x) => x.name).join(" · "), zusatz: u.wirkung_zusatz },
    };
  });

  // Absolute address of a page (site URL from src/CNAME), e.g. for print headers.
  eleventyConfig.addFilter("absoluteUrl", (url) => atlasExport.seitenUrl() + (url || "/"));
  eleventyConfig.addFilter("atlasJson", (bm, alle) => JSON.stringify(atlasExport.atlasJson(bm, alle), null, 2));
  eleventyConfig.addFilter("atlasJsonLd", (bm, alle, b) => JSON.stringify(atlasExport.atlasJsonLd(bm, alle, b), null, 2));
  eleventyConfig.addFilter("monatJahr", () =>
    new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })
  );

  // "Wem wir glauben · Worauf wir achten" -> ["Wem wir glauben", "Worauf wir achten"]
  // effekt.hinsichten (list of hinsicht ids) without the card's main hinsicht,
  // as hinsicht objects; unknown ids are skipped (the build warns about them).
  eleventyConfig.addFilter("weitereHinsichten", (ids, haupt, hinsichten) =>
    [].concat(ids || [])
      .filter((id) => id !== haupt)
      .map((id) => (hinsichten || []).find((h) => h.id === id))
      .filter(Boolean)
  );

  // True if either argument is a list (minimal pair as a selection of items).
  eleventyConfig.addFilter("istListe", (a, b) => Array.isArray(a) || Array.isArray(b));

  // Minimal pair as lists: rows aligned across both versions, comparing
  // entries without [[…]] marks. A row has `muster` and/or `gegenform`:
  // - both equal: an unchanged entry
  // - both different (`getauscht: true`): the entry was replaced at this
  //   position (neither text occurs later in the other list)
  // - one side missing: an entry only one version has
  eleventyConfig.addFilter("paarZeilen", (muster, gegenform) => {
    const a = Array.isArray(muster) ? muster : muster == null ? [] : [muster];
    const b = Array.isArray(gegenform) ? gegenform : gegenform == null ? [] : [gegenform];
    const zeilen = [];
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      const kommtSpaeterInB = i < a.length && b.slice(j).some((x) => ohneMarken(x) === ohneMarken(a[i]));
      const kommtSpaeterInA = j < b.length && a.slice(i).some((x) => ohneMarken(x) === ohneMarken(b[j]));
      if (i < a.length && j < b.length && ohneMarken(a[i]) === ohneMarken(b[j])) {
        zeilen.push({ muster: a[i++], gegenform: b[j++] });
      } else if (i < a.length && j < b.length && !kommtSpaeterInB && !kommtSpaeterInA) {
        zeilen.push({ muster: a[i++], gegenform: b[j++], getauscht: true });
      } else if (i < a.length && !b.slice(j).some((x) => ohneMarken(x) === ohneMarken(a[i]))) {
        zeilen.push({ muster: a[i++], gegenform: null });
      } else {
        zeilen.push({ muster: null, gegenform: b[j++] });
      }
    }
    return zeilen;
  });

  // Data for a graphic (netz.js / balken.js), JSON safe inside <script>.
  // Illustration (grafik.typ: illustration) as finished figure markup.
  eleventyConfig.addFilter("illustration", (grafik, texte) => illustration(grafik, texte));

  // Bar graphics: the fixed series, and whether any topic has absolute values.
  eleventyConfig.addFilter("reiheA", (grafik) => reiheA(grafik));
  eleventyConfig.addFilter("hatAbsolut", (grafik) => ((grafik && grafik.themen) || []).some((t) => t && t.absolut));

  // A number in German notation (1183 -> "1.183").
  eleventyConfig.addFilter("zahl", (n) => (typeof n === "number" ? n.toLocaleString("de-DE") : n));

  eleventyConfig.addFilter("grafikDaten", (grafik, einschaetzungen, texte) => {
    const daten = { grafik, texte: texte || {} };
    if (grafik && grafik.typ === "netz") daten.zustaende = netzZustaende(grafik, einschaetzungen);
    if (grafik && grafik.typ === "balken") daten.reihe_a = reiheA(grafik);
    return JSON.stringify(daten).replace(/</g, "\\u003c");
  });

  // No-JS table for a network graphic: every assessment × every combination
  // of the graphic's own switches, with key figure and verdict.
  eleventyConfig.addFilter("netzTabelle", (grafik, einschaetzungen) => {
    const schalter = (grafik && grafik.schalter) || [];
    const zustaende = netzZustaende(grafik, einschaetzungen);
    const basis = zustaende.length ? zustaende : [{ key: "", label: "", werte: {} }];
    const kombis = [];
    for (let n = 0; n < 1 << schalter.length; n++) {
      kombis.push(Object.fromEntries(schalter.map((s, i) => [s.id, Boolean(n & (1 << i))])));
    }
    const zeilen = [];
    basis.forEach((z) =>
      kombis.forEach((k) => {
        const r = netzLogik.auswerten(grafik, { ...z.werte, ...k });
        zeilen.push({ label: z.label, schalter: k, kennzahl: r.kennzahl, kennzahl_2: r.kennzahl_2, urteil: r.urteil });
      })
    );
    return zeilen;
  });

  // Shift headings in rendered Markdown one level down (h2 -> h3 …), so a
  // card's body text sits under its tile heading.
  eleventyConfig.addFilter("ueberschriftenTiefer", (html) =>
    String(html || "").replace(/<(\/?)h([1-5])(\s|>)/g, (m, slash, n, rest) => `<${slash}h${Number(n) + 1}${rest}`)
  );

  // Fields of one stage of the big template for an assessment: the card's
  // template, with the field of the adjusting screw and the verdict (and the
  // effect, if given) filled in from the assessment ("belegt").
  eleventyConfig.addFilter("einschaetzungsStufe", (schablone, e, kippFeld, bm, keineLabel) => {
    const felder = { ...(schablone || {}) };
    if (!e) return felder;
    if (kippFeld) felder[kippFeld] = { status: "belegt", text: [e[kippFeld]] };
    const u = (bm.urteile || []).find((x) => x.id === e.urteil);
    felder.urteil = { status: "belegt", text: [u ? u.name : e.urteil, e.begruendung].filter(Boolean) };
    if (e.wirkung) {
      // one effect or a list of effects
      const namen = [].concat(e.wirkung).map((id) => {
        const w = (bm.wirkungen || []).find((x) => x.id === id);
        return w ? w.name : id === "keine" ? keineLabel : id;
      });
      felder.wirkung = { status: "belegt", text: [namen.join(" · ")] };
    }
    return felder;
  });

  // Normalise template fields: a bare list or string (as in schablone_leer)
  // becomes { status: <standard>, text: … }.
  eleventyConfig.addFilter("schablonenFelder", (felder, standard = "offen") =>
    Object.fromEntries(
      Object.entries(felder || {}).map(([id, f]) => [
        id,
        Array.isArray(f) || typeof f === "string" ? { status: standard, text: f } : f,
      ])
    )
  );

  // Statuses used in a schablone (for its legend); a field without status is "offen".
  eleventyConfig.addFilter("schablonenStatus", (felder) => [
    ...new Set(Object.values(felder || {}).map((f) => (f && f.status) || "offen")),
  ]);

  // A value as a list ("a" -> ["a"], null -> []), e.g. for wirkung.
  eleventyConfig.addFilter("alsListe", (x) => (x == null || x === "" ? [] : [].concat(x)));
};
