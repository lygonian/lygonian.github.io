/* Dezente Progressive Enhancement.
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

  // 3) Ganze Karte klickbar ------------------------------------------------
  // Führt einen Klick auf die Kartenfläche auf den primären Link der Karte.
  // Echte Links/Buttons behalten ihr eigenes Ziel; Tastaturnutzer folgen wie
  // bisher den sichtbaren Links. Ohne JS bleibt alles normal bedienbar.
  var cards = [].slice.call(document.querySelectorAll(".card, .feature"));
  cards.forEach(function (card) {
    var primary = card.querySelector(".card-cta a[href], a[href]");
    if (!primary) return;
    card.classList.add("is-clickable");
    card.addEventListener("click", function (e) {
      // Klicks auf echte interaktive Elemente nicht abfangen.
      if (e.target.closest("a, button, input, textarea, select, label")) return;
      // Textmarkierung nicht als Klick werten.
      if (window.getSelection && String(window.getSelection())) return;
      var newTab = primary.target === "_blank" || e.metaKey || e.ctrlKey || e.button === 1;
      if (newTab) {
        window.open(primary.href, "_blank", "noopener");
      } else {
        window.location.href = primary.href;
      }
    });
  });
})();
