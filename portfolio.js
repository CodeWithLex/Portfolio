/* Portfolio Lex — main page motion + gallery interactions.
   Gallery filter/lightbox run as plain JS (no GSAP needed).
   GSAP entrance + ScrollTrigger reveals follow. Float cards / pills / status
   dot animate in CSS only — GSAP never writes transforms on them (opacity
   only), so the two systems never fight. Everything animation-related no-ops
   without GSAP or under prefers-reduced-motion. */

(function () {
  "use strict";

  /* ---- gallery: category filter ---- */
  var chips = document.querySelectorAll(".chip");
  var items = document.querySelectorAll(".gitem");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("is-active");
      });
      chip.classList.add("is-active");
      var f = chip.getAttribute("data-filter");
      items.forEach(function (it) {
        it.classList.toggle(
          "is-hidden",
          f !== "all" && it.getAttribute("data-cat") !== f,
        );
      });
    });
  });

  /* ---- gallery: lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var current = -1;

  var visibleItems = function () {
    return Array.prototype.filter.call(items, function (it) {
      return !it.classList.contains("is-hidden");
    });
  };

  var catFileKey = function (it) {
    return it
      .querySelector("img")
      .getAttribute("src")
      .split("/")
      .pop()
      .replace(/\.jpg$/, "");
  };

  var show = function (list, index) {
    var it = list[index];
    var img = it.querySelector("img");
    lbImg.src = "assets/photos/full/" + catFileKey(it) + ".jpg";
    lbImg.alt = img.alt;
    lbCap.textContent =
      it.getAttribute("data-caption") +
      " · " +
      it.getAttribute("data-cat").toUpperCase();
    current = index;
  };

  items.forEach(function (it) {
    it.addEventListener("click", function () {
      show(visibleItems(), visibleItems().indexOf(it));
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lb-close").focus();
    });
  });

  var close = function () {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lbImg.src = "";
  };

  var step = function (delta) {
    var list = visibleItems();
    if (!list.length) return;
    show(list, (current + delta + list.length) % list.length);
  };

  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", function () {
    step(-1);
  });
  lightbox.querySelector(".lb-next").addEventListener("click", function () {
    step(1);
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---- CODE / CREATE mode switch ---- */
  var body = document.body;
  var modeBtns = document.querySelectorAll(".mode-toggle button");
  var wipe = document.querySelector(".mode-wipe");
  var wipeWord = wipe ? wipe.querySelector(".wipe-word") : null;
  var switching = false;

  var applyMode = function (mode) {
    body.setAttribute("data-mode", mode);
    modeBtns.forEach(function (b) {
      var active = b.getAttribute("data-mode-btn") === mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    history.replaceState(null, "", mode === "create" ? "#create" : "#code");
  };

  var setMode = function (mode) {
    if (switching || mode === body.getAttribute("data-mode")) return;
    var reducedNow = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!window.gsap || reducedNow || !wipe) {
      applyMode(mode);
      window.scrollTo(0, 0);
      return;
    }
    switching = true;
    wipeWord.textContent = mode === "create" ? "Create" : "Code";
    gsap
      .timeline({
        onComplete: function () {
          switching = false;
        },
      })
      .set(wipe, { display: "flex" })
      .fromTo(
        wipe,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 0.45, ease: "power3.in" },
      )
      .add(function () {
        applyMode(mode);
        window.scrollTo(0, 0);
      })
      .fromTo(
        wipeWord,
        { yPercent: 40, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
        "-=0.05",
      )
      .to(
        wipeWord,
        { yPercent: -20, autoAlpha: 0, duration: 0.25, ease: "power2.in" },
        "+=0.4",
      )
      .to(wipe, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power3.out",
      })
      .set(wipe, { display: "none", clipPath: "inset(100% 0 0 0)" });
  };

  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      setMode(b.getAttribute("data-mode-btn"));
    });
  });

  document.querySelectorAll("[data-mode-switch]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      setMode(el.getAttribute("data-mode-switch"));
    });
  });

  if (location.hash === "#create") applyMode("create");

  /* ---- motion (optional, progressive) ---- */
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced || !window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---- hero entrance ---- */
  gsap
    .timeline({ defaults: { duration: 0.5, ease: "power3.out" } })
    .from(".nav", { y: -16, autoAlpha: 0, duration: 0.4, clearProps: "all" })
    .from(".ai-label", { x: -14, autoAlpha: 0, clearProps: "all" }, "-=0.2")
    .from(
      ".hero-title .line",
      { yPercent: 70, autoAlpha: 0, stagger: 0.12, clearProps: "all" },
      "-=0.25",
    )
    .from(".hero-sub", { y: 16, autoAlpha: 0, clearProps: "all" }, "-=0.2")
    .from(
      ".hero-cta a",
      { y: 14, autoAlpha: 0, stagger: 0.08, clearProps: "all" },
      "-=0.25",
    )
    .from(".hero-clients", { y: 12, autoAlpha: 0, clearProps: "all" }, "-=0.25")
    .from(".mockup", { y: 28, autoAlpha: 0, clearProps: "transform" }, "-=0.8")
    .from(
      ".float-card, .gen-pill, .mock-person",
      { autoAlpha: 0, stagger: 0.12, duration: 0.4 },
      "-=0.3",
    );

  /* ---- scroll reveals ---- */
  var reveal = function (targets, vars) {
    gsap.from(
      targets,
      Object.assign(
        {
          y: 28,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: targets, start: "top 85%", once: true },
        },
        vars,
      ),
    );
  };

  reveal(".section-head");
  reveal(".bcard", { stagger: 0.06 });
  reveal(".filter-row .chip", { y: 10, stagger: 0.05 });
  reveal(".gitem", { stagger: 0.05 });
  reveal(".photo-links");
  reveal(".steps li", { x: -24, y: 0 });
  reveal(".portrait", { scale: 0.92, y: 0 });
  reveal(".testimonial", { y: 24 });
  reveal(".footer-cta h2");
  reveal(".btn-mega");

  /* bars grow from the baseline when they scroll into view */
  gsap.utils.toArray(".b-viz").forEach(function (chart) {
    gsap.from(chart.querySelectorAll(".mbar, .b-bar"), {
      scaleY: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.06,
      scrollTrigger: { trigger: chart, start: "top 85%", once: true },
    });
  });

  /* watermark parallax */
  gsap.from(".watermark", {
    yPercent: 40,
    ease: "none",
    scrollTrigger: {
      trigger: ".footer",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });

  /* ---- pointer tilt on the mockup shell ---- */
  var mockup = document.querySelector(".mockup");
  var visual = document.querySelector(".hero-visual");
  if (mockup && visual && window.matchMedia("(pointer: fine)").matches) {
    var tiltX = gsap.quickTo(mockup, "rotationX", {
      duration: 0.5,
      ease: "power2.out",
    });
    var tiltY = gsap.quickTo(mockup, "rotationY", {
      duration: 0.5,
      ease: "power2.out",
    });

    visual.addEventListener("pointermove", function (e) {
      var rect = visual.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY(px * 6);
      tiltX(py * -6);
    });

    visual.addEventListener("pointerleave", function () {
      tiltX(0);
      tiltY(0);
    });
  }
})();

