/* ---------------------------------------------------------------------------
   Lex Matondo — Minimal Editorial Landing Controller
   Smooth 65/35 hover dynamics + Fullscreen expansion wipe on click
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("split-hero");
  const sideTech = document.getElementById("side-tech");
  const sideCreate = document.getElementById("side-create");

  if (!hero || !sideTech || !sideCreate) return;

  // Desktop Hover Dynamics
  sideTech.addEventListener("mouseenter", () => {
    hero.classList.add("hover-tech");
    hero.classList.remove("hover-create");
  });

  sideTech.addEventListener("mouseleave", () => {
    hero.classList.remove("hover-tech");
  });

  sideCreate.addEventListener("mouseenter", () => {
    hero.classList.add("hover-create");
    hero.classList.remove("hover-tech");
  });

  sideCreate.addEventListener("mouseleave", () => {
    hero.classList.remove("hover-create");
  });

  // Intentional Full-Screen Expansion Wipe Transition on Click
  const handleTransition = (targetHref, isTech) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.href = targetHref;
      return;
    }

    if (isTech) {
      hero.classList.add("expand-tech");
      hero.classList.remove("hover-tech", "hover-create");
    } else {
      hero.classList.add("expand-create");
      hero.classList.remove("hover-tech", "hover-create");
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
});
