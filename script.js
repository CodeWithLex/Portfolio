/* ---------------------------------------------------------------------------
   Lex Matondo — Split Landing Controller (CODE × CREATE)
   Handles hover dynamics and keyboard shortcuts
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("split-container");
  const panelCode = document.getElementById("panel-code");
  const panelCreate = document.getElementById("panel-create");

  if (!container || !panelCode || !panelCreate) return;

  // Desktop Hover Expansion Physics
  panelCode.addEventListener("mouseenter", () => {
    container.classList.add("hover-code");
    container.classList.remove("hover-create");
  });

  panelCode.addEventListener("mouseleave", () => {
    container.classList.remove("hover-code");
  });

  panelCreate.addEventListener("mouseenter", () => {
    container.classList.add("hover-create");
    container.classList.remove("hover-code");
  });

  panelCreate.addEventListener("mouseleave", () => {
    container.classList.remove("hover-create");
  });

  // Click entire panel to navigate (if not clicking inside child buttons)
  panelCode.addEventListener("click", (e) => {
    if (!e.target.closest("a, button")) {
      window.location.href = "portfolio.html?mode=code";
    }
  });

  panelCreate.addEventListener("click", (e) => {
    if (!e.target.closest("a, button")) {
      window.location.href = "portfolio.html?mode=create";
    }
  });

  // Keyboard Shortcuts: C / 1 -> Code, P / 2 -> Create
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;

    const key = e.key.toLowerCase();
    if (key === "c" || key === "1") {
      window.location.href = "portfolio.html?mode=code";
    } else if (key === "p" || key === "2") {
      window.location.href = "portfolio.html?mode=create";
    }
  });
});
