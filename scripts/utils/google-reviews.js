/**
 * google-reviews.js — Carrega avaliações do Google Business Profile via Places API (New).
 *
 * Uso:
 *   const data = await loadReviews();
 *   // { rating, userRatingCount, reviews, googleMapsUri, placeId }
 */

import { getGoogleMapsConfig } from '../config/google-maps.config.js';
import { FALLBACK_REVIEWS } from '../data/location.js';

const PLACES_BASE = 'https://places.googleapis.com/v1';

function getApiKey() {
  const { apiKey } = getGoogleMapsConfig();
  return apiKey?.trim() || '';
}

async function placesFetch(path, { method = 'GET', body, fieldMask }) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Google Maps API key não configurada');

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': fieldMask,
  };

  const res = await fetch(`${PLACES_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Places API error ${res.status}: ${err}`);
  }

  return res.json();
}

/** Resolve Place ID via Text Search quando não configurado */
export async function resolvePlaceId(textQuery) {
  const { placeId } = getGoogleMapsConfig();
  if (placeId) return placeId;

  const data = await placesFetch('/places:searchText', {
    method: 'POST',
    fieldMask: 'places.id,places.displayName',
    body: { textQuery, languageCode: 'pt-BR' },
  });

  const id = data.places?.[0]?.id;
  if (!id) throw new Error('Place ID não encontrado para a busca informada');
  return id;
}

function normalizeReview(review) {
  return {
    rating: review.rating ?? 5,
    text: review.text?.text || review.originalText?.text || '',
    author: review.authorAttribution?.displayName || 'Hóspede Google',
    authorUri: review.authorAttribution?.uri || '',
    publishTime: review.publishTime || '',
    relativeTime: review.relativePublishTimeDescription || '',
  };
}

/**
 * Carrega rating e reviews do Google Business Profile.
 * Retorna fallback estático se API key não estiver configurada.
 */
export async function loadReviews() {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      ...FALLBACK_REVIEWS,
      live: false,
      placeId: null,
      googleMapsUri: null,
    };
  }

  try {
    const { textQuery } = getGoogleMapsConfig();
    const placeId = await resolvePlaceId(textQuery);

    const place = await placesFetch(`/places/${placeId}`, {
      fieldMask: [
        'id',
        'displayName',
        'rating',
        'userRatingCount',
        'googleMapsUri',
        'reviews',
      ].join(','),
    });

    const reviews = (place.reviews || [])
      .map(normalizeReview)
      .filter((r) => r.text);

    return {
      rating: place.rating ?? FALLBACK_REVIEWS.rating,
      userRatingCount: place.userRatingCount ?? FALLBACK_REVIEWS.userRatingCount,
      reviews: reviews.slice(0, 5),
      googleMapsUri: place.googleMapsUri || null,
      placeId: place.id || placeId,
      source: 'Google',
      live: true,
    };
  } catch (err) {
    console.warn('[loadReviews]', err.message);
    return {
      ...FALLBACK_REVIEWS,
      live: false,
      error: err.message,
    };
  }
}

/** Renderiza estrelas SVG para um rating 0–5 */
export function renderStars(rating, max = 5) {
  const rounded = Math.round(rating * 2) / 2;
  let html = '';
  for (let i = 1; i <= max; i++) {
    const filled = rounded >= i;
    const half = !filled && rounded >= i - 0.5;
    html += `<span class="location-stars__star${filled ? ' is-filled' : ''}${half ? ' is-half' : ''}" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    </span>`;
  }
  return html;
}
