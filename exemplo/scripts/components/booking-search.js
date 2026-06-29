/**
 * booking-search.js — Tabs e formulário de busca de reservas
 * Gerencia abas (Temporada/Mensal/Eventos) e submit do buscador.
 */

import { $$ } from "../utils/dom.js";

/**
 * Inicializa tabs de tipo de reserva.
 */
export function initSearchTabs() {
  $$(".search-tabs").forEach((tabs) => {
    const buttons = $$("button", tabs);
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  });
}

/**
 * Inicializa formulários de busca (redireciona para apartamentos).
 */
export function initSearchForms() {
  $$(".search-grid").forEach((form) => {
    if (form.tagName !== "FORM") return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "apartamentos.html";
    });
  });
}

/**
 * Filtro de apartamentos na página de catálogo.
 */
export function initPropertyFilter() {
  const filterForm = document.querySelector("[data-filter-form]");
  const propertyGrid = document.querySelector("[data-filter-target]");
  if (!filterForm || !propertyGrid) return;

  const cards = $$(".property", propertyGrid);

  const apply = () => {
    const tipo = filterForm.tipo?.value || "";
    const bairro = filterForm.bairro?.value || "";
    const hospedes = parseInt(filterForm.hospedes?.value || "0", 10);
    let visible = 0;

    cards.forEach((card) => {
      const cTipo = card.dataset.tipo || "";
      const cBairro = card.dataset.bairro || "";
      const cHospedes = parseInt(card.dataset.hospedes || "0", 10);
      const ok =
        (!tipo || cTipo === tipo) &&
        (!bairro || cBairro === bairro) &&
        (!hospedes || cHospedes >= hospedes);

      card.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    const empty = document.querySelector("[data-empty]");
    if (empty) empty.hidden = visible > 0;
  };

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    apply();
  });
  filterForm.addEventListener("change", apply);
}
