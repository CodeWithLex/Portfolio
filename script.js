/* ---------------------------------------------------------------------------
   Lex Matondo — Dual-Discipline Landing Controller
   Handles subtle panel weight expansion and direct navigation
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("split-container");
  const panelEng = document.getElementById("panel-code");
  const panelPhoto = document.getElementById("panel-create");

  if (!container || !panelEng || !panelPhoto) return;

  // Hover expansion weight
  panelEng.addEventListener("mouseenter", () => {
    container.classList.add("hover-code");
    container.classList.remove("hover-create");
  });

  panelEng.addEventListener("mouseleave", () => {
    container.classList.remove("hover-code");
  });

  panelPhoto.addEventListener("mouseenter", () => {
    container.classList.add("hover-create");
    container.classList.remove("hover-code");
  });

  panelPhoto.addEventListener("mouseleave", () => {
    container.classList.remove("hover-create");
  });

  // Direct panel click navigation
  panelEng.addEventListener("click", (e) => {
    if (!e.target.closest("a, button")) {
      window.location.href = "portfolio.html?mode=code";
    }
  });

  panelPhoto.addEventListener("click", (e) => {
    if (!e.target.closest("a, button")) {
      window.location.href = "portfolio.html?mode=create";
    }
  });
});
