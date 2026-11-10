// Atlas: illustrations (grafik.typ: illustration). The SVG is built at build
// time (config/illustration.js) in its revealed state, which is what the page
// shows without JavaScript and in print. This script shows the state before
// first, and one button uncovers the trick (and covers it again):
//   .ist-zu on the figure      state before (CSS does the transitions)
//   .ist-js on the figure      only the current caption is shown
// The text alternative (aria-label of [data-illustration-bild]) follows the
// state. Motif "weiche": a train rides along the active branch.
// With prefers-reduced-motion everything switches without animation.
(function () {
  "use strict";

  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  Array.prototype.forEach.call(document.querySelectorAll("[data-illustration]"), init);

  function init(figur) {
    var kachel = figur.closest("[data-grafik-kachel]");
    var knopf = kachel && kachel.querySelector("[data-illustration-knopf]");
    var bild = figur.querySelector("[data-illustration-bild]");
    if (!knopf || !bild) return;

    Array.prototype.forEach.call(kachel.querySelectorAll("[data-nur-js]"), function (el) { el.hidden = false; });
    figur.classList.add("ist-js");

    var fahrt = null; // running train animation

    function setze(auf, sofort) {
      knopf.setAttribute("aria-pressed", String(auf));
      if (sofort) figur.classList.add("ohne-uebergang");
      figur.classList.toggle("ist-zu", !auf);
      bild.setAttribute("aria-label", bild.getAttribute(auf ? "data-alt-nachher" : "data-alt-vorher"));
      if (sofort) {
        // let the browser apply the state before transitions come back
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { figur.classList.remove("ohne-uebergang"); });
        });
      }
      if (figur.classList.contains("il-motiv-weiche")) fahre(auf ? "auf" : "zu", sofort);
    }

    // The train rides from the start along the branch "zu" or "auf" to the
    // stop in front of the target (where the resting train of that state is).
    function fahre(ziel, sofort) {
      if (fahrt) { cancelAnimationFrame(fahrt); fahrt = null; }
      figur.classList.remove("ist-faehrt");
      if (sofort || ruhig) return;
      var svg = Array.prototype.filter.call(figur.querySelectorAll("svg"), function (s) {
        return s.getBoundingClientRect().width > 0;
      })[0];
      if (!svg) return;
      var pfad = svg.querySelector('[data-pfad="' + ziel + '"]');
      var zug = svg.querySelector(".il-zug-fahrt");
      if (!pfad || !zug || !pfad.getTotalLength) return;
      var laenge = pfad.getTotalLength() - 20;
      var dauer = 1400, beginn = null;
      figur.classList.add("ist-faehrt");
      function schritt(zeit) {
        if (beginn === null) beginn = zeit;
        var t = Math.min(1, (zeit - beginn) / dauer);
        var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
        var d = e * laenge;
        var p = pfad.getPointAtLength(d), q = pfad.getPointAtLength(Math.min(d + 1, laenge + 20));
        var winkel = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        zug.setAttribute("transform", "translate(" + p.x + "," + p.y + ") rotate(" + winkel + ")");
        if (t < 1) fahrt = requestAnimationFrame(schritt);
        else { fahrt = null; figur.classList.remove("ist-faehrt"); }
      }
      fahrt = requestAnimationFrame(schritt);
    }

    knopf.addEventListener("click", function () {
      setze(knopf.getAttribute("aria-pressed") !== "true", false);
    });

    // start: the state before; the train of the "weiche" first rides to the
    // diverted target (unless motion is reduced)
    setze(false, true);
    if (figur.classList.contains("il-motiv-weiche") && !ruhig) {
      setTimeout(function () { if (knopf.getAttribute("aria-pressed") !== "true") fahre("zu", false); }, 400);
    }
  }
})();
