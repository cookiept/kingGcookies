/* =========================================================
   LA COOKIE LOCAA — lógica do site
   Uma só script para as duas páginas:
   - início (body[data-pagina="inicio"])
   - receita (body[data-pagina="receita"][data-receita="id"])
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const pagina = document.body.dataset.pagina;
  const ICON = (n) => `assets/img/icons/${n}.png`;
  const SVG_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const SVG_RELOGIO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>';
  const SVG_SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- memória (só neste browser) ---------- */
  const guardar = (k, v) => { try { localStorage.setItem("kingg:" + k, JSON.stringify(v)); } catch (e) {} };
  const ler = (k, padrao) => {
    try { const v = localStorage.getItem("kingg:" + k); return v == null ? padrao : JSON.parse(v); }
    catch (e) { return padrao; }
  };
  const estado = {
    doses: Object.assign(Object.fromEntries(RECEITAS.map(r => [r.id, BASE_COOKIES])), ler("doses", {})),
    feitos: ler("feitos", {}),
    passosFeitos: ler("passosFeitos", {}),
    compras: ler("compras", RECEITAS.map(r => r.id)),
    comprado: ler("comprado", {})
  };
  const receita = (id) => RECEITAS.find(r => r.id === id);

  /* ---------- quantidades ---------- */
  const FRAC = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  function fracao(x) {
    const r = Math.max(0.25, Math.round(x * 4) / 4);
    const int = Math.floor(r), dec = +(r - int).toFixed(2);
    return (int || "") + (FRAC[dec] || "");
  }
  function quantidade(item, f) {
    const q = item.q * f;
    switch (item.u) {
      case "g":  return (q < 100 ? Math.max(1, Math.round(q)) : Math.round(q / 5) * 5) + " g";
      case "ml": return (q < 100 ? Math.max(1, Math.round(q)) : Math.round(q / 5) * 5) + " ml";
      case "cc": return fracao(q) + " c. chá";
      case "cs": return fracao(q) + " c. sopa";
      case "un": return fracao(Math.max(0.5, Math.round(q * 2) / 2));
    }
    return String(q);
  }
  function nomeItem(item, f) {
    if (item.u !== "un") return item.n;
    const r = Math.max(0.5, Math.round(item.q * f * 2) / 2);
    if (r === 0.5 && /ovo/.test(item.n)) return "ovo grande (bate-o e usa ≈25 g)";
    return r > 1 && item.plural ? item.plural : item.n;
  }
  const fator = (r) => estado.doses[r.id] / BASE_COOKIES;
  const texto = (t, r) => t.replace(/\{N\}/g, estado.doses[r.id]);

  /* nível: três barras em vez de coroas */
  const nivel = (n) => `<span class="nivel" aria-label="Nível: ${NIVEIS[n]}">
      <span class="nivel__barras" aria-hidden="true">${[1, 2, 3].map(i => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>
      ${NIVEIS[n]}</span>`;

  /* ---------- aviso ---------- */
  let avisoT;
  function avisar(msg) {
    const a = $("#aviso"); if (!a) return;
    a.textContent = msg; a.classList.add("ver");
    clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove("ver"), 2400);
  }

  /* ---------- menu no telemóvel ---------- */
  const menuBtn = $(".nav__menu"), menu = $("#nav-links");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const aberto = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!aberto));
      menuBtn.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
      menu.classList.toggle("aberto", !aberto);
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) { menuBtn.setAttribute("aria-expanded", "false"); menu.classList.remove("aberto"); }
    });
  }

  /* =========================================================
     CHUVA DE COOKIES (efeito e transição entre páginas)
     ========================================================= */
  const IMGS_CHUVA = ["assets/img/cookie.png", ...RECEITAS.map(r => r.imagem)];
  function gota({ inicioY = -160, dur = 1.6, atraso = 0, img }) {
    const el = document.createElement("img");
    el.src = img || IMGS_CHUVA[Math.floor(Math.random() * IMGS_CHUVA.length)];
    el.alt = ""; el.className = "chuva";
    const tam = 50 + Math.random() * 90;
    el.style.width = tam + "px";
    el.style.left = (Math.random() * 110 - 5) + "vw";
    el.style.top = inicioY + "px";
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = atraso + "s";
    el.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
    return el;
  }
  function chuva(n = 26) {
    if (reduzido) return;
    for (let i = 0; i < n; i++) gota({ dur: 1.8 + Math.random() * 2, atraso: Math.random() * .8 });
  }

  /* =========================================================
     CORTINA DE BOLACHAS (transição entre páginas)
     As bolachas caem e empilham-se até taparem o ecrã todo;
     a página muda por trás; na página nova, caem para fora.
     ========================================================= */
  const MINI = (src) => "assets/img/mini/" + src.split("/").pop();
  const IMGS_CORTINA = IMGS_CHUVA.map(MINI);
  IMGS_CORTINA.forEach(src => { const i = new Image(); i.src = src; });

  /* imagem da cortina: a versão vista de cima (topo) quando existir */
  const imgCortina = (img) => { const r = RECEITAS.find(x => x.imagem === img); return r && r.topo ? r.topo : MINI(img); };
  function gerarCortina(img, cor) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const cols = Math.max(4, Math.ceil(vw / 170));
    const cel = vw / cols, linhas = Math.ceil(vh / cel) + 1, tam = cel * 1.32;
    const bolachas = [];
    for (let l = 0; l <= linhas; l++) {
      for (let c = 0; c <= cols; c++) {
        for (const desvio of [0, 0.5]) {
          const x = (c + desvio) * cel - tam / 2 + (Math.random() - .5) * cel * .15;
          const y = (l + desvio) * cel - tam / 2 + (Math.random() - .5) * cel * .15;
          bolachas.push({
            x: Math.round(x), y: Math.round(y), s: Math.round(tam * (.92 + Math.random() * .16)),
            r: Math.round(Math.random() * 360),
            l, i: img ? imgCortina(img) : IMGS_CORTINA[Math.floor(Math.random() * IMGS_CORTINA.length)]
          });
        }
      }
    }
    return { linhas, bolachas, cor: cor || "#fbf6ee" };
  }
  function desenharCortina(cortina, fase) {
    const el = document.createElement("div");
    el.className = "cortina " + fase;
    el.style.setProperty("--fundo", cortina.cor || "#fbf6ee");
    el.setAttribute("aria-hidden", "true");
    const ultima = cortina.linhas;
    el.innerHTML = cortina.bolachas.map(b => {
      const entra = (ultima - b.l) * 55 + Math.random() * 90;   // de baixo para cima: empilham
      const sai = (ultima - b.l) * 40 + Math.random() * 70;     // as de baixo caem primeiro
      return `<img src="${b.i}" alt="" style="left:${b.x}px;top:${b.y}px;width:${b.s}px;--rot:${b.r}deg;--entra:${entra}ms;--sai:${sai}ms">`;
    }).join("");
    document.body.appendChild(el);
    return el;
  }

  function irPara(url, img, cor) {
    if (reduzido) { location.href = url; return; }
    const cortina = gerarCortina(img, cor);
    const el = desenharCortina(cortina, "a-entrar");
    const total = cortina.linhas * 55 + 90 + 520;
    setTimeout(() => el.classList.add("cheia"), total * .55);
    try { sessionStorage.setItem("kingg:cortina", JSON.stringify(cortina)); } catch (e) {}
    setTimeout(() => { location.href = url; }, total + 60);
  }

  (function chegada() {
    let cortina = null;
    try { cortina = JSON.parse(sessionStorage.getItem("kingg:cortina")); sessionStorage.removeItem("kingg:cortina"); } catch (e) {}
    const raiz = document.documentElement;
    if (!cortina) { raiz.classList.remove("cortina-pre"); return; }
    const el = desenharCortina(cortina, "pousada cheia");
    raiz.classList.remove("cortina-pre");
    const imgs = [...el.querySelectorAll("img")];
    const prontas = Promise.all(imgs.map(i => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())));
    Promise.race([prontas, new Promise(r => setTimeout(r, 400))]).then(() => {
      requestAnimationFrame(() => {
        el.classList.remove("pousada", "cheia");
        el.classList.add("a-sair");
        setTimeout(() => el.remove(), cortina.linhas * 40 + 70 + 700);
      });
    });
  })();

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-ir]");
    if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); irPara(link.getAttribute("href"), link.dataset.ir, link.dataset.cor); return; }
    const voltar = e.target.closest("[data-voltar]");
    if (voltar && !e.metaKey && !e.ctrlKey) { e.preventDefault(); irPara(voltar.getAttribute("href"), "assets/img/cookie.png"); }
  });
  /* ao voltar atrás no browser, a página vem da cache ainda tapada */
  window.addEventListener("pageshow", (e) => { if (e.persisted) document.querySelectorAll(".cortina").forEach(c => c.remove()); });

  /* =========================================================
     PÁGINA INICIAL
     ========================================================= */
  function iniciarInicio() {
    /* cookies espalhadas à volta do número (com sombra colorida desfasada) */
    const esp = $("#espalhadas");
    if (esp) {
      const imgs = RECEITAS.map(r => r.topoGrande);
      const sombras = ["#fbd0d9", "#ffe08a", "#cfe0ff", "#fbd0d9"];
      const pos = [[4, 12, 16, -16], [16, 40, 11, 12], [2, 72, 15, 20], [14, 94, 12, -10],
                   [96, 10, 15, 18], [84, 42, 12, -14], [98, 72, 16, 8], [86, 96, 12, -20]];
      esp.innerHTML = pos.map(([x, y, w, r], i) => `<img src="${imgs[i % imgs.length]}" alt="" style="left:${x}%;top:${y}%;width:${w}%;--r:${r}deg;--s:${sombras[i % sombras.length]}">`).join("");
    }
    const cartoes = $("#cartoes");
    const desenhar = (filtro) => {
      const lista = RECEITAS.filter(r => filtro === "todas" ? true : filtro === "recheio" ? /recheio/i.test(r.subtitulo) : String(r.nivel) === filtro);
      cartoes.innerHTML = lista.map(r => `
        <a class="b-card" href="${r.pagina}" data-ir="${r.imagem}" data-cor="${r.corSuave}" style="--cor:${r.cor};--suave:${r.corSuave}">
          <span class="b-card__img"><img src="${r.imagem}" alt=""></span>
          <span class="b-card__txt">
            <h3>${r.nome}</h3>
            <span class="b-card__desc">${r.subtitulo}</span>
            <span class="b-card__meta">${SVG_RELOGIO}${r.tempoTotal}<i aria-hidden="true">·</i>${nivel(r.nivel)}</span>
            <span class="b-card__base"><span>${BASE_COOKIES} cookies</span><span class="b-card__btn" aria-hidden="true">${SVG_SETA}</span></span>
          </span>
        </a>`).join("") || `<p class="b-vazio">Nenhuma cookie neste filtro.</p>`;
    };
    desenhar("todas");
    document.querySelectorAll("[data-filtro]").forEach(bt => bt.addEventListener("click", () => {
      document.querySelectorAll("[data-filtro]").forEach(x => x.setAttribute("aria-selected", String(x === bt)));
      desenhar(bt.dataset.filtro);
    }));
  }

  function iniciarLista() {
    desenharCompras();
    document.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-compra]");
      if (!chip) return;
      const id = chip.dataset.compra;
      estado.compras = estado.compras.includes(id) ? estado.compras.filter(x => x !== id) : [...estado.compras, id];
      guardar("compras", estado.compras); desenharCompras();
    });
    document.addEventListener("change", (e) => {
      const c = e.target.closest("[data-comprado]");
      if (c) { estado.comprado[c.dataset.comprado] = c.checked; guardar("comprado", estado.comprado); desenharCompras(); $(`[data-comprado="${c.dataset.comprado}"]`).focus(); }
    });
    $("#copiar-lista").addEventListener("click", async () => {
      const itens = desenharCompras().filter(([k]) => !estado.comprado[k]);
      const linhas = ["Lista de compras · La Cookie Locaa", ""].concat(itens.map(([, it]) => `• ${it.qtd} ${it.nome}`));
      try { await navigator.clipboard.writeText(linhas.join("\n")); avisar("Lista copiada."); }
      catch (e) { avisar("Não foi possível copiar. Tira um print."); }
    });
    $("#limpar-lista").addEventListener("click", () => { estado.comprado = {}; guardar("comprado", {}); desenharCompras(); });
  }

  /* lista de compras em forma de talão: junta ingredientes iguais e soma */
  const curto = (txt) => txt && txt.split(/[(,]/)[0].trim();
  const chave = (it) => (it.loja ? it.loja.n : curto(it.n)).toLowerCase();
  function itensCompra() {
    const mapa = new Map();
    RECEITAS.filter(r => estado.compras.includes(r.id)).forEach(r => {
      const f = fator(r);
      r.grupos.forEach(g => g.itens.forEach(it => {
        const k = chave(it);
        const a = mapa.get(k) || { q: 0, n: curto(it.n), loja: it.loja, u: it.u };
        a.q += it.q * f; mapa.set(k, a);
      }));
    });
    return [...mapa.entries()].map(([k, it]) => {
      if (it.loja) {
        const n = Math.max(1, Math.ceil(it.q / it.loja.por - 0.001));
        return [k, { qtd: String(n), nome: n > 1 ? it.loja.plural : it.loja.n, peso: it.q }];
      }
      return [k, { qtd: quantidade({ q: it.q, u: it.u }, 1), nome: it.n, peso: it.q }];
    }).sort((a, b) => b[1].peso - a[1].peso);
  }
  const codigoBarras = (() => {
    let x = 7, partes = [], pos = 0;
    for (let i = 0; i < 46; i++) {
      x = (x * 9301 + 49297) % 233280;
      const w = 1 + (x % 4), gap = 1 + ((x >> 3) % 3);
      partes.push(`var(--tinta-talao) ${pos}px ${pos + w}px, transparent ${pos + w}px ${pos + w + gap}px`);
      pos += w + gap;
    }
    return { css: `linear-gradient(90deg, ${partes.join(", ")})`, largura: pos };
  })();
  const SIM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function desenharCompras() {
    $("#compras-escolha").innerHTML = RECEITAS.map(r => `
      <button class="chip" aria-pressed="${estado.compras.includes(r.id)}" data-compra="${r.id}">
        <img src="${r.imagem}" alt="">${r.nome} · ${estado.doses[r.id]}
      </button>`).join("");
    const itens = itensCompra();
    const escolhidas = RECEITAS.filter(r => estado.compras.includes(r.id));
    const cookies = escolhidas.reduce((n, r) => n + estado.doses[r.id], 0);
    const agora = new Date();
    const dd = (n) => String(n).padStart(2, "0");
    const data = `${dd(agora.getDate())}/${dd(agora.getMonth() + 1)}/${agora.getFullYear()}`;
    const hora = `${dd(agora.getHours())}:${dd(agora.getMinutes())}`;
    const riscados = itens.filter(([k]) => estado.comprado[k]).length;
    const badge = $("#nav-badge"); if (badge) badge.textContent = itens.length - riscados;
    $("#talao").innerHTML = `
      <img class="talao__logo" src="assets/img/topo/bueno-mini.png" alt="">
      <p class="talao__marca">LA COOKIE LOCAA</p>
      <p class="talao__centro">Receitas caseiras<br>LISTA DE COMPRAS</p>
      <div class="talao__linha"><span>DATA ${data}</span><span>HORA ${hora}</span></div>
      <div class="talao__linha"><span>TALÃO Nº ${String(cookies).padStart(4, "0")}</span><span>OP. GONÇALO</span></div>
      <hr>
      ${escolhidas.length ? escolhidas.map(r => `<div class="talao__linha talao__receita"><span>${r.nome.toUpperCase()}</span><span>x${estado.doses[r.id]}</span></div>`).join("") : ""}
      <hr>
      <div class="talao__linha talao__cab"><span>QTD</span><span class="talao__art">ARTIGO</span></div>
      <ul class="talao__lista">
        ${itens.length ? itens.map(([k, it]) => `
          <li><label class="tal-item">
            <input type="checkbox" data-comprado="${k}" ${estado.comprado[k] ? "checked" : ""}>
            <span class="tal-item__caixa">${SIM}</span>
            <span class="tal-item__q">${it.qtd}</span>
            <span class="tal-item__n">${it.nome}</span>
          </label></li>`).join("")
          : `<li class="talao__vazio">*** NENHUMA RECEITA ESCOLHIDA ***</li>`}
      </ul>
      <hr class="talao__duplo">
      <div class="talao__linha talao__total"><span>ARTIGOS</span><span>${itens.length}</span></div>
      <div class="talao__linha talao__total"><span>NO CESTO</span><span>${riscados}/${itens.length}</span></div>
      <div class="talao__linha talao__total talao__grande"><span>COOKIES</span><span>${cookies}</span></div>
      <hr>
      <div class="talao__linha"><span>PAGAMENTO</span><span>MANTEIGA</span></div>
      <div class="talao__linha"><span>TROCO</span><span>0,00 MIGALHAS</span></div>
      <div class="talao__barras" style="background:${codigoBarras.css};width:${codigoBarras.largura}px" aria-hidden="true"></div>
      <p class="talao__centro">OBRIGADO E VOLTE SEMPRE<br>*** NÃO SERVE COMO FATURA ***</p>`;
    return itens;
  }

  /* =========================================================
     TEMPORIZADORES (só na página da receita)
     ========================================================= */
  const timers = [];
  let audio;
  const mmss = (s) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
  const segundos = (t) => Math.ceil((t.pausa != null ? t.pausa : t.fim - Date.now()) / 1000);
  function bip() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, .25, .5].forEach(d => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(.25, audio.currentTime + d); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + d + .2);
        o.start(audio.currentTime + d); o.stop(audio.currentTime + d + .22);
      });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
  function iniciarTempo(nome, minutos) {
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume && audio.resume(); } catch (e) {}
    const existente = timers.find(t => t.nome === nome);
    if (existente) { avisar("Esse temporizador já está a contar."); return existente; }
    const t = { id: String(Date.now() + Math.random()), nome, fim: Date.now() + minutos * 60000, pausa: null, tocou: false };
    timers.push(t); desenharDoca(); avisar(`Temporizador: ${minutos} min`);
    return t;
  }
  function desenharDoca() {
    const doca = $("#doca"); if (!doca) return;
    doca.innerHTML = timers.map(t => {
      const s = segundos(t);
      return `<div class="tempo-ativo ${s <= 0 ? "toca" : ""}" data-t="${t.id}">
        <span class="tempo-ativo__nome">${t.nome}</span>
        <span class="tempo-ativo__t">${s <= 0 ? "Pronto" : mmss(s)}</span>
        ${s > 0 ? `<button data-pausa>${t.pausa != null ? "Retomar" : "Pausa"}</button>` : ""}
        <button data-parar>${s <= 0 ? "OK" : "Parar"}</button>
      </div>`;
    }).join("");
    document.body.classList.toggle("com-doca", timers.length > 0);
  }

  /* =========================================================
     PÁGINA DA RECEITA
     ========================================================= */
  function iniciarReceita() {
    const r = receita(document.body.dataset.receita);
    const main = $("#receita");

    const SVG_COOKIE_IC = '<img src="assets/img/mini/cookie.png" alt="">';
    let observador;

    function desenhar() {
      const f = fator(r), feitos = estado.feitos[r.id] || {}, pf = estado.passosFeitos[r.id] || {};
      let idx = 0;
      const outras = RECEITAS.filter(x => x.id !== r.id);
      const nIng = r.grupos.reduce((n, g) => n + g.itens.length, 0);
      const fases = [...new Set(r.passos.map(p => p.fase))];

      /* cronologia: passos agrupados por fase, numeração contínua */
      let linha = "";
      fases.forEach((fase, fi) => {
        const passos = r.passos.map((p, i) => ({ p, i })).filter(x => x.p.fase === fase);
        linha += `<li class="r-fase"><span class="r-fase__n">Fase ${fi + 1}</span><h3>${fase}</h3><span class="r-fase__conta">${passos.length} ${passos.length > 1 ? "passos" : "passo"}</span></li>`;
        linha += passos.map(({ p, i }) => `
          <li class="r-passo ${pf[i] ? "feito" : ""}" data-passo="${i}">
            <span class="r-passo__num" aria-hidden="true">${i + 1}</span>
            <div class="r-passo__cartao" role="button" tabindex="0" aria-pressed="${!!pf[i]}">
              <img class="r-passo__ic" src="${ICON(p.icone)}" alt="">
              <div class="r-passo__corpo">
                <h4><span class="vh">Passo ${i + 1}: </span>${p.t}</h4>
                <p>${texto(p.d, r)}</p>
                <div class="r-passo__acoes">
                  ${p.min ? `<button class="mini" data-temp="${i}">${SVG_RELOGIO} ${p.min} min</button>` : ""}
                  <span class="r-passo__marca">${pf[i] ? "Feito" : "Toca para marcar como feito"}</span>
                </div>
              </div>
              <span class="r-passo__check" aria-hidden="true">${SVG_CHECK}</span>
            </div>
          </li>`).join("");
      });

      main.innerHTML = `
        <section class="r-hero">
          <div class="contentor r-hero__grelha">
            <div class="r-hero__foto"><img src="${r.imagem}" alt="Cookie ${r.nome}"></div>
            <div class="r-hero__texto">
              <a class="voltar" href="index.html#cookies" data-voltar>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg> Todas as cookies
              </a>
              <h1 class="r-hero__nome">${r.nome}</h1>
              <p class="r-hero__desc">${r.descricao}</p>
              <ul class="r-chips">
                <li><span class="r-chip__ic">${SVG_RELOGIO}</span><span><b>${r.tempoTotal}</b><small>tempo total</small></span></li>
                <li><span class="r-chip__ic"><img src="assets/img/mini/cookie.png" alt=""></span><span><b>${BASE_COOKIES} cookies</b><small>${r.pesoBola.split(" + ")[0]} cada</small></span></li>
                <li><span class="r-chip__ic"><img src="${ICON("forno")}" alt=""></span><span><b>${r.forno.split(" · ")[0]}</b><small>${r.forno.split(" · ")[1] || "forno"}</small></span></li>
                <li><span class="r-chip__ic r-chip__ic--nivel"><span class="nivel__barras" aria-hidden="true">${[1, 2, 3].map(i => `<i class="${i <= r.nivel ? "on" : ""}"></i>`).join("")}</span></span><span><b>${NIVEIS[r.nivel]}</b><small>${r.tempoAtivo} de mãos na massa</small></span></li>
              </ul>
              <a class="pilula" href="#precisas">Ver ingredientes ${SVG_SETA}</a>
            </div>
          </div>
        </section>

        <nav class="r-etapas" aria-label="Etapas da receita">
          <div class="contentor r-etapas__lista">
            <a href="#precisas" data-etapa="precisas"><span>1</span>Ingredientes</a>
            <a href="#preparacao" data-etapa="preparacao"><span>2</span>Preparação</a>
            <a href="#servir" data-etapa="servir"><span>3</span>Servir</a>
          </div>
        </nav>

        <section class="r-etapa contentor" id="precisas">
          <header class="r-etapa__cab">
            <span class="r-etapa__num">1</span>
            <div>
              <p class="r-etapa__olho">Etapa 1 de 3</p>
              <h2>O que precisas</h2>
              <p class="r-etapa__resumo">${nIng} ingredientes · ${r.equipamento.length} utensílios</p>
            </div>
          </header>
          <div class="r-precisas">
            <div class="r-bloco r-bloco--ing" id="ingredientes">
              <div class="r-bloco__cab">
                <h3 class="r-bloco__titulo">Ingredientes</h3>
                <div class="dose">
                  <span class="dose__texto">Cookies</span>
                  <div class="dose__ctrl">
                    <button data-dose="-1" aria-label="Menos cookies">−</button>
                    <span class="dose__num" aria-live="polite">${estado.doses[r.id]}</span>
                    <button data-dose="1" aria-label="Mais cookies">+</button>
                  </div>
                </div>
              </div>
              ${estado.doses[r.id] !== BASE_COOKIES ? `<p class="dose__nota">Quantidades para ${estado.doses[r.id]} cookies (a receita base é para ${BASE_COOKIES}). <button class="link" data-repor>Repor</button></p>` : ""}
              <div class="r-ing__grupos">
              ${r.grupos.map(g => `
                <div class="r-ing__grupo">
                  <h4 class="grupo__titulo">${g.titulo}</h4>
                  <ul class="lista-ing">${g.itens.map(it => {
                    const k = idx++;
                    const v = emVolume(it, f);
                    const nota = v && v.nota ? ` <em class="check__nota">${v.nota}</em>` : "";
                    return `
                    <li><label class="check">
                      <input type="checkbox" data-ing="${k}" ${feitos[k] ? "checked" : ""}>
                      <span class="check__caixa">${SVG_CHECK}</span>
                      <span class="check__q">${quantidade(it, f)}${v ? `<small>${v.q}</small>` : ""}</span>
                      <span class="check__txt">${it.n}${nota}</span>
                    </label></li>`; }).join("")}
                  </ul>
                </div>`).join("")}
              </div>
              <button class="mini" data-limpar-ing>Desmarcar ingredientes</button>
            </div>
            <div class="r-precisas__col">
              <div class="r-bloco">
                <h3 class="r-bloco__titulo">Equipamento</h3>
                <ul class="r-equip">${r.equipamento.map(e => `<li><img src="${ICON(e)}" alt=""><span>${EQUIPAMENTO[e]}</span></li>`).join("")}</ul>
              </div>
              <div class="r-bloco">
                <h3 class="r-bloco__titulo">Antes de começar</h3>
                <ul class="r-antes">${r.preparacao.map(p => `<li>${p}</li>`).join("")}</ul>
              </div>
            </div>
          </div>
        </section>

        <section class="r-etapa contentor" id="preparacao">
          <header class="r-etapa__cab">
            <span class="r-etapa__num">2</span>
            <div>
              <p class="r-etapa__olho">Etapa 2 de 3</p>
              <h2>Preparação</h2>
              <p class="r-etapa__resumo">${r.passos.length} passos em ${fases.length} fases · <span id="passos-conta"></span></p>
            </div>
          </header>
          <ol class="r-linha">${linha}</ol>
          <button class="mini r-recomecar" data-limpar-passos>Recomeçar passos</button>
        </section>

        <section class="r-etapa contentor" id="servir">
          <header class="r-etapa__cab">
            <span class="r-etapa__num">3</span>
            <div>
              <p class="r-etapa__olho">Etapa 3 de 3</p>
              <h2>Servir e guardar</h2>
            </div>
          </header>
          <ul class="r-notas">${r.dicas.map(d => `<li><img src="${ICON("grade")}" alt="">${d}</li>`).join("")}</ul>
        </section>

        <section class="r-outras contentor">
          <h2 class="i-titulo">Outras receitas</h2>
          <div class="i-grelha i-grelha--2">${outras.map(o => `
            <a class="i-cookie" href="${o.pagina}" data-ir="${o.imagem}" data-cor="${o.corSuave}" style="--cor:${o.cor};--suave:${o.corSuave}">
              <span class="i-cookie__img"><img src="${o.imagem}" alt=""></span>
              <h3>${o.nome}</h3>
              <p>${o.subtitulo}</p>
              <span class="i-cookie__meta">${SVG_RELOGIO}${o.tempoTotal}<i aria-hidden="true">·</i>${nivel(o.nivel)}</span>
            </a>`).join("")}
          </div>
        </section>`;
      contarPassos();

      /* destaca a etapa visível na barra */
      if (observador) observador.disconnect();
      if ("IntersectionObserver" in window) {
        observador = new IntersectionObserver((ents) => {
          ents.forEach(en => {
            if (!en.isIntersecting) return;
            document.querySelectorAll(".r-etapas a").forEach(a => a.classList.toggle("ativa", a.dataset.etapa === en.target.id));
          });
        }, { rootMargin: "-45% 0px -50% 0px" });
        ["precisas", "preparacao", "servir"].forEach(id => observador.observe(document.getElementById(id)));
      }
    }

    function contarPassos() {
      const pf = estado.passosFeitos[r.id] || {};
      const n = Object.values(pf).filter(Boolean).length;
      const el = $("#passos-conta"); if (el) el.textContent = `${n} feitos`;
    }

    desenhar();

    main.addEventListener("click", (e) => {
      const dose = e.target.closest("[data-dose]");
      if (dose) {
        estado.doses[r.id] = Math.min(36, Math.max(1, estado.doses[r.id] + Number(dose.dataset.dose)));
        guardar("doses", estado.doses); desenhar();
        $(`[data-dose="${dose.dataset.dose}"]`).focus();
        return;
      }
      if (e.target.closest("[data-repor]")) { estado.doses[r.id] = BASE_COOKIES; guardar("doses", estado.doses); desenhar(); return; }
      if (e.target.closest("[data-limpar-ing]")) { estado.feitos[r.id] = {}; guardar("feitos", estado.feitos); desenhar(); return; }
      if (e.target.closest("[data-limpar-passos]")) { estado.passosFeitos[r.id] = {}; guardar("passosFeitos", estado.passosFeitos); desenhar(); return; }
      const temp = e.target.closest("[data-temp]");
      if (temp) { const p = r.passos[+temp.dataset.temp]; iniciarTempo(p.t, p.min); return; }
      const cartao = e.target.closest(".r-passo__cartao");
      if (cartao) {
        const li = cartao.closest(".r-passo"), i = li.dataset.passo;
        const pf = estado.passosFeitos[r.id] = estado.passosFeitos[r.id] || {};
        pf[i] = !pf[i]; guardar("passosFeitos", estado.passosFeitos);
        li.classList.toggle("feito", pf[i]);
        cartao.setAttribute("aria-pressed", String(pf[i]));
        const marca = cartao.querySelector(".r-passo__marca"); if (marca) marca.textContent = pf[i] ? "Feito" : "Toca para marcar como feito";
        contarPassos(); return;
      }
    });
    main.addEventListener("keydown", (e) => {
      const c = e.target.closest && e.target.closest(".r-passo__cartao");
      if (c && e.target === c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); c.click(); }
    });
    main.addEventListener("change", (e) => {
      const ing = e.target.closest("[data-ing]");
      if (ing) { const m = estado.feitos[r.id] = estado.feitos[r.id] || {}; m[ing.dataset.ing] = ing.checked; guardar("feitos", estado.feitos); }
    });

    /* temporizadores */
    $("#doca").addEventListener("click", (e) => {
      const el = e.target.closest(".tempo-ativo"); if (!el) return;
      const i = timers.findIndex(t => t.id === el.dataset.t); if (i < 0) return;
      const t = timers[i];
      if (e.target.closest("[data-parar]")) timers.splice(i, 1);
      if (e.target.closest("[data-pausa]")) {
        if (t.pausa != null) { t.fim = Date.now() + t.pausa; t.pausa = null; } else t.pausa = t.fim - Date.now();
      }
      desenharDoca();
    });
    setInterval(() => {
      if (!timers.length) return;
      timers.forEach(t => { if (!t.tocou && segundos(t) <= 0) { t.tocou = true; bip(); avisar(`${t.nome}: tempo terminado`); } });
      desenharDoca();
    }, 1000);

  }

  /* rodapé: no telemóvel as secções começam fechadas */
  if (window.innerWidth < 761) document.querySelectorAll(".b-rodape__col[open]").forEach(d => d.removeAttribute("open"));

  /* menu do cabeçalho (todas as páginas) */
  const mb = $(".b-nav__menu"), mn = $("#b-menu");
  if (mb) {
    mb.addEventListener("click", () => {
      const ab = mb.getAttribute("aria-expanded") === "true";
      mb.setAttribute("aria-expanded", String(!ab)); mn.classList.toggle("aberto", !ab);
    });
    mn.addEventListener("click", (e) => { if (e.target.closest("a")) { mb.setAttribute("aria-expanded", "false"); mn.classList.remove("aberto"); } });
  }

  if (pagina === "inicio") iniciarInicio();
  if (pagina === "lista") iniciarLista();
  if (pagina === "receita") iniciarReceita();
})();
