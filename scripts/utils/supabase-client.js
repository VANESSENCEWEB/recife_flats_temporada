/**
 * supabase-client.js — Integração leve com Supabase via CDN (ESM), sem build step.
 *
 * Usado pelo Matching Inteligente para:
 *   - saveMatchingLead(lead)      → grava em `matching_leads`
 *   - checkAvailability(slug,...) → consulta `apartment_availability` (opcional)
 *
 * Se o Supabase não estiver configurado (scripts/config/supabase.config.js),
 * as funções falham de forma silenciosa e o site continua funcionando
 * (o hóspede sempre pode seguir pelo WhatsApp).
 */

import { getSupabaseConfig, isSupabaseConfigured } from '../config/supabase.config.js';

let clientPromise = null;

async function getClient() {
  if (!isSupabaseConfigured()) return null;

  if (!clientPromise) {
    const { url, anonKey } = getSupabaseConfig();
    clientPromise = import('https://esm.sh/@supabase/supabase-js@2')
      .then(({ createClient }) => createClient(url, anonKey))
      .catch((err) => {
        console.warn('[supabase] falha ao carregar o client:', err);
        return null;
      });
  }

  return clientPromise;
}

/**
 * Salva um lead capturado pelo Matching Inteligente.
 * @param {{
 *   name: string, email?: string, whatsapp: string,
 *   checkin?: string, checkout?: string,
 *   preferredSlug?: string, guests?: number,
 *   objective?: string, budget?: string, answers?: object,
 * }} lead
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function saveMatchingLead(lead) {
  const client = await getClient();

  if (!client) {
    console.info('[matching] Supabase não configurado — lead não persistido no banco:', lead);
    return { ok: false, reason: 'not-configured' };
  }

  try {
    const { error } = await client.from('matching_leads').insert([{
      name: lead.name,
      email: lead.email || null,
      whatsapp: lead.whatsapp,
      desired_checkin: lead.checkin || null,
      desired_checkout: lead.checkout || null,
      preferred_apartment_slug: lead.preferredSlug || null,
      guests: lead.guests || null,
      objective: lead.objective || null,
      budget_profile: lead.budget || null,
      match_answers: lead.answers || null,
      source: 'matching_inteligente',
    }]);

    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error('[matching] erro ao salvar lead:', err);
    return { ok: false, reason: err.message };
  }
}

/**
 * Verifica disponibilidade real de um apartamento (opcional).
 * Espera uma tabela `apartment_availability` com colunas:
 *   apartment_slug (text), blocked_from (date), blocked_until (date)
 *
 * @returns {Promise<boolean | null>} true = disponível, false = indisponível,
 *   null = não foi possível verificar (Supabase não configurado, tabela
 *   inexistente, ou erro) — nesse caso o site trata como "desconhecido"
 *   e não bloqueia a reserva via WhatsApp.
 */
export async function checkAvailability(slug, checkin, checkout) {
  const client = await getClient();
  if (!client || !checkin || !checkout) return null;

  try {
    const { data, error } = await client
      .from('apartment_availability')
      .select('blocked_from, blocked_until')
      .eq('apartment_slug', slug)
      .lte('blocked_from', checkout)
      .gte('blocked_until', checkin);

    if (error) throw error;
    return data.length === 0;
  } catch (err) {
    console.warn('[matching] checkAvailability indisponível:', err.message);
    return null;
  }
}
