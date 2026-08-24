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
      if (btnRect.width > 0) {
        const leftOffset = btnRect.left - groupRect.left;
        modeSlider.style.transform = `translate3d(${leftOffset}px, 0, 0)`;
        modeSlider.style.width = `${btnRect.width}px`;
      }
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
        threshold: 0.02,
        rootMargin: "0px 0px -10px 0px"
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

    // Temporarily disable smooth scroll to prevent scroll fighting during wipe
    document.documentElement.style.scrollBehavior = "auto";

    // Reset wipe state
    wipeLayer.className = "discipline-wipe-layer";

    // Sequence 1: Content softens, wipe blade sweeps across screen
    mainContainer.classList.add("is-switching");
    wipeLayer.classList.add(inClass);
    updateNav(mode);

    setTimeout(() => {
      // Sequence 2: Switch discipline while covered, reset scroll to top immediately
      body.setAttribute("data-mode", mode);
      window.scrollTo(0, 0);
      updateUrl(mode);

      // Sequence 3: Wipe blade sweeps out to destination side
      setTimeout(() => {
        wipeLayer.classList.remove(inClass);
        wipeLayer.classList.add(outClass);
        mainContainer.classList.remove("is-switching");

        refreshMotionObservers();

        setTimeout(() => {
          wipeLayer.className = "discipline-wipe-layer";
          document.documentElement.style.scrollBehavior = "";
          isTransitioning = false;
        }, 320);
      }, 120);
    }, 240);
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

  // Cinematic Entrance Handoff from Landing Page
  try {
    const entranceFlag = sessionStorage.getItem("portfolio-entrance");
    if (entranceFlag && wipeLayer && !prefersReducedMotion) {
      sessionStorage.removeItem("portfolio-entrance");
      const isCreate = (entranceFlag === "create");
      const outClass = isCreate ? "wipe-to-create-out" : "wipe-to-tech-out";

      wipeLayer.className = `discipline-wipe-layer ${isCreate ? "wipe-to-create-in" : "wipe-to-tech-in"}`;
      document.documentElement.classList.remove("has-portfolio-entrance");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wipeLayer.className = `discipline-wipe-layer ${outClass}`;
          setTimeout(() => {
            wipeLayer.className = "discipline-wipe-layer";
          }, 380);
        });
      });
    } else {
      document.documentElement.classList.remove("has-portfolio-entrance");
    }
  } catch (_) {
    document.documentElement.classList.remove("has-portfolio-entrance");
  }

  // Smooth Return to Landing Page on Brand Click
  const siteBrand = document.querySelector(".site-brand");
  const portfolioWrapper = document.querySelector(".portfolio-container");
  if (siteBrand) {
    siteBrand.addEventListener("click", (e) => {
      e.preventDefault();
      const currentMode = body.getAttribute("data-mode") || "code";

      try {
        sessionStorage.setItem("landing-entrance", currentMode);
      } catch (_) {}

      if (prefersReducedMotion || !wipeLayer) {
        window.location.href = "index.html";
        return;
      }

      const inClass = (currentMode === "create") ? "wipe-to-tech-in" : "wipe-to-create-in";
      wipeLayer.className = `discipline-wipe-layer ${inClass}`;
      if (portfolioWrapper) portfolioWrapper.classList.add("is-exiting-to-landing");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 360);
    });
  }

  // Handle browser Back/Forward (bfcache)
  window.addEventListener("pageshow", () => {
    isTransitioning = false;
    document.documentElement.classList.remove("has-portfolio-entrance");
    if (portfolioWrapper) portfolioWrapper.classList.remove("is-exiting-to-landing");
    if (mainContainer) mainContainer.classList.remove("is-switching");
    if (wipeLayer) wipeLayer.className = "discipline-wipe-layer";
  });

  // 4. Photography Category Filtering (Smooth Stagger & Soft Transition)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const photoTiles = document.querySelectorAll(".photo-tile");
  let isFiltering = false;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isFiltering || btn.classList.contains("is-active")) return;
      isFiltering = true;

      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const selectedCategory = btn.getAttribute("data-filter");

      if (prefersReducedMotion) {
        photoTiles.forEach((tile) => {
          const tileCategory = tile.getAttribute("data-cat");
          const match = (selectedCategory === "all" || tileCategory === selectedCategory);
          tile.classList.toggle("is-hidden", !match);
        });
        isFiltering = false;
        return;
      }

      // Step 1: Smoothly fade out tiles that won't match
      photoTiles.forEach((tile) => {
        const tileCategory = tile.getAttribute("data-cat");
        const match = (selectedCategory === "all" || tileCategory === selectedCategory);
        if (!match && !tile.classList.contains("is-hidden")) {
          tile.classList.add("is-filtering-out");
        }
      });

      setTimeout(() => {
        // Step 2: Toggle hidden states and animate in matching tiles
        let delayIndex = 0;
        photoTiles.forEach((tile) => {
          const tileCategory = tile.getAttribute("data-cat");
          const match = (selectedCategory === "all" || tileCategory === selectedCategory);
          const wasHidden = tile.classList.contains("is-hidden");

          tile.classList.remove("is-filtering-out");
          tile.classList.toggle("is-hidden", !match);

          if (match) {
            tile.classList.remove("is-filtering-in");
            tile.style.animationDelay = `${delayIndex * 50}ms`;
            delayIndex++;
            requestAnimationFrame(() => {
              tile.classList.add("is-filtering-in");
            });
          }
        });

        setTimeout(() => {
          photoTiles.forEach((tile) => {
            tile.classList.remove("is-filtering-in");
            tile.style.animationDelay = "";
          });
          isFiltering = false;
        }, 500);
      }, 180);
    });
  });

  // 5. Cinematic Minimal Lightbox (Smooth Scale & Blur Transition)
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

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              lightbox.classList.add("is-open");
            });
          });
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      setTimeout(() => {
        lightbox.setAttribute("hidden", "");
        lbImg.src = "";
      }, 260);
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

  // 6. Section Exit Monitoring & Scroll Displacement (Desktop fine pointers only)
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!prefersReducedMotion && isFinePointer && "IntersectionObserver" in window) {
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
              heroHeading.style.transform = `translate3d(0, -${moveY}px, 0)`;
              heroKicker.style.opacity = kickerOpacity;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // 7. Featured Project Screenshot Showcase with Right-to-Left Shutter Wipe
  const crossfadeStage = document.getElementById("coelgu-crossfade-stage");
  if (crossfadeStage) {
    const slides = crossfadeStage.querySelectorAll(".crossfade-slide");
    const dots = crossfadeStage.querySelectorAll(".cf-dot");
    const prevBtn = document.getElementById("cf-prev-btn");
    const nextBtn = document.getElementById("cf-next-btn");
    const container = crossfadeStage.querySelector(".crossfade-container");
    const shutterBlade = document.getElementById("cf-shutter");

    let currentSlide = 0;
    let crossfadeTimer = null;
    let isWiping = false;
    let isVisible = true;

    const transitionToSlide = (targetIndex, direction = "rtl") => {
      const nextIndex = (targetIndex + slides.length) % slides.length;
      if (nextIndex === currentSlide) return;

      if (prefersReducedMotion || !shutterBlade) {
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === nextIndex));
        dots.forEach((dot, i) => {
          const active = (i === nextIndex);
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
        currentSlide = nextIndex;
        return;
      }

      if (isWiping) return;
      isWiping = true;

      const inClass = direction === "rtl" ? "wipe-rtl-in" : "wipe-ltr-in";
      const outClass = direction === "rtl" ? "wipe-rtl-out" : "wipe-ltr-out";

      // 1. Shutter sweeps across screenshot frame from right to left
      shutterBlade.className = "cf-shutter-blade";
      shutterBlade.classList.add(inClass);

      setTimeout(() => {
        // 2. Switch slide while completely covered by black blade
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === nextIndex));
        dots.forEach((dot, i) => {
          const active = (i === nextIndex);
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
        currentSlide = nextIndex;

        // 3. Shutter blade sweeps out to left, revealing new screenshot
        setTimeout(() => {
          shutterBlade.classList.remove(inClass);
          shutterBlade.classList.add(outClass);

          setTimeout(() => {
            shutterBlade.className = "cf-shutter-blade";
            isWiping = false;
          }, 240);
        }, 60);
      }, 180);
    };

    const nextSlide = () => {
      if (!isVisible) return;
      transitionToSlide(currentSlide + 1, "rtl");
    };

    const prevSlide = () => {
      if (!isVisible) return;
      transitionToSlide(currentSlide - 1, "ltr");
    };

    const startTimer = () => {
      stopTimer();
      if (!prefersReducedMotion) {
        crossfadeTimer = setInterval(nextSlide, 3600);
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
      }, 4500);
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
        const dir = i > currentSlide ? "rtl" : "ltr";
        transitionToSlide(i, dir);
        restartTimerAfterDelay();
      });
    });

    if (container) {
      container.addEventListener("click", (e) => {
        if (e.target.closest(".crossfade-badge, .cf-nav-btn, .cf-dot")) return;
        nextSlide();
        restartTimerAfterDelay();
      });
    }

    // Reset when tab regains focus
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

  // 8. Soft Feathered Radial Color Lens (Mouse Tracking & Mobile Touch/Scroll)
  const portraitStages = document.querySelectorAll("[data-interactive-portrait]");
  portraitStages.forEach((stage) => {
    const frame = stage.querySelector(".portrait-frame");
    if (!frame) return;

    const setLensPos = (x, y, radius = 135) => {
      frame.style.setProperty("--lens-x", `${x}px`);
      frame.style.setProperty("--lens-y", `${y}px`);
      frame.style.setProperty("--lens-r", `${radius}px`);
    };

    // Desktop Mouse Tracking
    frame.addEventListener("mousemove", (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLensPos(x, y, 135);
      stage.classList.add("is-lens-active");
    });

    frame.addEventListener("mouseenter", (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLensPos(x, y, 135);
      stage.classList.add("is-lens-active");
    });

    frame.addEventListener("mouseleave", () => {
      stage.classList.remove("is-lens-active");
    });

    // Mobile / Touch Drag Lens & Tap with requestAnimationFrame throttling
    let touchTimeout = null;
    let touchTicking = false;
    const handleTouch = (e) => {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      if (!touchTicking) {
        window.requestAnimationFrame(() => {
          const rect = frame.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          setLensPos(x, y, 120);
          stage.classList.add("is-lens-active");
          touchTicking = false;
        });
        touchTicking = true;
      }

      if (touchTimeout) clearTimeout(touchTimeout);
    };

    frame.addEventListener("touchstart", (e) => {
      handleTouch(e);
    }, { passive: true });

    frame.addEventListener("touchmove", (e) => {
      handleTouch(e);
    }, { passive: true });

    frame.addEventListener("touchend", () => {
      touchTimeout = setTimeout(() => {
        stage.classList.remove("is-lens-active");
      }, 2000);
    }, { passive: true });

    // Mobile Scroll Ambient Pulse: softly illuminates center face when scrolled past
    if ("IntersectionObserver" in window) {
      let hasPreviewed = false;
      const ambientObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isTouch = window.matchMedia("(hover: none) or (pointer: coarse)").matches;
            if (isTouch && entry.isIntersecting && !hasPreviewed && !stage.classList.contains("is-lens-active")) {
              hasPreviewed = true;
              const rect = frame.getBoundingClientRect();
              setLensPos(rect.width * 0.5, rect.height * 0.38, 120);
              stage.classList.add("is-lens-active");

              setTimeout(() => {
                stage.classList.remove("is-lens-active");
              }, 2000);
            }
          });
        },
        { threshold: 0.5 }
      );
      ambientObserver.observe(stage);
    }
  });
});
