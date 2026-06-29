/**
 * navbar.js — Navegação fixa com estado ao rolar
 */

import { $ } from "../utils/dom.js";

/**
 * Inicializa o comportamento de scroll da navbar.
 */
export function initNavbar() {
  const nav = $(".nav");
  if (!nav) return;

  const update = (scrollY) => {
    nav.classList.toggle("is-scrolled", scrollY > 40);
  };

  update(window.scrollY);

  window.addEventListener("scroll", () => update(window.scrollY), {
    passive: true,
  });

  window.addEventListener("lenis:scroll", (e) => {
    update(e.detail.scroll);
  });
}
