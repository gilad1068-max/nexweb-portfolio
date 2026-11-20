const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-product]");
const empty = document.querySelector("[data-empty]");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
    let shown = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.product || "").split(/\s+/);
      const show = filter === "all" || tags.includes(filter);
      card.hidden = !show;
      if (show) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
  });
});

const counts = document.querySelectorAll("[data-cart-count]");
const toast = document.querySelector("[data-toast]");
let count = 0;
let timer = 0;

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    count += 1;
    counts.forEach((el) => {
      el.textContent = String(count);
    });
    if (!toast) return;
    toast.textContent = `${button.dataset.add} נוסף לסל הדוגמה. אין כאן סליקה.`;
    toast.hidden = false;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  });
});

const note = document.querySelector("[data-cart-note]");
const cartOpen = document.querySelector("[data-cart-open]");
const cartClose = document.querySelector("[data-cart-close]");
function cartKeys(event) {
  if (!note || note.hidden) return;
  if (event.key === "Escape") {
    note.hidden = true;
    document.removeEventListener("keydown", cartKeys);
    cartOpen?.focus();
    return;
  }
  if (event.key !== "Tab" || !cartClose) return;
  event.preventDefault();
  cartClose.focus();
}
cartOpen?.addEventListener("click", () => {
  if (!note) return;
  note.hidden = false;
  cartClose?.focus();
  document.addEventListener("keydown", cartKeys);
});
cartClose?.addEventListener("click", () => {
  if (!note) return;
  note.hidden = true;
  document.removeEventListener("keydown", cartKeys);
  cartOpen?.focus();
});
