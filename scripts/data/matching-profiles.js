/**
 * Atributos de matching — complementam os dados de apartamentos.js
 * (capacidade, estacionamento e piscina booleanos já vivem lá).
 *
 * Aqui ficam os atributos que só existem para o algoritmo de compatibilidade:
 *   - parkingType   : 'fixo' | 'rotativo' | 'nenhum'
 *   - poolType       : 'rooftop' | 'terreo' | 'nenhum'
 *   - wifiTier       : 'alta' | 'padrao'
 *   - budgetTier     : 'economico' | 'medio' | 'alto'
 *   - objectiveFit   : { [objetivo]: 0..1 } — o quanto o apê serve bem cada objetivo
 *   - highlightReasons: frase pronta por objetivo, usada na explicação do resultado
 */

/** @typedef {{
 *   parkingType: 'fixo' | 'rotativo' | 'nenhum',
 *   poolType: 'rooftop' | 'terreo' | 'nenhum',
 *   wifiTier: 'alta' | 'padrao',
 *   budgetTier: 'economico' | 'medio' | 'alto',
 *   objectiveFit: Record<string, number>,
 *   highlightReasons: Record<string, string>,
 * }} MatchingProfile */

/** @type {Record<string, MatchingProfile>} */
export const MATCHING_PROFILES = {
  'apartamento-2-quartos-boa-viagem': {
    parkingType: 'rotativo',
    poolType: 'nenhum',
    wifiTier: 'alta',
    budgetTier: 'alto',
    objectiveFit: { familia: 1, casal: 0.55, trabalho_remoto: 0.6, turismo: 0.65 },
    highlightReasons: {
      familia: 'Apartamento espaçoso com 2 quartos e cozinha completa — perfeito para toda a família aproveitar Boa Viagem.',
      casal: 'Espaço confortável e privativo, a poucos passos da orla de Boa Viagem.',
      trabalho_remoto: 'Wi-Fi de alta velocidade e ambiente tranquilo em Boa Viagem para render no home office.',
      turismo: 'A 100 m da praia de Boa Viagem, com fácil acesso a restaurantes e comércio local.',
    },
  },

  'flat-golden-view-1006': {
    parkingType: 'rotativo',
    poolType: 'rooftop',
    wifiTier: 'alta',
    budgetTier: 'economico',
    objectiveFit: { familia: 0.4, casal: 0.9, trabalho_remoto: 0.7, turismo: 0.85 },
    highlightReasons: {
      casal: 'Compacto e aconchegante, com piscina na cobertura — perfeito para casais.',
      turismo: 'Piscina no rooftop e a poucos passos da praia e do Shopping Recife.',
      trabalho_remoto: 'Wi-Fi de alta velocidade e portaria 24h para trabalhar com tranquilidade.',
      familia: 'Ideal para famílias pequenas que querem praticidade perto da praia.',
    },
  },

  'studio-203-boa-viagem': {
    parkingType: 'nenhum',
    poolType: 'nenhum',
    wifiTier: 'padrao',
    budgetTier: 'economico',
    objectiveFit: { familia: 0.15, casal: 1, trabalho_remoto: 0.5, turismo: 0.6 },
    highlightReasons: {
      casal: 'Studio aconchegante e privativo, pensado especialmente para casais.',
      turismo: 'Ótima localização em Boa Viagem, perto da praia e com acesso rápido ao aeroporto.',
      trabalho_remoto: 'Ambiente silencioso (22h–7h) para quem precisa de foco durante a estadia.',
      familia: 'Studio compacto para até 2 pessoas — para famílias maiores, considere um apartamento com mais quartos.',
    },
  },

  'apartamento-804-pina': {
    parkingType: 'fixo',
    poolType: 'terreo',
    wifiTier: 'alta',
    budgetTier: 'medio',
    objectiveFit: { familia: 0.9, casal: 0.5, trabalho_remoto: 0.6, turismo: 0.8 },
    highlightReasons: {
      familia: 'Dois quartos, piscina e garagem — conforto completo para a família no Pina.',
      turismo: 'Ao lado do Shopping RioMar, com piscina e fácil acesso à orla.',
      trabalho_remoto: 'Wi-Fi rápido e localização estratégica perto do polo empresarial do Pina.',
      casal: 'Espaço amplo com piscina e garagem — ótimo para casais que querem conforto extra.',
    },
  },
};

/** @param {string} slug */
export function getMatchingProfile(slug) {
  return MATCHING_PROFILES[slug] || null;
}
