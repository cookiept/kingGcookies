/* =========================================================
   COOKIE'S DO KING G — lógica do site
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
      case "g":  return (q < 20 ? Math.max(1, Math.round(q)) : Math.round(q / 5) * 5) + " g";
      case "ml": return Math.max(5, Math.round(q / 5) * 5) + " ml";
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

  function gerarCortina(img) {
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
            l, i: Math.random() < .55 && img ? MINI(img) : IMGS_CORTINA[Math.floor(Math.random() * IMGS_CORTINA.length)]
          });
        }
      }
    }
    return { linhas, bolachas };
  }
  function desenharCortina(cortina, fase) {
    const el = document.createElement("div");
    el.className = "cortina " + fase;
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

  function irPara(url, img) {
    if (reduzido) { location.href = url; return; }
    const cortina = gerarCortina(img);
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
    if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); irPara(link.getAttribute("href"), link.dataset.ir); return; }
    const voltar = e.target.closest("[data-voltar]");
    if (voltar && !e.metaKey && !e.ctrlKey) { e.preventDefault(); irPara(voltar.getAttribute("href"), "assets/img/cookie.png"); }
  });
  /* ao voltar atrás no browser, a página vem da cache ainda tapada */
  window.addEventListener("pageshow", (e) => { if (e.persisted) document.querySelectorAll(".cortina").forEach(c => c.remove()); });

  /* =========================================================
     PÁGINA INICIAL
     ========================================================= */
  function iniciarInicio() {
    $("#cartoes").innerHTML = RECEITAS.map(r => `
      <a class="cartao" href="${r.pagina}" data-ir="${r.imagem}" style="--cor:${r.cor}">
        <img class="cartao__foto" src="${r.imagem}" alt="">
        <div class="etiquetas">
          <span class="etiqueta"><img class="etiqueta__ic" src="assets/img/mini/cookie.png" alt="">${BASE_COOKIES} cookies</span>
          <span class="etiqueta">${SVG_RELOGIO.replace("<svg", '<svg class="etiqueta__svg"')}${r.tempoTotal}</span>
          <span class="etiqueta">${nivel(r.nivel)}</span>
        </div>
        <h3 class="cartao__nome">${r.nome}</h3>
        <p class="cartao__desc">${r.descricao}</p>
        <span class="btn btn--real cartao__btn">Ver receita ${SVG_SETA}</span>
      </a>`).join("");

    $("#regras-grelha").innerHTML = REGRAS_DO_REINO.map((g, i) => `
      <article class="regra">
        <span class="regra__n" aria-hidden="true">${i + 1}</span>
        <img src="${ICON(g.icone)}" alt="">
        <h3>${g.t}</h3>
        <p>${g.d}</p>
      </article>`).join("");

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
      if (c) { estado.comprado[c.dataset.comprado] = c.checked; guardar("comprado", estado.comprado); }
    });
    $("#copiar-lista").addEventListener("click", async () => {
      const itens = desenharCompras().filter(([k]) => !estado.comprado[k]);
      const linhas = ["Lista de compras · Cookie's do King G", ""].concat(itens.map(([, it]) => `• ${quantidade(it, 1)} ${nomeItem(it, 1)}`));
      try { await navigator.clipboard.writeText(linhas.join("\n")); avisar("Lista copiada."); }
      catch (e) { avisar("Não foi possível copiar. Tira um print."); }
    });
    $("#limpar-lista").addEventListener("click", () => { estado.comprado = {}; guardar("comprado", {}); desenharCompras(); });
  }

  /* lista de compras: junta ingredientes iguais e soma */
  const chave = (it) => it.n.split(/[(,]/)[0].replace(/\s+/g, " ").trim().toLowerCase() + "|" + it.u;
  const curto = (s) => s && s.split(/[(,]/)[0].trim();
  function desenharCompras() {
    $("#compras-escolha").innerHTML = RECEITAS.map(r => `
      <button class="chip" aria-pressed="${estado.compras.includes(r.id)}" data-compra="${r.id}">
        <img src="${r.imagem}" alt="">${r.nome} · ${estado.doses[r.id]}
      </button>`).join("");
    const mapa = new Map();
    RECEITAS.filter(r => estado.compras.includes(r.id)).forEach(r => {
      const f = fator(r);
      r.grupos.forEach(g => g.itens.forEach(it => {
        const k = chave(it);
        const a = mapa.get(k) || { ...it, q: 0, n: curto(it.n), plural: curto(it.plural) };
        a.q += it.q * f; mapa.set(k, a);
      }));
    });
    const itens = [...mapa.entries()].sort((a, b) => (a[1].u === "g" ? 0 : 1) - (b[1].u === "g" ? 0 : 1) || b[1].q - a[1].q);
    $("#compras-lista").innerHTML = itens.length ? itens.map(([k, it]) => `
      <li><label class="check">
        <input type="checkbox" data-comprado="${k}" ${estado.comprado[k] ? "checked" : ""}>
        <span class="check__caixa">${SVG_CHECK}</span>
        <span class="check__q">${quantidade(it, 1)}</span>
        <span class="check__txt">${nomeItem(it, 1)}</span>
      </label></li>`).join("")
      : `<li class="compras__vazio">Escolhe pelo menos uma cookie.</li>`;
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

    function desenhar() {
      const f = fator(r), feitos = estado.feitos[r.id] || {}, pf = estado.passosFeitos[r.id] || {};
      let idx = 0;
      const outras = RECEITAS.filter(x => x.id !== r.id);
      main.innerHTML = `
        <section class="rc-hero">
          <svg class="rc-hero__blob" viewBox="0 0 600 600" aria-hidden="true"><path d="M421 72c62 38 118 102 128 176 10 75-26 160-86 218-60 57-145 87-226 72-82-15-160-75-185-153C27 307 55 212 116 146 177 80 272 43 339 44c30 1 57 11 82 28Z"/></svg>
          <div class="contentor rc-hero__grelha">
            <div class="rc-hero__texto">
              <a class="voltar" href="index.html#joias" data-voltar>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg> Todas as cookies
              </a>
              <h1 class="rc-hero__nome">${r.nome}</h1>
              <p class="rc-hero__sub">${r.subtitulo}</p>
              <p class="rc-hero__desc">${r.descricao}</p>
              <dl class="factos">
                <div class="facto facto--cookie"><dt>Rende</dt><dd>${BASE_COOKIES} cookies</dd></div>
                <div class="facto facto--relogio"><dt>Mãos na massa</dt><dd>${r.tempoAtivo}</dd></div>
                <div class="facto facto--relogio"><dt>Tempo total</dt><dd>${r.tempoTotal}</dd></div>
                <div class="facto facto--forno"><dt>Forno</dt><dd>${r.forno}</dd></div>
                <div class="facto facto--balanca"><dt>Cada cookie</dt><dd>${r.pesoBola}</dd></div>
                <div class="facto facto--nivel"><dt>Nível</dt><dd>${nivel(r.nivel)}</dd></div>
              </dl>
              <button class="btn btn--real" data-acao="cozinhar">Começar em modo cozinha ${SVG_SETA}</button>
            </div>
            <button class="rc-hero__foto" id="foto-chuva" aria-label="Fazer chover cookies">
              <img src="${r.imagem}" alt="Cookie ${r.nome}">
            </button>
          </div>
        </section>

        <section class="contentor antes">
          <div class="antes__bloco">
            <h2 class="sub-titulo">Antes de começar</h2>
            <ul class="antes__lista">${r.preparacao.map(p => `<li>${p}</li>`).join("")}</ul>
          </div>
          <div class="antes__bloco">
            <h2 class="sub-titulo">Vais precisar de</h2>
            <ul class="equip">${r.equipamento.map(e => `<li><img src="${ICON(e)}" alt=""><span>${EQUIPAMENTO[e]}</span></li>`).join("")}</ul>
          </div>
        </section>

        <section class="contentor rc-corpo">
          <aside class="ingredientes" id="ingredientes">
            <h2 class="sub-titulo">Ingredientes</h2>
            <div class="dose">
              <span class="dose__texto">Quantas<br>cookies?</span>
              <div class="dose__ctrl">
                <button data-dose="-1" aria-label="Menos cookies">−</button>
                <span class="dose__num" aria-live="polite">${estado.doses[r.id]}<small>cookies</small></span>
                <button data-dose="1" aria-label="Mais cookies">+</button>
              </div>
            </div>
            ${estado.doses[r.id] !== BASE_COOKIES ? `<p class="dose__nota">Quantidades ajustadas de ${BASE_COOKIES} para ${estado.doses[r.id]} cookies. <button class="link" data-repor>Repor</button></p>` : ""}
            ${r.grupos.map(g => `
              <h3 class="grupo__titulo">${g.titulo}</h3>
              <ul class="lista-ing">${g.itens.map(it => { const k = idx++; return `
                <li><label class="check">
                  <input type="checkbox" data-ing="${k}" ${feitos[k] ? "checked" : ""}>
                  <span class="check__caixa">${SVG_CHECK}</span>
                  <span class="check__q">${quantidade(it, f)}</span>
                  <span class="check__txt">${nomeItem(it, f)}</span>
                </label></li>`; }).join("")}
              </ul>`).join("")}
            <button class="mini" data-limpar-ing>Desmarcar ingredientes</button>
          </aside>

          <section class="passos" id="passos">
            <div class="passos__cabeca">
              <h2 class="sub-titulo">Passo a passo</h2>
              <span class="passos__conta" id="passos-conta"></span>
            </div>
            <ol class="lista-passos">${r.passos.map((p, i) => `
              <li class="passo ${pf[i] ? "feito" : ""}" data-passo="${i}">
                <div class="passo__icone"><img src="${ICON(p.icone)}" alt=""><span class="passo__num">${i + 1}</span></div>
                <div class="passo__corpo">
                  <h3>${p.t}</h3>
                  <p>${texto(p.d, r)}</p>
                  <div class="passo__acoes">
                    ${p.min ? `<button class="mini" data-temp="${i}">${SVG_RELOGIO} Temporizador ${p.min} min</button>` : ""}
                    <button class="mini mini--feito" data-feito="${i}" aria-pressed="${!!pf[i]}">${SVG_CHECK} ${pf[i] ? "Feito" : "Marcar como feito"}</button>
                  </div>
                </div>
              </li>`).join("")}
            </ol>
            <div class="dicas">
              <h3>Notas</h3>
              <ul>${r.dicas.map(d => `<li>${d}</li>`).join("")}</ul>
            </div>
            <button class="mini" data-limpar-passos>Recomeçar passos</button>
          </section>
        </section>

        <section class="outras">
          <div class="contentor">
            <h2 class="sub-titulo">Outras receitas</h2>
            <div class="outras__grelha">${outras.map(o => `
              <a class="outra" href="${o.pagina}" data-ir="${o.imagem}" style="--cor:${o.cor};--suave:${o.corSuave}">
                <img src="${o.imagem}" alt="">
                <span><strong>${o.nome}</strong><small>${o.subtitulo}</small></span>
                ${SVG_SETA}
              </a>`).join("")}
            </div>
          </div>
        </section>`;
      contarPassos();
    }

    function contarPassos() {
      const pf = estado.passosFeitos[r.id] || {};
      const n = Object.values(pf).filter(Boolean).length;
      const el = $("#passos-conta"); if (el) el.textContent = `${n} de ${r.passos.length} feitos`;
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
      const feito = e.target.closest("[data-feito]");
      if (feito) {
        const i = feito.dataset.feito, pf = estado.passosFeitos[r.id] = estado.passosFeitos[r.id] || {};
        pf[i] = !pf[i]; guardar("passosFeitos", estado.passosFeitos);
        const li = feito.closest(".passo"); li.classList.toggle("feito", pf[i]);
        feito.setAttribute("aria-pressed", String(pf[i]));
        feito.innerHTML = `${SVG_CHECK} ${pf[i] ? "Feito" : "Marcar como feito"}`;
        contarPassos(); return;
      }
      if (e.target.closest("#foto-chuva")) { chuva(18); return; }
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
      desenharDoca(); relogioCozinha();
    });
    setInterval(() => {
      if (!timers.length) return;
      timers.forEach(t => { if (!t.tocou && segundos(t) <= 0) { t.tocou = true; bip(); avisar(`${t.nome}: tempo terminado`); } });
      desenharDoca(); relogioCozinha();
    }, 1000);

    /* ---------- modo cozinha ---------- */
    const coz = { passo: 0 }, cozinha = $("#cozinha");
    let focoAntes, wakeLock = null;

    async function manterEcraLigado() {
      try { if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
    }
    document.addEventListener("visibilitychange", () => { if (!cozinha.hidden && document.visibilityState === "visible") manterEcraLigado(); });

    function abrirCozinha() {
      focoAntes = document.activeElement;
      const pf = estado.passosFeitos[r.id] || {};
      const primeiro = r.passos.findIndex((_, i) => !pf[i]);
      coz.passo = primeiro < 0 ? 0 : primeiro;
      cozinha.hidden = false; document.body.classList.add("em-cozinha");
      manterEcraLigado(); desenharCozinha(); $("#cozinha-seg").focus();
    }
    function fecharCozinha() {
      cozinha.hidden = true; document.body.classList.remove("em-cozinha");
      if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
      desenhar(); if (focoAntes && document.contains(focoAntes)) focoAntes.focus();
    }
    function desenharCozinha() {
      const total = r.passos.length, fim = coz.passo >= total;
      $("#cozinha-progresso").style.width = Math.min(100, (coz.passo / total) * 100) + "%";
      const palco = $("#cozinha-palco");
      if (fim) {
        palco.innerHTML = `<div class="cozinha__fim">
          <img src="assets/img/king-g.png" alt="">
          <p class="sobrancelha">Receita concluída</p>
          <h2 class="cozinha__titulo" id="cozinha-titulo">Viva o Rei!</h2>
          <p class="cozinha__texto">${estado.doses[r.id]} cookies “${r.nome}” prontas. Serve-as mornas.</p>
        </div>`;
        $("#cozinha-seg").innerHTML = "Fechar";
        chuva(40);
      } else {
        const p = r.passos[coz.passo];
        palco.innerHTML = `
          <img class="cozinha__icone" src="${ICON(p.icone)}" alt="" aria-hidden="true">
          <p class="sobrancelha">Passo ${coz.passo + 1} de ${total}</p>
          <h2 class="cozinha__titulo" id="cozinha-titulo">${p.t}</h2>
          <p class="cozinha__texto">${texto(p.d, r)}</p>
          <div class="cozinha__temporizador" id="cozinha-temp"></div>`;
        $("#cozinha-seg").innerHTML = (coz.passo === total - 1 ? "Terminar" : "Próximo") + " " + SVG_SETA;
        relogioCozinha();
      }
      $("#cozinha-ant").style.visibility = coz.passo === 0 ? "hidden" : "visible";
    }
    function relogioCozinha() {
      if (cozinha.hidden) return;
      const box = $("#cozinha-temp"), p = r.passos[coz.passo];
      if (!box || !p) return;
      if (!p.min) { box.innerHTML = ""; return; }
      const t = timers.find(x => x.nome === p.t), s = t ? segundos(t) : p.min * 60;
      box.innerHTML = `<div class="relogio">
        <span class="relogio__tempo">${t && s <= 0 ? "Pronto" : mmss(s)}</span>
        <button class="btn btn--real btn--peq" id="relogio-btn">${t ? (s <= 0 ? "OK" : (t.pausa != null ? "Retomar" : "Pausa")) : "Iniciar"}</button>
      </div>`;
    }
    cozinha.addEventListener("click", (e) => {
      if (!e.target.closest("#relogio-btn")) return;
      const p = r.passos[coz.passo], t = timers.find(x => x.nome === p.t);
      if (!t) iniciarTempo(p.t, p.min);
      else if (segundos(t) <= 0) timers.splice(timers.indexOf(t), 1);
      else if (t.pausa != null) { t.fim = Date.now() + t.pausa; t.pausa = null; }
      else t.pausa = t.fim - Date.now();
      desenharDoca(); relogioCozinha();
    });
    function marcarFeito(i) {
      const pf = estado.passosFeitos[r.id] = estado.passosFeitos[r.id] || {};
      pf[i] = true; guardar("passosFeitos", estado.passosFeitos);
    }
    $("#cozinha-seg").addEventListener("click", () => {
      if (coz.passo >= r.passos.length) return fecharCozinha();
      marcarFeito(coz.passo); coz.passo++; desenharCozinha();
    });
    $("#cozinha-ant").addEventListener("click", () => { if (coz.passo > 0) { coz.passo--; desenharCozinha(); } });
    $("#cozinha-fechar").addEventListener("click", fecharCozinha);
    document.addEventListener("keydown", (e) => {
      if (cozinha.hidden) return;
      if (e.key === "Escape") fecharCozinha();
      if (e.key === "ArrowRight") $("#cozinha-seg").click();
      if (e.key === "ArrowLeft") $("#cozinha-ant").click();
    });
    /* deslizar no telemóvel */
    let toqueX = null;
    cozinha.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
    cozinha.addEventListener("touchend", (e) => {
      if (toqueX == null) return;
      const dx = e.changedTouches[0].clientX - toqueX; toqueX = null;
      if (Math.abs(dx) < 70) return;
      if (dx < 0) $("#cozinha-seg").click(); else $("#cozinha-ant").click();
    });

    document.addEventListener("click", (e) => { if (e.target.closest('[data-acao="cozinhar"]')) abrirCozinha(); });
  }

  if (pagina === "inicio") iniciarInicio();
  if (pagina === "receita") iniciarReceita();
})();
