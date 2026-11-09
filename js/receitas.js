/* =========================================================
   COOKIE'S DO KING G — AS RECEITAS
   Fonte única: o site e o livro em PDF leem este ficheiro.
   Quantidades para 6 cookies. Nos passos, {N} é trocado pelo
   número de cookies escolhido no site.

   Quantidades em gramas ("g"); líquidos em mililitros ("ml").
   "loja" diz como comprar (ex.: ovos à unidade) para a lista de compras.
   ========================================================= */

const BASE_COOKIES = 6;

const NIVEIS = { 1: "Fácil", 2: "Médio", 3: "Exigente" };

const RECEITAS = [
  {
    id: "recheada",
    pagina: "cookie-chocolate-recheada.html",
    nome: "Cookie de Chocolate Recheada",
    palavra: "Choco",
    subtitulo: "Massa de chocolate com recheio de mousse de chocolate",
    descricao: "Cookie grossa de massa de chocolate, com pedaços de chocolate de leite e um recheio de ganache batida que fica cremoso depois de cozer. Serve-se morna.",
    cor: "#5a2d1a",
    corSuave: "#f3e3d6",
    imagem: "assets/img/cookies/recheada.png",
    pesoBola: "≈113 g de massa + 25 g de recheio",
    tempoAtivo: "45 min",
    tempoTotal: "2 h 45 min",
    forno: "190 °C · 12–13 min",
    nivel: 3,
    equipamento: ["tacho", "taca", "vara", "colher", "balanca", "tabuleiro", "aro", "grade"],
    preparacao: [
      "Tira a manteiga e o ovo do frigorífico 1 hora antes. A manteiga deve estar a 18–20 °C: cede quando a pressionas, mas não está brilhante nem derretida.",
      "Pica o chocolate da massa em pedaços de cerca de 1 cm e o chocolate do recheio bem fino.",
      "Pesa todos os ingredientes antes de começar."
    ],
    grupos: [
      {
        titulo: "Recheio de mousse (ganache batida)",
        itens: [
          { q: 100, u: "g", n: "chocolate de leite ou negro (50–55%), picado fino" },
          { q: 60, u: "ml", n: "natas para bater (35% gordura)" }
        ]
      },
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, a 18–20 °C" },
          { q: 130, u: "g", n: "açúcar mascavado claro" },
          { q: 50, u: "g", n: "açúcar branco" },
          { q: 50, u: "g", n: "ovo batido (1 ovo grande ≈ 50 g), à temperatura ambiente", loja: { por: 50, n: "ovo grande", plural: "ovos grandes", un: "ovo", unPl: "ovos", nomeVol: "grande, à temperatura ambiente", nomeVolPl: "grandes, à temperatura ambiente" } },
          { q: 5, u: "ml", n: "extrato de baunilha" },
          { q: 175, u: "g", n: "farinha sem fermento" },
          { q: 30, u: "g", n: "cacau em pó sem açúcar" },
          { q: 4, u: "g", n: "amido de milho (Maizena)" },
          { q: 3, u: "g", n: "bicarbonato de sódio" },
          { q: 2, u: "g", n: "sal fino" },
          { q: 120, u: "g", n: "chocolate de leite, em pedaços de 1 cm" }
        ]
      }
    ],
    passos: [
      { fase: "Recheio", t: "Aquecer as natas", icone: "tacho", min: 0,
        d: "Aquece as natas num tacho pequeno em lume médio até surgirem pequenas bolhas junto à borda (≈80 °C). Não deixes ferver." },
      { fase: "Recheio", t: "Fazer a ganache", icone: "taca", min: 1,
        d: "Verte as natas quentes sobre o chocolate picado. Espera 1 minuto sem mexer e depois mexe com uma espátula, do centro para fora, até ficar lisa e brilhante." },
      { fase: "Recheio", t: "Arrefecer a ganache", icone: "frio", min: 60,
        d: "Cobre com película aderente encostada à superfície e leva ao frigorífico 60 minutos. Deve ficar firme mas fácil de mexer, com a consistência de manteiga de amendoim." },
      { fase: "Recheio", t: "Bater a ganache", icone: "vara", min: 2,
        d: "Bate a ganache fria com a vara (ou batedeira em velocidade baixa) durante 1–2 minutos, até clarear e ganhar volume. Para assim que mudar de cor: se bateres demasiado, fica granulosa." },
      { fase: "Recheio", t: "Porcionar e congelar o recheio", icone: "frio", min: 45,
        d: "Forra um prato com papel vegetal e faz {N} porções de ≈25 g com uma colher. Congela pelo menos 45 minutos, até estarem rijas." },
      { fase: "Massa", t: "Pré-aquecer o forno", icone: "forno", min: 15,
        d: "Liga o forno a 190 °C, calor em cima e em baixo, com a grelha na posição do meio. Deixa aquecer pelo menos 15 minutos. Forra dois tabuleiros com papel vegetal. Num forno só ventilado, usa 170–175 °C." },
      { fase: "Massa", t: "Bater a manteiga com os açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga, o açúcar mascavado e o açúcar branco em velocidade média durante 3 minutos, até a mistura ficar mais clara e fofa." },
      { fase: "Massa", t: "Juntar o ovo e a baunilha", icone: "taca", min: 1,
        d: "Junta o ovo e a baunilha e bate 30–45 segundos, só até estarem incorporados. Raspa o fundo e as paredes da taça com uma espátula." },
      { fase: "Massa", t: "Misturar os ingredientes secos", icone: "peneira", min: 0,
        d: "Numa taça à parte, mistura a farinha, o cacau peneirado, o amido de milho, o bicarbonato e o sal com uma vara de mão, para ficarem bem distribuídos e sem grumos de cacau." },
      { fase: "Massa", t: "Juntar os secos à massa", icone: "colher", min: 0,
        d: "Adiciona os secos em duas vezes e mistura com uma espátula (ou batedeira em velocidade mínima) só até deixares de ver pó. Misturar demasiado deixa as cookies rijas." },
      { fase: "Massa", t: "Adicionar o chocolate", icone: "colher", min: 0,
        d: "Envolve os pedaços de chocolate de leite na massa até ficarem distribuídos." },
      { fase: "Moldar", t: "Porcionar a massa", icone: "balanca", min: 0,
        d: "Pesa a massa toda e divide por {N}: devem dar porções de ≈113 g cada. Usa a balança para ficarem todas iguais e cozerem por igual." },
      { fase: "Moldar", t: "Rechear as bolas", icone: "recheio", min: 0,
        d: "Achata cada porção na palma da mão num disco de ≈9 cm. Põe um recheio congelado no centro, puxa as bordas para cima e sela bem, sem fissuras. Coloca a bola com a junção virada para baixo. Se a massa estiver a colar, leva as bolas ao frigorífico 15 minutos." },
      { fase: "Forno", t: "Cozer", icone: "tabuleiro", min: 13,
        d: "Coloca 3 bolas por tabuleiro, com 8 cm de distância, e coze um tabuleiro de cada vez durante 12–13 minutos. Estão prontas quando as bordas estão firmes e o centro ainda parece mole e brilhante. Guarda a massa da segunda fornada no frigorífico enquanto esperas." },
      { fase: "Forno", t: "Arredondar e arrefecer", icone: "grade", min: 10,
        d: "Logo ao sair do forno, roda um aro de 10 cm (ou um copo) à volta de cada cookie para ficarem redondas. Deixa-as 10 minutos no tabuleiro e passa-as depois para uma grade." }
    ],
    dicas: [
      "O recheio está mais cremoso entre 10 e 30 minutos depois de saírem do forno.",
      "Guardam-se 2 dias num recipiente fechado. Para voltar a ter o recheio cremoso, aquece 10–15 segundos no micro-ondas.",
      "As bolas recheadas cruas congelam até 1 mês. Coze-as diretamente do congelador, a 180 °C, durante 15–16 minutos."
    ]
  },

  {
    id: "bueno",
    pagina: "cookie-kinder-bueno.html",
    nome: "Cookie Kinder Bueno",
    palavra: "Bueno",
    subtitulo: "Com pedaços de Kinder Bueno e recheio de Nutella",
    descricao: "Cookie de baunilha com pedaços de Kinder Bueno e chocolate de leite, recheada com Nutella e decorada com fios de chocolate de leite e branco.",
    cor: "#b9520e",
    corSuave: "#fde7d2",
    imagem: "assets/img/cookies/bueno.png",
    pesoBola: "≈114 g de massa + 15 g de Nutella",
    tempoAtivo: "40 min",
    tempoTotal: "1 h 50 min",
    forno: "190 °C · 11–12 min",
    nivel: 2,
    equipamento: ["taca", "vara", "colher", "balanca", "faca", "tabuleiro", "aro", "grade", "manga"],
    preparacao: [
      "Tira a manteiga e o ovo do frigorífico 1 hora antes. A manteiga deve estar a 18–20 °C: cede quando a pressionas, mas não está brilhante nem derretida.",
      "Pesa todos os ingredientes antes de começar."
    ],
    grupos: [
      {
        titulo: "Recheio",
        itens: [
          { q: 90, u: "g", n: "Nutella" }
        ]
      },
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, a 18–20 °C" },
          { q: 120, u: "g", n: "açúcar mascavado claro" },
          { q: 50, u: "g", n: "açúcar branco" },
          { q: 50, u: "g", n: "ovo batido (1 ovo grande ≈ 50 g), à temperatura ambiente", loja: { por: 50, n: "ovo grande", plural: "ovos grandes", un: "ovo", unPl: "ovos", nomeVol: "grande, à temperatura ambiente", nomeVolPl: "grandes, à temperatura ambiente" } },
          { q: 5, u: "ml", n: "extrato de baunilha" },
          { q: 200, u: "g", n: "farinha sem fermento" },
          { q: 4, u: "g", n: "amido de milho (Maizena)" },
          { q: 3, u: "g", n: "bicarbonato de sódio" },
          { q: 2, u: "g", n: "sal fino" },
          { q: 60, u: "g", n: "chocolate de leite, em pedaços de 1 cm" },
          { q: 86, u: "g", n: "Kinder Bueno (2 embalagens de 43 g), em pedaços de 1 cm", loja: { por: 43, n: "Kinder Bueno (emb. 43 g)", plural: "Kinder Bueno (emb. 43 g)", un: "emb.", unPl: "emb.", nomeVol: "Kinder Bueno (43 g cada), em pedaços de 1 cm" } }
        ]
      },
      {
        titulo: "Cobertura",
        itens: [
          { q: 43, u: "g", n: "Kinder Bueno (1 embalagem de 43 g)", loja: { por: 43, n: "Kinder Bueno (emb. 43 g)", plural: "Kinder Bueno (emb. 43 g)", un: "emb.", unPl: "emb.", nomeVol: "Kinder Bueno (43 g cada)" } },
          { q: 40, u: "g", n: "chocolate de leite" },
          { q: 25, u: "g", n: "chocolate branco" }
        ]
      }
    ],
    passos: [
      { fase: "Recheio e topo", t: "Porcionar e congelar a Nutella", icone: "frio", min: 60,
        d: "Forra um prato com papel vegetal e faz {N} porções de 15 g de Nutella. Congela 60 minutos, até estarem rijas." },
      { fase: "Recheio e topo", t: "Cortar os Kinder Bueno", icone: "faca", min: 0,
        d: "Corta o Kinder Bueno da massa em pedaços de ≈1 cm. Corta o da cobertura em pedaços de ≈2 cm (2 por cookie) e reserva-os. Usa uma faca afiada e corta de uma só vez para o recheio não esmagar." },
      { fase: "Massa", t: "Pré-aquecer o forno", icone: "forno", min: 15,
        d: "Liga o forno a 190 °C, calor em cima e em baixo, com a grelha na posição do meio. Deixa aquecer pelo menos 15 minutos. Forra dois tabuleiros com papel vegetal. Num forno só ventilado, usa 170–175 °C." },
      { fase: "Massa", t: "Bater a manteiga com os açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga, o açúcar mascavado e o açúcar branco em velocidade média durante 3 minutos, até a mistura ficar mais clara e fofa." },
      { fase: "Massa", t: "Juntar o ovo e a baunilha", icone: "taca", min: 1,
        d: "Junta o ovo e a baunilha e bate 30–45 segundos, só até estarem incorporados. Raspa o fundo e as paredes da taça." },
      { fase: "Massa", t: "Misturar os ingredientes secos", icone: "peneira", min: 0,
        d: "Numa taça à parte, mistura a farinha, o amido de milho, o bicarbonato e o sal com uma vara de mão." },
      { fase: "Massa", t: "Juntar os secos à massa", icone: "colher", min: 0,
        d: "Adiciona os secos em duas vezes e mistura com uma espátula (ou batedeira em velocidade mínima) só até deixares de ver farinha." },
      { fase: "Massa", t: "Adicionar o chocolate e o Kinder Bueno", icone: "colher", min: 0,
        d: "Envolve o chocolate de leite e os pedaços de Kinder Bueno com a espátula, com movimentos largos, para não os desfazer." },
      { fase: "Moldar", t: "Porcionar a massa", icone: "balanca", min: 0,
        d: "Pesa a massa toda e divide por {N}: devem dar porções de ≈114 g cada." },
      { fase: "Moldar", t: "Rechear as bolas", icone: "recheio", min: 0,
        d: "Achata cada porção num disco de ≈9 cm, põe uma porção de Nutella congelada no centro, fecha bem as bordas e coloca a bola com a junção para baixo. Pressiona 2 pedaços de Kinder Bueno reservados no topo de cada uma." },
      { fase: "Forno", t: "Cozer", icone: "tabuleiro", min: 12,
        d: "Coloca 3 bolas por tabuleiro, com 8 cm de distância, e coze um tabuleiro de cada vez durante 11–12 minutos. Estão prontas quando as bordas estão douradas e o centro ainda parece cru. Guarda a massa da segunda fornada no frigorífico." },
      { fase: "Forno", t: "Arredondar e arrefecer", icone: "grade", min: 20,
        d: "Logo ao sair do forno, roda um aro de 10 cm à volta de cada cookie. Deixa-as 10 minutos no tabuleiro e passa-as para uma grade. Espera que fiquem apenas mornas (≈20 minutos no total) antes de decorar." },
      { fase: "Decorar", t: "Derreter o chocolate da cobertura", icone: "taca", min: 0,
        d: "Derrete o chocolate de leite e o chocolate branco em taças separadas, no micro-ondas, em intervalos de 20 segundos, mexendo entre cada um. O branco queima mais depressa: usa potência média." },
      { fase: "Decorar", t: "Decorar", icone: "manga", min: 15,
        d: "Põe cada chocolate num saco de congelação e corta uma ponta de 2 mm. Rega as cookies em zigue-zague, primeiro com o de leite e depois com o branco. Deixa solidificar 15 minutos." }
    ],
    dicas: [
      "Se as cookies estiverem quentes quando as regas, o chocolate escorre e perde o desenho.",
      "Guardam-se 3 dias num recipiente fechado, à temperatura ambiente."
    ]
  },

  {
    id: "redvelvet",
    pagina: "cookie-red-velvet.html",
    nome: "Cookie Red Velvet",
    palavra: "Velvet",
    subtitulo: "Red velvet com chocolate branco e de leite",
    descricao: "Cookie red velvet com um toque de cacau e pedaços de chocolate branco e de leite. Borda firme e centro macio.",
    cor: "#b3122a",
    corSuave: "#fbe0e3",
    imagem: "assets/img/cookies/redvelvet.png",
    pesoBola: "≈123 g",
    tempoAtivo: "30 min",
    tempoTotal: "1 h 15 min",
    forno: "190 °C · 10–11 min",
    nivel: 1,
    equipamento: ["taca", "vara", "colher", "balanca", "tabuleiro", "aro", "grade"],
    preparacao: [
      "Tira a manteiga e o ovo do frigorífico 1 hora antes. A manteiga deve estar a 18–20 °C: cede quando a pressionas, mas não está brilhante nem derretida.",
      "Usa corante alimentar em gel. O corante líquido dá um tom rosado e deixa a massa mais mole.",
      "Separa 30 g do chocolate branco para o topo."
    ],
    grupos: [
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, a 18–20 °C" },
          { q: 100, u: "g", n: "açúcar mascavado claro" },
          { q: 80, u: "g", n: "açúcar branco" },
          { q: 50, u: "g", n: "ovo batido (1 ovo grande ≈ 50 g), à temperatura ambiente", loja: { por: 50, n: "ovo grande", plural: "ovos grandes", un: "ovo", unPl: "ovos", nomeVol: "grande, à temperatura ambiente", nomeVolPl: "grandes, à temperatura ambiente" } },
          { q: 5, u: "ml", n: "extrato de baunilha" },
          { q: 15, u: "ml", n: "leite" },
          { q: 6, u: "g", n: "corante alimentar vermelho em gel" },
          { q: 190, u: "g", n: "farinha sem fermento" },
          { q: 15, u: "g", n: "cacau em pó sem açúcar" },
          { q: 4, u: "g", n: "amido de milho (Maizena)" },
          { q: 3, u: "g", n: "bicarbonato de sódio" },
          { q: 2, u: "g", n: "sal fino" }
        ]
      },
      {
        titulo: "Chocolates",
        itens: [
          { q: 100, u: "g", n: "chocolate branco, em pedaços de 1 cm (30 g para o topo)" },
          { q: 60, u: "g", n: "chocolate de leite, em pedaços de 1 cm" }
        ]
      }
    ],
    passos: [
      { fase: "Massa", t: "Bater a manteiga com os açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga, o açúcar mascavado e o açúcar branco em velocidade média durante 3 minutos, até a mistura ficar mais clara e fofa." },
      { fase: "Massa", t: "Juntar o ovo, o leite e o corante", icone: "taca", min: 1,
        d: "Junta o ovo, a baunilha, o leite e o corante e bate 45 segundos, até a cor ficar uniforme. A massa deve ficar vermelho intenso: o cacau vai escurecê-la ligeiramente. Se estiver pálida, acrescenta mais 2 g de corante." },
      { fase: "Massa", t: "Misturar os ingredientes secos", icone: "peneira", min: 0,
        d: "Numa taça à parte, mistura a farinha, o cacau peneirado, o amido de milho, o bicarbonato e o sal com uma vara de mão." },
      { fase: "Massa", t: "Juntar os secos à massa", icone: "colher", min: 0,
        d: "Adiciona os secos em duas vezes e mistura com uma espátula só até deixares de ver pó." },
      { fase: "Massa", t: "Adicionar os chocolates", icone: "colher", min: 0,
        d: "Envolve 70 g de chocolate branco e o chocolate de leite na massa. Os 30 g de chocolate branco que separaste são para o topo." },
      { fase: "Repouso", t: "Refrigerar a massa", icone: "frio", min: 30,
        d: "Cobre a taça e leva ao frigorífico 30 minutos. O cacau e o corante deixam esta massa mais mole, e o frio evita que as cookies espalhem no forno." },
      { fase: "Repouso", t: "Pré-aquecer o forno", icone: "forno", min: 15,
        d: "A meio do tempo de frigorífico, liga o forno a 190 °C, calor em cima e em baixo, com a grelha na posição do meio. Forra dois tabuleiros com papel vegetal. Num forno só ventilado, usa 170–175 °C." },
      { fase: "Moldar", t: "Porcionar e moldar", icone: "balanca", min: 0,
        d: "Pesa a massa toda e divide por {N} (≈123 g cada). Faz uma bola com cada porção, parte-a ao meio e volta a juntá-la com as faces partidas viradas para cima, para o topo ficar irregular. Pressiona pedaços do chocolate branco reservado no topo." },
      { fase: "Forno", t: "Cozer", icone: "tabuleiro", min: 11,
        d: "Coloca 3 bolas por tabuleiro, com 8 cm de distância, e coze um tabuleiro de cada vez durante 10–11 minutos. Nesta massa não vês dourar: estão prontas quando as bordas estão firmes e o centro ainda tem aspeto húmido. Guarda a massa da segunda fornada no frigorífico." },
      { fase: "Forno", t: "Arredondar e arrefecer", icone: "grade", min: 10,
        d: "Logo ao sair do forno, roda um aro de 10 cm à volta de cada cookie. Deixa-as 10 minutos no tabuleiro e passa-as depois para uma grade." }
    ],
    dicas: [
      "Uma pitada de flor de sal no topo, logo ao sair do forno, equilibra a doçura do chocolate branco.",
      "Guardam-se 3 dias num recipiente fechado, à temperatura ambiente."
    ]
  }
];

