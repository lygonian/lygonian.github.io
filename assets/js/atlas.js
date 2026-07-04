/* Systematlas — dezente Progressive Enhancement.
   Ohne dieses Skript bleibt die Seite vollständig sichtbar und bedienbar. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal-Zustand nur aktivieren, wenn Bewegung erwünscht ist.
  if (!reduce) root.classList.add("js");

  // 1) Reveal-on-scroll ----------------------------------------------------
  var targets = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if (targets.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("is-in"); });
  }

  // 2) Kategorie-Highlight über die Legende --------------------------------
  var grid = document.querySelector(".feature-grid");
  var legend = document.querySelector(".legend");
  if (grid && legend) {
    var setFocus = function (cat) {
      var items = grid.querySelectorAll(".feature");
      if (!cat) {
        grid.classList.remove("is-focusing");
        items.forEach(function (el) { el.classList.remove("is-match"); });
        return;
      }
      var matches = 0;
      items.forEach(function (el) {
        var m = el.getAttribute("data-cat") === cat;
        if (m) matches++;
        el.classList.toggle("is-match", m);
      });
      // Kategorie ohne Treffer im Grid: kein Dimmen (z. B. nur in „Weitere Projekte").
      grid.classList.toggle("is-focusing", matches > 0);
    };
    legend.querySelectorAll("li").forEach(function (li) {
      var cat = li.getAttribute("data-cat");
      li.addEventListener("mouseenter", function () { setFocus(cat); });
      li.addEventListener("mouseleave", function () { setFocus(null); });
      li.addEventListener("focus", function () { setFocus(cat); }, true);
      li.addEventListener("blur", function () { setFocus(null); }, true);
    });
    legend.addEventListener("mouseleave", function () { setFocus(null); });
  }
})();
