# Configurando o Supabase no ApartMatch (sem expor chaves no repositório público)

Este guia explica como ligar o Matching Inteligente ao seu banco Supabase
(leads + disponibilidade real) **sem** commitar `url`/`anonKey` no repositório
público do GitHub.

---

## 1. A anon key do Supabase é "pública por design" — mas dá pra evitar deixá-la no repo

A `anon key` do Supabase **não é um segredo** como uma senha de banco de dados:
ela é feita pra rodar no navegador de qualquer visitante do site. Quem
protege seus dados de verdade são as políticas de **Row Level Security (RLS)**
— e as tabelas deste projeto (`sql/matching_leads.sql` e
`sql/apartment_availability.sql`) já vêm com RLS configurado para permitir
**só** inserir leads e **só** ler disponibilidade, nada além disso.

Mesmo assim, como você pediu para não deixar isso no repositório público,
o caminho abaixo (Snippet Injection do Netlify) resolve 100% do problema:
**as chaves nunca aparecem no GitHub**, só no painel privado do Netlify.

---

## 2. Rode o SQL no Supabase

No **SQL Editor** do seu projeto Supabase, rode, nesta ordem:

1. `sql/matching_leads.sql` — cria a tabela de leads (obrigatório).
2. `sql/apartment_availability.sql` — cria a tabela de disponibilidade
   (**opcional**). Se você **já tem** uma tabela de reservas/disponibilidade
   no seu outro sistema, **não rode este script** — me passe o nome da
   tabela e das colunas (apartamento/slug, data de início e fim do
   bloqueio) que eu ajusto `scripts/utils/supabase-client.js` para
   consultar direto ali, sem duplicar dados.

## 3. Pegue a URL e a anon key do seu projeto

No Supabase: **Project Settings → API**. Copie:
- **Project URL** (algo como `https://xxxxxxxx.supabase.co`)
- **anon public key** (uma string longa começando com `eyJ...`)

## 4. Recomendado — injete as chaves só no Netlify (fora do Git)

No painel do Netlify, no site do projeto:

**Site configuration → Build & deploy → Post processing → Snippet injection**

Adicione um snippet em **"Before `</head>`"** com:

```html
<script>
  window.RF_SUPABASE = {
    url: "https://xxxxxxxx.supabase.co",
    anonKey: "eyJ...sua-anon-key-aqui..."
  };
</script>
```

Salve. Pronto — em todo deploy, o Netlify injeta esse `<script>` em todas
as páginas automaticamente, **antes** do `main.js` carregar. O código em
`scripts/config/supabase.config.js` já procura por `window.RF_SUPABASE`
primeiro; se existir, usa essas chaves. Nada disso fica no GitHub.

> Isso não exige nenhum "build step" novo — é um recurso nativo do Netlify
> para sites estáticos, exatamente o seu caso.

## 5. Alternativa — colocar direto no código (só se você preferir)

Se depois de ler o item 1 você decidir que não tem problema (é o mais comum
entre sites com Supabase), edite diretamente:

`scripts/config/supabase.config.js`

```js
export const SUPABASE_CONFIG = {
  url: 'https://xxxxxxxx.supabase.co',   // ← cole aqui
  anonKey: 'eyJ...',                      // ← cole aqui
};
```

Essas duas linhas são as únicas que precisam de edição. Tudo o resto do
código já está pronto para funcionar assim que essas variáveis existirem
(via `window.RF_SUPABASE` **ou** direto neste arquivo — o que vier
primeiro vence, com o `window.RF_SUPABASE` tendo prioridade).

## 6. Teste rápido

Depois de configurar (por qualquer um dos dois caminhos), abra o console
do navegador (F12) na home e rode:

```js
window.RF_SUPABASE // deve mostrar { url, anonKey } se veio via Netlify
```

Se você fizer o Matching Inteligente informando datas, o `checkAvailability()`
vai tentar consultar `apartment_availability` automaticamente. Sem
configuração, ele **não quebra nada** — apenas retorna "disponibilidade
desconhecida" e o hóspede segue pelo WhatsApp normalmente.

---

## Onde cada coisa mexe no código

| O que | Onde |
|---|---|
| Config das chaves | `scripts/config/supabase.config.js` |
| Salvar lead | `scripts/utils/supabase-client.js` → `saveMatchingLead()` |
| Checar disponibilidade | `scripts/utils/supabase-client.js` → `checkAvailability()` |
| Tabela de leads (SQL) | `sql/matching_leads.sql` |
| Tabela de disponibilidade (SQL, opcional) | `sql/apartment_availability.sql` |