/* ---- testimonial deck ---------------------------------------------------- */
(function () {
  "use strict";

  var stage = document.getElementById("tdeck-stage");
  if (!stage) return; /* section not in this page */

  var cards = Array.from(stage.querySelectorAll(".tcard"));
  var pipsEl = document.getElementById("tdeck-pips");
  var prevBtn = document.getElementById("tdeck-prev");
  var nextBtn = document.getElementById("tdeck-next");
  var N = cards.length;
  var active = 0;

  /* build pip dots */
  var pips = [];
  if (pipsEl) {
    for (var i = 0; i < N; i++) {
      var p = document.createElement("span");
      p.className = "tdeck-pip";
      pipsEl.appendChild(p);
      pips.push(p);
    }
  }

  /* wrapped signed distance from active index */
  function wdist(idx) {
    var d = idx - active;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    return d;
  }

  function update() {
    cards.forEach(function (card, idx) {
      var d = wdist(idx);
      var ad = Math.abs(d);
      card.style.setProperty("--dist", d);
      card.style.setProperty("--adist", ad);
      var act = idx === active;
      card.classList.toggle("is-active", act);
      card.setAttribute("aria-hidden", act ? "false" : "true");
      card.setAttribute("tabindex", act ? "0" : "-1");
    });
    pips.forEach(function (p, i) {
      p.classList.toggle("is-active", i === active);
    });
  }

  function goNext() {
    active = (active + 1) % N;
    update();
  }
  function goPrev() {
    active = (active - 1 + N) % N;
    update();
  }

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

  /* clicking an off-center card jumps to it; clicking active card opens lightbox */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");

  cards.forEach(function (card, idx) {
    card.addEventListener("click", function () {
      if (idx !== active) {
        active = idx;
        update();
      } else if (lightbox && lbImg) {
        var img = card.querySelector("img");
        if (img) {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          var cap = card.getAttribute("data-caption") || "";
          var cat = card.getAttribute("data-cat") || "";
          lbCap.textContent = cap + (cat ? " · " + cat.toUpperCase() : "");
          lightbox.hidden = false;
          document.body.style.overflow = "hidden";
          var closeBtn = lightbox.querySelector(".lb-close");
          if (closeBtn) closeBtn.focus();
        }
      }
    });
  });

  /* Touch swiping support on mobile */
  var startX = 0;
  var startY = 0;
  stage.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (e.changedTouches.length === 1) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }
  }, { passive: true });

  /* arrow keys active when deck is on-screen */
  document.addEventListener("keydown", function (e) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  });

  update(); /* initialise */
})();
