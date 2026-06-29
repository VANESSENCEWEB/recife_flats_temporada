/**
 * dom.js — Utilitários de seleção no DOM
 * Atalhos para querySelector e querySelectorAll.
 */

/** Seleciona um único elemento */
export const $ = (selector, context = document) =>
  context.querySelector(selector);

/** Seleciona múltiplos elementos como array */
export const $$ = (selector, context = document) =>
  Array.from(context.querySelectorAll(selector));

/** Verifica preferência de movimento reduzido */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
