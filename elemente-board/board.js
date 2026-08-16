(function () {
  "use strict";

  var rows = Array.prototype.slice.call(document.querySelectorAll(".element-row"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".element-section"));
  var search = document.getElementById("search");
  var groupFilter = document.getElementById("group-filter");
  var statusFilter = document.getElementById("status-filter");
  var labelsButton = document.getElementById("toggle-labels");
  var copyButton = document.getElementById("copy-selection");
  var selectionId = document.getElementById("selection-id");
  var selectionName = document.getElementById("selection-name");
  var headerSelection = document.getElementById("header-selection");
  var toast = document.getElementById("toast");
  var selected = null;
  var selectedPart = null;
  var toastTimer = 0;

  function clearPartSelection() {
    Array.prototype.slice.call(document.querySelectorAll(".anatomy li.is-part-selected")).forEach(function (item) { item.classList.remove("is-part-selected"); });
    selectedPart = null;
  }

  function selectRow(row, moveFocus) {
    if (selected) {
      selected.classList.remove("is-selected");
      if (selected.matches("[role='button']")) selected.setAttribute("aria-pressed", "false");
      var oldSelectButton = selected.querySelector(".element-select");
      if (oldSelectButton) oldSelectButton.setAttribute("aria-pressed", "false");
    }
    selected = row;
    selected.classList.add("is-selected");
    if (selected.matches("[role='button']")) selected.setAttribute("aria-pressed", "true");
    var selectButton = selected.querySelector(".element-select");
    if (selectButton) selectButton.setAttribute("aria-pressed", "true");
    selectionId.textContent = row.dataset.id;
    selectionName.textContent = row.dataset.name;
    headerSelection.textContent = selectedPart ? row.dataset.id + "/" + selectedPart.index + " · " + selectedPart.name : row.dataset.id + " · " + row.dataset.name;
    try {
      history.replaceState(null, "", "#" + row.dataset.id.toLowerCase());
    } catch (error) {
      /* file:// blocks history updates in some browsers; selection still works. */
    }
    if (moveFocus) {
      document.documentElement.style.scrollBehavior = "auto";
      row.scrollIntoView({ block: "center" });
      document.documentElement.style.scrollBehavior = "";
    }
  }

  rows.forEach(function (row) {
    row.id = row.dataset.id.toLowerCase();
    var selectButton = row.querySelector(".element-select");
    if (selectButton) {
      selectButton.setAttribute("aria-pressed", "false");
      selectButton.setAttribute("aria-label", row.dataset.id + " · " + row.dataset.name + " auswählen");
      selectButton.addEventListener("click", function (event) {
        event.stopPropagation();
        clearPartSelection();
        selectRow(row, false);
      });
    } else {
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-pressed", "false");
      row.setAttribute("aria-label", row.dataset.id + " · " + row.dataset.name + " auswählen");
    }
    Array.prototype.slice.call(row.querySelectorAll(".specimen a, .specimen button")).forEach(function (demoControl) {
      demoControl.tabIndex = -1;
      demoControl.setAttribute("aria-hidden", "true");
    });
    if (!selectButton) {
      row.addEventListener("click", function (event) {
        if (event.target.closest("a, button")) event.preventDefault();
        clearPartSelection();
        selectRow(row, false);
      });
      row.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          clearPartSelection();
          selectRow(row, false);
        }
      });
    }
    Array.prototype.slice.call(row.querySelectorAll(".anatomy li")).forEach(function (part, index) {
      var partName = part.querySelector("b") ? part.querySelector("b").textContent.trim() : part.textContent.trim();
      part.tabIndex = 0;
      part.setAttribute("role", "button");
      part.setAttribute("aria-label", row.dataset.id + "/" + (index + 1) + " · " + partName + " auswählen");
      function choosePart(event) {
        event.stopPropagation();
        clearPartSelection();
        selectedPart = { index: index + 1, name: partName };
        part.classList.add("is-part-selected");
        selectRow(row, false);
      }
      part.addEventListener("click", choosePart);
      part.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choosePart(event); }
      });
    });
  });

  function applyFilters() {
    var query = search.value.trim().toLocaleLowerCase("de");
    var group = groupFilter ? groupFilter.value : "";
    var status = statusFilter ? statusFilter.value : "";
    var activePanel = document.querySelector(".board-tabpanel:not([hidden])");
    var visible = 0;
    rows.forEach(function (row) {
      var haystack = [row.dataset.id, row.dataset.name, row.dataset.search, row.textContent].join(" ").toLocaleLowerCase("de");
      var rowSection = row.closest(".element-section").id;
      var rowStatus = row.querySelector(".status");
      var statusMatch = !status || (rowStatus && rowStatus.classList.contains("status--" + status));
      var inActivePanel = !activePanel || activePanel.contains(row);
      var show = inActivePanel && (!query || haystack.indexOf(query) !== -1) && (!group || rowSection === group) && statusMatch;
      row.hidden = !show;
      if (show) visible += 1;
    });
    sections.filter(function (section) { return !section.classList.contains("board-tabpanel"); }).forEach(function (section) {
      var sectionRows = Array.prototype.slice.call(section.querySelectorAll(".element-row"));
      section.hidden = sectionRows.every(function (row) { return row.hidden; });
    });
    var startMessage = document.getElementById("start-no-results");
    var oldMessage = document.querySelector(".no-results:not(#start-no-results)");
    if (oldMessage) oldMessage.remove();
    if (startMessage) startMessage.hidden = visible !== 0;
    if (!visible && !startMessage) {
      var message = document.createElement("p");
      message.className = "no-results";
      message.textContent = "Kein Element passt zu den gewählten Filtern.";
      document.querySelector(".scope-note").insertAdjacentElement("afterend", message);
    }
    if (selected && selected.hidden) {
      selected.classList.remove("is-selected");
      if (selected.matches("[role='button']")) selected.setAttribute("aria-pressed", "false");
      var hiddenSelectButton = selected.querySelector(".element-select");
      if (hiddenSelectButton) hiddenSelectButton.setAttribute("aria-pressed", "false");
      selected = null;
      clearPartSelection();
      selectionId.textContent = "Noch kein Element gewählt";
      selectionName.textContent = "Klicke auf eine Elementzeile.";
      headerSelection.textContent = "Keine Auswahl";
    }
  }

  if (search) search.addEventListener("input", applyFilters);
  if (groupFilter) groupFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);

  if (labelsButton) {
    labelsButton.addEventListener("click", function () {
      var off = document.body.classList.toggle("labels-off");
      if (off && selectedPart) {
        clearPartSelection();
        if (selected) headerSelection.textContent = selected.dataset.id + " · " + selected.dataset.name;
      }
      labelsButton.setAttribute("aria-pressed", String(!off));
      labelsButton.textContent = off ? "Anatomie an" : "Anatomie aus";
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var copied = document.execCommand("copy");
    area.remove();
    return copied;
  }

  copyButton.addEventListener("click", function () {
    if (!selected) {
      showToast("Bitte zuerst ein Element auswählen");
      return;
    }
    var reference = selectedPart ? selected.dataset.id + "/" + selectedPart.index + " · " + selectedPart.name : selected.dataset.id + " · " + selected.dataset.name;
    var text = reference + " — Gewünschte Änderung: [Beschreibung]. Unverändert bleiben soll: [Bereich].";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast("Änderungsvorlage kopiert"); }, function () { showToast(fallbackCopy(text) ? "Änderungsvorlage kopiert" : "Kopieren nicht möglich"); });
    } else {
      try { showToast(fallbackCopy(text) ? "Änderungsvorlage kopiert" : "Kopieren nicht möglich"); }
      catch (error) { showToast("Kopieren nicht möglich"); }
    }
  });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".board-sidebar nav a"));
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id); });
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  var initial = window.location.hash.slice(1).toUpperCase();
  var initialRow = null;
  if (initial) {
    initialRow = rows.find(function (row) { return row.dataset.id === initial; });
    if (initialRow) selectRow(initialRow, false);
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll("[role='tab']"));
  function tabFromLocation() {
    var fragment = window.location.hash.slice(1);
    var directTab = tabs.find(function (tab) { return tab.getAttribute("aria-controls") === fragment; });
    if (directTab) return directTab;
    var fragmentTarget = fragment && document.getElementById(fragment);
    var targetPanel = fragmentTarget && fragmentTarget.closest(".board-tabpanel");
    return targetPanel && tabs.find(function (tab) { return tab.getAttribute("aria-controls") === targetPanel.id; });
  }

  function activateTab(tab, moveFocus) {
    tabs.forEach(function (candidate) {
      var active = candidate === tab;
      candidate.setAttribute("aria-selected", String(active));
      candidate.tabIndex = active ? 0 : -1;
      var panel = document.getElementById(candidate.getAttribute("aria-controls"));
      if (panel) panel.hidden = !active;
    });
    if (moveFocus) tab.focus();
    applyFilters();
  }

  function updateTabLocation(tab, replace) {
    try {
      history[replace ? "replaceState" : "pushState"](null, "", tab.getAttribute("href"));
    } catch (error) {
      window.location.hash = tab.getAttribute("aria-controls");
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      updateTabLocation(tab, false);
      activateTab(tab, false);
    });
    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === " ") {
        event.preventDefault();
        updateTabLocation(tab, false);
        activateTab(tab, false);
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      updateTabLocation(tabs[nextIndex], true);
      activateTab(tabs[nextIndex], true);
    });
  });
  if (tabs.length) {
    var selectedPanel = selected && selected.closest(".board-tabpanel");
    var initialTab = selectedPanel && tabs.find(function (tab) { return tab.getAttribute("aria-controls") === selectedPanel.id; });
    activateTab(initialTab || tabFromLocation() || tabs.find(function (tab) { return tab.getAttribute("aria-selected") === "true"; }) || tabs[0], false);
    if (initialRow) window.setTimeout(function () { initialRow.scrollIntoView({ block: "start" }); }, 0);
    function syncTabToLocation() { activateTab(tabFromLocation() || tabs[0], false); }
    window.addEventListener("popstate", syncTabToLocation);
    window.addEventListener("hashchange", syncTabToLocation);
  }

}());
