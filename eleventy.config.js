module.exports = function (eleventyConfig) {
  // Static assets, copied as-is into the output.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/projects/**/*.{js,png,jpg,jpeg,svg,gif,mp3,wav}");
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

  eleventyConfig.addFilter("dateDisplay", (date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
