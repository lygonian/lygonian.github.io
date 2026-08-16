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
  var io = null;

  function settleReveal(target) {
    target.classList.add("is-in");
    if (io) io.unobserve(target);
  }

  // Ein fokussierter Link darf nie in einer noch transparenten Reveal-Fläche
  // liegen. focusin steigt vom echten Link zur Reveal-Fläche auf und schließt den
  // Zustand synchron ab; ohne JavaScript war die Fläche ohnehin immer sichtbar.
  targets.forEach(function (target) {
    target.addEventListener("focusin", function () { settleReveal(target); });
  });

  if (targets.length && !reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          settleReveal(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(settleReveal);
  }

  // 2) Ganze Karte klickbar ------------------------------------------------
  // Führt einen Klick auf die Kartenfläche auf den primären Link der Karte.
  // Echte Links/Buttons behalten ihr eigenes Ziel; Tastaturnutzer folgen wie
  // bisher den sichtbaren Links. Ohne JS bleibt alles normal bedienbar.
  var cards = [].slice.call(document.querySelectorAll(".card, .feature, .project-card"));
  cards.forEach(function (card) {
    var primaryLinks = card.querySelectorAll("a[data-card-primary][href]");
    if (primaryLinks.length !== 1) return;
    var primary = primaryLinks[0];
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

  // 3) Geordneter Weg durch die Startseite ---------------------------------
  // Eine ruhige Ader folgt den benannten Stationen der Landschaft. Verlinkte
  // Einträge docken mit kurzen seitlichen Abzweigen an. Nach jeder Übergabe
  // führt die Ader deren Rubrikfarbe bis zur nächsten Station weiter; ohne
  // JavaScript bleiben Inhalte und Ziele vollständig zugänglich.
  var homeMain = document.querySelector(".home-main");
  var routeLayers = homeMain ? {
    back: homeMain.querySelector(".home-route-laser--back"),
    middle: homeMain.querySelector(".biome-route--middle"),
    front: homeMain.querySelector(".home-route-laser--front")
  } : null;
  var routeStages = homeMain ? [].slice.call(homeMain.querySelectorAll("[data-route-stage]")) : [];
  var routeActions = homeMain ? [].slice.call(homeMain.querySelectorAll("[data-route-activation]")) : [];
  var routeCards = homeMain ? [].slice.call(homeMain.querySelectorAll("[data-route-card]")) : [];

  if (routeLayers && routeLayers.back && routeLayers.middle && routeLayers.front && routeStages.length === 2) {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var routeFrame = 0;
    var layoutConnectors = routeLayers.front.querySelector(".home-layout-connectors");
    var extensionConnections = [
      { from: ".route-intro--domains .route-blob", to: ".route-intro--domains .route-heading-extension", color: "--category-contact" },
      { from: ".domain-pair--automation .route-blob", to: ".domain-pair--automation .route-station-copy", color: "--category-automation" },
      { from: ".domain-pair--analysis .route-blob", to: ".domain-pair--analysis .route-station-copy", color: "--category-analysis" },
      { from: ".route-intro--work .route-blob", to: ".route-intro--work .route-heading-extension", color: "--category-contact" },
      { from: ".project-pair--payment .route-blob", to: ".project-pair--payment .route-station-copy", color: "--category-automation" },
      { from: ".project-pair--forecast .route-blob", to: ".project-pair--forecast .route-station-copy", color: "--category-analysis" },
      { from: ".project-pair--irrigation .route-blob", to: ".project-pair--irrigation .route-station-copy", color: "--category-private" },
      { from: ".profile-branch--research .route-blob", to: ".profile-branch--research .profile-branch-copy", color: "--category-profile" },
      { from: ".profile-branch--private .route-blob", to: ".profile-branch--private .profile-branch-copy", color: "--category-private" },
      { from: ".contact-station-link .route-blob", to: ".contact-extension", color: "--category-contact" }
    ];
    var profileConnections = [
      { from: ".profile-intro .route-blob", to: ".profile-fact--study", color: "--category-profile", rectEnd: true },
      { from: ".profile-intro .route-blob", to: ".profile-fact--certificate", color: "--category-profile", rectEnd: true },
      { from: ".profile-intro .route-blob", to: ".profile-fact--tools", color: "--category-profile", rectEnd: true }
    ];

    if (layoutConnectors) root.classList.add("layout-connectors");

    function createRouteLine(className, pathData, startLength, endLength, totalLength) {
      var segmentLength = Math.max(1, endLength - startLength);
      var line = document.createElementNS(SVG_NS, "path");
      line.setAttribute("class", "home-route-line " + className);
      line.setAttribute("d", pathData);
      line.style.strokeDasharray = segmentLength.toFixed(1) + " " + (totalLength + segmentLength).toFixed(1);
      line.style.strokeDashoffset = (-startLength).toFixed(1);
      return line;
    }

    function addRouteStateSegment(layerName, pathData, startLength, endLength, totalLength, color) {
      if (endLength <= startLength) return;
      var lines = routeLayers[layerName].querySelector(".home-route-lines");
      var group = document.createElementNS(SVG_NS, "g");
      group.setAttribute("class", "home-route-state");
      group.style.setProperty("--route-color", color);
      group.appendChild(createRouteLine("home-route-haze", pathData, startLength, endLength, totalLength));
      group.appendChild(createRouteLine("home-route-core", pathData, startLength, endLength, totalLength));
      lines.appendChild(group);
    }

    function addRouteTransition(pathData, startLength, endLength, totalLength, routeMeasure, fromColor, toColor, index) {
      if (endLength <= startLength || fromColor === toColor) {
        addRouteStateSegment("front", pathData, startLength, endLength, totalLength, toColor);
        return;
      }

      var lines = routeLayers.front.querySelector(".home-route-lines");
      var defs = lines.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS(SVG_NS, "defs");
        lines.appendChild(defs);
      }

      var gradientId = "home-route-transition-" + index;
      var gradient = document.createElementNS(SVG_NS, "linearGradient");
      var start = routeMeasure.getPointAtLength(startLength);
      var end = routeMeasure.getPointAtLength(endLength);
      gradient.setAttribute("id", gradientId);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", start.x.toFixed(1));
      gradient.setAttribute("y1", start.y.toFixed(1));
      gradient.setAttribute("x2", end.x.toFixed(1));
      gradient.setAttribute("y2", end.y.toFixed(1));

      [
        { offset: "0%", color: fromColor },
        { offset: "30%", color: fromColor },
        { offset: "70%", color: toColor },
        { offset: "100%", color: toColor }
      ].forEach(function (definition) {
        var stop = document.createElementNS(SVG_NS, "stop");
        stop.setAttribute("offset", definition.offset);
        stop.setAttribute("stop-color", definition.color);
        gradient.appendChild(stop);
      });
      defs.appendChild(gradient);

      var group = document.createElementNS(SVG_NS, "g");
      group.setAttribute("class", "home-route-state home-route-transition");
      group.style.setProperty("--route-color", toColor);
      var stroke = "url(#" + gradientId + ")";
      var haze = createRouteLine("home-route-haze", pathData, startLength, endLength, totalLength);
      var core = createRouteLine("home-route-core", pathData, startLength, endLength, totalLength);
      haze.style.stroke = stroke;
      core.style.stroke = stroke;
      group.appendChild(haze);
      group.appendChild(core);
      lines.appendChild(group);
    }

    function clearRouteLayers() {
      Object.keys(routeLayers).forEach(function (name) {
        var lines = routeLayers[name].querySelector(".home-route-lines");
        while (lines.firstChild) lines.removeChild(lines.firstChild);
      });
    }

    function localRect(element, mainRect) {
      var rect = element.getBoundingClientRect();
      return {
        left: rect.left - mainRect.left,
        top: rect.top - mainRect.top,
        right: rect.right - mainRect.left,
        bottom: rect.bottom - mainRect.top,
        width: rect.width,
        height: rect.height
      };
    }

    function rectCenter(rect) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function ellipseBoundary(rect, toward) {
      var center = rectCenter(rect);
      var dx = toward.x - center.x;
      var dy = toward.y - center.y;
      var radiusX = Math.max(2, rect.width / 2 - 3);
      var radiusY = Math.max(2, rect.height / 2 - 3);
      var factor = 1 / Math.sqrt((dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY));
      if (!isFinite(factor)) factor = 0;
      return { x: center.x + dx * factor, y: center.y + dy * factor };
    }

    function rectangleBoundary(rect, toward) {
      var center = rectCenter(rect);
      var dx = toward.x - center.x;
      var dy = toward.y - center.y;
      if (!dx && !dy) return center;
      var scaleX = Math.abs(dx) ? rect.width / 2 / Math.abs(dx) : Infinity;
      var scaleY = Math.abs(dy) ? rect.height / 2 / Math.abs(dy) : Infinity;
      var scale = Math.min(scaleX, scaleY);
      return { x: center.x + dx * scale, y: center.y + dy * scale };
    }

    function nearestExtensionEdge(fromRect, toRect) {
      var from = rectCenter(fromRect);
      var to = rectCenter(toRect);
      var dx = from.x - to.x;
      var dy = from.y - to.y;
      if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
      return dy > 0 ? "bottom" : "top";
    }

    function connectorPath(start, end) {
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      if (Math.abs(dx) >= Math.abs(dy)) {
        var bendX = Math.min(80, Math.abs(dx) * 0.38) * (dx < 0 ? -1 : 1);
        return "M " + start.x.toFixed(1) + " " + start.y.toFixed(1) +
          " C " + (start.x + bendX).toFixed(1) + " " + start.y.toFixed(1) + ", " +
          (end.x - bendX).toFixed(1) + " " + end.y.toFixed(1) + ", " +
          end.x.toFixed(1) + " " + end.y.toFixed(1);
      }
      var bendY = Math.min(80, Math.abs(dy) * 0.38) * (dy < 0 ? -1 : 1);
      return "M " + start.x.toFixed(1) + " " + start.y.toFixed(1) +
        " C " + start.x.toFixed(1) + " " + (start.y + bendY).toFixed(1) + ", " +
        end.x.toFixed(1) + " " + (end.y - bendY).toFixed(1) + ", " +
        end.x.toFixed(1) + " " + end.y.toFixed(1);
    }

    function connectionColor(property) {
      var styles = window.getComputedStyle(homeMain);
      return styles.getPropertyValue(property).trim() || styles.getPropertyValue("--art-route-global").trim();
    }

    function appendLayoutConnection(definition, mainRect, profile) {
      var fromElement = homeMain.querySelector(definition.from);
      var toElement = homeMain.querySelector(definition.to);
      if (!fromElement || !toElement || !layoutConnectors) return;
      var fromRect = localRect(fromElement, mainRect);
      var toRect = localRect(toElement, mainRect);
      if (!fromRect.width || !toRect.width) return;
      var fromCenter = rectCenter(fromRect);
      var toCenter = rectCenter(toRect);
      var start = ellipseBoundary(fromRect, toCenter);
      var end = (!profile || definition.rectEnd) ? rectangleBoundary(toRect, fromCenter) : ellipseBoundary(toRect, fromCenter);
      var color = connectionColor(definition.color);
      var path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", "home-layout-connector" + (profile ? " home-layout-connector--profile" : ""));
      path.setAttribute("d", connectorPath(start, end));
      path.style.setProperty("--connector-color", color);
      layoutConnectors.appendChild(path);

      var terminal = document.createElementNS(SVG_NS, "circle");
      terminal.setAttribute("class", "home-layout-connector-terminal");
      terminal.setAttribute("cx", end.x.toFixed(1));
      terminal.setAttribute("cy", end.y.toFixed(1));
      terminal.setAttribute("r", profile ? "1.8" : "2.4");
      terminal.style.setProperty("--connector-color", color);
      layoutConnectors.appendChild(terminal);

      if (toElement.hasAttribute("data-extension-entry")) {
        toElement.setAttribute("data-extension-entry", nearestExtensionEdge(fromRect, toRect));
      }
    }

    function drawLayoutConnectors(mainRect) {
      if (!layoutConnectors) return;
      while (layoutConnectors.firstChild) layoutConnectors.removeChild(layoutConnectors.firstChild);
      extensionConnections.forEach(function (definition) {
        appendLayoutConnection(definition, mainRect, false);
      });
      profileConnections.forEach(function (definition) {
        appendLayoutConnection(definition, mainRect, true);
      });
    }

    function elementCenter(element, mainRect, fallback) {
      if (!element) return fallback;
      var rect = element.getBoundingClientRect();
      return {
        x: rect.left - mainRect.left + rect.width / 2,
        y: rect.top - mainRect.top + rect.height / 2
      };
    }

    function appendRoutePoint(model, point) {
      model.points.push(point);
    }

    function clamp(value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    }

    function buildRouteModel(width, height, mainRect) {
      var definitions = [
        { key: "origin", selector: "[data-route-origin]", guide: true },
        { key: "dna", selector: '[data-route-orbit="dna"]', guide: true },
        { key: "automation", selector: '[data-route-orbit="automation"]' },
        { key: "analysis", selector: '[data-route-orbit="analysis"]' },
        { key: "threshold", selector: '[data-route-orbit="threshold"]', guide: true },
        { key: "work", selector: '[data-route-orbit="work"]', guide: true },
        { key: "work-payment", selector: '[data-route-orbit="work-payment"]', guide: true },
        { key: "work-mid", selector: '[data-route-orbit="work-mid"]', guide: true },
        { key: "work-late", selector: '[data-route-orbit="work-late"]', guide: true },
        { key: "work-exit", selector: '[data-route-orbit="work-exit"]', guide: true },
        { key: "profile", selector: '[data-route-activation="profile"]', guide: true },
        { key: "profile-research", selector: '[data-route-orbit="profile-research"]', guide: true },
        { key: "profile-private", selector: '[data-route-orbit="profile-private"]', guide: true },
        { key: "profile-exit", selector: '[data-route-orbit="profile-exit"]', guide: true },
        { key: "contact", selector: '[data-route-activation="contact"]', guide: true },
        { key: "tail", selector: "[data-route-tail]", guide: true }
      ];
      var model = {
        points: [],
        stationOrder: [],
        stationPoints: {},
        stationRouteLengths: {}
      };

      definitions.forEach(function (definition) {
        var element = homeMain.querySelector(definition.selector);
        if (!element) return;
        var point = elementCenter(element, mainRect, { x: width * 0.5, y: height * 0.5 });
        point.key = definition.key;
        model.stationOrder.push(definition.key);
        model.stationPoints[definition.key] = point;
        if (definition.guide) appendRoutePoint(model, point);
      });

      if (model.points.length < 5) return null;
      appendRoutePoint(model, { x: width * 0.5, y: height + 32 });
      return model;
    }

    function buildLandscapeRoutePath(anchors, width) {
      // Die veröffentlichte Startseite lebt von großen, randnahen Schwüngen.
      // Die redaktionellen Anker sichern nur die Höhe; zwei alternierende
      // Zwischenpunkte pro Etappe stellen die ruhige Spiralweite wieder her.
      var points = [anchors[0]];
      var spread = Math.min(width * 0.34, 380);
      var edge = Math.max(24, width * 0.045);
      var direction = -1;
      var centralGuideKeys = {
        work: true,
        "work-payment": true,
        "work-mid": true,
        "work-late": true,
        "work-exit": true,
        profile: true,
        "profile-research": true,
        "profile-private": true,
        "profile-exit": true
      };

      for (var anchor = 0; anchor < anchors.length - 1; anchor += 1) {
        var start = anchors[anchor];
        var end = anchors[anchor + 1];
        var gap = end.y - start.y;
        // In Arbeits- und Profilabschnitt bleibt die Hauptader zwischen den
        // mittigen Andockpunkten. Die außenliegenden Blobs erreicht nur ihr Ray.
        var keepRouteCentral = centralGuideKeys[start.key] && centralGuideKeys[end.key];

        if (gap > 170 && !keepRouteCentral) {
          for (var swingPoint = 1; swingPoint <= 2; swingPoint += 1) {
            var ratio = swingPoint / 3;
            var baseX = start.x + (end.x - start.x) * ratio;
            var swing = swingPoint === 1 ? direction : -direction * 0.72;
            points.push({
              x: clamp(baseX + spread * swing, edge, width - edge),
              y: start.y + gap * ratio
            });
          }
          direction *= -1;
        }
        points.push(end);
      }

      var pathData = "M " + points[0].x.toFixed(1) + " " + points[0].y.toFixed(1);
      var tension = 0.78;

      for (var point = 0; point < points.length - 1; point += 1) {
        var p0 = points[point - 1] || points[point];
        var p1 = points[point];
        var p2 = points[point + 1];
        var p3 = points[point + 2] || p2;
        var c1x = p1.x + (p2.x - p0.x) * tension / 6;
        var c1y = p1.y + (p2.y - p0.y) * tension / 6;
        var c2x = p2.x - (p3.x - p1.x) * tension / 6;
        var c2y = p2.y - (p3.y - p1.y) * tension / 6;

        pathData += " C " +
          c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " +
          c2x.toFixed(1) + " " + c2y.toFixed(1) + ", " +
          p2.x.toFixed(1) + " " + p2.y.toFixed(1);
      }
      return pathData;
    }

    // Die grobe Projektion wird in einem kleinen Fenster verfeinert. So bleiben
    // Stationsmarker auch nach Schrift- oder Fenstergrößenänderungen exakt an
    // derselben ruhigen Ader verankert.
    function routeLengthNearPoint(routeMeasure, totalLength, target, estimate) {
      var radius = totalLength * 0.02;
      var bestLength = estimate;
      var bestDistance = Infinity;

      for (var pass = 0; pass < 2; pass += 1) {
        var start = Math.max(0, bestLength - radius);
        var end = Math.min(totalLength, bestLength + radius);
        for (var sample = 0; sample <= 16; sample += 1) {
          var length = start + (end - start) * sample / 16;
          var point = routeMeasure.getPointAtLength(length);
          var dx = point.x - target.x;
          var dy = point.y - target.y;
          var pointDistance = dx * dx + dy * dy;
          if (pointDistance < bestDistance) {
            bestDistance = pointDistance;
            bestLength = length;
          }
        }
        radius = Math.max(1, (end - start) / 16);
      }

      return bestLength;
    }

    function projectPointToRoute(routeMeasure, totalLength, target) {
      var bestLength = 0;
      var bestDistance = Infinity;

      for (var sample = 0; sample <= 96; sample += 1) {
        var length = totalLength * sample / 96;
        var point = routeMeasure.getPointAtLength(length);
        var dx = point.x - target.x;
        var dy = point.y - target.y;
        var pointDistance = dx * dx + dy * dy;
        if (pointDistance < bestDistance) {
          bestDistance = pointDistance;
          bestLength = length;
        }
      }

      return routeLengthNearPoint(routeMeasure, totalLength, target, bestLength);
    }

    function mapStationRouteLengths(routeMeasure, totalLength, model) {
      var nearest = {};
      model.stationOrder.forEach(function (stationKey) {
        nearest[stationKey] = { length: 0, distance: Infinity };
      });

      for (var sample = 0; sample <= 160; sample += 1) {
        var length = totalLength * sample / 160;
        var point = routeMeasure.getPointAtLength(length);
        model.stationOrder.forEach(function (stationKey) {
          var target = model.stationPoints[stationKey];
          var dx = point.x - target.x;
          var dy = point.y - target.y;
          var distance = dx * dx + dy * dy;
          if (distance < nearest[stationKey].distance) {
            nearest[stationKey] = { length: length, distance: distance };
          }
        });
      }

      model.stationOrder.forEach(function (stationKey) {
        model.stationRouteLengths[stationKey] = routeLengthNearPoint(
          routeMeasure,
          totalLength,
          model.stationPoints[stationKey],
          nearest[stationKey].length
        );
      });
    }

    function routeCategoryColor(category) {
      var styles = window.getComputedStyle(homeMain);
      return styles.getPropertyValue("--category-" + category).trim() || styles.getPropertyValue("--art-route-global").trim();
    }

    function collectRouteTouches(routeMeasure, model, mainRect, totalLength) {
      var touches = [];
      routeActions.forEach(function (action) {
        var stationKey = action.getAttribute("data-route-near");
        var category = action.getAttribute("data-route-activation");
        if (!category) return;

        var rect = action.getBoundingClientRect();
        var centerLength;

        if (stationKey && model.stationRouteLengths[stationKey] != null) {
          centerLength = model.stationRouteLengths[stationKey];
        } else {
          centerLength = projectPointToRoute(routeMeasure, totalLength, elementCenter(action, mainRect, { x: 0, y: 0 }));
        }

        var transitionHalf = 9;
        var transitionStart = Math.max(0, centerLength - transitionHalf);
        var transitionEnd = Math.min(totalLength, centerLength + transitionHalf);
        var resumeLength = transitionEnd;

        // Direkte Portale unterbrechen die Ader. Der Farbwechsel endet an der
        // Membran; dahinter trägt die Ader die neue Farbe weiter.
        if (!stationKey && action.classList.contains("route-blob")) {
          var clearanceFactor = parseFloat(action.getAttribute("data-route-clearance"));
          if (!isFinite(clearanceFactor)) clearanceFactor = 0.54;
          var portalClearance = Math.max(rect.width, rect.height) * clearanceFactor;
          transitionEnd = Math.max(0, centerLength - portalClearance);
          transitionStart = Math.max(0, transitionEnd - transitionHalf * 2);
          resumeLength = Math.min(totalLength, centerLength + portalClearance);
        }

        touches.push({
          category: category,
          color: routeCategoryColor(category),
          centerLength: centerLength,
          transitionStart: transitionStart,
          transitionEnd: transitionEnd,
          resumeLength: resumeLength
        });
      });

      touches.sort(function (a, b) { return a.centerLength - b.centerLength; });
      return touches;
    }

    function drawStatefulRoute(routeMeasure, model, mainRect, pathData, totalLength) {
      var currentColor = window.getComputedStyle(homeMain).getPropertyValue("--art-route-global").trim();
      var cursor = 0;

      collectRouteTouches(routeMeasure, model, mainRect, totalLength).forEach(function (touch, index) {
        var transitionStart = Math.max(cursor, touch.transitionStart);
        var transitionEnd = Math.max(transitionStart, touch.transitionEnd);
        addRouteStateSegment("front", pathData, cursor, transitionStart, totalLength, currentColor);
        addRouteTransition(pathData, transitionStart, transitionEnd, totalLength, routeMeasure, currentColor, touch.color, index);
        currentColor = touch.color;
        cursor = Math.max(transitionEnd, touch.resumeLength);
      });

      addRouteStateSegment("front", pathData, cursor, totalLength, totalLength, currentColor);
    }

    function stationSearchRange(model, stationKey, totalLength) {
      var index = model.stationOrder.indexOf(stationKey);
      if (index < 0) return null;
      var position = model.stationRouteLengths[stationKey];
      if (position == null) return null;
      var before = index > 0 ? model.stationRouteLengths[model.stationOrder[index - 1]] : position;
      var after = index < model.stationOrder.length - 1 ? model.stationRouteLengths[model.stationOrder[index + 1]] : position;
      return {
        from: index > 0 ? (before + position) / 2 : position,
        to: index < model.stationOrder.length - 1 ? (position + after) / 2 : position
      };
    }

    function createCardRay(pathData, stationKey, category, junction, terminal) {
      var lines = routeLayers.front.querySelector(".home-route-lines");
      var group = document.createElementNS(SVG_NS, "g");
      group.setAttribute("class", "home-card-ray-group");
      group.setAttribute("data-route-card-ray", stationKey);
      if (category) group.setAttribute("data-route-category", category);

      var ray = document.createElementNS(SVG_NS, "path");
      ray.setAttribute("class", "home-card-ray");
      ray.setAttribute("d", pathData);
      group.appendChild(ray);

      var bud = document.createElementNS(SVG_NS, "circle");
      bud.setAttribute("class", "home-card-ray-junction");
      bud.setAttribute("cx", junction.x.toFixed(1));
      bud.setAttribute("cy", junction.y.toFixed(1));
      bud.setAttribute("r", "4.2");
      group.appendChild(bud);

      var terminalBud = document.createElementNS(SVG_NS, "circle");
      terminalBud.setAttribute("class", "home-card-ray-terminal");
      terminalBud.setAttribute("cx", terminal.x.toFixed(1));
      terminalBud.setAttribute("cy", terminal.y.toFixed(1));
      terminalBud.setAttribute("r", "2.6");
      group.appendChild(terminalBud);
      lines.appendChild(group);
    }

    function mapRouteCards(routeMeasure, model, mainRect, totalLength) {
      routeCards.forEach(function (card) {
        var stationKey = card.getAttribute("data-route-near");
        var range = stationSearchRange(model, stationKey, totalLength);
        if (!range || range.to <= range.from) return;

        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var dock = card.getAttribute("data-route-dock") || card.getAttribute("data-route-edge") || "left";
        var left = rect.left - mainRect.left;
        var right = rect.right - mainRect.left;
        var top = rect.top - mainRect.top;
        var bottom = rect.bottom - mainRect.top;
        var targetX = left + rect.width / 2;
        var targetY = top + rect.height / 2;
        if (dock === "left") targetX = left + 1;
        if (dock === "right") targetX = right - 1;
        if (dock === "top") targetY = top + 1;
        if (dock === "bottom") targetY = bottom - 1;
        var stationLength = model.stationRouteLengths[stationKey];
        var routePoint = routeMeasure.getPointAtLength(clamp(stationLength, range.from, range.to));
        var horizontalDock = dock === "left" || dock === "right";
        var direction = horizontalDock ? (targetX >= routePoint.x ? 1 : -1) : (targetY >= routePoint.y ? 1 : -1);
        var primaryDistance = horizontalDock ? Math.abs(targetX - routePoint.x) : Math.abs(targetY - routePoint.y);
        var controlOne = {
          x: horizontalDock ? routePoint.x + direction * Math.min(38, primaryDistance * 0.38) : routePoint.x,
          y: horizontalDock ? routePoint.y : routePoint.y + direction * Math.min(38, primaryDistance * 0.38)
        };
        var controlTwo = {
          x: horizontalDock ? targetX - direction * Math.min(26, primaryDistance * 0.28) : targetX,
          y: horizontalDock ? targetY : targetY - direction * Math.min(26, primaryDistance * 0.28)
        };
        var pathData = "M " + routePoint.x.toFixed(1) + " " + routePoint.y.toFixed(1) +
          " C " + controlOne.x.toFixed(1) + " " + controlOne.y.toFixed(1) + ", " +
          controlTwo.x.toFixed(1) + " " + controlTwo.y.toFixed(1) + ", " +
          targetX.toFixed(1) + " " + targetY.toFixed(1);
        createCardRay(pathData, stationKey, card.getAttribute("data-route-activation"), routePoint, { x: targetX, y: targetY });
      });
    }

    function drawRoute() {
      routeFrame = 0;
      var mainRect = homeMain.getBoundingClientRect();
      var width = Math.max(1, homeMain.clientWidth);
      var height = Math.max(1, homeMain.scrollHeight);
      var model = buildRouteModel(width, height, mainRect);
      if (!model || !model.points.length) return;
      var pathData = buildLandscapeRoutePath(model.points, width);
      var routeMeasure = document.createElementNS(SVG_NS, "path");
      routeMeasure.setAttribute("d", pathData);
      routeMeasure.setAttribute("visibility", "hidden");

      [routeLayers.back, routeLayers.front].forEach(function (layer) {
        layer.setAttribute("viewBox", "0 0 " + width + " " + height);
      });
      clearRouteLayers();
      routeLayers.back.appendChild(routeMeasure);
      var totalLength = routeMeasure.getTotalLength();
      mapStationRouteLengths(routeMeasure, totalLength, model);
      drawStatefulRoute(routeMeasure, model, mainRect, pathData, totalLength);
      mapRouteCards(routeMeasure, model, mainRect, totalLength);
      drawLayoutConnectors(mainRect);
      routeLayers.back.removeChild(routeMeasure);
    }

    function scheduleRoute() {
      if (window.innerWidth < 1024) {
        clearRouteLayers();
        if (layoutConnectors) layoutConnectors.replaceChildren();
        return;
      }
      if (!routeFrame) routeFrame = window.requestAnimationFrame(drawRoute);
    }

    scheduleRoute();
    window.addEventListener("load", scheduleRoute, { once: true });
    window.addEventListener("resize", scheduleRoute);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleRoute);
  }

  // 5) Signalwege der Zelle ------------------------------------------------
  // Der Kern und die drei Felder stehen im Layout an gemessenen Stellen. Von
  // jedem Feld führt ein ruhendes Filament zurück zum Kern: das Motiv der
  // digitalen DNA zeigt damit die Weiterleitung, statt sie nur zu behaupten.
  // Die Kurve bekommt einen leichten Bogen, dessen Richtung je Feld wechselt,
  // damit die drei Wege nicht parallel wirken. Ohne JavaScript fehlt allein
  // die Verbindungslinie.
  var SVG = "http://www.w3.org/2000/svg";
  var expertiseMap = document.querySelector(".expertise-map");
  var linkMarks = expertiseMap && expertiseMap.querySelector(".expertise-link-marks");
  var linkHub = expertiseMap && expertiseMap.querySelector(".expertise-hub");
  var linkNodes = expertiseMap ? [].slice.call(expertiseMap.querySelectorAll(".expertise-node")) : [];

  // Anteil der Strecke, bis sie die Karte zum ersten Mal berührt (Liang-Barsky).
  // Trifft sie gar nicht, bleibt es bei der vollen Strecke.
  function clipToBox(from, to, box) {
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var p = [-dx, dx, -dy, dy];
    var q = [from.x - box.left, box.right - from.x, from.y - box.top, box.bottom - from.y];
    var enter = 0;
    var leave = 1;

    for (var i = 0; i < 4; i += 1) {
      if (p[i] === 0) {
        if (q[i] < 0) return 1;
      } else {
        var t = q[i] / p[i];
        if (p[i] < 0) { if (t > enter) enter = t; }
        else if (t < leave) leave = t;
      }
    }

    return enter > leave ? 1 : enter;
  }

  if (linkMarks && linkHub && linkNodes.length) {
    var linkSvg = linkMarks.ownerSVGElement;
    var linkFrame = 0;

    function drawLinks() {
      linkFrame = 0;

      // Gestapelte Karten unter 780 px: Dort blendet das Stylesheet die Wege
      // aus, weil sie neben einer einspaltigen Liste nichts mehr erklären.
      if (window.getComputedStyle(linkSvg).display === "none") return;

      var mapRect = expertiseMap.getBoundingClientRect();
      var width = Math.max(1, expertiseMap.clientWidth);
      var height = Math.max(1, expertiseMap.clientHeight);
      var hubRect = linkHub.getBoundingClientRect();
      var hub = {
        x: hubRect.left - mapRect.left + hubRect.width / 2,
        y: hubRect.top - mapRect.top + hubRect.height / 2
      };
      var hubRadius = Math.min(hubRect.width, hubRect.height) / 2;

      linkSvg.setAttribute("viewBox", "0 0 " + width + " " + height);
      while (linkMarks.firstChild) linkMarks.removeChild(linkMarks.firstChild);

      linkNodes.forEach(function (node, index) {
        var marker = node.querySelector(".expertise-node-marker") || node;
        var markerRect = marker.getBoundingClientRect();
        var nodeRect = node.getBoundingClientRect();
        // Der Marker gibt die Richtung vor — er ist die Stelle, an der das Feld
        // das Signal annimmt. Enden muss der Weg aber an der Kartenkante:
        // Die Automation-Karte steht direkt über dem Kern, ihr Marker liegt
        // mitten in der Karte, und der ganze Weg läge sonst unter ihr.
        var aim = {
          x: markerRect.left - mapRect.left + markerRect.width / 2,
          y: markerRect.top - mapRect.top + markerRect.height / 2
        };
        var box = {
          left: nodeRect.left - mapRect.left,
          right: nodeRect.right - mapRect.left,
          top: nodeRect.top - mapRect.top,
          bottom: nodeRect.bottom - mapRect.top
        };

        var reach = clipToBox(hub, aim, box);
        var target = {
          x: hub.x + (aim.x - hub.x) * reach,
          y: hub.y + (aim.y - hub.y) * reach
        };

        var dx = target.x - hub.x;
        var dy = target.y - hub.y;
        var span = Math.sqrt(dx * dx + dy * dy);
        if (span < hubRadius + 30) return;

        var ux = dx / span;
        var uy = dy / span;
        // Am Kern beginnt der Weg auf der Membran, am Feld endet er kurz vor
        // der Kante, damit keine Linie in die Karte hineinsticht.
        var start = { x: hub.x + ux * (hubRadius * 0.94), y: hub.y + uy * (hubRadius * 0.94) };
        var end = { x: target.x - ux * 9, y: target.y - uy * 9 };

        dx = end.x - start.x;
        dy = end.y - start.y;
        // Der Bogen richtet sich nach der sichtbaren Strecke, nicht nach der
        // Luftlinie zum Marker; sonst taucht die Kurve unter der Karte durch.
        var bow = Math.sqrt(dx * dx + dy * dy) * 0.15 * (index % 2 === 0 ? 1 : -1);
        var nx = -uy * bow;
        var ny = ux * bow;
        var c1 = { x: start.x + dx * 0.3 + nx, y: start.y + dy * 0.3 + ny };
        var c2 = { x: start.x + dx * 0.68 + nx * 0.7, y: start.y + dy * 0.68 + ny * 0.7 };

        var d = "M " + start.x.toFixed(1) + " " + start.y.toFixed(1) +
          " C " + c1.x.toFixed(1) + " " + c1.y.toFixed(1) + ", " +
          c2.x.toFixed(1) + " " + c2.y.toFixed(1) + ", " +
          end.x.toFixed(1) + " " + end.y.toFixed(1);

        // Die Feldfarbe steht im Stylesheet auf der Karte; der Weg übernimmt sie,
        // damit Verbindung und Ziel dieselbe Sprache sprechen.
        var category = window.getComputedStyle(node).getPropertyValue("--category").trim();

        ["haze", "core"].forEach(function (kind) {
          var path = document.createElementNS(SVG, "path");
          path.setAttribute("class", "expertise-link expertise-link--" + kind);
          path.setAttribute("d", d);
          if (category) path.style.setProperty("--category", category);
          linkMarks.appendChild(path);
        });

        // Ein feiner Austritt an der Membran: der Punkt, an dem das Signal
        // den Kern verlässt.
        var seed = document.createElementNS(SVG, "circle");
        seed.setAttribute("class", "expertise-link-seed");
        seed.setAttribute("cx", start.x.toFixed(1));
        seed.setAttribute("cy", start.y.toFixed(1));
        seed.setAttribute("r", "2.2");
        if (category) seed.style.setProperty("--category", category);
        linkMarks.appendChild(seed);
      });
    }

    function scheduleLinks() {
      if (!linkFrame) linkFrame = window.requestAnimationFrame(drawLinks);
    }

    scheduleLinks();
    window.addEventListener("load", scheduleLinks, { once: true });
    window.addEventListener("resize", scheduleLinks);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleLinks);
    if ("ResizeObserver" in window) new ResizeObserver(scheduleLinks).observe(expertiseMap);
  }

  // 6) Entscheidungsbaum ---------------------------------------------------
  // Reiz → Prüfung → Aktion → Wirkung, dazu der Zweig, an dem die
  // Automatisierung endet. Die Knoten stehen als verschachtelte Liste im
  // Fluss; gezeichnet werden allein die Verbindungen zwischen den gemessenen
  // Kanten der Beschriftungen. Dadurch stimmt die Darstellung bei jeder Breite
  // ohne feste Pixelwerte — und dieselbe Messung trägt auch die schmale
  // Ansicht, in der der Baum in eine eingerückte Gliederung kippt: Liegt ein
  // Kind nicht rechts neben seinem Elternknoten, führt der Bogen nach unten.
  // Ohne JavaScript bleibt die Gliederung als eingerückte Liste lesbar.
  var SVG_NS = "http://www.w3.org/2000/svg";
  var trees = [].slice.call(document.querySelectorAll("[data-tree]"));

  trees.forEach(function (tree) {
    var canvas = tree.querySelector(".tree-canvas");
    var links = canvas && canvas.querySelector(".tree-links");
    var marks = canvas && canvas.querySelector(".tree-marks");
    var gradient = canvas && canvas.querySelector("linearGradient");
    var nodes = [].slice.call(tree.querySelectorAll(".tree-node"));
    if (!links || !marks || !nodes.length) return;

    var treeFrame = 0;
    var settled = false;

    // Ebene eines Knotens: die Zahl der Knoten über ihm im selben Baum.
    function depthOf(node) {
      var depth = 0;
      var parent = node.parentNode;
      while (parent && parent !== tree) {
        if (parent.classList && parent.classList.contains("tree-node")) depth += 1;
        parent = parent.parentNode;
      }
      return depth;
    }

    // Direkte Kinder eines Knotens — nicht der ganze Teilbaum.
    function childrenOf(node) {
      var count = 0;
      var kids = node.children;
      for (var i = 0; i < kids.length; i += 1) {
        if (!kids[i].classList.contains("tree-branch")) continue;
        var branch = kids[i].children;
        for (var j = 0; j < branch.length; j += 1) {
          if (branch[j].classList.contains("tree-node")) count += 1;
        }
      }
      return count;
    }

    function drawTree() {
      treeFrame = 0;

      // Vor der Messung: Ohne `is-live` gilt die eingerückte Ersatzdarstellung,
      // und gemessen würde eine Anordnung, die es gleich nicht mehr gibt.
      tree.classList.add("is-live");

      var box = tree.getBoundingClientRect();
      var width = Math.max(1, tree.clientWidth);
      var height = Math.max(1, tree.clientHeight);

      canvas.setAttribute("viewBox", "0 0 " + width + " " + height);

      // Der Verlauf liegt im Benutzerkoordinatensystem: Zweig und Knospe zeigen
      // dieselbe Farbe an derselben Stelle. Vor dem linken Rand läuft er auf
      // Null aus — der Reiz kommt sichtbar von außen.
      if (gradient) {
        gradient.setAttribute("x1", "-60");
        gradient.setAttribute("x2", String(Math.round(width)));
      }

      var maxDepth = 0;

      nodes.forEach(function (node) {
        var label = node.querySelector(".tree-label") || node;
        var head = label.querySelector("strong") || label;
        var rect = label.getBoundingClientRect();
        // Die Spalte gibt die linke Kante vor, der Begriff Höhe und Austritt:
        // Der Zweig verlässt das Wort und trifft das nächste Wort — nicht die
        // Mitte eines Textblocks und nicht eine leere Spaltenkante.
        var headRect = head.getBoundingClientRect();
        node.__depth = depthOf(node);
        node.__box = {
          left: rect.left - box.left,
          right: headRect.right - box.left,
          colRight: rect.right - box.left,
          bottom: rect.bottom - box.top,
          cy: headRect.top - box.top + headRect.height / 2
        };
        if (node.__depth > maxDepth) maxDepth = node.__depth;
        // Halm und Gabel gehören dem Elternknoten und entstehen beim ersten
        // seiner Kinder; jede Neuberechnung beginnt deshalb wieder von vorn.
        node.__stemmed = false;
        node.__forked = false;
      });

      while (links.firstChild) links.removeChild(links.firstChild);
      while (marks.firstChild) marks.removeChild(marks.firstChild);

      // Ein Weg besteht aus zwei gestapelten Konturen: Der Schein entsteht aus
      // ihnen, nicht aus einem Blur. Jeder wächst über seine eigene Länge; die
      // Ebene bestimmt, wann er an der Reihe ist.
      function addLink(d, at, stop) {
        ["haze", "core"].forEach(function (kind) {
          var path = document.createElementNS(SVG_NS, "path");
          path.setAttribute("class",
            "tree-link tree-link--" + kind + (stop ? " tree-link--stop" : ""));
          path.setAttribute("d", d);
          path.style.setProperty("--tree-at", at);
          links.appendChild(path);

          if (!reduce) {
            var length = path.getTotalLength();
            if (length) path.style.setProperty("--tree-len", length.toFixed(1));
          }
        });
      }

      nodes.forEach(function (node) {
        var ratio = (maxDepth ? node.__depth / maxDepth : 0).toFixed(3);
        var stop = node.classList.contains("tree-node--stop");
        var parent = node.parentNode.closest(".tree-node");
        var end = { x: node.__box.left - 9, y: node.__box.cy };
        var start;
        var c1;
        var c2;
        var span;

        node.style.setProperty("--tree-at", ratio);

        if (!parent) {
          // Zulauf von außerhalb der Fläche; sichtbar wird er erst dort, wo
          // der Verlauf einsetzt.
          start = { x: -56, y: end.y };
          span = end.x - start.x;
          c1 = { x: start.x + span * 0.5, y: start.y };
          c2 = { x: end.x - span * 0.5, y: end.y };
        } else if (node.__box.left >= parent.__box.colRight - 4) {
          // Waagerecht, an beiden Enden tangential. Die Spaltenkante entscheidet
          // über den Fall, der Begriff über den Austritt.
          // Die Gabel liegt hinter der Spalte, nicht am Begriff: Ein
          // abzweigender Weg liefe sonst quer durch die Beschreibung seines
          // Elternknotens. Vom Begriff bis zur Gabel führt ein gerader Halm.
          start = { x: parent.__box.colRight + 14, y: parent.__box.cy };
          span = end.x - start.x;
          c1 = { x: start.x + span * 0.5, y: start.y };
          c2 = { x: end.x - span * 0.5, y: end.y };

          if (!parent.__stemmed) {
            parent.__stemmed = true;
            addLink(
              "M " + (parent.__box.right + 7).toFixed(1) + " " + start.y.toFixed(1) +
              " L " + start.x.toFixed(1) + " " + start.y.toFixed(1),
              (maxDepth ? (parent.__depth + 0.4) / maxDepth : 0).toFixed(3),
              false
            );
          }
        } else {
          // Eingerückt: von der Unterkante des Elternbegriffs nach unten und
          // im Bogen nach rechts in den Unterzweig.
          start = { x: parent.__box.left + 11, y: parent.__box.bottom + 5 };
          span = end.y - start.y;
          c1 = { x: start.x, y: start.y + span * 0.55 };
          c2 = { x: start.x, y: end.y };
        }

        var d = "M " + start.x.toFixed(1) + " " + start.y.toFixed(1) +
          " C " + c1.x.toFixed(1) + " " + c1.y.toFixed(1) + ", " +
          c2.x.toFixed(1) + " " + c2.y.toFixed(1) + ", " +
          end.x.toFixed(1) + " " + end.y.toFixed(1);

        addLink(d, ratio, stop);

        // Ende des Zweigs: Der Weg verdickt sich tangential zur Knospe. Der
        // Rückgabe-Zweig endet offen — dort läuft nichts weiter.
        var bud;
        if (stop) {
          bud = document.createElementNS(SVG_NS, "circle");
          bud.setAttribute("class", "tree-bud tree-bud--stop");
          bud.setAttribute("cx", (end.x - 2.5).toFixed(1));
          bud.setAttribute("cy", end.y.toFixed(1));
          bud.setAttribute("r", "3.2");
        } else {
          bud = document.createElementNS(SVG_NS, "ellipse");
          bud.setAttribute("class", "tree-bud");
          bud.setAttribute("cx", (end.x - 1).toFixed(1));
          bud.setAttribute("cy", end.y.toFixed(1));
          bud.setAttribute("rx", "8.5");
          bud.setAttribute("ry", "2.2");
        }
        bud.style.setProperty("--tree-at", ratio);
        marks.appendChild(bud);

        // Die Gabel: der Punkt, an dem sich der Weg teilt. Sie sitzt genau am
        // Anfang der Zweige und wird deshalb nur einmal je Elternknoten gesetzt.
        if (parent && !parent.__forked && childrenOf(parent) > 1) {
          parent.__forked = true;
          var fork = document.createElementNS(SVG_NS, "circle");
          fork.setAttribute("class", "tree-fork");
          fork.setAttribute("cx", start.x.toFixed(1));
          fork.setAttribute("cy", start.y.toFixed(1));
          fork.setAttribute("r", "2.4");
          fork.style.setProperty("--tree-at",
            (maxDepth ? parent.__depth / maxDepth : 0).toFixed(3));
          marks.appendChild(fork);
        }
      });

      // Der Aufbau läuft genau einmal. Spätere Neuberechnungen — etwa beim
      // Drehen des Geräts — zeichnen still nach, ohne die Bewegung zu wiederholen.
      if (settled) {
        tree.classList.add("is-settled");
      } else if (tree.classList.contains("is-in")) {
        settled = true;
      }
    }

    function scheduleTree() {
      if (!treeFrame) treeFrame = window.requestAnimationFrame(drawTree);
    }

    scheduleTree();
    window.addEventListener("load", scheduleTree, { once: true });
    window.addEventListener("resize", scheduleTree);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleTree);
    // Die Höhe ergibt sich aus dem Inhalt; ein reiner resize-Listener griffe zu kurz.
    if ("ResizeObserver" in window) new ResizeObserver(scheduleTree).observe(tree);
  });

})();
