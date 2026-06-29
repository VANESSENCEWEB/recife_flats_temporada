/**
 * menu.js — Menu fullscreen com efeito de "nova página"
 */

import { $, $$ } from "../utils/dom.js";
import { getLenis } from "./lenis.js";

/**
 * Inicializa o menu overlay estilo página.
 */
export function initMenu() {
  const menuPage = $("#menu-page");
  const openBtn = $("[data-menu-open]");

  if (!menuPage || !openBtn) return;

  const openMenu = (e) => {
    e.preventDefault();
    menuPage.classList.add("is-open");
    menuPage.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
    getLenis()?.stop();
  };

  const closeMenu = () => {
    menuPage.classList.remove("is-open");
    menuPage.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    getLenis()?.start();
  };

  openBtn.addEventListener("click", openMenu);

  $$("[data-menu-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });
  });

  const page = document.body.dataset.page;
  if (page) {
    const activeLink = $(`.menu-page__link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add("is-active");
  }

  $$(".menu-page__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuPage.classList.contains("is-open")) {
      closeMenu();
    }
  });
}