const REGRAS_DO_REINO = [
  { icone: "balanca", t: "Pesa tudo", d: "Usa sempre balança. Medidas em chávenas variam muito, e farinha a menos é a causa mais comum de cookies que espalham." },
  { icone: "forno", t: "Forno sem ventoinha", d: "190 °C com calor em cima e em baixo, grelha no meio. Pré-aquece pelo menos 15 minutos." },
  { icone: "tabuleiro", t: "Tira-as com o centro mole", d: "O centro deve parecer mal cozido. As cookies acabam de cozer com o calor do tabuleiro." },
  { icone: "aro", t: "O truque do aro", d: "Logo ao sair do forno, roda um aro ou um copo à volta de cada cookie. Ficam perfeitamente redondas." }
];

const EQUIPAMENTO = {
  taca: "Taça grande",
  vara: "Batedeira ou vara",
  colher: "Espátula e colher",
  balanca: "Balança de cozinha",
  tacho: "Tacho pequeno",
  faca: "Faca afiada e tábua",
  tabuleiro: "2 tabuleiros + papel vegetal",
  aro: "Aro de 10 cm ou copo",
  grade: "Grade de arrefecimento",
  manga: "Saco de congelação"
};

if (typeof module !== "undefined") module.exports = { RECEITAS, REGRAS_DO_REINO, BASE_COOKIES, NIVEIS, EQUIPAMENTO };

