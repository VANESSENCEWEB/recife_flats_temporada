/**
 * announcement.js — Faixa marquee de destaques
 * Pausa animação ao passar o mouse (reforço via CSS).
 * Atualiza ano no rodapé.
 */

import { $ } from "../utils/dom.js";

/**
 * Atualiza o ano dinâmico no footer.
 */
export function initFooterYear() {
  const yearEl = $("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Placeholder para lógica futura do marquee (ex.: conteúdo dinâmico).
 */
export function initAnnouncement() {
  initFooterYear();
}
