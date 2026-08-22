/* ---------------------------------------------------------------------------
   Lex Matondo — Minimal Editorial Portfolio Controller
   Mode switching, photography filter & minimal lightbox
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const modeBtns = document.querySelectorAll("[data-mode-btn]");
  const modeSwitches = document.querySelectorAll("[data-mode-switch]");

  // 1. Mode Switching Function
  const setMode = (mode) => {
    body.setAttribute("data-mode", mode);

    modeBtns.forEach((btn) => {
      const active = btn.getAttribute("data-mode-btn") === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("mode", mode);
    window.history.replaceState({}, "", newUrl);
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.getAttribute("data-mode-btn"));
    });
  });

  modeSwitches.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetMode = btn.getAttribute("data-mode-switch");
      setMode(targetMode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Initial Mode Detection (Query Param or Hash)
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get("mode");
  if (initialMode === "create" || window.location.hash === "#create" || window.location.hash === "#photography") {
    setMode("create");
  } else {
    setMode("code");
  }

  // 2. Photography Category Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const photoTiles = document.querySelectorAll(".photo-tile");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const selectedCategory = btn.getAttribute("data-filter");

      photoTiles.forEach((tile) => {
        const tileCategory = tile.getAttribute("data-cat");
        if (selectedCategory === "all" || tileCategory === selectedCategory) {
          tile.classList.remove("is-hidden");
        } else {
          tile.classList.add("is-hidden");
        }
      });
    });
  });

  // 3. Minimal Lightbox
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  const lbClose = document.getElementById("lb-close");

  if (lightbox && lbImg && lbCap) {
    photoTiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        const img = tile.querySelector("img");
        const caption = tile.getAttribute("data-caption") || "";
        const meta = tile.getAttribute("data-meta") || "";

        if (img) {
          lbImg.src = img.src;
          lbImg.alt = img.alt || caption;
          lbCap.textContent = meta ? `${caption} — ${meta}` : caption;
          lightbox.removeAttribute("hidden");
        }
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute("hidden", "");
      lbImg.src = "";
    };

    if (lbClose) lbClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) {
        closeLightbox();
      }
    });
  }

  // 4. Global Motion Observer (Calm, Editorial & Non-repetitive)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(
    ".reveal-on-scroll, .reveal-image, .reveal-group, .selected-work-flow, .archive-flow, .philosophy-flow, .contact-flow"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // Monitor Selected Work exiting into Other Work
    const selectedWork = document.getElementById("work");
    const archiveSection = document.getElementById("archive-section");

    if (selectedWork && archiveSection) {
      const exitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              selectedWork.classList.add("is-exiting");
            } else if (entry.boundingClientRect.top > 0) {
              selectedWork.classList.remove("is-exiting");
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -80px 0px"
        }
      );
      exitObserver.observe(archiveSection);
    }

    // Monitor Philosophy Section exiting into Contact Climax
    const philosophySection = document.getElementById("about");
    const contactSection = document.getElementById("contact");

    if (philosophySection && contactSection) {
      const philExitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              philosophySection.classList.add("is-exiting");
            } else if (entry.boundingClientRect.top > 0) {
              philosophySection.classList.remove("is-exiting");
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -80px 0px"
        }
      );
      philExitObserver.observe(contactSection);
    }

    // Subtle scroll displacement on hero exit (capped at -28px)
    const heroHeading = document.querySelector(".hero-elem-heading");
    const heroKicker = document.querySelector(".hero-elem-kicker");

    if (heroHeading && heroKicker) {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY < 400) {
              const moveY = Math.min(scrollY * 0.12, 28);
              const kickerOpacity = Math.max(1 - scrollY * 0.005, 0.2);
              heroHeading.style.transform = `translateY(-${moveY}px)`;
              heroKicker.style.opacity = kickerOpacity;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }
});
