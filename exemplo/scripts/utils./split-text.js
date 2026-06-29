/**
 * split-text.js — Divide títulos em palavras para animação reveal
 * Envolve cada palavra em .split-word > span para GSAP.
 */

import { $, $$ } from "./dom.js";

/**
 * Aplica split-word no elemento alvo.
 * @param {HTMLElement} element — Elemento com atributo data-split
 */
export function initSplitText(element) {
  if (!element) return;

  const original = element.innerHTML;
  const tokens = original.split(/(<[^>]+>|\s+)/);

  const wrapped = tokens
    .map((token) => {
      if (!token) return "";
      if (/^<[^>]+>$/.test(token)) return token;
      if (/^\s+$/.test(token)) return token;
      return `<span class="split-word"><span>${token}</span></span>`;
    })
    .join("");

  element.innerHTML = wrapped;
}

/**
 * Remove transformações de split (fallback sem animação).
 */
export function resetSplitText() {
  $$("[data-split] .split-word > span").forEach((span) => {
    span.style.transform = "none";
  });
}

/**
 * Inicializa split em todos os elementos [data-split].
 */
export function initAllSplitText() {
  const heroTitle = $("[data-split]");
  if (heroTitle) initSplitText(heroTitle);
}
