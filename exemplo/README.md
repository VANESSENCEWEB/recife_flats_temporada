# Recife Flats

Website institucional para **Recife Flats** — 4 apartamentos por temporada em **Boa Viagem** e **Pina**, Recife (PE).

Design inspirado no template **Tripora** (pasta `mix/`), combinado com a paleta praia/oceano de Recife. Arquitetura **modular por componentes**, menu fixo com overlay fullscreen, scroll suave (Lenis), animações GSAP e **100% responsivo**.

## Apartamentos

| Imóvel | Bairro | Tipo | m² | Quartos | Hóspedes | Diária |
|--------|--------|------|-----|---------|----------|--------|
| Flat Atlântico Premium | Boa Viagem | flat | 62 | 2 | 4 | R$ 420 |
| Cobertura Boa Viagem | Boa Viagem | cobertura | 120 | 3 | 6 | R$ 580 |
| Studio Pina Beach | Pina | studio | 34 | 1 | 2 | R$ 220 |
| Apartamento Pina Varanda | Pina | apartamento | 70 | 2 | 4 | R$ 360 |

## Páginas

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Hero com vídeo, busca, 4 apartamentos, valores, depoimentos marquee |
| `apartamentos.html` | Catálogo com filtro por bairro, tipo e hóspedes |
| `sobre.html` | História, valores e números da empresa |
| `contato.html` | Formulário e canais de atendimento |

## Estrutura

```
├── index.html, apartamentos.html, sobre.html, contato.html
├── styles/
│   ├── main.css, tokens.css, base.css, utilities.css
│   └── components/   # navbar, menu, hero, property, footer…
├── scripts/
│   ├── main.js
│   ├── components/   # navbar, menu, hero, lenis, animations…
│   └── utils/
├── assets/
│   ├── images/mix/   # decorações do estilo mix
│   └── videos/       # vídeo do hero
└── mix/              # referência visual Tripora (Webflow export)
```

## Tecnologias

- HTML5 semântico + CSS modular + JavaScript ES modules (sem build)
- **GSAP 3 + ScrollTrigger** — animações e split text
- **Lenis** — scroll suave
- **Google Fonts** — Stack Sans Headline, Inter Tight, Source Serif 4

## Contato

- WhatsApp / telefone: **+55 81 99660-1178**
- E-mail: **contato@recifeflats.com.br**

## Como rodar localmente

```bash
python3 -m http.server 8000
# Abra http://localhost:8000
```

---

Feito com cuidado para receber bem cada hóspede em Recife.
