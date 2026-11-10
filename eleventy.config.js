const atlasPlugin = require("./config/atlas.js");

module.exports = function (eleventyConfig) {
  // Atlas (src/atlas/): YAML data, collections and filters.
  eleventyConfig.addPlugin(atlasPlugin);

  // Static assets, copied as-is into the output.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/**/projects/**/*.{js,png,jpg,jpeg,svg,gif,mp3,wav}");
  eleventyConfig.addPassthroughCopy("src/embeds");
  // Embeds are standalone files: copy them as they are, but don't also
  // render them as templates (which produced /embeds/<name>/index.html).
  eleventyConfig.ignores.add("src/embeds/**");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // Third-party libraries, self-hosted from node_modules (no CDN requests).
  eleventyConfig.addPassthroughCopy({
    "node_modules/d3/dist/d3.min.js": "js/vendor/d3.min.js",
    "node_modules/p5/lib/p5.min.js": "js/vendor/p5.min.js",
  });

  // Collections, grouped by tag so standing pages (Sprache, Polit) can
  // list just their own posts, and the Blog page can list everything.
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("sprachePosts", (collectionApi) =>
    collectionApi.getFilteredByTag("sprache").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("politPosts", (collectionApi) =>
    collectionApi.getFilteredByTag("polit").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByTag("project").sort((a, b) => a.data.title.localeCompare(b.data.title))
  );

  // Placeholders like "[E-MAIL-ADRESSE]" or "[PRÜFEN: …]" in the legal pages:
  // square brackets starting with capitals (as check:atlas counts them), so
  // ordinary brackets like "mike [at] posteo" are left alone. Text wrapped in
  // {% filter platzhalter %}…{% endfilter %} gets every placeholder highlighted.
  // Every build then warns about (a) pages still marked `platzhalter: true`
  // and (b) every page whose output still contains a highlighted
  // placeholder, with the count -- so nothing reaches main unnoticed.
  // Nunjucks-only, so the result can be marked safe (a {% filter %} block
  // can't be piped through `| safe`).
  eleventyConfig.addNunjucksFilter("platzhalter", function (html) {
    const markiert = String(html).replace(/\[([A-ZÄÖÜ][A-ZÄÖÜ-]*[A-ZÄÖÜ][^\[\]<>]*)\]/g, '<mark class="platzhalter">[$1]</mark>');
    return this.env.getFilter("safe")(markiert);
  });

  const platzhalterMarkiert = new Set();
  const platzhalterGefunden = new Map();
  eleventyConfig.on("eleventy.before", () => {
    platzhalterMarkiert.clear();
    platzhalterGefunden.clear();
  });
  eleventyConfig.addCollection("platzhalterSeiten", (collectionApi) => {
    const items = collectionApi.getAll().filter((item) => item.data.platzhalter === true);
    items.forEach((item) => platzhalterMarkiert.add(item.url));
    return items;
  });
  eleventyConfig.addTransform("platzhalterZaehlen", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      const n = (content.match(/<mark class="platzhalter">/g) || []).length;
      if (n) platzhalterGefunden.set(this.page.url, n);
    }
    return content;
  });
  eleventyConfig.on("eleventy.after", () => {
    const urls = new Set([...platzhalterMarkiert, ...platzhalterGefunden.keys()]);
    if (!urls.size) return;
    const liste = [...urls]
      .sort()
      .map((url) => `${url} (${platzhalterGefunden.get(url) || 0} offen${platzhalterMarkiert.has(url) ? ", platzhalter: true" : ""})`)
      .join(", ");
    console.warn(`[mike-eka] Platzhalter vor dem Merge nach main ersetzen: ${liste}`);
  });

  eleventyConfig.addFilter("dateDisplay", (date, locale) => {
    return new Date(date).toLocaleDateString(locale === "en" ? "en-GB" : "de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Filters a collection down to items in the given locale (used so the
  // German and English versions of Blog/Sprache/Polit/Projects can share
  // one set of collections instead of duplicating them per language).
  eleventyConfig.addFilter("byLocale", (items, locale) =>
    (items || []).filter((item) => (item.data.locale || "de") === locale)
  );

  // Computes the URL of the other-language version of the current page: the
  // same path under /en/ (or without it). If that page doesn't exist (e.g. a
  // post that hasn't been translated yet), it falls back to the other
  // language's start page (/en/ or /), so the toggle never leads nowhere.
  // `alle` is collections.all, used to check which URLs exist.
  // Publications: splits the field `in` ("Hrsg. (eds.), Sammelband (Reihe)")
  // into the editors part, the volume title (set in italics) and a series in
  // brackets at the end (kept upright).
  eleventyConfig.addFilter("inTeile", (text) => {
    const s = String(text || "");
    const m = /^(.*?\(eds?\.\),\s*)(.*)$/.exec(s);
    const vor = m ? m[1] : "";
    const rest = m ? m[2] : s;
    const r = /^(.*\S)\s+(\([^()]*\))$/.exec(rest);
    return r ? { vor, titel: r[1], reihe: r[2] } : { vor, titel: rest, reihe: "" };
  });

  eleventyConfig.addFilter("otherLocaleUrl", (url, locale, alle) => {
    const ziel = locale === "en"
      ? url.replace(/^\/en\//, "/").replace(/^\/en$/, "/")
      : "/en" + url;
    if (!alle) return ziel;
    const gibt = (alle || []).some((item) => item.url === ziel);
    return gibt ? ziel : locale === "en" ? "/" : "/en/";
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
