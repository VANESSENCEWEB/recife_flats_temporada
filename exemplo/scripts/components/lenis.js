/**
 * lenis.js — Scroll suave integrado com ScrollTrigger
 */

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function initLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const script = document.createElement("script");
  script.src = "https://unpkg.com/lenis@1.3.4/dist/lenis.min.js";
  script.onload = () => {
    lenisInstance = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance.on("scroll", ({ scroll }) => {
      window.dispatchEvent(
        new CustomEvent("lenis:scroll", { detail: { scroll } })
      );
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  };
  document.head.appendChild(script);
}
