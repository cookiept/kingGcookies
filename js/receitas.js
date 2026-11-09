/* =========================================================
   O LIVRO SAGRADO DO KING G
   Todas as receitas vivem aqui. O site lê este ficheiro.
   Para mudar uma quantidade, muda-a aqui e pronto.

   unidades: "g", "ml", "cc" (colher de chá), "cs" (colher de sopa), "un" (unidades)
   ========================================================= */

const BASE_COOKIES = 6;

const RECEITAS = [
  {
    id: "recheada",
    nome: "O Rei Recheado",
    subtitulo: "Massa de chocolate com coração de mousse de chocolate",
    piada: "Parte-a ao meio e vê a mousse a escorrer. É um golpe de estado de chocolate.",
    cor: "#5a2d1a",
    corSuave: "#f3e3d6",
    imagem: "assets/img/cookies/recheada.png",
    tempoTotal: "2 h 30 (1 h 45 é frigorífico)",
    forno: "190 °C · 12–13 min",
    dificuldade: 3,
    icone: "taca",
    grupos: [
      {
        titulo: "Recheio de mousse",
        nota: "É uma ganache batida: fica fofa como mousse e aguenta o forno sem desaparecer.",
        itens: [
          { q: 100, u: "g", n: "chocolate negro ou de leite" },
          { q: 60, u: "ml", n: "natas para bater" }
        ]
      },
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, mole" },
          { q: 130, u: "g", n: "açúcar mascavado claro" },
          { q: 50, u: "g", n: "açúcar branco" },
          { q: 1, u: "un", n: "ovo grande", plural: "ovos grandes" },
          { q: 1, u: "cc", n: "extrato de baunilha" },
          { q: 0.5, u: "cc", n: "bicarbonato de sódio" },
          { q: 0.5, u: "cc", n: "sal grosso (ou ¼ de sal fino)" },
          { q: 1.5, u: "cc", n: "Maizena" },
          { q: 30, u: "g", n: "cacau em pó sem açúcar" },
          { q: 175, u: "g", n: "farinha sem fermento" },
          { q: 120, u: "g", n: "chocolate de leite picado" }
        ]
      }
    ],
    passos: [
      { t: "Faz a mousse real", icone: "medidor", min: 0,
        d: "Aquece as natas até começarem a fumegar (não deixes ferver). Despeja por cima do chocolate partido, espera 1 minuto e mexe até ficar brilhante e liso." },
      { t: "Frigorífico, 1 hora", icone: "luva", min: 60,
        d: "Tapa a taça e deixa a ganache firmar no frigorífico. Tem de ficar com textura de manteiga de amendoim." },
      { t: "Bate até ficar mousse", icone: "vara", min: 0,
        d: "Bate a ganache fria com a vara 1–2 minutos até ficar mais clara e fofa. Faz {N} montinhos (uma colher de sopa cheia cada) em papel vegetal e leva ao congelador." },
      { t: "Congela os recheios", icone: "aro", min: 45,
        d: "Mínimo 45 minutos. Recheio congelado = recheio que fica lá dentro. Recheio mole = cookie a chorar chocolate pelo tabuleiro." },
      { t: "Liga o forno", icone: "luva", min: 0,
        d: "190 °C, calor em cima e em baixo, grelha no meio (ventilado: 170–175 °C). Forra o tabuleiro com papel vegetal." },
      { t: "Manteiga + açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga com os dois açúcares durante 3 minutos, até ficar cremoso e mais claro." },
      { t: "Ovo e companhia", icone: "taca", min: 1,
        d: "Junta o ovo, a baunilha, o bicarbonato, o sal e a Maizena. Bate mais 1 minuto e raspa as paredes da taça." },
      { t: "Farinha, com calma", icone: "colher", min: 0,
        d: "Mistura a farinha com o cacau numa taça à parte (assim não faz grumos). Junta à massa com uma espátula só até deixares de ver pó branco. Depois envolve o chocolate picado." },
      { t: "Embrulha o tesouro", icone: "rolo", min: 0,
        d: "Divide a massa em {N} bolas (≈115 g). Achata cada uma na mão, põe um recheio congelado no meio e fecha bem a massa à volta, sem buracos. Volta a fazer bola." },
      { t: "Forno!", icone: "tabuleiro", min: 13,
        d: "Máximo 6 no tabuleiro, bem afastadas. 12–13 minutos. Como a massa é escura, não esperes que doure: estão prontas quando as bordas estão firmes e o centro ainda parece mole." },
      { t: "Coroação", icone: "aro", min: 5,
        d: "Mal saiam, arredonda as bordas com um aro ou um copo e deixa-as 5 minutos no tabuleiro. Para o efeito da foto, parte uma ao meio ainda morna à frente de toda a gente." }
    ],
    dicas: [
      "Serve-as mornas: 10 minutos depois de saírem, o recheio está no ponto de mousse.",
      "Já frias? 10 segundos no micro-ondas e volta tudo."
    ]
  },

  {
    id: "bueno",
    nome: "O Bueno Real",
    subtitulo: "Kinder Bueno na massa, por cima e com coração de Nutella",
    piada: "Três Kinder Bueno morreram para que esta cookie pudesse viver. Valeu a pena.",
    cor: "#c75b12",
    corSuave: "#fde7d2",
    imagem: "assets/img/cookies/bueno.png",
    tempoTotal: "1 h 30 (1 h é congelador)",
    forno: "190 °C · 11–12 min",
    dificuldade: 2,
    icone: "tabuleiro",
    grupos: [
      {
        titulo: "Coração de Nutella",
        itens: [
          { q: 90, u: "g", n: "Nutella (≈ 6 colheres de chá bem cheias)" }
        ]
      },
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, mole" },
          { q: 120, u: "g", n: "açúcar mascavado claro" },
          { q: 50, u: "g", n: "açúcar branco" },
          { q: 1, u: "un", n: "ovo grande", plural: "ovos grandes" },
          { q: 1, u: "cc", n: "extrato de baunilha" },
          { q: 0.5, u: "cc", n: "bicarbonato de sódio" },
          { q: 0.5, u: "cc", n: "sal grosso (ou ¼ de sal fino)" },
          { q: 1.5, u: "cc", n: "Maizena" },
          { q: 200, u: "g", n: "farinha sem fermento" },
          { q: 60, u: "g", n: "chocolate de leite picado" },
          { q: 2, u: "un", n: "embalagem de Kinder Bueno (2 barras), picada", plural: "embalagens de Kinder Bueno (2 barras cada), picadas" }
        ]
      },
      {
        titulo: "Para o topo",
        itens: [
          { q: 1, u: "un", n: "embalagem de Kinder Bueno, aos pedaços", plural: "embalagens de Kinder Bueno, aos pedaços" },
          { q: 40, u: "g", n: "chocolate de leite derretido, para regar" },
          { q: 25, u: "g", n: "chocolate branco derretido, para regar" }
        ]
      }
    ],
    passos: [
      { t: "Nutella ao frio", icone: "colher", min: 60,
        d: "Faz {N} montinhos de Nutella em papel vegetal e leva ao congelador 1 hora. Sim, uma hora. A paciência também é real." },
      { t: "Liga o forno", icone: "luva", min: 0,
        d: "190 °C, calor em cima e em baixo, grelha no meio (ventilado: 170–175 °C). Papel vegetal no tabuleiro." },
      { t: "Manteiga + açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga com os dois açúcares 3 minutos, até ficar cremoso." },
      { t: "Ovo e companhia", icone: "taca", min: 1,
        d: "Junta o ovo, a baunilha, o bicarbonato, o sal e a Maizena. Bate mais 1 minuto." },
      { t: "Farinha e Bueno", icone: "colher", min: 0,
        d: "Mistura a farinha com a espátula só até desaparecer. Envolve o chocolate e os Kinder Bueno picados." },
      { t: "Embrulha a Nutella", icone: "rolo", min: 0,
        d: "Faz {N} bolas (≈115 g). Achata, põe a Nutella congelada no centro, fecha bem e volta a fazer bola. Espeta 2–3 pedaços de Bueno no topo." },
      { t: "Forno!", icone: "tabuleiro", min: 12,
        d: "11–12 minutos, até as bordas ficarem douradas. O centro deve parecer cru. Confia no processo." },
      { t: "Arredonda e rega", icone: "aro", min: 0,
        d: "Mal saiam, arredonda as bordas com um aro. Quando estiverem mornas, rega em zigue-zague com o chocolate de leite e depois com o branco. Um saco de congelação com a pontinha cortada faz de manga pasteleira." },
      { t: "Descanso real", icone: "luva", min: 5,
        d: "5 minutos no tabuleiro antes de lhes tocares. Estão a acabar de cozer com o calor." }
    ],
    dicas: [
      "Corta os Kinder Bueno com uma faca bem afiada e de uma vez, para não esmagares o recheio.",
      "Se quiseres ainda mais, mistura uma colher de chá de Nutella no chocolate derretido do topo."
    ]
  },

  {
    id: "redvelvet",
    nome: "A Capa Vermelha",
    subtitulo: "Red velvet com chocolate branco e de leite",
    piada: "Da mesma cor da capa do Rei. Coincidência? O Rei não acredita em coincidências.",
    cor: "#b3122a",
    corSuave: "#fbe0e3",
    imagem: "assets/img/cookies/redvelvet.png",
    tempoTotal: "1 h (30 min é frigorífico)",
    forno: "190 °C · 10–11 min",
    dificuldade: 2,
    icone: "medidor",
    grupos: [
      {
        titulo: "Massa",
        itens: [
          { q: 115, u: "g", n: "manteiga com sal, mole" },
          { q: 100, u: "g", n: "açúcar mascavado claro" },
          { q: 80, u: "g", n: "açúcar branco" },
          { q: 1, u: "un", n: "ovo grande", plural: "ovos grandes" },
          { q: 1, u: "cc", n: "extrato de baunilha" },
          { q: 1, u: "cs", n: "leite" },
          { q: 1.5, u: "cc", n: "corante alimentar vermelho em gel" },
          { q: 15, u: "g", n: "cacau em pó sem açúcar" },
          { q: 190, u: "g", n: "farinha sem fermento" },
          { q: 1.5, u: "cc", n: "Maizena" },
          { q: 0.5, u: "cc", n: "bicarbonato de sódio" },
          { q: 0.5, u: "cc", n: "sal grosso (ou ¼ de sal fino)" }
        ]
      },
      {
        titulo: "Os chocolates",
        itens: [
          { q: 100, u: "g", n: "chocolate branco picado (guarda uns pedaços)" },
          { q: 60, u: "g", n: "chocolate de leite picado" }
        ]
      }
    ],
    passos: [
      { t: "Manteiga + açúcares", icone: "vara", min: 3,
        d: "Bate a manteiga com os dois açúcares 3 minutos, até ficar cremoso." },
      { t: "Fica vermelha", icone: "taca", min: 1,
        d: "Junta o ovo, a baunilha, o leite e o corante. Bate 1 minuto. Se o vermelho estiver tímido, mais meia colher de chá de corante." },
      { t: "Os secos", icone: "medidor", min: 0,
        d: "Numa taça à parte, mistura a farinha, o cacau, a Maizena, o bicarbonato e o sal. Assim o cacau não faz grumos." },
      { t: "Junta tudo", icone: "colher", min: 0,
        d: "Junta os secos à massa vermelha com a espátula, só até desaparecerem. Envolve os dois chocolates." },
      { t: "Frigorífico", icone: "luva", min: 30,
        d: "30 minutos. O cacau deixa a massa mais mole e assim ela não se espalha no forno. Liga o forno a meio deste tempo: 190 °C, sem ventoinha (ventilado: 170–175 °C)." },
      { t: "Bolas rugosas", icone: "rolo", min: 0,
        d: "Faz {N} bolas (≈120 g). Parte cada uma ao meio e volta a juntar com o lado partido para cima. Espeta pedaços de chocolate branco no topo." },
      { t: "Forno!", icone: "tabuleiro", min: 11,
        d: "10–11 minutos. Atenção: aqui não as vês dourar! Estão prontas quando as bordas estão firmes e o centro ainda brilha." },
      { t: "Coroação", icone: "aro", min: 5,
        d: "Arredonda com um aro mal saiam e deixa 5 minutos no tabuleiro. O contraste branco no vermelho é o teu momento de glória." }
    ],
    dicas: [
      "Usa corante em gel: o líquido deixa-as cor-de-rosa-choque em vez de vermelho real.",
      "Uma pitada de flor de sal no topo, ao sair do forno, deixa toda a gente calada."
    ]
  }
];

const REGRAS_DO_REINO = [
  { icone: "medidor", t: "Pesa tudo", d: "Chávenas mentem. A balança não. Cookies que espalham quase sempre são farinha a menos." },
  { icone: "luva", t: "Forno sem ventoinha", d: "190 °C com calor em cima e em baixo, grelha no meio. Pré-aquece 10–15 minutos." },
  { icone: "tabuleiro", t: "Tira-as \"cruas\"", d: "O centro tem de parecer mal cozido. Elas acabam de cozer no tabuleiro quente." },
  { icone: "aro", t: "O truque do aro", d: "Mal saiam do forno, roda um aro (ou um copo) à volta de cada uma. Ficam perfeitamente redondas." }
];

if (typeof module !== "undefined") module.exports = { RECEITAS, REGRAS_DO_REINO, BASE_COOKIES };
