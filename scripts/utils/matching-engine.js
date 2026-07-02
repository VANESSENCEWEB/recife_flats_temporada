/**
 * matching-engine.js — Algoritmo de compatibilidade do Matching Inteligente.
 *
 * Compara as respostas do hóspede com os atributos de cada apartamento e
 * gera um score de 0 a 100%. Pesos priorizam capacidade, estacionamento
 * e localização/objetivo da viagem, conforme especificado pelo negócio.
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { MATCHING_PROFILES } from '../data/matching-profiles.js';
import { NEIGHBORHOODS } from '../data/site-structure.js';

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

/**
 * "Insights" usados para transformar o texto livre do hóspede em explicações
 * concretas — usa as próprias palavras dele (ou o que ele marcou) para dizer
 * *por que* aquele apartamento combina, e não só o percentual.
 */
const KEYWORD_INSIGHTS = [
  {
    keywords: ['praia', 'beira mar', 'orla', 'mar', 'beach'],
    match: () => true,
    sentence: (apt) => `Você mencionou querer ficar perto da praia — o ${apt.building} fica bem posicionado em ${apt.neighborhood}, pertinho da orla.`,
  },
  {
    keywords: ['pet', 'cachorro', 'gato', 'cachorrinho', 'animal de estimação'],
    match: (apt) => apt.petFriendly,
    sentence: () => 'Você mencionou viajar com pet — boa notícia: aqui pets são bem-vindos (sob combinação).',
  },
  {
    keywords: ['trabalho', 'remoto', 'home office', 'reunião', 'call', 'notebook'],
    match: (apt, profile) => profile.wifiTier === 'alta',
    sentence: () => 'Pensando no seu trabalho remoto, a internet aqui é de alta velocidade.',
  },
  {
    keywords: ['silêncio', 'tranquilo', 'sossegado', 'descanso', 'quieto'],
    match: (apt) => apt.slug === 'studio-203-boa-viagem',
    sentence: () => 'Você busca tranquilidade — este é um dos pontos fortes por aqui (silêncio garantido à noite).',
  },
  {
    keywords: ['aeroporto', 'voo', 'avião', 'chegada tarde'],
    match: () => true,
    sentence: () => 'Fica a poucos minutos do Aeroporto dos Guararapes.',
  },
  {
    keywords: ['piscina', 'nadar', 'pool'],
    match: (apt) => apt.pool,
    sentence: () => 'Você mencionou piscina — este apartamento tem exatamente isso.',
  },
  {
    keywords: ['shopping', 'riomar', 'compras', 'cinema'],
    match: (apt) => apt.neighborhoodSlug === 'pina',
    sentence: () => 'Fica pertinho do RioMar Shopping — ótimo pra compras e lazer.',
  },
  {
    keywords: ['família', 'crianças', 'filhos', 'bebê'],
    match: (apt) => apt.guests >= 4,
    sentence: () => 'Espaço com boa capacidade — confortável pra viajar em família.',
  },
  {
    keywords: ['carro', 'estacionar', 'garagem', 'vaga'],
    match: (apt) => apt.parking,
    sentence: () => 'Você mencionou o carro — este apê conta com vaga de estacionamento.',
  },
];

/**
 * Lê o texto livre do hóspede e retorna frases + um pequeno bônus de score
 * quando o que ele escreveu bate com um atributo real do apartamento.
 */
function matchFreeText(freeText, apt, profile) {
  if (!freeText || !freeText.trim()) return { sentences: [], bonus: 0 };

  const normalized = freeText.toLowerCase();
  const sentences = [];
  let bonus = 0;

  for (const insight of KEYWORD_INSIGHTS) {
    const mentioned = insight.keywords.some((k) => normalized.includes(k));
    if (!mentioned) continue;
    if (insight.match(apt, profile)) {
      sentences.push(insight.sentence(apt));
      bonus += 2;
    }
  }

  return { sentences: sentences.slice(0, 2), bonus: Math.min(bonus, 6) };
}

function buildReason(answers, apt, profile, sub, freeTextSentences = []) {
  if (sub.capacity < 0.4) {
    return `Este apartamento comporta até ${apt.guests} hóspedes — pode ser apertado para o seu grupo de ${answers.guests}.`;
  }
  if (answers.parking === 'essencial' && sub.parking < 0.3) {
    return 'Não possui vaga de estacionamento — vale considerar se isso for essencial pra você.';
  }

  const highlight = profile.highlightReasons?.[answers.objective];
  const neighborhood = NEIGHBORHOODS[apt.neighborhoodSlug];
  const localInsight = neighborhood?.highlights?.[0];

  const parts = [...freeTextSentences, highlight, localInsight].filter(Boolean);
  const unique = [...new Set(parts)];

  return unique.slice(0, 2).join(' ') || apt.tagline;
}

/**
 * Calcula o match de um apartamento específico contra as respostas do hóspede.
 * @param {object} answers { objective, guests, parking, pool, wifi, budget, freeText? }
 *   `freeText` é opcional — usado para personalizar a explicação e dar um
 *   pequeno bônus de score quando o hóspede escreve algo que bate com um
 *   atributo real do apartamento.
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

  const { sentences: freeTextSentences, bonus } = matchFreeText(answers.freeText, apt, profile);

  const score = Math.round(clamp01((rawScore + bonus) / 100) * 100);

  return {
    apt,
    profile,
    sub,
    score,
    reason: buildReason(answers, apt, profile, sub, freeTextSentences),
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
