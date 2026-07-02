/**
 * Configuração Supabase — usada pelo Matching Inteligente para:
 *   1. Salvar leads (tabela `matching_leads`, veja sql/matching_leads.sql)
 *   2. Opcionalmente checar disponibilidade real (tabela `apartment_availability`,
 *      veja sql/apartment_availability.sql) — se você já tem esse controle no
 *      seu outro sistema, me diga a tabela/colunas reais que eu adapto o código.
 *
 * Como configurar (site estático, sem build step):
 * 1. No Supabase: Project Settings → API → copie a "Project URL" e a
 *    "anon public key". A anon key é pública por design — a segurança real
 *    vem das políticas de RLS definidas no SQL (insert-only para o público).
 * 2. Preencha os valores abaixo OU (recomendado, evita commitar a URL/key
 *    fixas no HTML) defina antes do <script type="module" src=".../main.js">:
 *
 *      <script>
 *        window.RF_SUPABASE = {
 *          url: 'https://SEU-PROJETO.supabase.co',
 *          anonKey: 'eyJ...'
 *        };
 *      </script>
 *
 * Sem configuração, o Matching Inteligente continua funcionando normalmente
 * (score, ranking, explicações) — apenas não persiste leads no banco nem
 * checa disponibilidade real; o hóspede ainda pode reservar via WhatsApp.
 */

export const SUPABASE_CONFIG = {
  url: '',
  anonKey: '',
};

export function getSupabaseConfig() {
  const globalCfg = typeof window !== 'undefined' ? window.RF_SUPABASE : null;
  return { ...SUPABASE_CONFIG, ...(globalCfg || {}) };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url?.trim() && anonKey?.trim());
}
