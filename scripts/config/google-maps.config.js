/**
 * Configuração Google Maps / Places API
 *
 * Para avaliações reais via API:
 * 1. Crie um projeto em https://console.cloud.google.com
 * 2. Ative "Places API (New)"
 * 3. Crie uma API Key restrita por HTTP referrer (seu domínio)
 * 4. Cole a chave em `apiKey` abaixo OU defina antes do main.js:
 *    window.RF_GOOGLE_MAPS = { apiKey: 'SUA_CHAVE', placeId: 'ChIJ...' };
 *
 * Place ID: use https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
 * Busque "Recife Flats Temporada" em Boa Viagem.
 */

export const GOOGLE_MAPS_CONFIG = {
  /** Deixe vazio para usar apenas embed + links (sem fetch de reviews) */
  apiKey: '',

  /**
   * Place ID (formato ChIJ...). Se vazio, tenta resolver via textQuery.
   * Extraído do embed do Google Business Profile quando disponível.
   */
  placeId: '',

  textQuery:
    'Recife Flats Temporada, Av. Eng. Domingos Ferreira 2041, Boa Viagem, Recife, PE',
};

/** Mescla config do arquivo com override global (útil em produção sem commitar a chave) */
export function getGoogleMapsConfig() {
  const globalCfg = typeof window !== 'undefined' ? window.RF_GOOGLE_MAPS : null;
  return {
    ...GOOGLE_MAPS_CONFIG,
    ...(globalCfg || {}),
  };
}
