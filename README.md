<p align="center"><img src="assets/img/king-g.png" width="320" alt="King G"></p>

# Cookie's do King G 👑

> Sua Majestade decretou: cookies para todos.

Site com as três receitas de cookies do King G, cada uma para 6 cookies:

| Cookie | O que é |
|---|---|
| **Cookie de Chocolate Recheada** | Massa de chocolate com recheio de mousse de chocolate |
| **Cookie Kinder Bueno** | Com pedaços de Kinder Bueno e recheio de Nutella |
| **Cookie Red Velvet** | Red velvet com chocolate branco e de leite |

## O que o site faz

- **Página inicial** com as três cookies. Carregar numa abre a página dela, com uma chuva de cookies pelo meio.
- **Uma página por cookie** (`cookie-chocolate-recheada.html`, `cookie-kinder-bueno.html`, `cookie-red-velvet.html`) com:
  - tempos, forno, peso de cada cookie e nível de dificuldade;
  - "Antes de começar" e o equipamento necessário;
  - ingredientes com visto e **doses ajustáveis** (as quantidades recalculam-se);
  - passo a passo com **temporizadores** e "marcar como feito";
  - **modo cozinha**: um passo de cada vez, em letra grande; desliza para mudar de passo e o ecrã não se apaga.
- **Lista de compras** que junta as receitas escolhidas e soma as quantidades.
- **Livro de receitas**: [`livro.html`](livro.html) para imprimir, ou o PDF em [`docs/`](docs/Livro-Cookies-do-King-G.pdf).
- Pensado primeiro para telemóvel: menu próprio e barra fixa em baixo nas receitas.

## Estrutura

```
kingGcookies/
├── index.html            ← página inicial
├── cookie-chocolate-recheada.html  ← páginas das receitas (geradas, ver abaixo)
├── cookie-kinder-bueno.html
├── cookie-red-velvet.html
├── livro.html            ← livro de receitas para imprimir (A4)
├── css/
│   ├── estilo.css        ← cores, letras e layout da marca
│   └── fontes.css        ← fontes guardadas localmente
├── js/
│   ├── receitas.js       ← AS RECEITAS (muda quantidades e passos aqui)
│   └── app.js            ← a lógica do site
├── ferramentas/
│   ├── pagina.tpl        ← modelo das páginas das receitas
│   └── gerar.js          ← gera as páginas a partir do modelo
├── assets/
│   ├── img/              ← logo, cookies, ícones
│   └── fonts/
└── docs/
    └── Livro-Cookies-do-King-G.pdf
```

## Mudar uma receita

Abre `js/receitas.js`. Cada receita tem `grupos` (ingredientes) e `passos`.
As quantidades são para 6 cookies; o site faz as contas para outras doses.
Nos passos, `{N}` é trocado pelo número de cookies escolhido.

Se adicionares uma receita nova (ou mudares o nome ou a cor de uma), volta a gerar as páginas:

```bash
node ferramentas/gerar.js .
```

## Pôr o site online (GitHub Pages)

1. No GitHub, abre o repositório → **Settings** → **Pages**.
2. Em *Source* escolhe **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Guarda. Em 1–2 minutos fica em `https://cookiept.github.io/kingGcookies/`.

## Ver no computador

Basta abrir o `index.html` no browser. Ou, numa pasta com o projeto:

```bash
python3 -m http.server
# depois abre http://localhost:8000
```

---

Fontes: Luckiest Guy (Apache 2.0), Bebas Neue, Caveat, DM Sans e Jost (SIL OFL), via Fontsource.
