// Shared data for every card in this folder. Cards with
// `veroeffentlicht: false` (or without the field) get no page; they still
// appear in `collections.atlasMusterAlle` (and, unless begriffsmodell.yaml sets
// entwuerfe_anzeigen: false, in `collections.atlasMusterSichtbar`).
module.exports = {
  layout: "atlas/karte.njk",
  eleventyComputed: {
    title: (data) => data.titel,
    description: (data) => data.kurz,
    permalink: (data) =>
      data.veroeffentlicht === true ? `/atlas/muster/${data.page.fileSlug}/` : false,
  },
};
