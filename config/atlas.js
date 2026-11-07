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

module.exports = function atlasPlugin(eleventyConfig) {
  // Global data files in YAML (src/_data/atlas/*.yaml -> `atlas.<name>`).
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // All cards, drafts included (for titles of related cards), and the
  // published ones (`veroeffentlicht: true`), which are the only ones built.
  eleventyConfig.addCollection("atlasMusterAlle", (api) =>
    sortiereMuster(api.getFilteredByGlob(MUSTER_GLOB))
  );
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
