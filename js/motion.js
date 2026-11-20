(function () {
  var root = document.documentElement;
  var intro = document.querySelector("[data-intro]");
  function clearIntro() {
    if (intro && intro.parentNode) intro.remove();
  }
  function stopped() {
    return root.classList.contains("reduce") || root.classList.contains("a11y-motion");
  }
  window.addEventListener("nexweb:motion-off", function () {
    if (window.gsap) {
      gsap.globalTimeline.clear();
      gsap.set("[data-reveal],[data-parallax]", { clearProps: "all" });
    }
    if (window.__lenis) window.__lenis.destroy();
    clearIntro();
  });

  var grain = document.querySelector("[data-grain]");
  if (grain) {
    var canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 140;
    var ctx = canvas.getContext("2d");
    var pixels = ctx.createImageData(140, 140);
    for (var i = 0; i < pixels.data.length; i += 4) {
      var v = 160 + Math.random() * 80;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
      pixels.data[i + 3] = Math.random() * 46;
    }
    ctx.putImageData(pixels, 0, 0);
    grain.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
  }

  var glow = document.querySelector("[data-glow]");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (glow && fine && !stopped()) {
    window.addEventListener("pointermove", function (event) {
      var x = (event.clientX / window.innerWidth) * 100;
      var y = (event.clientY / window.innerHeight) * 100;
      glow.style.setProperty("--mx", x.toFixed(1) + "%");
      glow.style.setProperty("--my", y.toFixed(1) + "%");
    }, { passive: true });
  }

  if (fine && !stopped()) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var box = el.getBoundingClientRect();
        var dx = event.clientX - (box.left + box.width / 2);
        var dy = event.clientY - (box.top + box.height / 2);
        el.style.transform = "translate(" + (dx * 0.18).toFixed(1) + "px," + (dy * 0.25).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  if (stopped() || !window.gsap || !window.ScrollTrigger) {
    clearIntro();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: coarse ? 0.18 : 0.085, smoothWheel: true, smoothTouch: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  if (intro) {
    gsap.to(intro, {
      yPercent: -100,
      duration: 0.7,
      delay: 0.22,
      ease: "power3.inOut",
      onComplete: clearIntro
    });
  }
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" }
    });
  });
  gsap.utils.toArray("[data-parallax]").forEach(function (el) {
    gsap.fromTo(el, { yPercent: -6 }, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  document.querySelectorAll("[data-marquee]").forEach(function (wrap) {
    var track = wrap.querySelector("[data-track]");
    if (!track) return;
    gsap.fromTo(track, { x: 0 }, { x: function () { return -track.scrollWidth / 2; }, duration: 28, ease: "none", repeat: -1 });
  });
})();
setTimeout(function () {
  var intro = document.querySelector("[data-intro]");
  if (intro) intro.remove();
}, 2200);
