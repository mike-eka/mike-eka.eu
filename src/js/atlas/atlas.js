// Atlas: generic switches. Progressive enhancement only — without this script
// every panel stays visible as a plain list.
//
// Markup (see _includes/atlas/einschaetzungen.njk):
//   [data-atlas-schalter]          container
//     .atlas-schalter[hidden]      button group, shown by this script
//       button[data-ziel=<id>]     one per panel, aria-pressed marks the start
//     [data-panel]#<id>            the panels
(function () {
  "use strict";

  function initSchalter(root) {
    var gruppe = root.querySelector(".atlas-schalter");
    var knoepfe = Array.prototype.slice.call(root.querySelectorAll("[data-ziel]"));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
    if (!gruppe || knoepfe.length < 2 || panels.length < 2) return;

    function zeige(id) {
      knoepfe.forEach(function (k) {
        k.setAttribute("aria-pressed", String(k.getAttribute("data-ziel") === id));
      });
      panels.forEach(function (p) {
        p.hidden = p.id !== id;
      });
    }

    knoepfe.forEach(function (k, i) {
      k.addEventListener("click", function () {
        zeige(k.getAttribute("data-ziel"));
      });
      // Arrow keys move between buttons in the group.
      k.addEventListener("keydown", function (e) {
        var schritt = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
          : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!schritt) return;
        e.preventDefault();
        var naechster = knoepfe[(i + schritt + knoepfe.length) % knoepfe.length];
        naechster.focus();
        zeige(naechster.getAttribute("data-ziel"));
      });
    });

    var start = knoepfe.filter(function (k) {
      return k.getAttribute("aria-pressed") === "true";
    })[0] || knoepfe[0];

    gruppe.hidden = false;
    root.classList.add("ist-aktiv");
    zeige(start.getAttribute("data-ziel"));
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-atlas-schalter]"), initSchalter);
})();
