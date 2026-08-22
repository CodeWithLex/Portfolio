/* Portfolio Lex — motion.
   Expressive per DESIGN.md: 300ms/100ms, ease + cubic-bezier(0.4, 0, 0.2, 1).
   Everything degrades to a static, fully visible page:
   gsap.from() keeps the no-JS / CDN-failure state as the final state. */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  /* entrance choreography — clearProps hands transforms back to CSS
     so :hover transitions own the elements once the intro completes */
  gsap
    .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
    .from(".topbar", { y: -12, autoAlpha: 0, clearProps: "all" })
    .from(".card-shell", { y: 16, autoAlpha: 0 }, "-=0.15")
    .from(
      ".code-lines .line",
      { x: -10, autoAlpha: 0, stagger: 0.08, clearProps: "all" },
      "-=0.15"
    )
    .from(
      ".cta-row .btn",
      { y: 8, autoAlpha: 0, stagger: 0.08, clearProps: "all" },
      "-=0.1"
    )
    .from(".site-footer", { autoAlpha: 0, clearProps: "all" }, "-=0.1");

  /* pointer parallax — subtle tilt of the hero card (fine pointers only) */
  var shell = document.querySelector(".card-shell");
  var hero = document.querySelector(".hero");
  if (shell && hero && window.matchMedia("(pointer: fine)").matches) {
    hero.style.perspective = "1200px";
    var tiltX = gsap.quickTo(shell, "rotationX", { duration: 0.4, ease: "power2.out" });
    var tiltY = gsap.quickTo(shell, "rotationY", { duration: 0.4, ease: "power2.out" });

    hero.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY(px * 3);
      tiltX(py * -3);
    });

    hero.addEventListener("pointerleave", function () {
      tiltX(0);
      tiltY(0);
    });
  }

  /* scroll: card drifts up slightly slower than the page */
  gsap.to(".card-shell", {
    yPercent: -6,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
})();
