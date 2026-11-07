// Atlas: generic switches. Progressive enhancement only — without this script
// every variant stays visible as a plain list.
//
// Markup (see _includes/atlas/schablone.njk):
//   [data-atlas-schalter]            container
//     [data-nur-js][hidden]          shown by this script (incl. the buttons)
//     [data-ohne-js]                 hidden by this script (no-JS fallback)
//     .atlas-schalter                button group
//       button[data-ziel=<key>]      one per variant; aria-pressed marks the start
//     [data-panel=<key>]             any number of elements per key, anywhere in
//                                    the container (e.g. the value at the
//                                    adjusting screw and the verdict)
(function () {
  "use strict";

  function initSchalter(root) {
    var gruppe = root.querySelector(".atlas-schalter");
    var knoepfe = Array.prototype.slice.call(root.querySelectorAll("[data-ziel]"));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
    if (!gruppe || knoepfe.length < 2 || !panels.length) return;

    function zeige(key) {
      knoepfe.forEach(function (k) {
        k.setAttribute("aria-pressed", String(k.getAttribute("data-ziel") === key));
      });
      panels.forEach(function (p) {
        p.hidden = p.getAttribute("data-panel") !== key;
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

    // Switch from the no-JS presentation (grouped by assessment) to the
    // interactive one (values in their fields).
    Array.prototype.forEach.call(root.querySelectorAll("[data-nur-js]"), function (el) {
      el.hidden = false;
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-ohne-js]"), function (el) {
      el.hidden = true;
    });
    gruppe.hidden = false;
    root.classList.add("ist-aktiv");
    zeige(start.getAttribute("data-ziel"));
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-atlas-schalter]"), initSchalter);
})();