/* =========================================================
   MEDIDAS EM CHÁVENAS E COLHERES
   Densidade de cada ingrediente (gramas por ml) para converter
   gramas em medidas de volume rasas:
   1 chávena = 240 ml · 1 c. sopa = 15 ml · 1 c. chá = 5 ml.
   "chav: true" prefere chávena a partir de ¼ (ingredientes volumosos).
   Ingredientes com "loja" (ovos, Kinder Bueno) aparecem à unidade.
   ========================================================= */
const MEDIDAS = [
  { re: /^farinha/i,           d: 0.52, chav: true, nota: "nivelada, sem calcar" },
  { re: /^açúcar mascavado/i,  d: 0.90, chav: true, nota: "bem calcado" },
  { re: /^açúcar branco/i,     d: 0.83, chav: true },
  { re: /^manteiga/i,          d: 0.95, chav: true },
  { re: /^natas/i,             d: 1.00 },
  { re: /^leite/i,             d: 1.00 },
  { re: /^extrato de baunilha/i, d: 1.00 },
  { re: /^cacau/i,             d: 0.35, chav: true },
  { re: /^amido de milho/i,    d: 0.53 },
  { re: /^bicarbonato/i,       d: 1.10 },
  { re: /^sal/i,               d: 1.20 },
  { re: /^corante/i,           d: 1.20 },
  { re: /^nutella/i,           d: 1.25 },
  { re: /^chocolate/i,         d: 0.71, chav: true }
];

