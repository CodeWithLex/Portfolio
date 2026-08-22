/* ---------------------------------------------------------------------------
   Lex Matondo — Minimal Editorial Portfolio Controller
   Mode switching, scroll reveals, photography gallery & crossfade loop
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const modeBtns = document.querySelectorAll("[data-mode-btn]");
  const modeSwitches = document.querySelectorAll("[data-mode-switch]");
  const wipeLayer = document.getElementById("discipline-wipe");
  const mainContainer = document.querySelector(".portfolio-main");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let isTransitioning = false;

  const modeSlider = document.getElementById("mode-slider");
  const modeGroup = document.querySelector(".mode-switch-group");

  // 1. Navigation and URL updates
  const updateNav = (mode) => {
    let activeBtn = null;
    modeBtns.forEach((btn) => {
      const active = btn.getAttribute("data-mode-btn") === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      if (active) activeBtn = btn;
    });

    if (modeSlider && activeBtn && modeGroup) {
      const groupRect = modeGroup.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const leftOffset = btnRect.left - groupRect.left;
      modeSlider.style.transform = `translateX(${leftOffset}px)`;
      modeSlider.style.width = `${btnRect.width}px`;
    }
  };

  window.addEventListener("resize", () => {
    const currentMode = body.getAttribute("data-mode") || "code";
    updateNav(currentMode);
  });

  const updateUrl = (mode) => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("mode", mode);
    window.history.pushState({ mode }, "", newUrl);
  };

  // 2. Global Motion Observer
  let revealObserver = null;
  const refreshMotionObservers = () => {
    const revealElements = document.querySelectorAll(
      ".reveal-on-scroll, .reveal-image, .reveal-group, .selected-work-flow, .archive-flow, .philosophy-flow, .contact-flow, .create-hero-flow, .photo-archive"
    );

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    if (revealObserver) {
      revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver(
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

    revealElements.forEach((el) => {
      // If element is already in viewport, reveal it immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
      } else {
        revealObserver.observe(el);
      }
    });
  };

  // 3. Directional Mode Switching with Horizontal Monochrome Shutter Wipe
  const setMode = (mode, isInitial = false) => {
    const currentMode = body.getAttribute("data-mode");
    if (!isInitial && currentMode === mode) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isInitial || prefersReducedMotion || !wipeLayer || !mainContainer) {
      body.setAttribute("data-mode", mode);
      updateNav(mode);
      if (!isInitial) {
        updateUrl(mode);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      refreshMotionObservers();
      return;
    }

    if (isTransitioning) return;
    isTransitioning = true;

    const goingToCreate = (mode === "create");
    const inClass = goingToCreate ? "wipe-to-create-in" : "wipe-to-tech-in";
    const outClass = goingToCreate ? "wipe-to-create-out" : "wipe-to-tech-out";

    // Reset wipe state
    wipeLayer.className = "discipline-wipe-layer";

    // Sequence 1: Content softens, wipe blade sweeps across screen
    mainContainer.classList.add("is-switching");
    wipeLayer.classList.add(inClass);
    updateNav(mode);

    setTimeout(() => {
      // Sequence 2: Switch discipline while covered, reset scroll to top
      body.setAttribute("data-mode", mode);
      window.scrollTo({ top: 0 });
      updateUrl(mode);

      // Sequence 3: Wipe blade sweeps out to destination side
      setTimeout(() => {
        wipeLayer.classList.remove(inClass);
        wipeLayer.classList.add(outClass);
        mainContainer.classList.remove("is-switching");

        refreshMotionObservers();

        setTimeout(() => {
          wipeLayer.className = "discipline-wipe-layer";
          isTransitioning = false;
        }, 280);
      }, 100);
    }, 220);
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
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode") || "code";
    setMode(mode, true);
  });

  // Initial Mode Detection (Query Param or Hash)
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get("mode");
  if (initialMode === "create" || window.location.hash === "#create" || window.location.hash === "#photography") {
    setMode("create", true);
  } else {
    setMode("code", true);
  }

  // 4. Photography Category Filtering
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

  // 5. Minimal Lightbox
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

  // 6. Section Exit Monitoring & Scroll Displacement
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
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
        { threshold: 0.05, rootMargin: "0px 0px -80px 0px" }
      );
      exitObserver.observe(archiveSection);
    }

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
        { threshold: 0.05, rootMargin: "0px 0px -80px 0px" }
      );
      philExitObserver.observe(contactSection);
    }

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

  // 7. Featured Project Screenshot Crossfade Showcase
  const crossfadeStage = document.getElementById("coelgu-crossfade-stage");
  if (crossfadeStage) {
    const slides = crossfadeStage.querySelectorAll(".crossfade-slide");
    const dots = crossfadeStage.querySelectorAll(".cf-dot");
    const prevBtn = document.getElementById("cf-prev-btn");
    const nextBtn = document.getElementById("cf-next-btn");
    const container = crossfadeStage.querySelector(".crossfade-container");

    let currentSlide = 0;
    let crossfadeTimer = null;
    let userInteracted = false;
    let isVisible = true;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === currentSlide);
      });
      dots.forEach((dot, i) => {
        const active = (i === currentSlide);
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
      });
    };

    const nextSlide = () => {
      if (!isVisible || prefersReducedMotion) return;
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      if (!isVisible || prefersReducedMotion) return;
      showSlide(currentSlide - 1);
    };

    const startTimer = () => {
      stopTimer();
      if (!prefersReducedMotion) {
        crossfadeTimer = setInterval(nextSlide, 3500);
      }
    };

    const stopTimer = () => {
      if (crossfadeTimer) {
        clearInterval(crossfadeTimer);
        crossfadeTimer = null;
      }
    };

    const restartTimerAfterDelay = () => {
      stopTimer();
      setTimeout(() => {
        startTimer();
      }, 4000);
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevSlide();
        restartTimerAfterDelay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextSlide();
        restartTimerAfterDelay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(i);
        restartTimerAfterDelay();
      });
    });

    if (container) {
      container.addEventListener("click", (e) => {
        // Only advance if not clicking the badge, arrows, or dots
        if (e.target.closest(".crossfade-badge, .cf-nav-btn, .cf-dot")) return;
        nextSlide();
        restartTimerAfterDelay();
      });
    }

    // Never stay permanently paused when switching tabs
    window.addEventListener("focus", () => {
      if (isVisible) startTimer();
    });

    if ("IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startTimer();
          } else {
            stopTimer();
          }
        });
      }, { threshold: 0.1 });
      visibilityObserver.observe(crossfadeStage);
    } else {
      startTimer();
    }
  }
});
