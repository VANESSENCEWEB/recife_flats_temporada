/**
 * main.js — Ponto de entrada da aplicação
 * Inicializa todos os componentes do site Recife Flats.
 */

import { initLenis } from "./components/lenis.js";
import { initNavbar } from "./components/navbar.js";
import { initMenu } from "./components/menu.js";
import {
  initSearchTabs,
  initSearchForms,
  initPropertyFilter,
} from "./components/booking-search.js";
import { initHero } from "./components/hero.js";
import { initAnnouncement } from "./components/announcement.js";
import {
  initScrollAnimations,
  initContactForm,
  showAllReveals,
} from "./components/animations.js";

/**
 * Aguarda GSAP (scripts defer) antes de animar.
 */
function waitForGSAP(maxAttempts = 40) {
  return new Promise((resolve) => {
    let attempts = 0;
    const tick = () => {
      if (typeof window.gsap !== "undefined") {
        resolve(true);
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

async function bootstrap() {
  initNavbar();
  initMenu();
  initSearchTabs();
  initSearchForms();
  initPropertyFilter();
  initAnnouncement();
  initContactForm();

  const hasGSAP = await waitForGSAP();

  if (!hasGSAP) {
    showAllReveals();
    return;
  }

  initLenis();
  initHero();
  initScrollAnimations();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
