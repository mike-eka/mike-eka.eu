// Site-wide switches, available in every template as `site`.
module.exports = {
  // Self-hosted downloads (at the moment /atlas/atlas.json and
  // /atlas/atlas.jsonld, linked from the tile "Download" in the Anhang).
  // false: the files are not written to _site (their URLs give 404) and no
  // link, heading or mention of them appears on any page. The templates, the
  // export code (config/export.js) and the texts stay in the repo.
  // true: everything as before. See README-atlas.md, "Downloads ein- und
  // ausblenden"; check:atlas checks both states.
  downloads: false,
};
