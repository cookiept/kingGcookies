/* =========================================================
   LA COOKIE LOCAA — lógica do site
   Páginas: inicio · receita · lista (body[data-pagina])
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pagina = document.body.dataset.pagina;
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ICON = (n) => `assets/img/icons/${n}.webp`;
  const MINI = "assets/img/mini/cookie.webp";
  const SVG = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    relogio: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
    seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    voltar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    cozinha: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6"/></svg>'
  };

  /* ---------- memória local (só neste browser) ---------- */
  const guardar = (k, v) => { try { localStorage.setItem("lcl:" + k, JSON.stringify(v)); } catch (e) {} };
  const ler = (k, padrao) => { try { const v = localStorage.getItem("lcl:" + k); return v == null ? padrao : JSON.parse(v); } catch (e) { return padrao; } };
  const estado = {
    doses: Object.assign(Object.fromEntries(RECEITAS.map(r => [r.id, BASE_COOKIES])), ler("doses", {})),
    feitos: ler("feitos", {}),
    passosFeitos: ler("passosFeitos", {}),
    compras: ler("compras", RECEITAS.map(r => r.id)),
    comprado: ler("comprado", {})
  };
  const receita = (id) => RECEITAS.find(r => r.id === id);
  const fator = (r) => estado.doses[r.id] / BASE_COOKIES;
  const texto = (t, r) => t.replace(/\{N\}/g, estado.doses[r.id]);
  const curto = (t) => t && t.split(/[(,]/)[0].trim();
  function quantidade(it, f) {
    const q = it.q * f;
    const n = q < 100 ? Math.max(1, Math.round(q)) : Math.round(q / 5) * 5;
    return n + (it.u === "ml" ? " ml" : " g");
  }

  let avisoT;
  function avisar(msg) {
    const a = $("#aviso"); if (!a) return;
    a.textContent = msg; a.classList.add("ver");
    clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove("ver"), 2600);
  }

  /* =========================================================
     CABEÇALHO: menu e pesquisa
     ========================================================= */
  const botaoMenu = $(".cab__menu"), gaveta = $("#gaveta");
  if (botaoMenu && gaveta) {
    const fechar = () => { botaoMenu.setAttribute("aria-expanded", "false"); botaoMenu.setAttribute("aria-label", "Abrir menu"); gaveta.classList.remove("aberta"); };
    botaoMenu.addEventListener("click", () => {
      if (botaoMenu.getAttribute("aria-expanded") === "true") return fechar();
      botaoMenu.setAttribute("aria-expanded", "true"); botaoMenu.setAttribute("aria-label", "Fechar menu"); gaveta.classList.add("aberta");
    });
    gaveta.addEventListener("click", (e) => { if (e.target.closest("a, button")) fechar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
  }

  /* pesquisa por nome, descrição ou ingrediente ("tenho Kinder em casa") */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const PARADAS = new Set("tenho tens em casa de do da dos das com sem uma um a o e as os para que quero queria fazer receita receitas cookie cookies algo".split(" "));
  const INDICE = RECEITAS.map(r => ({ r, txt: norm([r.nome, r.subtitulo, r.descricao, ...r.grupos.flatMap(g => g.itens.map(i => i.n))].join(" ")) }));
  function procurar(q) {
    const termos = norm(q || "").split(/[^a-z0-9]+/).filter(t => t.length > 1 && !PARADAS.has(t));
    if (!termos.length) return RECEITAS.slice();
    return INDICE.map(({ r, txt }) => ({ r, n: termos.filter(t => txt.includes(t) || (t.length > 4 && txt.includes(t.slice(0, -1)))).length }))
      .filter(x => x.n > 0).sort((a, b) => b.n - a.n).map(x => x.r);
  }
  const linhaResultado = (r) => `<li><a class="resultado" href="${r.pagina}" data-ir="${r.topoGrande}" data-cor="${r.corSuave}"><img src="${r.topo}" alt="" width="56" height="56"><span><b>${r.nome}</b><small>${r.subtitulo}</small></span></a></li>`;
  const dialogo = $("#pesquisa"), campo = $("#pesquisa-input"), listaPesq = $("#pesquisa-resultados");
  if (dialogo && campo) {
    const mostrar = () => {
      const res = procurar(campo.value);
      listaPesq.innerHTML = res.length ? res.map(linhaResultado).join("")
        : `<li class="pesquisa__dica">Nenhuma receita com “${campo.value.replace(/[<>&]/g, "")}”. Experimenta “chocolate”, “Nutella” ou “red velvet”.</li>`;
    };
    const abrir = () => { mostrar(); if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute("open", ""); campo.focus(); };
    $$("[data-pesquisa]").forEach(b => b.addEventListener("click", abrir));
    $$("[data-fechar-pesquisa]").forEach(b => b.addEventListener("click", () => dialogo.close()));
    campo.addEventListener("input", mostrar);
    campo.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); dialogo.close(); return; } if (e.key === "Enter") { e.preventDefault(); const a = $(".resultado", listaPesq); if (a) a.click(); } });
    dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName) && !dialogo.open) { e.preventDefault(); abrir(); }
    });
  }

  /* =========================================================
     TRANSIÇÃO: cortina com a cookie em que se carregou
     ========================================================= */
  const miniDe = (img) => { const r = RECEITAS.find(x => x.topoGrande === img || x.topo === img || x.imagem === img); return r ? r.topo : MINI; };
  function gerarCortina(img, cor) {
    const vw = innerWidth, vh = innerHeight;
    const cols = Math.max(4, Math.ceil(vw / 170)), cel = vw / cols, linhas = Math.ceil(vh / cel) + 1, tam = cel * 1.32;
    const bolachas = [], src = miniDe(img);
    for (let l = 0; l <= linhas; l++) for (let c = 0; c <= cols; c++) for (const d of [0, .5]) {
      bolachas.push({ x: Math.round((c + d) * cel - tam / 2 + (Math.random() - .5) * cel * .15), y: Math.round((l + d) * cel - tam / 2 + (Math.random() - .5) * cel * .15), s: Math.round(tam * (.92 + Math.random() * .16)), r: Math.round(Math.random() * 360), l, i: src });
    }
    return { linhas, bolachas, cor: cor || "" };
  }
  function desenharCortina(c, fase) {
    const el = document.createElement("div");
    el.className = "cortina " + fase; el.setAttribute("aria-hidden", "true");
    if (c.cor) el.style.setProperty("--fundo", c.cor);
    el.innerHTML = c.bolachas.map(b => `<img src="${b.i}" alt="" style="left:${b.x}px;top:${b.y}px;width:${b.s}px;--rot:${b.r}deg;--entra:${(c.linhas - b.l) * 55 + Math.random() * 90}ms;--sai:${(c.linhas - b.l) * 40 + Math.random() * 70}ms">`).join("");
    document.body.appendChild(el); return el;
  }
  function irPara(url, img, cor) {
    if (reduzido) { location.href = url; return; }
    const c = gerarCortina(img, cor), el = desenharCortina(c, "a-entrar"), total = c.linhas * 55 + 610;
    setTimeout(() => el.classList.add("cheia"), total * .55);
    try { sessionStorage.setItem("lcl:cortina", JSON.stringify(c)); } catch (e) {}
    setTimeout(() => { location.href = url; }, total + 60);
  }
  (function chegada() {
    let c = null;
    try { c = JSON.parse(sessionStorage.getItem("lcl:cortina")); sessionStorage.removeItem("lcl:cortina"); } catch (e) {}
    const raiz = document.documentElement;
    if (!c) { raiz.classList.remove("cortina-pre"); return; }
    const el = desenharCortina(c, "pousada cheia"); raiz.classList.remove("cortina-pre");
    const prontas = Promise.all([...el.querySelectorAll("img")].map(i => i.decode ? i.decode().catch(() => {}) : 0));
    Promise.race([prontas, new Promise(r => setTimeout(r, 400))]).then(() => requestAnimationFrame(() => {
      el.classList.remove("pousada", "cheia"); el.classList.add("a-sair");
      setTimeout(() => el.remove(), c.linhas * 40 + 800);
    }));
  })();
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-ir]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    const destino = a.getAttribute("href");
    const aqui = location.pathname.split("/").pop() || "index.html";
    if (destino.split("#")[0] === aqui) return;
    e.preventDefault(); if (dialogo && dialogo.open) dialogo.close();
    irPara(destino, a.dataset.ir, a.dataset.cor);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) $$(".cortina").forEach(c => c.remove()); });

  /* =========================================================
     PÁGINA INICIAL
     ========================================================= */
  function iniciarInicio() {
    /* filtros + pesquisa por ingrediente */
    let filtro = "todas";
    const input = $("#procura-input"), achados = $("#achados"), filtros = $("#filtros");
    if (filtros && achados) {
      filtros.innerHTML = FILTROS.map(f => `<button class="chip" type="button" aria-pressed="${f.id === filtro}" data-filtro="${f.id}">${f.nome}</button>`).join("");
      const atualizar = () => {
        const res = procurar(input ? input.value : "").filter(r => filtro === "todas" || r.tags.includes(filtro));
        achados.innerHTML = res.length ? res.map(linhaResultado).join("") : `<li class="achados__vazio">Nenhuma receita com estes critérios. Tira um filtro ou experimenta outro ingrediente.</li>`;
      };
      filtros.addEventListener("click", (e) => {
        const b = e.target.closest("[data-filtro]"); if (!b) return;
        filtro = b.dataset.filtro; $$("[data-filtro]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); atualizar();
      });
      if (input) {
        input.addEventListener("input", atualizar);
        input.closest("form") && input.closest("form").addEventListener("submit", (e) => { e.preventDefault(); const a = $(".resultado", achados); if (a) a.click(); });
      }
      atualizar();
    }

    /* foto do chef: enquanto não existir, mostra a mascote */
    const foto = $(".chef__foto img");
    if (foto) {
      const trocar = () => { if (foto.dataset.provisoria && !foto.classList.contains("provisoria")) { foto.src = foto.dataset.provisoria; foto.classList.add("provisoria"); } };
      foto.addEventListener("error", trocar, { once: true });
      if (foto.complete && !foto.naturalWidth) trocar();
    }

    /* galeria da comunidade (só com fotos reais em COMUNIDADE) */
    if (COMUNIDADE.length && $("#comunidade")) {
      $("#comunidade").innerHTML = `<div class="fotos">${COMUNIDADE.map(f => {
        const r = receita(f.receita);
        return `<figure class="foto-com"><img src="${f.foto}" alt="${r ? r.nome : "Cookie"} feita por ${f.nome}" loading="lazy"><figcaption><b>${f.nome}</b>${f.texto || ""}</figcaption></figure>`;
      }).join("")}</div>`;
    }

    /* newsletter */
    const form = $("#news"), msg = $("#news-msg");
    if (form) form.addEventListener("submit", (e) => {
      const email = $("#news-email");
      if (!email.checkValidity()) { e.preventDefault(); msg.textContent = "Escreve um email válido, por exemplo nome@exemplo.pt."; email.focus(); return; }
      if (NEWSLETTER_ACAO) { form.action = NEWSLETTER_ACAO; form.method = "post"; form.target = "_blank"; msg.textContent = "Obrigado! Confirma a subscrição no teu email."; return; }
      e.preventDefault(); msg.textContent = "A newsletter ainda está a ser preparada. Volta em breve!";
    });

    /* migalhas a cair devagar com o scroll */
    if (!reduzido) {
      const migalhas = [];
      $$("main > section").forEach((s) => {
        if (getComputedStyle(s).position === "static") s.style.position = "relative";
        const caixa = document.createElement("div"); caixa.className = "migalhas"; caixa.setAttribute("aria-hidden", "true");
        for (let k = 0; k < 3; k++) {
          const m = document.createElement("span"); m.className = "migalha";
          m.style.left = (4 + Math.random() * 92) + "%"; m.style.top = (Math.random() * 60) + "%";
          m.dataset.v = (.06 + Math.random() * .1).toFixed(3); caixa.appendChild(m); migalhas.push([m, s]);
        }
        s.prepend(caixa);
      });
      let pedido = false;
      addEventListener("scroll", () => {
        if (pedido) return; pedido = true;
        requestAnimationFrame(() => {
          migalhas.forEach(([m, s]) => { const top = s.getBoundingClientRect().top; m.style.transform = `translateY(${Math.max(0, innerHeight - top) * m.dataset.v}px) rotate(${top * .2}deg)`; });
          pedido = false;
        });
      }, { passive: true });
    }
  }

  /* =========================================================
     LISTA DE COMPRAS (talão)
     ========================================================= */
  const chaveCompra = (it) => (it.loja ? it.loja.n : curto(it.n)).toLowerCase();
  function itensCompra() {
    const mapa = new Map();
    RECEITAS.filter(r => estado.compras.includes(r.id)).forEach(r => {
      const f = fator(r);
      r.grupos.forEach(g => g.itens.forEach(it => {
        const k = chaveCompra(it), a = mapa.get(k) || { q: 0, n: curto(it.n), loja: it.loja, u: it.u };
        a.q += it.q * f; mapa.set(k, a);
      }));
    });
    return [...mapa.entries()].map(([k, it]) => {
      if (it.loja) { const n = Math.max(1, Math.ceil(it.q / it.loja.por - 0.001)); return [k, { qtd: String(n), nome: n > 1 ? it.loja.plural : it.loja.n, peso: it.q }]; }
      return [k, { qtd: quantidade({ q: it.q, u: it.u }, 1), nome: it.n, peso: it.q }];
    }).sort((a, b) => b[1].peso - a[1].peso);
  }
  const barras = (() => {
    let x = 7, partes = [], pos = 0;
    for (let i = 0; i < 46; i++) { x = (x * 9301 + 49297) % 233280; const w = 1 + (x % 4), gap = 1 + ((x >> 3) % 3); partes.push(`var(--tinta-talao) ${pos}px ${pos + w}px, transparent ${pos + w}px ${pos + w + gap}px`); pos += w + gap; }
    return { css: `linear-gradient(90deg, ${partes.join(", ")})`, largura: pos };
  })();
  function desenharTalao() {
    $("#compras-escolha").innerHTML = RECEITAS.map(r => `<button class="chip" aria-pressed="${estado.compras.includes(r.id)}" data-compra="${r.id}"><img src="${r.topo}" alt="">${r.nome} · ${estado.doses[r.id]}</button>`).join("");
    const itens = itensCompra(), escolhidas = RECEITAS.filter(r => estado.compras.includes(r.id));
    const cookies = escolhidas.reduce((n, r) => n + estado.doses[r.id], 0);
    const d = new Date(), dd = (n) => String(n).padStart(2, "0");
    const riscados = itens.filter(([k]) => estado.comprado[k]).length;
    $("#talao").innerHTML = `
      <img class="talao__logo" src="assets/img/mascote.webp" alt="">
      <p class="talao__marca">LA COOKIE LOCAA</p>
      <p class="talao__centro">Receitas caseiras<br>LISTA DE COMPRAS</p>
      <div class="talao__linha"><span>DATA ${dd(d.getDate())}/${dd(d.getMonth() + 1)}/${d.getFullYear()}</span><span>HORA ${dd(d.getHours())}:${dd(d.getMinutes())}</span></div>
      <div class="talao__linha"><span>TALÃO Nº ${String(cookies).padStart(4, "0")}</span><span>OP. GONÇALO</span></div>
      <hr>${escolhidas.map(r => `<div class="talao__linha talao__receita"><span>${r.nome.toUpperCase()}</span><span>x${estado.doses[r.id]}</span></div>`).join("")}<hr>
      <div class="talao__linha talao__cab"><span>QTD</span><span class="talao__art">ARTIGO</span></div>
      <ul class="talao__lista">${itens.length ? itens.map(([k, it]) => `<li><label class="tal-item"><input type="checkbox" data-comprado="${k}" ${estado.comprado[k] ? "checked" : ""}><span class="tal-item__caixa">${SVG.check}</span><span class="tal-item__q">${it.qtd}</span><span class="tal-item__n">${it.nome}</span></label></li>`).join("") : `<li class="talao__vazio">*** NENHUMA RECEITA ESCOLHIDA ***</li>`}</ul>
      <hr class="talao__duplo">
      <div class="talao__linha talao__total"><span>ARTIGOS</span><span>${itens.length}</span></div>
      <div class="talao__linha talao__total"><span>NO CESTO</span><span>${riscados}/${itens.length}</span></div>
      <div class="talao__linha talao__total talao__grande"><span>COOKIES</span><span>${cookies}</span></div>
      <hr>
      <div class="talao__linha"><span>PAGAMENTO</span><span>MANTEIGA</span></div>
      <div class="talao__linha"><span>TROCO</span><span>0,00 MIGALHAS</span></div>
      <div class="talao__barras" style="background:${barras.css};width:${barras.largura}px" aria-hidden="true"></div>
      <p class="talao__centro">OBRIGADO E VOLTE SEMPRE<br>*** NÃO SERVE COMO FATURA ***</p>`;
    return itens;
  }
  function iniciarLista() {
    desenharTalao();
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-compra]"); if (!b) return;
      const id = b.dataset.compra;
      estado.compras = estado.compras.includes(id) ? estado.compras.filter(x => x !== id) : [...estado.compras, id];
      guardar("compras", estado.compras); desenharTalao(); $(`[data-compra="${id}"]`).focus();
    });
    document.addEventListener("change", (e) => {
      const c = e.target.closest("[data-comprado]"); if (!c) return;
      estado.comprado[c.dataset.comprado] = c.checked; guardar("comprado", estado.comprado); desenharTalao(); $(`[data-comprado="${c.dataset.comprado}"]`).focus();
    });
    $("#copiar-lista").addEventListener("click", async () => {
      const itens = desenharTalao().filter(([k]) => !estado.comprado[k]);
      try { await navigator.clipboard.writeText(["Lista de compras · La Cookie Locaa", "", ...itens.map(([, it]) => `• ${it.qtd} ${it.nome}`)].join("\n")); avisar("Lista copiada."); }
      catch (e) { avisar("Não foi possível copiar. Tira um print."); }
    });
    $("#limpar-lista").addEventListener("click", () => { estado.comprado = {}; guardar("comprado", {}); desenharTalao(); });
  }

  /* =========================================================
     TEMPORIZADORES
     ========================================================= */
  const timers = []; let audio;
  const mmss = (s) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
  const segundos = (t) => Math.ceil((t.pausa != null ? t.pausa : t.fim - Date.now()) / 1000);
  function bip() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, .25, .5].forEach(d => { const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audio.destination); g.gain.setValueAtTime(.25, audio.currentTime + d); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + d + .2); o.start(audio.currentTime + d); o.stop(audio.currentTime + d + .22); });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
  function iniciarTempo(nome, min) {
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume && audio.resume(); } catch (e) {}
    if (timers.some(t => t.nome === nome)) { avisar("Esse temporizador já está a contar."); return; }
    timers.push({ id: String(Date.now() + Math.random()), nome, fim: Date.now() + min * 60000, pausa: null, tocou: false });
    desenharDoca(); avisar(`Temporizador de ${min} min a contar.`);
  }
  function alternarTempo(t) {
    if (segundos(t) <= 0) timers.splice(timers.indexOf(t), 1);
    else if (t.pausa != null) { t.fim = Date.now() + t.pausa; t.pausa = null; } else t.pausa = t.fim - Date.now();
  }
  function desenharDoca() {
    const doca = $("#doca"); if (!doca) return;
    doca.innerHTML = timers.map(t => { const s = segundos(t); return `<div class="tempo ${s <= 0 ? "toca" : ""}" data-t="${t.id}"><span class="tempo__nome">${t.nome}</span><span class="tempo__t">${s <= 0 ? "Pronto!" : mmss(s)}</span>${s > 0 ? `<button data-pausa>${t.pausa != null ? "Retomar" : "Pausa"}</button>` : ""}<button data-parar>${s <= 0 ? "OK" : "Parar"}</button></div>`; }).join("");
  }

  /* =========================================================
     PÁGINA DA RECEITA
     ========================================================= */
  function iniciarReceita() {
    const r = receita(document.body.dataset.receita), main = $("#receita");
    const todos = r.grupos.flatMap(g => g.itens);
    const ingDoPasso = (i) => todos.filter(it => (it.p || []).includes(i + 1));
    const chipsDoPasso = (i, f) => ingDoPasso(i).map(it => `<span>${quantidade(it, f)} ${curto(it.n)}</span>`).join("");
    const fases = [...new Set(r.passos.map(p => p.fase))];
    const [fornoT, fornoM] = r.forno.split(" · ");
    let observador;

    function desenhar() {
      const f = fator(r), feitos = estado.feitos[r.id] || {}, pf = estado.passosFeitos[r.id] || {};
      let idx = 0, linha = "";
      fases.forEach((fase, fi) => {
        const lista = r.passos.map((p, i) => ({ p, i })).filter(x => x.p.fase === fase);
        linha += `<li class="fase"><small>Fase ${fi + 1}</small><h3>${fase}</h3></li>`;
        linha += lista.map(({ p, i }) => `
          <li class="passo ${pf[i] ? "feito" : ""}" data-passo="${i}">
            <span class="passo__num" aria-hidden="true">${i + 1}</span>
            <div class="passo__cartao" role="button" tabindex="0" aria-pressed="${!!pf[i]}">
              <img class="passo__ic" src="${ICON(p.icone)}" alt="" width="56" height="56" loading="lazy">
              <div>
                <h4><span class="vh">Passo ${i + 1}: </span>${p.t}</h4>
                <p>${texto(p.d, r)}</p>
                ${ingDoPasso(i).length ? `<div class="passo__ing" aria-label="Ingredientes deste passo">${chipsDoPasso(i, f)}</div>` : ""}
                <div class="passo__acoes">
                  ${p.min ? `<button class="mini" data-temp="${i}">${SVG.relogio} ${p.min} min</button>` : ""}
                  <span class="passo__marca">${pf[i] ? "Feito" : "Toca para marcar como feito"}</span>
                </div>
              </div>
              <span class="passo__check" aria-hidden="true">${SVG.check}</span>
            </div>
          </li>`).join("");
      });
      const outras = RECEITAS.filter(x => x.id !== r.id);
      main.innerHTML = `
        <section class="r-hero contentor">
          <div class="r-hero__grelha">
            <div class="r-hero__foto"><img src="${r.imagem}" alt="${r.alt}" width="900" height="560" fetchpriority="high"></div>
            <div>
              <a class="voltar" href="index.html#receitas" data-ir="${MINI}">${SVG.voltar} Todas as receitas</a>
              <h1 class="h1">${r.nome}</h1>
              <p class="lead">${r.descricao}</p>
              <ul class="factos">
                <li><span class="ic">${SVG.relogio}</span><span><b>${r.tempoTotal}</b><small>tempo total</small></span></li>
                <li><span class="ic"><img src="${r.topo}" alt=""></span><span><b>${BASE_COOKIES} unidades</b><small>${r.pesoBola.split(" + ")[0]} cada</small></span></li>
                <li><span class="ic"><img src="${ICON("forno")}" alt=""></span><span><b>${fornoT}</b><small>${fornoM || "forno"}</small></span></li>
                <li><span class="ic ic--larga"><span class="dificuldade" aria-hidden="true">${[1, 2, 3].map(n => `<img src="${MINI}" alt="" width="18" height="18" class="${n > r.nivel ? "off" : ""}">`).join("")}</span></span><span><b>${NIVEIS[r.nivel]}</b><small>${r.tempoAtivo} a trabalhar</small></span></li>
              </ul>
              <div class="r-hero__acoes">
                <a class="btn btn--acao" href="#precisas">Saltar para a receita ${SVG.seta}</a>
                <button class="btn btn--sec" data-acao="cozinhar">${SVG.cozinha} Modo cozinha</button>
              </div>
            </div>
          </div>
        </section>

        <nav class="etapas" aria-label="Etapas da receita">
          <div class="contentor etapas__lista">
            <a href="#precisas" data-etapa="precisas"><span>1</span>Ingredientes</a>
            <a href="#preparacao" data-etapa="preparacao"><span>2</span>Preparação</a>
            <a href="#servir" data-etapa="servir"><span>3</span>Servir</a>
          </div>
        </nav>

        <section class="etapa contentor" id="precisas" aria-labelledby="t-precisas" tabindex="-1">
          <div class="etapa__cab"><span class="etapa__num" aria-hidden="true">1</span><div><h2 class="h2" id="t-precisas">O que precisas</h2><small>${todos.length} ingredientes · ${r.equipamento.length} utensílios</small></div></div>
          <div class="precisas">
            <div class="bloco" id="ingredientes">
              <div class="bloco__cab">
                <h3>Ingredientes</h3>
                <div class="dose" role="group" aria-label="Número de cookies">
                  <span>Cookies</span>
                  <button data-dose="-1" aria-label="Menos cookies">−</button>
                  <output aria-live="polite">${estado.doses[r.id]}</output>
                  <button data-dose="1" aria-label="Mais cookies">+</button>
                </div>
              </div>
              ${estado.doses[r.id] !== BASE_COOKIES ? `<p class="dose__nota">Quantidades para ${estado.doses[r.id]} cookies (a receita base é para ${BASE_COOKIES}). <button data-repor>Repor</button></p>` : ""}
              ${r.grupos.map(g => `<div class="ing-grupo"><h4>${g.titulo}</h4><ul class="ing">${g.itens.map(it => {
                const k = idx++, v = emVolume(it, f), nota = v && v.nota ? ` <em>${v.nota}</em>` : "";
                return `<li><label class="check"><input type="checkbox" data-ing="${k}" ${feitos[k] ? "checked" : ""}><span class="check__caixa">${SVG.check}</span><span class="check__q">${quantidade(it, f)}${v ? `<small>${v.q}</small>` : ""}</span><span class="check__txt">${it.n}${nota}</span></label></li>`;
              }).join("")}</ul></div>`).join("")}
              <p><button class="mini" data-limpar-ing>Desmarcar ingredientes</button></p>
            </div>
            <div class="precisas__col">
              <div class="bloco"><h3>Utensílios</h3><ul class="equip">${r.equipamento.map(e => `<li><img src="${ICON(e)}" alt="" width="56" height="56" loading="lazy">${EQUIPAMENTO[e]}</li>`).join("")}</ul></div>
              <div class="bloco"><h3>Antes de começar</h3><ul class="antes">${r.preparacao.map(p => `<li>${p}</li>`).join("")}</ul></div>
            </div>
          </div>
        </section>

        <section class="etapa contentor" id="preparacao" aria-labelledby="t-prep">
          <div class="etapa__cab"><span class="etapa__num" aria-hidden="true">2</span><div><h2 class="h2" id="t-prep">Preparação</h2><small>${r.passos.length} passos em ${fases.length} fases · <span id="passos-conta"></span></small></div></div>
          <ol class="linha">${linha}</ol>
          <p class="linha__acoes"><button class="mini" data-limpar-passos>Recomeçar passos</button> <button class="mini" data-acao="cozinhar">${SVG.cozinha} Seguir em modo cozinha</button></p>
        </section>

        <section class="etapa contentor" id="servir" aria-labelledby="t-servir">
          <div class="etapa__cab"><span class="etapa__num" aria-hidden="true">3</span><div><h2 class="h2" id="t-servir">Servir e guardar</h2></div></div>
          <ul class="servir">${r.dicas.map(d => `<li><img src="${ICON("grade")}" alt="" width="44" height="44" loading="lazy">${d}</li>`).join("")}</ul>
        </section>

        <section class="sec contentor" aria-labelledby="t-outras">
          <div class="sec__cab"><h2 class="h2" id="t-outras">Outras receitas</h2></div>
          <div class="outras">${outras.map(o => `
            <a class="card" href="${o.pagina}" data-ir="${o.topoGrande}" data-cor="${o.corSuave}" style="--suave:${o.corSuave}">
              <div class="card__foto"><img class="card__topo" src="${o.topoGrande}" alt="${o.altTopo}" loading="lazy"></div>
              <div class="card__corpo"><h3 class="h3">${o.nome}</h3><div class="card__meta"><span>${SVG.relogio}${o.tempoTotal}</span><span>${BASE_COOKIES} unidades</span></div></div>
            </a>`).join("")}
          </div>
        </section>`;
      contarPassos();
      if (observador) observador.disconnect();
      if ("IntersectionObserver" in window) {
        observador = new IntersectionObserver((ents) => ents.forEach(en => { if (en.isIntersecting) $$(".etapas a").forEach(a => a.classList.toggle("ativa", a.dataset.etapa === en.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
        ["precisas", "preparacao", "servir"].forEach(id => observador.observe(document.getElementById(id)));
      }
    }
    function contarPassos() {
      const n = Object.values(estado.passosFeitos[r.id] || {}).filter(Boolean).length;
      const el = $("#passos-conta"); if (el) el.textContent = `${n} de ${r.passos.length} feitos`;
    }
    function marcar(i, valor) {
      const pf = estado.passosFeitos[r.id] = estado.passosFeitos[r.id] || {};
      pf[i] = valor === undefined ? !pf[i] : valor; guardar("passosFeitos", estado.passosFeitos);
      const li = $(`.passo[data-passo="${i}"]`);
      if (li) { li.classList.toggle("feito", pf[i]); $(".passo__cartao", li).setAttribute("aria-pressed", String(pf[i])); $(".passo__marca", li).textContent = pf[i] ? "Feito" : "Toca para marcar como feito"; }
      contarPassos();
    }
    desenhar();
    if (location.hash && location.hash !== "#cozinha") { const alvo = document.getElementById(location.hash.slice(1)); if (alvo) alvo.scrollIntoView(); }

    main.addEventListener("click", (e) => {
      const d = e.target.closest("[data-dose]");
      if (d) { estado.doses[r.id] = Math.min(36, Math.max(1, estado.doses[r.id] + Number(d.dataset.dose))); guardar("doses", estado.doses); desenhar(); $(`[data-dose="${d.dataset.dose}"]`).focus(); return; }
      if (e.target.closest("[data-repor]")) { estado.doses[r.id] = BASE_COOKIES; guardar("doses", estado.doses); desenhar(); $("[data-dose='1']").focus(); return; }
      if (e.target.closest("[data-limpar-ing]")) { estado.feitos[r.id] = {}; guardar("feitos", estado.feitos); desenhar(); return; }
      if (e.target.closest("[data-limpar-passos]")) { estado.passosFeitos[r.id] = {}; guardar("passosFeitos", estado.passosFeitos); desenhar(); return; }
      const t = e.target.closest("[data-temp]");
      if (t) { const p = r.passos[+t.dataset.temp]; iniciarTempo(p.t, p.min); return; }
      const c = e.target.closest(".passo__cartao");
      if (c) marcar(c.closest(".passo").dataset.passo);
    });
    main.addEventListener("keydown", (e) => {
      const c = e.target.closest && e.target.closest(".passo__cartao");
      if (c && e.target === c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); c.click(); }
    });
    main.addEventListener("change", (e) => {
      const i = e.target.closest("[data-ing]"); if (!i) return;
      (estado.feitos[r.id] = estado.feitos[r.id] || {})[i.dataset.ing] = i.checked; guardar("feitos", estado.feitos);
    });
    $("#doca").addEventListener("click", (e) => {
      const el = e.target.closest(".tempo"); if (!el) return;
      const t = timers.find(x => x.id === el.dataset.t); if (!t) return;
      if (e.target.closest("[data-parar]")) timers.splice(timers.indexOf(t), 1);
      if (e.target.closest("[data-pausa]")) alternarTempo(t);
      desenharDoca(); relogio();
    });
    setInterval(() => {
      if (!timers.length) return;
      timers.forEach(t => { if (!t.tocou && segundos(t) <= 0) { t.tocou = true; bip(); avisar(`${t.nome}: tempo terminado!`); } });
      desenharDoca(); relogio();
    }, 1000);

    /* ---------- modo cozinha ---------- */
    const coz = $("#cozinha"); let passo = 0, focoAntes = null, wake = null;
    async function ecraLigado() {
      const el = $("#cozinha-ligado");
      try { if ("wakeLock" in navigator) { wake = await navigator.wakeLock.request("screen"); el.textContent = "Ecrã sempre ligado"; el.classList.add("sim"); return; } } catch (e) {}
      el.textContent = ""; el.classList.remove("sim");
    }
    document.addEventListener("visibilitychange", () => { if (!coz.hidden && document.visibilityState === "visible") ecraLigado(); });
    function abrirCozinha() {
      if (!coz.hidden) return;
      focoAntes = document.activeElement;
      const pf = estado.passosFeitos[r.id] || {}; const primeiro = r.passos.findIndex((_, i) => !pf[i]);
      passo = primeiro < 0 ? 0 : primeiro;
      coz.hidden = false; document.body.classList.add("em-cozinha");
      ecraLigado(); desenharCozinha(); $("#cozinha-seg").focus();
      if (location.hash !== "#cozinha") history.replaceState(null, "", "#cozinha");
    }
    function fecharCozinha() {
      coz.hidden = true; document.body.classList.remove("em-cozinha");
      if (wake) { wake.release().catch(() => {}); wake = null; }
      if (location.hash === "#cozinha") history.replaceState(null, "", location.pathname);
      desenhar(); if (focoAntes && document.contains(focoAntes)) focoAntes.focus();
    }
    function desenharCozinha() {
      const total = r.passos.length, fim = passo >= total, palco = $("#cozinha-palco");
      $("#cozinha-progresso").style.width = Math.min(100, passo / total * 100) + "%";
      if (fim) {
        palco.innerHTML = `<div class="cozinha__fim"><img src="${r.topoGrande}" alt=""><p class="cozinha__passo">Receita concluída</p><h2 class="cozinha__titulo" id="cozinha-titulo">Estão prontas!</h2><p class="cozinha__texto">${estado.doses[r.id]} cookies prontas. Serve-as mornas.</p></div>`;
        $("#cozinha-seg").innerHTML = "Fechar";
      } else {
        const p = r.passos[passo], f = fator(r), ing = chipsDoPasso(passo, f);
        palco.innerHTML = `<p class="cozinha__passo">Passo ${passo + 1} de ${total} · ${p.fase}</p>
          <h2 class="cozinha__titulo" id="cozinha-titulo">${p.t}</h2>
          ${ing ? `<div class="cozinha__ing" aria-label="Ingredientes deste passo">${ing}</div>` : ""}
          <p class="cozinha__texto">${texto(p.d, r)}</p>
          <div id="cozinha-relogio"></div>`;
        $("#cozinha-seg").innerHTML = (passo === total - 1 ? "Terminar " : "Próximo ") + SVG.seta;
        relogio();
      }
      $("#cozinha-ant").style.visibility = passo === 0 ? "hidden" : "visible";
    }
    function relogio() {
      const box = $("#cozinha-relogio"); if (coz.hidden || !box) return;
      const p = r.passos[passo]; if (!p || !p.min) { box.innerHTML = ""; return; }
      const t = timers.find(x => x.nome === p.t), s = t ? segundos(t) : p.min * 60;
      const temFoco = document.activeElement && document.activeElement.id === "relogio-btn";
      box.innerHTML = `<div class="cozinha__relogio"><b>${t && s <= 0 ? "Pronto!" : mmss(s)}</b><button class="btn btn--acao btn--peq" id="relogio-btn">${t ? (s <= 0 ? "OK" : t.pausa != null ? "Retomar" : "Pausa") : "Iniciar"}</button></div>`;
      if (temFoco) $("#relogio-btn").focus();
    }
    coz.addEventListener("click", (e) => {
      if (!e.target.closest("#relogio-btn")) return;
      const p = r.passos[passo], t = timers.find(x => x.nome === p.t);
      if (!t) iniciarTempo(p.t, p.min); else alternarTempo(t);
      desenharDoca(); relogio();
    });
    $("#cozinha-seg").addEventListener("click", () => { if (passo >= r.passos.length) return fecharCozinha(); marcar(passo, true); passo++; desenharCozinha(); });
    $("#cozinha-ant").addEventListener("click", () => { if (passo > 0) { passo--; desenharCozinha(); } });
    $("#cozinha-fechar").addEventListener("click", fecharCozinha);
    document.addEventListener("keydown", (e) => {
      if (coz.hidden) return;
      if (e.key === "Escape") fecharCozinha();
      if (e.key === "ArrowRight") $("#cozinha-seg").click();
      if (e.key === "ArrowLeft") $("#cozinha-ant").click();
      if (e.key === "Tab") { const f = $$("button", coz).filter(b => b.offsetParent && b.style.visibility !== "hidden"); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    let x0 = null;
    coz.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    coz.addEventListener("touchend", (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 70) (dx < 0 ? $("#cozinha-seg") : $("#cozinha-ant")).click(); });
    document.addEventListener("click", (e) => { const b = e.target.closest('[data-acao="cozinhar"]'); if (b) { e.preventDefault(); if (gaveta) gaveta.classList.remove("aberta"); abrirCozinha(); } });
    if (location.hash === "#cozinha") abrirCozinha();
  }

  if (pagina === "inicio") iniciarInicio();
  if (pagina === "lista") iniciarLista();
  if (pagina === "receita") iniciarReceita();
})();
