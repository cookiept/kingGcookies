/* =========================================================
   Gera todas as páginas do site a partir de js/receitas.js.
   Correr na pasta do projeto:   node ferramentas/gerar.js .
   ========================================================= */
const fs = require("fs"), path = require("path");
const site = path.resolve(process.argv[2] || ".");
const { RECEITAS, BASE_COOKIES, NIVEIS, emVolume } = require(path.join(site, "js/receitas.js"));

const MARCA = "La Cookie Locaa";
const DESCRICAO = "Cookies loucas, receitas simples. Três receitas caseiras de cookies grossas e macias, passo a passo, com modo cozinha.";
const GITHUB = "https://github.com/cookiept/kingGcookies";

/* ---------- ícones ---------- */
const SVG = {
  lupa: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  talao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21Z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  voltar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
  fechar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  passo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6"/></svg>',
  balanca: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 7l-3 7a3 3 0 0 0 6 0L7 7M17 7l-3 7a3 3 0 0 0 6 0l-3-7M12 4v16M8 20h8"/></svg>',
  sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>'
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dificuldade = (n) => `<span class="dificuldade" aria-label="Dificuldade: ${n} de 3 (${NIVEIS[n]})" title="${NIVEIS[n]}">${[1, 2, 3].map(i => `<img src="assets/img/mini/cookie.webp" alt="" width="18" height="18" class="${i > n ? "off" : ""}">`).join("")}</span>`;
const g = (q) => Math.round(q) + " g";

/* ---------- partes comuns ---------- */
function cabeca({ titulo, descricao, imagem, extra = "", cor = "" }) {
  return `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#fbf5ec" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1b120d" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:image" content="${imagem}">
  <link rel="icon" type="image/webp" href="assets/img/mascote.webp">
  <link rel="preload" href="assets/fonts/fredoka-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/site.css">
  <script>try{if(sessionStorage.getItem("lcl:cortina"))document.documentElement.classList.add("cortina-pre")}catch(e){}</script>
${extra}</head>
`;
}
function header(atual) {
  const cur = (k) => (atual === k ? ' aria-current="page"' : "");
  const modo = atual === "receita"
    ? `<a href="#cozinha" data-acao="cozinhar">Modo cozinha</a>`
    : `<a href="index.html#modo-cozinha"${cur("modo")}>Modo cozinha</a>`;
  return `  <header class="cab">
    <div class="contentor cab__dentro">
      <a class="marca" href="index.html" aria-label="${MARCA}, página inicial">
        <img src="assets/img/mascote.webp" alt="" width="40" height="40">
        <span>La Cookie <em>Locaa</em></span>
      </a>
      <nav class="cab__nav" aria-label="Principal">
        <a href="index.html#receitas"${cur("inicio")}>Receitas</a>
        <a href="index.html#chef">Sobre o chef</a>
        ${modo}
      </nav>
      <button class="icone-btn" type="button" data-pesquisa aria-label="Pesquisar receitas">${SVG.lupa}</button>
      <a class="icone-btn" href="lista.html" aria-label="Lista de compras"${cur("lista")}>${SVG.talao}</a>
      <button class="icone-btn cab__menu" type="button" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu">${SVG.menu}</button>
    </div>
    <nav class="cab__gaveta" id="gaveta" aria-label="Menu">
      <a href="index.html#receitas">Receitas</a>
      <a href="index.html#chef">Sobre o chef</a>
      ${atual === "receita" ? `<a href="#cozinha" data-acao="cozinhar">Modo cozinha</a>` : `<a href="index.html#modo-cozinha">Modo cozinha</a>`}
      <a href="lista.html">Lista de compras</a>
      <a href="livro.html">Livro de receitas (PDF)</a>
    </nav>
  </header>

  <dialog class="pesquisa" id="pesquisa" aria-label="Pesquisar receitas">
    <form method="dialog" class="pesquisa__campo" role="search">
      ${SVG.lupa}
      <label class="vh" for="pesquisa-input">Pesquisar receitas ou ingredientes</label>
      <input id="pesquisa-input" type="search" placeholder="Ex.: tenho Kinder em casa" autocomplete="off">
      <button class="icone-btn" value="fechar" aria-label="Fechar pesquisa">${SVG.fechar}</button>
    </form>
    <ul class="pesquisa__resultados" id="pesquisa-resultados" aria-live="polite"></ul>
  </dialog>
`;
}
function footer() {
  return `  <footer class="rodape">
    <div class="contentor">
      <div class="rodape__grelha">
        <div class="rodape__marca">
          <img src="assets/img/mascote.webp" alt="" width="72" height="72" loading="lazy">
          <div><b>${MARCA}</b><span>Até à próxima fornada!</span></div>
        </div>
        <div>
          <h2>Receitas</h2>
          <ul>${RECEITAS.map(r => `<li><a href="${r.pagina}" data-ir="${r.topoGrande}" data-cor="${r.corSuave}">${r.nome}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h2>Mais</h2>
          <ul>
            <li><a href="lista.html">Lista de compras</a></li>
            <li><a href="livro.html">Livro de receitas (PDF)</a></li>
            <li><a href="${GITHUB}" rel="noopener">${SVG.github} Código no GitHub</a></li>
          </ul>
        </div>
      </div>
      <p class="rodape__fim">© 2026 ${MARCA} · Receitas caseiras feitas com manteiga a mais.</p>
    </div>
  </footer>

  <div class="aviso" id="aviso" role="status" aria-live="polite"></div>
  <script src="js/receitas.js" defer></script>
  <script src="js/app.js" defer></script>
</body>
</html>
`;
}
const cartao = (r, lazy = true) => `
        <a class="card" href="${r.pagina}" data-ir="${r.topoGrande}" data-cor="${r.corSuave}" style="--suave:${r.corSuave}">
          <div class="card__foto">
            <img class="card__topo" src="${r.topoGrande}" alt="${esc(r.altTopo)}" width="520" height="520"${lazy ? ' loading="lazy"' : ""}>
            <img class="card__corte" src="${r.imagem}" alt="" width="900" height="560" loading="lazy">
          </div>
          <div class="card__corpo">
            <h3 class="h3">${r.nome}</h3>
            <div class="card__meta">
              <span>${SVG.relogio}${r.tempoTotal}</span>
              ${dificuldade(r.nivel)}
              <span>${BASE_COOKIES} unidades</span>
            </div>
          </div>
        </a>`;
const resultado = (r) => `<li><a class="resultado" href="${r.pagina}" data-ir="${r.topoGrande}" data-cor="${r.corSuave}"><img src="${r.topo}" alt="" width="56" height="56" loading="lazy"><span><b>${r.nome}</b><small>${r.subtitulo}</small></span></a></li>`;

/* ---------- página inicial ---------- */
function paginaInicial() {
  const demo = RECEITAS.find(r => r.id === "bueno");
  const passoDemo = 4;
  const p = demo.passos[passoDemo - 1];
  const ingDemo = demo.grupos.flatMap(x => x.itens).filter(it => it.p.includes(passoDemo));
  const primeira = RECEITAS.slice().sort((a, b) => a.nivel - b.nivel || a.totalMin - b.totalMin)[0];
  const total = RECEITAS.length * BASE_COOKIES;
  return cabeca({ titulo: `${MARCA} · Cookies loucas, receitas simples`, descricao: DESCRICAO, imagem: "assets/img/cookies/recheada.webp",
    extra: `  <link rel="preload" as="image" href="assets/img/cookies/recheada.webp">\n` }) + `<body data-pagina="inicio">
  <a class="saltar" href="#receitas">Saltar para as receitas</a>
${header("inicio")}
  <main>
    <section class="hero contentor" aria-labelledby="hero-titulo">
      <div class="hero__grelha">
        <div>
          <h1 class="h1 hero__titulo" id="hero-titulo">Cookies loucas.<span>Receitas simples.</span></h1>
          <p class="lead">Cookies grossas, douradas por fora e cremosas por dentro. Três receitas caseiras explicadas passo a passo, com modo cozinha para seguires com as mãos na massa.</p>
          <div class="hero__acoes">
            <a class="btn btn--acao" href="#receitas">Ver receitas ${SVG.seta}</a>
            <a class="link" href="${primeira.pagina}" data-ir="${primeira.topoGrande}" data-cor="${primeira.corSuave}">Fazer a minha primeira cookie ${SVG.seta}</a>
          </div>
        </div>
        <div class="hero__foto">
          <div class="hero__fundo" aria-hidden="true"></div>
          <img src="assets/img/cookies/recheada.webp" alt="Cookie de chocolate partida ao meio, com recheio de mousse de chocolate a escorrer" width="900" height="560" fetchpriority="high">
          <p class="hero__selo"><b>${total}</b>cookies em ${RECEITAS.length} receitas</p>
          <div class="mascote" tabindex="0" aria-label="Mascote da La Cookie Locaa">
            <img src="assets/img/mascote.webp" alt="" width="140" height="140">
            <span class="mascote__balao">Psst… prova a recheada!</span>
          </div>
        </div>
      </div>
    </section>

    <section class="sec contentor" id="receitas" aria-labelledby="receitas-titulo">
      <div class="sec__cab">
        <div>
          <p class="olho">As 3 cookies estrela</p>
          <h2 class="h2" id="receitas-titulo">Escolhe a tua cookie</h2>
        </div>
        <p>Passa por cima para veres por dentro.</p>
      </div>
      <div class="estrelas">${RECEITAS.map((r, i) => cartao(r, i > 0)).join("")}
      </div>
    </section>

    <section class="contentor" aria-labelledby="procura-titulo">
      <div class="procura">
        <p class="olho">Encontrar a receita certa</p>
        <h2 class="h2" id="procura-titulo">O que tens em casa?</h2>
        <div class="procura__campo">
          ${SVG.lupa}
          <label class="vh" for="procura-input">Pesquisar por receita ou ingrediente</label>
          <input id="procura-input" type="search" placeholder="Ex.: tenho Kinder em casa" autocomplete="off">
        </div>
        <div class="filtros" role="group" aria-label="Filtros" id="filtros"></div>
        <ul class="achados" id="achados" aria-live="polite">${RECEITAS.map(resultado).join("")}</ul>
      </div>
    </section>

    <section class="sec contentor" id="modo-cozinha" aria-labelledby="mc-titulo">
      <div class="mc">
        <div>
          <p class="olho">Modo cozinha</p>
          <h2 class="h2" id="mc-titulo">Um passo de cada vez, com as mãos na massa</h2>
          <ul class="mc__lista">
            <li><span class="ic">${SVG.passo}</span><span><b>Um passo de cada vez</b><span>Letra grande, para leres a um metro. Avanças com um toque ou a deslizar.</span></span></li>
            <li><span class="ic">${SVG.balanca}</span><span><b>Os ingredientes desse passo</b><span>Já com as quantidades certas para o número de cookies que escolheste.</span></span></li>
            <li><span class="ic">${SVG.relogio}</span><span><b>Temporizador</b><span>Toca quando acaba, mesmo que mudes de passo.</span></span></li>
            <li><span class="ic">${SVG.sol}</span><span><b>Ecrã sempre ligado</b><span>O telemóvel não escurece enquanto cozinhas.</span></span></li>
          </ul>
          <a class="btn btn--acao" href="${demo.pagina}#cozinha" data-ir="${demo.topoGrande}" data-cor="${demo.corSuave}">Experimentar o modo cozinha ${SVG.seta}</a>
        </div>
        <div class="telefone" aria-hidden="true">
          <div class="telefone__ecra">
            <div class="telefone__barra"><span></span></div>
            <span class="telefone__passo">Passo ${passoDemo} de ${demo.passos.length} · ${p.fase}</span>
            <p class="telefone__titulo">${p.t}</p>
            <div class="telefone__ing">${ingDemo.map(it => `<span>${g(it.q)} ${it.n.split(/[(,]/)[0].trim()}</span>`).join("")}</div>
            <p class="telefone__texto">${p.d}</p>
            <div class="telefone__relogio"><b>0${p.min}:00</b><span>Iniciar</span></div>
            <span class="telefone__ligado">Ecrã sempre ligado</span>
          </div>
        </div>
      </div>
    </section>

    <section class="sec contentor" id="chef" aria-labelledby="chef-titulo">
      <div class="chef">
        <div class="chef__foto">
          <img src="assets/img/eu.webp" alt="Gonçalo, o chef da La Cookie Locaa" width="360" height="360" loading="lazy" data-provisoria="assets/img/mascote.webp" onerror="this.onerror=null;this.src=this.dataset.provisoria;this.classList.add('provisoria')">
        </div>
        <div>
          <p class="olho">Sobre o chef</p>
          <h2 class="h2" id="chef-titulo">Olá, sou o Gonçalo</h2>
          <p>Faço cookies porque não há nada melhor do que partir uma ainda morna e ver o recheio a escorrer.</p>
          <p>Andei fornadas e fornadas atrás da cookie grossa das pastelarias, até acertar nas medidas. Agora partilho-as aqui, sem segredos.</p>
          <a class="link" href="#receitas">Ver as minhas receitas ${SVG.seta}</a>
        </div>
      </div>
    </section>

    <section class="contentor" aria-labelledby="social-titulo">
      <div class="sec__cab">
        <div>
          <p class="olho">Fiz e ficou assim</p>
          <h2 class="h2" id="social-titulo">As vossas fornadas</h2>
        </div>
      </div>
      <div id="comunidade">
        <div class="vazio-social">
          <div class="vazio-social__fotos" aria-hidden="true">${RECEITAS.map((r, i) => `<span style="--r:${[-8, 4, 10][i]}deg"><img src="${r.topo}" alt="" width="58" height="58" loading="lazy"></span>`).join("")}</div>
          <div>
            <h3 class="h3">Ainda não há fotos aqui</h3>
            <p>Esta galeria vai mostrar cookies feitas por quem seguiu as receitas. Fizeste uma? A tua fornada pode ser a primeira.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec contentor" aria-labelledby="news-titulo">
      <div class="news">
        <div>
          <h2 class="h2" id="news-titulo">Uma receita nova por mês.</h2>
          <p>Sem spam, só manteiga.</p>
        </div>
        <form class="news__form" id="news" novalidate>
          <label for="news-email">O teu email</label>
          <input id="news-email" type="email" name="email" placeholder="nome@exemplo.pt" autocomplete="email" required>
          <button class="btn btn--acao" type="submit">Quero receber</button>
          <p class="news__msg" id="news-msg" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </main>

${footer()}`;
}

/* ---------- página da lista de compras ---------- */
function paginaLista() {
  return cabeca({ titulo: `Lista de compras · ${MARCA}`, descricao: "A lista de compras das receitas da La Cookie Locaa, somada e pronta para riscar no supermercado.", imagem: "assets/img/monte.webp" }) + `<body data-pagina="lista">
  <a class="saltar" href="#talao">Saltar para a lista</a>
${header("lista")}
  <main class="contentor compras">
    <div class="compras__lado">
      <p class="olho">Missão supermercado</p>
      <h1 class="h2">Lista de compras</h1>
      <p class="lead">Escolhe as receitas que vais fazer. O talão junta os ingredientes e soma as quantidades, com as doses que escolheste em cada receita.</p>
      <div class="compras__escolha" id="compras-escolha"></div>
      <div class="compras__acoes">
        <button class="btn btn--acao" id="copiar-lista">Copiar lista</button>
        <button class="btn btn--sec" id="limpar-lista">Desmarcar tudo</button>
      </div>
    </div>
    <div class="talao-wrap"><div class="talao" id="talao" aria-label="Talão com a lista de compras"></div></div>
  </main>
${footer()}`;
}

/* ---------- página de cada receita (+ schema Recipe) ---------- */
const iso = (min) => `PT${Math.floor(min / 60) ? Math.floor(min / 60) + "H" : ""}${min % 60 ? (min % 60) + "M" : ""}`;
function schema(r) {
  const ing = r.grupos.flatMap(x => x.itens).map(it => `${Math.round(it.q)} ${it.u} ${it.n}`);
  return {
    "@context": "https://schema.org", "@type": "Recipe",
    name: r.nome, description: r.descricao,
    image: [r.imagem, r.topoGrande],
    author: { "@type": "Person", name: "Gonçalo" },
    recipeCategory: "Sobremesa", recipeCuisine: "Caseira", keywords: `cookies, ${r.nome.toLowerCase()}`,
    recipeYield: `${BASE_COOKIES} cookies`,
    prepTime: iso(r.ativoMin), cookTime: iso(r.fornoMin), totalTime: iso(r.totalMin),
    recipeIngredient: ing,
    recipeInstructions: r.passos.map(p => ({ "@type": "HowToStep", name: p.t, text: p.d.replace(/\{N\}/g, BASE_COOKIES) }))
  };
}
function paginaReceita(r) {
  return cabeca({
    titulo: `${r.nome} · ${MARCA}`, descricao: `${r.subtitulo}. Receita para ${BASE_COOKIES} cookies, passo a passo.`, imagem: r.imagem,
    extra: `  <script type="application/ld+json">${JSON.stringify(schema(r))}</script>\n`
  }) + `<body data-pagina="receita" data-receita="${r.id}" style="--suave:${r.corSuave}">
  <a class="saltar" href="#precisas">Saltar para a receita</a>
${header("receita")}
  <main id="receita"></main>

  <div class="barra-movel">
    <a href="#precisas">Ingredientes</a>
    <a href="#preparacao">Passos</a>
    <button class="btn--acao" data-acao="cozinhar">Modo cozinha</button>
  </div>

  <div class="cozinha" id="cozinha" role="dialog" aria-modal="true" aria-labelledby="cozinha-titulo" hidden>
    <div class="cozinha__topo">
      <b>${r.nome}</b>
      <button class="icone-btn" id="cozinha-fechar" aria-label="Fechar modo cozinha">${SVG.fechar}</button>
    </div>
    <div class="cozinha__barra"><span id="cozinha-progresso"></span></div>
    <div class="cozinha__ligado" id="cozinha-ligado"></div>
    <div class="cozinha__palco" id="cozinha-palco" aria-live="polite"></div>
    <div class="cozinha__nav">
      <button class="btn btn--sec" id="cozinha-ant">${SVG.voltar} Anterior</button>
      <button class="btn btn--acao" id="cozinha-seg">Próximo ${SVG.seta}</button>
    </div>
  </div>
  <div class="doca" id="doca" aria-live="polite"></div>
${footer()}`;
}

/* ---------- escrever ---------- */
const escrever = (nome, html) => { fs.writeFileSync(path.join(site, nome), html); console.log("criada", nome); };
escrever("index.html", paginaInicial());
escrever("lista.html", paginaLista());
RECEITAS.forEach(r => escrever(r.pagina, paginaReceita(r)));