/* devolve { q: "1⅓ chávenas", nota } ou null se não houver conversão */
function emVolume(item, fator) {
  if (item.u === "ml") return { q: Math.max(1, Math.round(item.q * fator)) + " ml" };
  const g = item.q * fator;
  if (item.loja) {
    const n = Math.max(0.5, Math.round((g / item.loja.por) * 2) / 2);
    const fr = n === 0.5 ? "½" : (Math.floor(n) + (n % 1 ? "½" : ""));
    return { q: fr + " " + (n > 1 ? item.loja.unPl : item.loja.un), nome: (n > 1 && item.loja.nomeVolPl) || item.loja.nomeVol };
  }
  const m = MEDIDAS.find(x => x.re.test(item.n));
  if (!m) return null;
  const ml = g / m.d, chav = ml / 240, sopa = ml / 15, cha = ml / 5;
  const FR = [[0, ""], [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [1 / 2, "½"], [2 / 3, "⅔"], [3 / 4, "¾"], [1, ""]];
  const fmt = (x, permitidos) => {
    const int = Math.floor(x), resto = x - int;
    let melhor = FR[0], erro = Infinity;
    for (const f of FR) {
      if (!permitidos.includes(f[1]) && f[0] !== 0 && f[0] !== 1) continue;
      const e = Math.abs(resto - f[0]);
      if (e < erro) { erro = e; melhor = f; }
    }
    const inteiro = int + (melhor[0] === 1 ? 1 : 0);
    const v = inteiro + (melhor[0] === 1 ? 0 : melhor[0]);
    return { txt: (inteiro ? inteiro : "") + (melhor[0] === 1 ? "" : melhor[1]) || "0", v };
  };
  let r;
  if (chav >= (m.chav ? 0.25 : 0.5)) { const f = fmt(chav, ["¼", "⅓", "½", "⅔", "¾"]); r = f.txt + (f.v > 1 ? " chávenas" : " chávena"); }
  else if (sopa >= 1) { const f = fmt(sopa, ["½"]); r = f.txt + " c. sopa"; }
  else { const f = fmt(cha, cha >= 1 ? ["¼", "½", "¾"] : ["⅛", "¼", "⅓", "½", "⅔", "¾"]); r = (f.txt === "0" ? "⅛" : f.txt) + " c. chá"; }
  return { q: r, nota: m.nota };
}

if (typeof module !== "undefined") Object.assign(module.exports, { MEDIDAS, emVolume });
