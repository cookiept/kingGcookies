/* =========================================================
   COOKIE'S DO KING G — a lógica do reino
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const ICON = (n) => `assets/img/icons/${n}.png`;
  const SVG_CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const SVG_RELOGIO = '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>';
  const SVG_SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- memória (só neste browser) ---------- */
  const guardar = (k, v) => { try { localStorage.setItem("kingg:" + k, JSON.stringify(v)); } catch (e) {} };
  const ler = (k, padrao) => {
    try { const v = localStorage.getItem("kingg:" + k); return v == null ? padrao : JSON.parse(v); }
    catch (e) { return padrao; }
  };

  const estado = {
    ativa: ler("ativa", RECEITAS[0].id),
    doses: ler("doses", Object.fromEntries(RECEITAS.map(r => [r.id, BASE_COOKIES]))),
    feitos: ler("feitos", {}),          // ingredientes riscados
    compras: ler("compras", RECEITAS.map(r => r.id)),
    comprado: ler("comprado", {})
  };
  const receita = (id) => RECEITAS.find(r => r.id === id) || RECEITAS[0];

  /* ---------- formatar quantidades ---------- */
  const FRAC = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  function fracao(x) {
    const r = Math.round(x * 4) / 4;
    const int = Math.floor(r), dec = +(r - int).toFixed(2);
    if (r === 0) return "¼";
    return (int ? int : "") + (FRAC[dec] || "");
  }
  function quantidade(item, fator) {
    const q = item.q * fator;
    switch (item.u) {
      case "g":  return (q < 20 ? Math.max(1, Math.round(q)) : Math.round(q / 5) * 5) + " g";
      case "ml": return Math.max(5, Math.round(q / 5) * 5) + " ml";
      case "cc": return fracao(q) + " c. chá";
      case "cs": return fracao(q) + " c. sopa";
      case "un": {
        const r = Math.max(0.5, Math.round(q * 2) / 2);
        return (r === 0.5 ? "½" : fracao(r)) ;
      }
    }
    return q;
  }
  function nomeItem(item, fator) {
    if (item.u !== "un") return item.n;
    const r = Math.max(0.5, Math.round(item.q * fator * 2) / 2);
    if (r > 1 && item.plural) return item.plural;
    if (r === 0.5 && /ovo/.test(item.n)) return "ovo (bate-o e usa metade)";
    return item.n;
  }
  const fator = (r) => estado.doses[r.id] / BASE_COOKIES;
  const texto = (t, r) => t.replace(/\{N\}/g, estado.doses[r.id]);
  const coroas = (n) => `<span class="coroas" aria-label="Dificuldade ${n} de 3">${[1, 2, 3].map(i => `<span class="${i > n ? "off" : ""}">♛</span>`).join("")}</span>`;

  /* ---------- aviso rápido ---------- */
  let avisoT;
  function avisar(msg) {
    const a = $("#aviso"); a.textContent = msg; a.classList.add("ver");
    clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove("ver"), 2200);
  }

  /* =========================================================
     CARTÕES
     ========================================================= */
  function desenharCartoes() {
    $("#cartoes").innerHTML = RECEITAS.map(r => `
      <article class="cartao" style="--cor:${r.cor}">
        <img class="cartao__foto" src="${r.imagem}" alt="Cookie ${r.nome}" loading="lazy">
        <ul class="etiquetas">
          <li class="etiqueta">${BASE_COOKIES} cookies</li>
          <li class="etiqueta">${coroas(r.dificuldade)}</li>
        </ul>
        <h3 class="cartao__nome" style="color:${r.cor}">${r.nome}</h3>
        <p class="cartao__sub">${r.subtitulo}</p>
        <p class="cartao__piada">“${r.piada}”</p>
        <a class="btn btn--real" href="#receitas" data-abrir="${r.id}">Quero esta ${SVG_SETA}</a>
      </article>`).join("");
  }

  /* =========================================================
     SEPARADORES + PAINEL DA RECEITA
     ========================================================= */
  function desenharSeparadores() {
    $("#separadores").innerHTML = RECEITAS.map(r => `
      <button class="separador" role="tab" style="--cor:${r.cor}" aria-selected="${r.id === estado.ativa}" data-abrir="${r.id}">
        <img src="${r.imagem}" alt="">${r.nome}
      </button>`).join("");
  }

  function desenharPainel() {
    const r = receita(estado.ativa), f = fator(r), feitos = estado.feitos[r.id] || {};
    let idx = 0;
    const grupos = r.grupos.map(g => `
      <p class="grupo__titulo">${g.titulo}</p>
      ${g.nota ? `<p class="grupo__nota">${g.nota}</p>` : ""}
      <ul class="lista-ing">
        ${g.itens.map(it => {
          const k = idx++;
          return `<li><label class="check">
            <input type="checkbox" data-ing="${k}" ${feitos[k] ? "checked" : ""}>
            <span class="check__caixa">${SVG_CHECK}</span>
            <span class="check__q">${quantidade(it, f)}</span>
            <span class="check__txt">${nomeItem(it, f)}</span>
          </label></li>`;
        }).join("")}
      </ul>`).join("");

    const passos = r.passos.map((p, i) => `
      <li class="passo" data-passo="${i}">
        <div class="passo__icone"><img src="${ICON(p.icone)}" alt=""><span class="passo__num">${i + 1}</span></div>
        <div>
          <h4>${p.t}</h4>
          <p>${texto(p.d, r)}</p>
          <div class="passo__acoes">
            ${p.min ? `<button class="mini" data-temp="${i}">${SVG_RELOGIO} ${p.min} min</button>` : ""}
            <button class="mini" data-feito="${i}">${SVG_CHECK.replace("<svg", '<svg style="stroke:currentColor"')} Feito</button>
          </div>
        </div>
      </li>`).join("");

    const painel = $("#painel");
    painel.innerHTML = `
      <article class="receita" style="--cor:${r.cor};--suave:${r.corSuave}" role="tabpanel">
        <header class="receita__cabeca">
          <img class="receita__foto" src="${r.imagem}" alt="Cookie ${r.nome}" title="Carrega em mim">
          <div>
            <h2 class="receita__nome">${r.nome}</h2>
            <p class="receita__sub">${r.subtitulo}</p>
            <p class="script">${r.piada}</p>
            <div class="receita__info">
              <span class="etiqueta">⏱ ${r.tempoTotal}</span>
              <span class="etiqueta">🔥 ${r.forno}</span>
              <span class="etiqueta">${coroas(r.dificuldade)}</span>
            </div>
          </div>
        </header>
        <div class="receita__corpo">
          <aside class="ingredientes">
            <h3>Ingredientes</h3>
            <div class="dose">
              <span class="dose__texto">Quantas<br>cookies?</span>
              <div class="dose__ctrl">
                <button data-dose="-1" aria-label="Menos cookies">−</button>
                <span class="dose__num" aria-live="polite">${estado.doses[r.id]}<small>cookies</small></span>
                <button data-dose="1" aria-label="Mais cookies">+</button>
              </div>
            </div>
            ${grupos}
            <div class="ingredientes__acoes">
              <button class="mini" data-limpar-ing>Desmarcar tudo</button>
            </div>
          </aside>
          <section class="passos">
            <div class="passos__cabeca">
              <h3>Passo a passo</h3>
              <button class="btn btn--real btn--peq" data-acao="cozinhar">Modo cozinha ${SVG_SETA}</button>
            </div>
            <ol class="lista-passos">${passos}</ol>
            <div class="dicas">
              <h4>Segredos do Rei</h4>
              <ul>${r.dicas.map(d => `<li>${d}</li>`).join("")}</ul>
            </div>
          </section>
        </div>
      </article>`;
  }

  function abrir(id, rolar) {
    estado.ativa = id; guardar("ativa", id);
    desenharSeparadores(); desenharPainel();
    if (rolar) $("#receitas").scrollIntoView({ behavior: "smooth" });
  }

  /* =========================================================
     REGRAS
     ========================================================= */
  function desenharRegras() {
    $("#regras-grelha").innerHTML = REGRAS_DO_REINO.map((g, i) => `
      <article class="regra">
        <span class="regra__n" aria-hidden="true">${i + 1}</span>
        <img src="${ICON(g.icone)}" alt="">
        <h3>${g.t}</h3>
        <p>${g.d}</p>
      </article>`).join("");
  }

  /* =========================================================
     LISTA DE COMPRAS (junta e soma)
     ========================================================= */
  const chave = (it) => it.n.split(/[(,]/)[0].replace(/\b(picado|derretido|mole)\b/g, "").replace(/\s+/g, " ").trim().toLowerCase() + "|" + it.u;
  const bonito = (it) => { const s = it.n.split(/[(,]/)[0].replace(/\b(picado|derretido)\b/g, "").trim(); return s; };

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
        const atual = mapa.get(k) || { ...it, q: 0, n: bonito(it), plural: it.plural ? it.plural.split(/[(,]/)[0].trim() : null };
        atual.q += it.q * f; mapa.set(k, atual);
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
      : `<li class="compras__vazio">Escolhe pelo menos uma cookie. O Rei não aceita listas vazias.</li>`;
    return itens;
  }

  /* =========================================================
     TEMPORIZADORES
     ========================================================= */
  const timers = [];
  let audio;
  function bip() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, .25, .5].forEach(t => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(.25, audio.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + t + .2);
        o.start(audio.currentTime + t); o.stop(audio.currentTime + t + .22);
      });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

  function iniciarTempo(nome, minutos) {
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    const t = { id: Date.now() + Math.random(), nome, fim: Date.now() + minutos * 60000, pausa: null, tocou: false };
    timers.push(t); desenharDoca(); avisar(`Temporizador: ${nome} (${minutos} min)`);
    return t;
  }
  function segundos(t) { return Math.ceil((t.pausa != null ? t.pausa : t.fim - Date.now()) / 1000); }

  function desenharDoca() {
    $("#doca").innerHTML = timers.map(t => {
      const s = segundos(t);
      return `<div class="tempo-ativo ${s <= 0 ? "toca" : ""}" data-t="${t.id}">
        <span class="tempo-ativo__nome">${t.nome}</span>
        <span class="tempo-ativo__t">${s <= 0 ? "JÁ!" : mmss(s)}</span>
        ${s > 0 ? `<button data-pausa>${t.pausa != null ? "Retomar" : "Pausa"}</button>` : ""}
        <button data-parar>${s <= 0 ? "OK" : "Parar"}</button>
      </div>`;
    }).join("");
  }
  setInterval(() => {
    if (!timers.length) return;
    timers.forEach(t => { if (!t.tocou && segundos(t) <= 0) { t.tocou = true; bip(); avisar(`${t.nome}: acabou o tempo!`); } });
    if (timers.some(t => t.tocou && segundos(t) <= 0)) { if (Date.now() % 3000 < 1000) bip(); }
    desenharDoca();
    atualizarRelogioCozinha();
  }, 1000);

  $("#doca").addEventListener("click", (e) => {
    const el = e.target.closest(".tempo-ativo"); if (!el) return;
    const i = timers.findIndex(t => String(t.id) === el.dataset.t); if (i < 0) return;
    const t = timers[i];
    if (e.target.closest("[data-parar]")) timers.splice(i, 1);
    if (e.target.closest("[data-pausa]")) {
      if (t.pausa != null) { t.fim = Date.now() + t.pausa; t.pausa = null; } else { t.pausa = t.fim - Date.now(); }
    }
    desenharDoca(); atualizarRelogioCozinha();
  });

  /* =========================================================
     CHUVA DE COOKIES
     ========================================================= */
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function chuva(n = 26) {
    if (reduzido) return;
    const imgs = ["assets/img/cookie.png", ...RECEITAS.map(r => r.imagem)];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("img");
      el.src = imgs[i % imgs.length]; el.alt = ""; el.className = "chuva";
      const tam = 40 + Math.random() * 70;
      el.style.width = tam + "px";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = 1.8 + Math.random() * 2 + "s";
      el.style.animationDelay = Math.random() * .8 + "s";
      el.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  const FRASES = [
    "Mais manteiga!", "Quem comeu a massa crua? Eu vi.", "Por decreto real: só uma… OK, duas.",
    "190 graus. Nem mais um.", "Pesa a farinha, súbdito!", "Isto não é dieta. É monarquia.",
    "Cookie mole é cookie feliz.", "Ninguém toca no tabuleiro quente!", "Viva o Rei! E as cookies."
  ];
  let fraseI = 0;
  $("#rei").addEventListener("click", () => {
    $("#rei-balao").textContent = FRASES[fraseI++ % FRASES.length];
    chuva();
  });

  /* =========================================================
     MODO COZINHA
     ========================================================= */
  const coz = { id: estado.ativa, passo: 0, timer: null };
  const cozinha = $("#cozinha");
  let focoAntes;

  function abrirCozinha() {
    focoAntes = document.activeElement;
    coz.id = estado.ativa; coz.passo = 0;
    cozinha.hidden = false; document.body.style.overflow = "hidden";
    desenharCozinha(); $("#cozinha-seg").focus();
  }
  function fecharCozinha() {
    cozinha.hidden = true; document.body.style.overflow = "";
    if (focoAntes) focoAntes.focus();
  }

  function desenharCozinha() {
    const r = receita(coz.id), total = r.passos.length, fim = coz.passo >= total;
    cozinha.style.setProperty("--cor", r.cor);
    $("#cozinha-escolha").innerHTML = RECEITAS.map(x => `
      <button class="separador" style="--cor:${x.cor}" role="tab" aria-selected="${x.id === coz.id}" data-coz="${x.id}">
        <img src="${x.imagem}" alt="">${x.nome}</button>`).join("");
    $("#cozinha-progresso").style.width = Math.min(100, (coz.passo / total) * 100) + "%";

    const palco = $(".cozinha__palco");
    if (fim) {
      palco.innerHTML = `<div class="cozinha__fim">
        <img src="assets/img/king-g.png" alt="O King G a festejar">
        <p class="sobrancelha">Missão cumprida</p>
        <h2 class="cozinha__titulo" id="cozinha-titulo">Viva o Rei!</h2>
        <p class="cozinha__texto">Fizeste ${estado.doses[r.id]} cookies “${r.nome}”. Agora serve-as mornas e aceita os aplausos.</p>
      </div>`;
      $("#cozinha-seg").innerHTML = `Fechar`;
      chuva(40);
    } else {
      const p = r.passos[coz.passo];
      palco.innerHTML = `
        <img class="cozinha__icone" src="${ICON(p.icone)}" alt="" aria-hidden="true">
        <p class="sobrancelha">Passo ${coz.passo + 1} de ${total}</p>
        <h2 class="cozinha__titulo" id="cozinha-titulo">${p.t}</h2>
        <p class="cozinha__texto">${texto(p.d, r)}</p>
        <div class="cozinha__temporizador" id="cozinha-temp"></div>`;
      $("#cozinha-seg").innerHTML = (coz.passo === total - 1 ? "Terminar" : "Próximo") + SVG_SETA;
      coz.timer = timers.find(t => t.nome === `${r.nome}: ${p.t}`) || null;
      desenharRelogioCozinha(p);
    }
    $("#cozinha-ant").disabled = coz.passo === 0;
    $("#cozinha-ant").style.visibility = coz.passo === 0 ? "hidden" : "visible";
  }

  function desenharRelogioCozinha(p) {
    const box = $("#cozinha-temp"); if (!box) return;
    if (!p.min) { box.innerHTML = ""; return; }
    const t = coz.timer, s = t ? segundos(t) : p.min * 60;
    box.innerHTML = `<div class="relogio">
      <span class="relogio__tempo" id="relogio-t">${t && s <= 0 ? "JÁ!" : mmss(s)}</span>
      <button class="btn btn--real btn--peq" id="relogio-btn">${t ? (s <= 0 ? "Feito" : (t.pausa != null ? "Retomar" : "Pausa")) : "Iniciar"}</button>
    </div>`;
  }
  function atualizarRelogioCozinha() {
    if (cozinha.hidden) return;
    const r = receita(coz.id), p = r.passos[coz.passo];
    if (!p) return;
    if (coz.timer && !timers.includes(coz.timer)) coz.timer = null;
    desenharRelogioCozinha(p);
  }

  cozinha.addEventListener("click", (e) => {
    const sep = e.target.closest("[data-coz]");
    if (sep) { coz.id = sep.dataset.coz; coz.passo = 0; desenharCozinha(); return; }
    if (e.target.closest("#relogio-btn")) {
      const r = receita(coz.id), p = r.passos[coz.passo], t = coz.timer;
      if (!t) coz.timer = iniciarTempo(`${r.nome}: ${p.t}`, p.min);
      else if (segundos(t) <= 0) { timers.splice(timers.indexOf(t), 1); coz.timer = null; }
      else if (t.pausa != null) { t.fim = Date.now() + t.pausa; t.pausa = null; }
      else t.pausa = t.fim - Date.now();
      desenharDoca(); desenharRelogioCozinha(p);
    }
  });
  $("#cozinha-seg").addEventListener("click", () => {
    const total = receita(coz.id).passos.length;
    if (coz.passo >= total) return fecharCozinha();
    coz.passo++; desenharCozinha();
  });
  $("#cozinha-ant").addEventListener("click", () => { if (coz.passo > 0) { coz.passo--; desenharCozinha(); } });
  $("#cozinha-fechar").addEventListener("click", fecharCozinha);
  document.addEventListener("keydown", (e) => {
    if (cozinha.hidden) return;
    if (e.key === "Escape") fecharCozinha();
    if (e.key === "ArrowRight") $("#cozinha-seg").click();
    if (e.key === "ArrowLeft") $("#cozinha-ant").click();
  });

  /* =========================================================
     CLIQUES GERAIS
     ========================================================= */
  document.addEventListener("click", (e) => {
    const abrirBtn = e.target.closest("[data-abrir]");
    if (abrirBtn) { e.preventDefault(); abrir(abrirBtn.dataset.abrir, !!abrirBtn.closest(".cartao")); return; }

    if (e.target.closest('[data-acao="cozinhar"]')) { abrirCozinha(); return; }

    const dose = e.target.closest("[data-dose]");
    if (dose) {
      const r = receita(estado.ativa);
      estado.doses[r.id] = Math.min(36, Math.max(1, estado.doses[r.id] + Number(dose.dataset.dose)));
      guardar("doses", estado.doses); desenharPainel(); desenharCompras();
      $('[data-dose="' + dose.dataset.dose + '"]').focus();
      return;
    }

    if (e.target.closest("[data-limpar-ing]")) { estado.feitos[estado.ativa] = {}; guardar("feitos", estado.feitos); desenharPainel(); return; }

    const temp = e.target.closest("[data-temp]");
    if (temp) { const r = receita(estado.ativa), p = r.passos[+temp.dataset.temp]; iniciarTempo(`${r.nome}: ${p.t}`, p.min); return; }

    const feito = e.target.closest("[data-feito]");
    if (feito) { feito.closest(".passo").classList.toggle("feito"); return; }

    if (e.target.closest(".receita__foto")) { chuva(14); return; }

    const chip = e.target.closest("[data-compra]");
    if (chip) {
      const id = chip.dataset.compra;
      estado.compras = estado.compras.includes(id) ? estado.compras.filter(x => x !== id) : [...estado.compras, id];
      guardar("compras", estado.compras); desenharCompras(); return;
    }
  });

  document.addEventListener("change", (e) => {
    const ing = e.target.closest("[data-ing]");
    if (ing) {
      const m = estado.feitos[estado.ativa] = estado.feitos[estado.ativa] || {};
      m[ing.dataset.ing] = ing.checked; guardar("feitos", estado.feitos);
    }
    const comp = e.target.closest("[data-comprado]");
    if (comp) { estado.comprado[comp.dataset.comprado] = comp.checked; guardar("comprado", estado.comprado); }
  });

  $("#copiar-lista").addEventListener("click", async () => {
    const itens = desenharCompras().filter(([k]) => !estado.comprado[k]);
    const linhas = ["🛒 Lista de compras · Cookie's do King G", ""]
      .concat(itens.map(([, it]) => `• ${quantidade(it, 1)} ${nomeItem(it, 1)}`));
    try { await navigator.clipboard.writeText(linhas.join("\n")); avisar("Lista copiada. Agora ao supermercado!"); }
    catch (e) { avisar("Não deu para copiar. Tira um print!"); }
  });
  $("#limpar-lista").addEventListener("click", () => { estado.comprado = {}; guardar("comprado", {}); desenharCompras(); });

  /* ---------- arrancar ---------- */
  desenharCartoes();
  desenharSeparadores();
  desenharPainel();
  desenharRegras();
  desenharCompras();
})();
