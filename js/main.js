import { STUDIO_NAME } from "./config.js";

document.querySelectorAll("[data-studio-name]").forEach((el) => {
  el.textContent = STUDIO_NAME;
});

if (document.body.dataset.page === "home") {
  const title = `${STUDIO_NAME} — סטודיו לאתרים לעסקים בישראל`;
  const description = `${STUDIO_NAME} מעצבת ובונה דפי נחיתה, אתרי תדמית וחנויות לעסקים בישראל. עברית מלאה, נגישות לפי ת״י 5568.`;
  document.title = title;
  const set = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  };
  set('meta[name="description"]', description);
  set('meta[property="og:title"]', title);
  set('meta[property="og:description"]', `${STUDIO_NAME}. דפי נחיתה, אתרי תדמית וחנויות בעברית, בנגישות לפי ת״י 5568.`);
  set('meta[property="og:site_name"]', STUDIO_NAME);
}

const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
if (toggle && nav) {
  let trap = null;
  const items = () => [toggle, ...nav.querySelectorAll("a,button")].filter((el) => !el.disabled);
  const onKey = (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const list = items();
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    if (window.NexA11y) window.NexA11y.syncInert();
    document.removeEventListener("keydown", onKey);
    if (open) {
      if (window.__lenis) window.__lenis.stop();
      const firstLink = nav.querySelector("a,button");
      if (firstLink) firstLink.focus();
      document.addEventListener("keydown", onKey);
      trap = true;
    } else if (trap) {
      trap = null;
      if (window.__lenis && !document.body.classList.contains("a11y-open")) window.__lenis.start();
      toggle.focus();
    }
  };
  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

const reel = document.querySelector("[data-reel-track]");
document.querySelectorAll("[data-reel]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!reel) return;
    const card = reel.querySelector("li");
    const amount = card ? card.getBoundingClientRect().width + 22 : 300;
    const dir = button.dataset.reel === "next" ? -1 : 1;
    reel.scrollBy({ left: dir * amount, behavior: document.documentElement.classList.contains("reduce") ? "auto" : "smooth" });
  });
});

const header = document.querySelector("[data-header]");
if (header) {
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.querySelectorAll("[data-accordion]").forEach((root) => {
  root.querySelectorAll("[data-panel]").forEach((panel) => {
    const button = panel.closest("[data-item]")?.querySelector("[data-acc-btn]");
    if (!button) return;
    panel.setAttribute("role", "region");
    if (button.id) panel.setAttribute("aria-labelledby", button.id);
  });
  root.querySelectorAll("[data-acc-btn]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest("[data-item]");
      const panel = item.querySelector("[data-panel]");
      const expanded = button.getAttribute("aria-expanded") === "true";
      root.querySelectorAll("[data-acc-btn]").forEach((other) => {
        if (other === button) return;
        other.setAttribute("aria-expanded", "false");
        const otherPanel = other.closest("[data-item]").querySelector("[data-panel]");
        if (otherPanel) otherPanel.hidden = true;
      });
      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.hidden = expanded;
    });
  });
});

document.querySelectorAll("form[data-form]").forEach((form) => {
  const success = document.getElementById(form.dataset.success);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
  });
});

