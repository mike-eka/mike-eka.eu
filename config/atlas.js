// Eleventy setup for the Atlas (src/atlas/). Registered in eleventy.config.js
// via addPlugin. Holds no content: all texts live in src/_data/atlas/*.yaml
// and src/atlas/muster/*.md.
const yaml = require("js-yaml");

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

  for (const item of items) {
    const { kippt_an: kipp, einschaetzungen, veroeffentlicht } = item.data;
    const datei = item.inputPath;
    if (!istTodo(kipp)) {
      const frage = fragen.find((q) => q.id === kipp);
      if (frage && frage.art === "rahmen") {
        warn(`${datei}: kippt_an "${kipp}" ist Rahmen jeder Einschätzung, keine Stellschraube eines Musters (erlaubt: ${musterFragen.map((q) => q.id).join(", ")})`);
      } else if (!frage || frage.art !== "muster") {
        warn(`${datei}: unbekanntes kippt_an "${kipp}" (erlaubt: ${musterFragen.map((q) => q.id).join(", ")})`);
      } else if (veroeffentlicht === true) {
        (einschaetzungen || []).forEach((e, i) => {
          if (istTodo(e && e[frage.feld])) {
            warn(`${datei}: Einschätzung ${i + 1} ("${e && e.label}") hat kein Feld "${frage.feld}" für die Stellschraube "${kipp}"`);
          }
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
  if (stufen.nachbar && !(bm.nachbarn || []).some((n) => n.id === stufen.nachbar)) {
    warn(`schablone_stufen.nachbar: Nachbar "${stufen.nachbar}" gibt es nicht`);
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
        publikum: b.schablone?.felder?.publikum?.name,
        publikum_verweis: b.schablone?.publikum_verweis,
      },
      pruefragen: (bm.pruefragen || []).map(({ id, art, frage }) => ({ id, art, frage })),
      hinsichten: (bm.hinsichten || []).map((h) => ({
        id: h.id,
        name: h.name,
        leitfrage: h.leitfrage,
        schwerpunkt: h.schwerpunkt !== false,
        rand: h.rand === true,
        muster: (alleMuster || [])
          .filter((item) => item.data.hinsicht === h.id)
          .map((item) => ({
            titel: item.data.titel,
            url: item.data.veroeffentlicht === true ? item.url : null,
          })),
      })),
      nachbarn: (bm.nachbarn || []).map(({ id, name, hinsicht }) => ({ id, name, hinsicht })),
    };
    return JSON.stringify(daten).replace(/</g, "\\u003c");
  });

  // Statuses used in a schablone (for its legend); a field without status is "offen".
  eleventyConfig.addFilter("schablonenStatus", (felder) => [
    ...new Set(Object.values(felder || {}).map((f) => (f && f.status) || "offen")),
  ]);

  // Distinct values of one key across a list, dropping empty ones,
  // e.g. einschaetzungen | eindeutig("wirkung").
  eleventyConfig.addFilter("eindeutig", (liste, key) => [
    ...new Set((liste || []).map((x) => x && x[key]).filter((v) => v != null && v !== "")),
  ]);
};
