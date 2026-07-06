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

  // 2) Ganze Karte klickbar ------------------------------------------------
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
