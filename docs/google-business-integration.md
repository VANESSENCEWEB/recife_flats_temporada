# Integração Google Business Profile

Seção `<rf-location-section>` na home (`#localizacao`) com:

- Mapa embed do Google Business Profile (sem API key)
- Benefícios de Boa Viagem / Pina
- Botões **Ver no Google Maps** e **Traçar rota**
- Avaliações via **Places API (New)** quando configurada
- JSON-LD `LodgingBusiness` para SEO local

## O que já funciona sem API key

| Recurso | Como |
|---------|------|
| Mapa interativo | iframe do embed oficial |
| Endereço exato | Av. Eng. Domingos Ferreira, 2041 — Boa Viagem |
| Direções | Link `Traçar rota` → Google Maps |
| Avaliações | Link "Ver todas no Google" + nota fallback 4.9 |

## Ativar avaliações reais no site

### 1. Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie ou selecione um projeto
3. Ative **Places API (New)** (não a legada)
4. Em **APIs & Services → Credentials**, crie uma **API Key**
5. Restrinja a chave:
   - **Application restrictions**: HTTP referrers
   - Domínios: `recifeflatstemporada.com/*`, `localhost:*`
   - **API restrictions**: apenas Places API (New)

### 2. Obter o Place ID

1. Abra o [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Busque **Recife Flats Temporada** em Boa Viagem
3. Copie o ID no formato `ChIJ...`

### 3. Configurar no projeto

**Opção A — arquivo de config** (`scripts/config/google-maps.config.js`):

```js
export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'SUA_CHAVE_AQUI',
  placeId: 'ChIJ...', // opcional; se vazio, resolve via textQuery
  textQuery: 'Recife Flats Temporada, Av. Eng. Domingos Ferreira 2041, Boa Viagem, Recife, PE',
};
```

**Opção B — sem commitar a chave** (recomendado em produção):

```html
<script>
  window.RF_GOOGLE_MAPS = {
    apiKey: 'SUA_CHAVE_AQUI',
    placeId: 'ChIJ...',
  };
</script>
<script type="module" src="./scripts/main.js"></script>
```

### 4. Como funciona `loadReviews()`

```js
import { loadReviews } from './scripts/utils/google-reviews.js';

const data = await loadReviews();
// data.rating, data.userRatingCount, data.reviews[], data.live
```

- Com API key: `fetch` na Places API (New) → até 5 reviews com texto
- Sem API key: fallback com nota 4.9 e link para o Google Maps

## Alternativa: Elfsight

Widgets como [Elfsight Google Reviews](https://elfsight.com/google-reviews-widget/) funcionam sem código, mas:

- Dependência de terceiros e possível custo mensal
- Menos controle visual sobre o design system
- Para este projeto, a **Places API** integra melhor ao visual cream/teal

## SEO local — checklist

- [x] Mapa embed com endereço real do perfil
- [x] Schema.org `LodgingBusiness` + `AggregateRating`
- [x] Links para perfil e avaliações no Google
- [ ] Manter NAP consistente (nome, endereço, telefone) em todo o site
- [ ] Pedir avaliações a hóspedes satisfeitos via link do Google Business

## Arquivos

| Arquivo | Função |
|---------|--------|
| `scripts/data/location.js` | Endereço, embed URL, benefícios |
| `scripts/config/google-maps.config.js` | API key e Place ID |
| `scripts/utils/google-reviews.js` | `loadReviews()`, `renderStars()` |
| `scripts/components/location-section.js` | Web Component da seção |
| `styles/components/location-section.css` | Estilos responsivos |

## Reaproveitado do site atual

Conteúdo adaptado de [recifeflatstemporada.com](https://recifeflatstemporada.com/):

- Benefícios Boa Viagem / Pina / vantagem prática
- Nota 4.9 e foco em localização privilegiada
- CTAs de mapa e avaliações Google
