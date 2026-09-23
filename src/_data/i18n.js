// Small dictionary of the site chrome's text (nav labels, footer, etc.) in
// each language, so base.njk doesn't need locale if/else branches per string.
// Page content itself (Bio text, post/project intros) lives directly in the
// German or English source files instead of here.
module.exports = {
  de: {
    blog: "Blog",
    bio: "Bio",
    sprache: "Sprache",
    polit: "Polit",
    projects: "Projects",
    source: "Quelltext auf GitHub",
    backToBlog: "← Zurück zum Blog",
    backToProjects: "← Zurück zu Projects",
    noPosts: "Noch keine Einträge.",
    noProjects: "Noch nichts veröffentlicht.",
  },
  en: {
    blog: "Blog",
    bio: "Bio",
    sprache: "Language",
    polit: "Politics",
    projects: "Projects",
    source: "Source on GitHub",
    backToBlog: "← Back to Blog",
    backToProjects: "← Back to Projects",
    noPosts: "No posts yet.",
    noProjects: "Nothing published yet.",
  },
};
