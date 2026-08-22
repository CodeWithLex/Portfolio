/* ---------------------------------------------------------------------------
   Lex Matondo — Minimal Editorial Landing Controller
   Smooth 65/35 hover dynamics + Fullscreen expansion wipe on click
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".landing-container");
  const hero = document.getElementById("split-hero");
  const sideTech = document.getElementById("side-tech");
  const sideCreate = document.getElementById("side-create");
  const shutter = document.getElementById("landing-shutter");

  if (!hero || !sideTech || !sideCreate) return;

  // Desktop Hover Dynamics
  sideTech.addEventListener("mouseenter", () => {
    if (hero.classList.contains("expand-tech") || hero.classList.contains("expand-create")) return;
    hero.classList.add("hover-tech");
    hero.classList.remove("hover-create");
  });

  sideTech.addEventListener("mouseleave", () => {
    if (hero.classList.contains("expand-tech") || hero.classList.contains("expand-create")) return;
    hero.classList.remove("hover-tech");
  });

  sideCreate.addEventListener("mouseenter", () => {
    if (hero.classList.contains("expand-tech") || hero.classList.contains("expand-create")) return;
    hero.classList.add("hover-create");
    hero.classList.remove("hover-tech");
  });

  sideCreate.addEventListener("mouseleave", () => {
    if (hero.classList.contains("expand-tech") || hero.classList.contains("expand-create")) return;
    hero.classList.remove("hover-create");
  });

  // Intentional Full-Screen Directional Wipe Transition on Click
  let isNavigating = false;
  const handleTransition = (targetHref, isTech) => {
    if (isNavigating) return;
    isNavigating = true;

    try {
      sessionStorage.setItem("portfolio-entrance", isTech ? "tech" : "create");
    } catch (_) {}

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.href = targetHref;
      return;
    }

    if (container) container.classList.add("is-exiting");

    if (isTech) {
      hero.classList.add("expand-tech");
      hero.classList.remove("hover-tech", "hover-create");
      if (shutter) {
        setTimeout(() => {
          shutter.classList.add("shutter-from-left");
        }, 120);
      }
    } else {
      hero.classList.add("expand-create");
      hero.classList.remove("hover-tech", "hover-create");
      if (shutter) {
        setTimeout(() => {
          shutter.classList.add("shutter-from-right");
        }, 120);
      }
    }

    setTimeout(() => {
      window.location.href = targetHref;
    }, 420);
  };

  sideTech.addEventListener("click", (e) => {
    e.preventDefault();
    handleTransition("portfolio.html?mode=code", true);
  });

  sideCreate.addEventListener("click", (e) => {
    e.preventDefault();
    handleTransition("portfolio.html?mode=create", false);
  });

  // Smooth Shutter Reveal When Returning Back from Portfolio
  try {
    const fromMode = sessionStorage.getItem("landing-entrance");
    if (fromMode && shutter && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.removeItem("landing-entrance");
      const isCreate = (fromMode === "create");
      const outClass = isCreate ? "shutter-to-right-out" : "shutter-to-left-out";

      shutter.className = `landing-shutter-layer ${isCreate ? "shutter-from-right" : "shutter-from-left"}`;
      document.documentElement.classList.remove("has-landing-entrance");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          shutter.className = `landing-shutter-layer ${outClass}`;
          setTimeout(() => {
            shutter.className = "landing-shutter-layer";
          }, 400);
        });
      });
    } else {
      document.documentElement.classList.remove("has-landing-entrance");
    }
  } catch (_) {
    document.documentElement.classList.remove("has-landing-entrance");
  }

  // Handle browser Back/Forward (bfcache)
  window.addEventListener("pageshow", (event) => {
    isNavigating = false;
    document.documentElement.classList.remove("has-landing-entrance");
    if (container) container.classList.remove("is-exiting");
    if (hero) hero.classList.remove("expand-tech", "expand-create", "hover-tech", "hover-create");
    if (shutter) shutter.className = "landing-shutter-layer";
  });
});
