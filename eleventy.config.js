module.exports = function (eleventyConfig) {
  // Static assets, copied as-is into the output.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/**/projects/**/*.{js,png,jpg,jpeg,svg,gif,mp3,wav}");
  eleventyConfig.addPassthroughCopy("src/embeds");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

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

  // Computes the URL of the other-language version of the current page,
  // assuming the same page exists at the same path under /en/ (or without
  // it). If a specific post/project hasn't been translated yet, this will
  // point at a URL that doesn't exist -- that's expected until you add a
  // matching file under src/en/ (or src/) with the same file name.
  eleventyConfig.addFilter("otherLocaleUrl", (url, locale) => {
    if (locale === "en") {
      return url.replace(/^\/en\//, "/").replace(/^\/en$/, "/");
    }
    return "/en" + url;
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
