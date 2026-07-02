/**
 * matching-engine.js — Algoritmo de compatibilidade do Matching Inteligente.
 *
 * Compara as respostas do hóspede com os atributos de cada apartamento e
 * gera um score de 0 a 100%. Pesos priorizam capacidade, estacionamento
 * e localização/objetivo da viagem, conforme especificado pelo negócio.
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { MATCHING_PROFILES } from '../data/matching-profiles.js';

export const OBJECTIVE_OPTIONS = [
  { value: 'familia', label: 'Viagem em família', icon: '👨‍👩‍👧‍👦' },
  { value: 'casal', label: 'Casal / lua de mel', icon: '💑' },
  { value: 'trabalho_remoto', label: 'Trabalho remoto', icon: '💻' },
  { value: 'turismo', label: 'Turismo / lazer', icon: '🏖️' },
];

export const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

export const PARKING_OPTIONS = [
  { value: 'nao_preciso', label: 'Não preciso de vaga', icon: '🚶' },
  { value: 'seria_bom', label: 'Seria bom ter', icon: '🚗' },
  { value: 'essencial', label: 'É essencial', icon: '🅿️' },
];

export const POOL_OPTIONS = [
  { value: 'rooftop', label: 'Prefiro piscina no rooftop', icon: '🌇' },
  { value: 'terreo', label: 'Prefiro piscina térrea', icon: '🏊' },
  { value: 'nao_importa', label: 'Tanto faz', icon: '🤷' },
  { value: 'sem_piscina_ok', label: 'Não preciso de piscina', icon: '🚫' },
];

export const WIFI_OPTIONS = [
  { value: 'basico', label: 'Básico já resolve', icon: '📶' },
  { value: 'importante', label: 'É importante', icon: '📡' },
  { value: 'essencial', label: 'Essencial — trabalho remoto', icon: '💻' },
];

export const BUDGET_OPTIONS = [
  { value: 'economico', label: 'Econômico', icon: '💰' },
  { value: 'medio', label: 'Médio', icon: '⚖️' },
  { value: 'sem_restricao', label: 'Sem restrição — conforto em 1º lugar', icon: '✨' },
];

/** Ordem das 6 perguntas do questionário (usada na barra de progresso) */
export const QUESTION_ORDER = ['objective', 'guests', 'parking', 'pool', 'wifi', 'budget'];

const WEIGHTS = { capacity: 30, parking: 20, location: 20, pool: 15, wifi: 10, budget: 5 };

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function scoreCapacity(guests, aptGuests) {
  if (aptGuests >= guests) {
    const surplus = aptGuests - guests;
    return surplus <= 2 ? 1 : clamp01(1 - (surplus - 2) * 0.08);
  }
  const deficit = guests - aptGuests;
  return clamp01(0.35 - deficit * 0.15);
}

function scoreParking(importance, hasParking, parkingType) {
  if (importance === 'essencial') {
    if (!hasParking) return 0.1;
    return parkingType === 'fixo' ? 1 : 0.75;
  }
  if (importance === 'seria_bom') {
    return hasParking ? 1 : 0.5;
  }
  return 0.85; // nao_preciso — não é decisivo, mas não zera o score
}

const POOL_TABLE = {
  rooftop: { rooftop: 1, terreo: 0.45, nenhum: 0.1 },
  terreo: { rooftop: 0.5, terreo: 1, nenhum: 0.1 },
  sem_piscina_ok: { rooftop: 0.8, terreo: 0.8, nenhum: 1 },
  nao_importa: { rooftop: 0.85, terreo: 0.85, nenhum: 0.8 },
};

function scorePool(preference, poolType) {
  return POOL_TABLE[preference]?.[poolType] ?? 0.7;
}

function scoreWifi(need, wifiTier) {
  if (need === 'essencial') return wifiTier === 'alta' ? 1 : 0.45;
  if (need === 'importante') return wifiTier === 'alta' ? 1 : 0.7;
  return 0.9; // basico
}

const BUDGET_ORDER = ['economico', 'medio', 'alto'];

function scoreBudget(profileBudget, aptBudgetTier) {
  if (profileBudget === 'sem_restricao') return 1;
  if (profileBudget === aptBudgetTier) return 1;
  const diff = Math.abs(BUDGET_ORDER.indexOf(profileBudget) - BUDGET_ORDER.indexOf(aptBudgetTier));
  return diff === 1 ? 0.6 : 0.3;
}

function scoreLocation(objective, objectiveFit) {
  return objectiveFit?.[objective] ?? 0.6;
}

function buildReason(answers, apt, profile, sub) {
  if (sub.capacity < 0.4) {
    return `Este apartamento comporta até ${apt.guests} hóspedes — pode ser apertado para o seu grupo de ${answers.guests}.`;
  }
  if (answers.parking === 'essencial' && sub.parking < 0.3) {
    return 'Não possui vaga de estacionamento — vale considerar se isso for essencial pra você.';
  }
  const highlight = profile.highlightReasons?.[answers.objective];
  if (highlight) return highlight;
  return apt.tagline;
}

/**
 * Calcula o match de um apartamento específico contra as respostas do hóspede.
 * @param {object} answers { objective, guests, parking, pool, wifi, budget }
 * @param {object} apt item de APARTAMENTOS
 */
export function computeMatch(answers, apt) {
  const profile = MATCHING_PROFILES[apt.slug];
  if (!profile) return null;

  const sub = {
    capacity: scoreCapacity(answers.guests, apt.guests),
    parking: scoreParking(answers.parking, apt.parking, profile.parkingType),
    location: scoreLocation(answers.objective, profile.objectiveFit),
    pool: scorePool(answers.pool, profile.poolType),
    wifi: scoreWifi(answers.wifi, profile.wifiTier),
    budget: scoreBudget(answers.budget, profile.budgetTier),
  };

  const rawScore = Object.entries(WEIGHTS)
    .reduce((sum, [key, weight]) => sum + sub[key] * weight, 0);

  const score = Math.round(clamp01(rawScore / 100) * 100);

  return {
    apt,
    profile,
    sub,
    score,
    reason: buildReason(answers, apt, profile, sub),
  };
}

/** Retorna todos os apartamentos ordenados do maior para o menor score. */
export function rankApartments(answers) {
  return APARTAMENTOS
    .map((apt) => computeMatch(answers, apt))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

/** Faixa visual do score (cor + rótulo). */
export function scoreTier(score) {
  if (score >= 85) return { label: 'Excelente combinação', className: 'is-excellent' };
  if (score >= 70) return { label: 'Boa combinação', className: 'is-good' };
  if (score >= 50) return { label: 'Combinação razoável', className: 'is-fair' };
  return { label: 'Combinação baixa', className: 'is-low' };
}
