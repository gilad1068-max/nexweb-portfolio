document.documentElement.classList.add("js");
(function () {
  var root = document.documentElement;
  try {
    var saved = JSON.parse(localStorage.getItem("nexweb-a11y") || "{}");
    if (saved.size === 1) root.classList.add("a11y-lg");
    if (saved.size >= 2) root.classList.add("a11y-xl");
    if (saved.contrast) root.classList.add("a11y-contrast");
    if (saved.gray) root.classList.add("a11y-gray");
    if (saved.links) root.classList.add("a11y-links");
    if (saved.font) root.classList.add("a11y-font");
    if (saved.motion) root.classList.add("a11y-motion", "reduce");
    if (saved.cursor) root.classList.add("a11y-cursor");
  } catch (error) {}
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("reduce");
})();
