(function () {
  var KEY = "nexweb-a11y";
  var root = document.documentElement;
  var state = { size: 0, contrast: false, gray: false, links: false, font: false, motion: false, cursor: false };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    state.size = saved.size || 0;
    state.contrast = !!saved.contrast;
    state.gray = !!saved.gray;
    state.links = !!saved.links;
    state.font = !!saved.font;
    state.motion = !!saved.motion;
    state.cursor = !!saved.cursor;
  } catch (error) {}

  var main = document.getElementById("main");
  if (main && !main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  document.querySelectorAll(".nav-toggle i").forEach(function (icon) {
    icon.setAttribute("aria-hidden", "true");
  });

  var host = document.createElement("div");
  host.className = "a11y-root";
  host.innerHTML =
    '<button class="a11y-fab" type="button" aria-expanded="false" aria-controls="a11y-panel" aria-haspopup="dialog">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><circle cx="12" cy="4.5" r="2" fill="currentColor"/><path fill="currentColor" d="M4 9h16v2h-6v9h-4v-9H4z"/></svg>' +
      '<span class="sr-only">תפריט נגישות</span>' +
    "</button>" +
    '<div id="a11y-panel" class="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title" hidden>' +
      '<div class="a11y-head"><h2 id="a11y-title">נגישות</h2><button type="button" data-a11y-close>סגירה</button></div>' +
      '<p class="a11y-note">ההגדרות נשמרות במכשיר הזה.</p>' +
      '<div class="a11y-size" role="group" aria-label="גודל טקסט">' +
        '<button type="button" data-size="-1">הקטנת טקסט</button>' +
        '<button type="button" data-size="1">הגדלת טקסט</button>' +
      "</div>" +
      '<p id="a11y-size-status" class="sr-only" aria-live="polite"></p>' +
      '<ul class="a11y-options">' +
        '<li><button type="button" data-toggle="contrast" aria-pressed="false">ניגודיות גבוהה</button></li>' +
        '<li><button type="button" data-toggle="gray" aria-pressed="false">גווני אפור</button></li>' +
        '<li><button type="button" data-toggle="links" aria-pressed="false">הדגשת קישורים</button></li>' +
        '<li><button type="button" data-toggle="font" aria-pressed="false">גופן קריא</button></li>' +
        '<li><button type="button" data-toggle="motion" aria-pressed="false">עצירת אנימציות</button></li>' +
        '<li><button type="button" data-toggle="cursor" aria-pressed="false">סמן גדול</button></li>' +
      "</ul>" +
      '<button class="a11y-reset" type="button" data-reset>איפוס הגדרות</button>' +
      '<p class="a11y-more"><a href="accessibility.html">הצהרת נגישות</a></p>' +
    "</div>";
  document.body.appendChild(host);

  var fab = host.querySelector(".a11y-fab");
  var panel = host.querySelector(".a11y-panel");
  var closer = host.querySelector("[data-a11y-close]");
  var status = host.querySelector("#a11y-size-status");
  var open = false;
  var lastFocus = null;

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (error) {}
  }
  function sizeLabel() {
    return state.size === 0 ? "גודל טקסט רגיל" : state.size === 1 ? "גודל טקסט בינוני" : "גודל טקסט גדול";
  }
  function apply() {
    root.classList.toggle("a11y-lg", state.size === 1);
    root.classList.toggle("a11y-xl", state.size >= 2);
    root.classList.toggle("a11y-contrast", state.contrast);
    root.classList.toggle("a11y-gray", state.gray);
    root.classList.toggle("a11y-links", state.links);
    root.classList.toggle("a11y-font", state.font);
    root.classList.toggle("a11y-motion", state.motion);
    root.classList.toggle("a11y-cursor", state.cursor);
    if (state.motion) root.classList.add("reduce");
    else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.remove("reduce");
    host.querySelectorAll("[data-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", state[button.dataset.toggle] ? "true" : "false");
    });
    var down = host.querySelector('[data-size="-1"]');
    var up = host.querySelector('[data-size="1"]');
    down.disabled = state.size <= 0;
    up.disabled = state.size >= 2;
    status.textContent = sizeLabel();
    if (state.motion) window.dispatchEvent(new CustomEvent("nexweb:motion-off"));
  }

  function focusables() {
    return Array.prototype.slice.call(panel.querySelectorAll("a,button,input,select,textarea")).filter(function (el) {
      return !el.disabled && !el.hidden;
    });
  }
  function onKey(event) {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function setOpen(next) {
    open = next;
    panel.hidden = !next;
    fab.setAttribute("aria-expanded", next ? "true" : "false");
    document.body.classList.toggle("a11y-open", next);
    if (window.NexA11y) window.NexA11y.syncInert();
    if (next) {
      lastFocus = document.activeElement;
      if (window.__lenis) window.__lenis.stop();
      var first = panel.querySelector("button,a");
      if (first) first.focus();
      document.addEventListener("keydown", onKey);
    } else {
      document.removeEventListener("keydown", onKey);
      if (window.__lenis && !document.body.classList.contains("nav-open")) window.__lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }

  fab.addEventListener("click", function () { setOpen(!open); });
  closer.addEventListener("click", function () { setOpen(false); });
  host.querySelector("[data-size='1']").addEventListener("click", function () {
    state.size = Math.min(2, state.size + 1);
    persist();
    apply();
  });
  host.querySelector("[data-size='-1']").addEventListener("click", function () {
    state.size = Math.max(0, state.size - 1);
    persist();
    apply();
  });
  host.querySelectorAll("[data-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.dataset.toggle;
      state[key] = !state[key];
      persist();
      apply();
    });
  });
  host.querySelector("[data-reset]").addEventListener("click", function () {
    state = { size: 0, contrast: false, gray: false, links: false, font: false, motion: false, cursor: false };
    persist();
    apply();
    window.dispatchEvent(new CustomEvent("nexweb:motion-off"));
  });

  window.NexA11y = {
    syncInert: function () {
      var navOpen = document.body.classList.contains("nav-open");
      var a11yOpen = document.body.classList.contains("a11y-open");
      var header = document.querySelector("header");
      var footer = document.querySelector("footer");
      var pageMain = document.getElementById("main");
      var skip = document.querySelector(".skip");
      if (pageMain) pageMain.inert = navOpen || a11yOpen;
      if (footer) footer.inert = navOpen || a11yOpen;
      if (header) header.inert = a11yOpen;
      if (skip) skip.inert = navOpen || a11yOpen;
      document.querySelectorAll(".wa,.dock").forEach(function (el) {
        el.inert = navOpen || a11yOpen;
      });
      host.inert = navOpen && !a11yOpen;
    }
  };
  apply();
})();
