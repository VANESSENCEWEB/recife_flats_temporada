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
    objectiveFit: { familia: 0.9, casal: 0.55, trabalho_remoto: 0.6, turismo: 0.65 },
    highlightReasons: {
      familia: 'Apartamento com 2 quartos e cozinha completa — ótimo para famílias de até 4 pessoas aproveitarem Boa Viagem.',
      casal: 'Espaço confortável e privativo, no Edifício Ipê, a 100 m da orla de Boa Viagem.',
      trabalho_remoto: 'Wi-Fi de alta velocidade e ambiente tranquilo em Boa Viagem para render no home office.',
      turismo: 'A 100 m da praia de Boa Viagem, em cima do comércio do bairro e perto de restaurantes.',
    },
  },

  'flat-golden-view-1006': {
    parkingType: 'rotativo',
    poolType: 'rooftop',
    wifiTier: 'alta',
    budgetTier: 'economico',
    objectiveFit: { familia: 0.1, casal: 1, trabalho_remoto: 0.65, turismo: 0.85 },
    highlightReasons: {
      casal: 'Compacto e aconchegante (até 2 pessoas), com piscina na cobertura — perfeito para casais.',
      turismo: 'Piscina no rooftop e a poucos passos da praia e do Shopping Recife.',
      trabalho_remoto: 'Wi-Fi de alta velocidade e ambiente tranquilo para trabalhar no Edifício Golden View.',
      familia: 'Apartamento compacto para até 2 pessoas — para famílias, considere um apê com mais quartos.',
    },
  },

  'studio-203-boa-viagem': {
    parkingType: 'rotativo',
    poolType: 'nenhum',
    wifiTier: 'padrao',
    budgetTier: 'economico',
    objectiveFit: { familia: 0.15, casal: 1, trabalho_remoto: 0.5, turismo: 0.6 },
    highlightReasons: {
      casal: 'Studio aconchegante e privativo no Edifício Ipê, a 100 m da praia — pensado especialmente para casais.',
      turismo: 'A 100 m da praia de Boa Viagem, no mesmo prédio do Apartamento 105, com acesso rápido ao aeroporto.',
      trabalho_remoto: 'Ambiente silencioso (22h–7h) para quem precisa de foco durante a estadia.',
      familia: 'Studio compacto para até 2 pessoas — para famílias maiores, considere um apartamento com mais quartos.',
    },
  },

  'apartamento-804-pina': {
    parkingType: 'fixo',
    poolType: 'terreo',
    wifiTier: 'alta',
    budgetTier: 'medio',
    objectiveFit: { familia: 1, casal: 0.5, trabalho_remoto: 0.6, turismo: 0.8 },
    highlightReasons: {
      familia: 'Dois quartos, piscina no térreo, 2 banheiros e sofá-cama — comporta até 6 pessoas no Edifício Forte São Pedro.',
      turismo: 'Ao lado do Shopping RioMar e o apê mais próximo do Centro do Recife da nossa coleção.',
      trabalho_remoto: 'Wi-Fi rápido e localização estratégica perto do Centro e do polo empresarial do Pina.',
      casal: 'Espaço amplo com piscina, TV de 70" e garagem — ótimo para casais que querem conforto extra.',
    },
  },
};

/** @param {string} slug */
export function getMatchingProfile(slug) {
  return MATCHING_PROFILES[slug] || null;
}
