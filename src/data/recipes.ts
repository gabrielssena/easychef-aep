export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: number;
  difficulty: "Fácil" | "Média";
  savedFoodKg: number;
  savedCo2Kg: number;
  image: string;
}

export const recipes: Recipe[] = [
  {
    id: "arroz-forno",
    title: "Arroz de forno com legumes",
    description: "Uma base rápida para reaproveitar arroz cozido, legumes e proteína já pronta.",
    ingredients: ["arroz", "frango", "cenoura", "ervilha", "milho", "tomate", "queijo"],
    instructions: [
      "Misture o arroz cozido com frango desfiado, cenoura, ervilha, milho e tomate picado.",
      "Ajuste o tempero com sal, pimenta e cheiro-verde.",
      "Transfira para uma travessa, cubra com queijo e leve ao forno até gratinar.",
    ],
    prepTime: "30 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.8,
    savedCo2Kg: 1.5,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "omelete-legumes",
    title: "Omelete de legumes",
    description: "Boa opção para usar pequenos pedaços de legumes antes que estraguem.",
    ingredients: ["ovo", "tomate", "cebola", "pimentão", "cenoura", "queijo"],
    instructions: [
      "Bata os ovos com uma pitada de sal e pimenta.",
      "Pique os legumes em cubos pequenos e misture aos ovos.",
      "Despeje em uma frigideira aquecida e cozinhe em fogo baixo dos dois lados.",
    ],
    prepTime: "15 min",
    servings: 2,
    difficulty: "Fácil",
    savedFoodKg: 0.4,
    savedCo2Kg: 0.8,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sopa-feijao",
    title: "Sopa de legumes com feijão",
    description: "Transforma feijão e legumes avulsos em uma refeição completa.",
    ingredients: ["feijão", "batata", "cenoura", "cebola", "alho", "macarrão"],
    instructions: [
      "Refogue cebola e alho com um fio de azeite.",
      "Adicione batata e cenoura em cubos, cubra com água e cozinhe até amaciar.",
      "Junte o feijão com caldo e o macarrão, cozinhando até engrossar.",
    ],
    prepTime: "40 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.6,
    savedCo2Kg: 1.2,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "macarrao-brocolis",
    title: "Macarrão alho e óleo com brócolis",
    description: "Receita simples para aproveitar brócolis, alho e massa já aberta.",
    ingredients: ["macarrão", "alho", "azeite", "brócolis", "queijo", "limão"],
    instructions: [
      "Cozinhe o macarrão até ficar al dente.",
      "Doure alho fatiado no azeite e junte o brócolis já cozido.",
      "Misture a massa, finalize com queijo e algumas gotas de limão.",
    ],
    prepTime: "25 min",
    servings: 3,
    difficulty: "Fácil",
    savedFoodKg: 0.4,
    savedCo2Kg: 0.7,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "torta-liquidificador",
    title: "Torta salgada de liquidificador",
    description: "Aceita recheios variados e ajuda a consumir frios, legumes e sobras de frango.",
    ingredients: ["ovo", "leite", "farinha de trigo", "frango", "presunto", "queijo", "tomate"],
    instructions: [
      "Bata ovos, leite, farinha e um fio de óleo até formar uma massa lisa.",
      "Coloque metade da massa em uma forma untada e distribua o recheio.",
      "Cubra com o restante da massa e asse até dourar.",
    ],
    prepTime: "50 min",
    servings: 6,
    difficulty: "Média",
    savedFoodKg: 0.7,
    savedCo2Kg: 1.4,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "refogado-carne-batata",
    title: "Refogado de carne com batata",
    description: "Um prato único para usar carne moída, tomate e batatas maduras.",
    ingredients: ["carne moída", "batata", "cebola", "alho", "tomate", "cheiro-verde"],
    instructions: [
      "Refogue cebola e alho, acrescente a carne e cozinhe até dourar.",
      "Adicione tomate e batata em cubos com um pouco de água.",
      "Tampe e cozinhe até a batata ficar macia. Finalize com cheiro-verde.",
    ],
    prepTime: "35 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.6,
    savedCo2Kg: 2.0,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "salada-frutas",
    title: "Salada de frutas com aveia",
    description: "Aproveita frutas muito maduras em uma sobremesa rápida.",
    ingredients: ["banana", "maçã", "mamão", "laranja", "mel", "aveia"],
    instructions: [
      "Pique as frutas in cubos pequenos.",
      "Misture tudo com suco de laranja para evitar escurecimento.",
      "Sirva com mel e aveia por cima.",
    ],
    prepTime: "15 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.4,
    savedCo2Kg: 0.6,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sanduiche-natural",
    title: "Sanduíche natural de frango",
    description: "Resolve sobras de frango cozido e folhas que precisam ser usadas.",
    ingredients: ["pão", "frango", "maionese", "cenoura", "alface", "tomate"],
    instructions: [
      "Misture frango desfiado com maionese e cenoura ralada.",
      "Monte o recheio no pão com alface e tomate.",
      "Corte ao meio e sirva gelado.",
    ],
    prepTime: "10 min",
    servings: 1,
    difficulty: "Fácil",
    savedFoodKg: 0.2,
    savedCo2Kg: 0.4,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pure-batata",
    title: "Purê de batata cremoso",
    description: "Ideal para batatas que já passaram do ponto de assar ou fritar.",
    ingredients: ["batata", "leite", "manteiga", "queijo", "sal"],
    instructions: [
      "Cozinhe as batatas até ficarem bem macias.",
      "Amasse ainda quentes e leve à panela com manteiga e leite.",
      "Mexe em fogo baixo até ficar cremoso. Finalize com queijo se tiver.",
    ],
    prepTime: "30 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.5,
    savedCo2Kg: 0.7,
    image: "https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "escondidinho-frango",
    title: "Escondidinho de frango",
    description: "Combina purê e frango desfiado para reaproveitar sobras de almoço.",
    ingredients: ["batata", "frango", "cebola", "alho", "molho de tomate", "queijo"],
    instructions: [
      "Prepare um purê com as batatas.",
      "Refogue o frango com cebola, alho e molho de tomate.",
      "Monte camadas de purê e frango, cubra com queijo e leve ao forno.",
    ],
    prepTime: "50 min",
    servings: 4,
    difficulty: "Média",
    savedFoodKg: 0.8,
    savedCo2Kg: 1.6,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "salada-crocante",
    title: "Salada crocante",
    description: "Usa folhas, pepino e tomate em uma salada leve de preparo imediato.",
    ingredients: ["alface", "tomate", "cebola", "pepino", "limão", "azeite"],
    instructions: [
      "Lave e seque bem as folhas.",
      "Corte tomate, cebola e pepino em fatias finas.",
      "Tempere com limão, azeite, sal e pimenta.",
    ],
    prepTime: "10 min",
    servings: 2,
    difficulty: "Fácil",
    savedFoodKg: 0.3,
    savedCo2Kg: 0.5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "panqueca-carne",
    title: "Panqueca de carne",
    description: "Boa para reaproveitar carne moída e molho de tomate.",
    ingredients: ["ovo", "leite", "farinha de trigo", "carne moída", "molho de tomate", "queijo"],
    instructions: [
      "Bata ovo, leite e farinha para preparar a massa.",
      "Faça discos finos em uma frigideira untada.",
      "Recheie com carne, cubra com molho e queijo e leve ao forno.",
    ],
    prepTime: "45 min",
    servings: 3,
    difficulty: "Média",
    savedFoodKg: 0.5,
    savedCo2Kg: 1.8,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "batata-assada-alho",
    title: "Batatas assadas com alho",
    description: "Uma receita extremamente simples e saborosa para aproveitar batatas e alho.",
    ingredients: ["batata", "alho"],
    instructions: [
      "Corte as batatas em cubos e descasque os dentes de alho.",
      "Misture as batatas e o alho em uma assadeira com um fio de azeite e sal se tiver.",
      "Leve ao forno alto por 30 minutos ou até que as batatas fiquem douradas e crocantes."
    ],
    prepTime: "35 min",
    servings: 3,
    difficulty: "Fácil",
    savedFoodKg: 0.5,
    savedCo2Kg: 0.8,
    image: "https://images.unsplash.com/photo-1518013006335-e116d97e27aa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "salada-cenoura-limao",
    title: "Salada de cenoura com limão",
    description: "Entrada refrescante e rápida de preparar usando cenouras raladas e suco de limão.",
    ingredients: ["cenoura", "limão"],
    instructions: [
      "Lave, descasque e rale as cenouras no ralo fino ou médio.",
      "Em uma tigela, tempere a cenoura ralada com o suco de limão espremido na hora.",
      "Finalize com uma pitada de sal se desejar e misture bem antes de servir."
    ],
    prepTime: "10 min",
    servings: 2,
    difficulty: "Fácil",
    savedFoodKg: 0.3,
    savedCo2Kg: 0.4,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "creme-batata-cebola",
    title: "Creme de batata e cebola",
    description: "Sopa cremosa e reconfortante feita à base de batatas, cebola e um toque de alho.",
    ingredients: ["batata", "cebola", "alho"],
    instructions: [
      "Pique a cebola, o alho e as batatas em cubos.",
      "Em uma panela, refogue a cebola e o alho até dourarem.",
      "Adicione as batatas, cubra com água e cozinhe até que fiquem bem macias.",
      "Bata tudo no liquidificador ou com um mixer e sirva quente."
    ],
    prepTime: "30 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.6,
    savedCo2Kg: 1.0,
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "maca-assada-canela",
    title: "Maçãs assadas com canela",
    description: "Sobremesa reconfortante para usar maçãs que estão amadurecendo rápido na fruteira.",
    ingredients: ["maçã", "açúcar", "canela"],
    instructions: [
      "Lave as maçãs, remova o miolo central.",
      "Disponha as maçãs em um refratário.",
      "Coloque uma colher de açúcar e canela em pó dentro do miolo de cada maçã e asse por 25 minutos."
    ],
    prepTime: "30 min",
    servings: 2,
    difficulty: "Fácil",
    savedFoodKg: 0.4,
    savedCo2Kg: 0.5,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "salada-maca-queijo",
    title: "Salada de maçã com queijo",
    description: "Uma salada agridoce, refrescante e super rápida que harmoniza maçãs frescas com cubos de queijo e molho de limão.",
    ingredients: ["maçã", "queijo", "limão"],
    instructions: [
      "Lave e corte as maçãs em cubos médios (mantenha a casca para mais fibras).",
      "Corte o queijo em cubinhos do mesmo tamanho das maçãs.",
      "Misture a maçã e o queijo em uma tigela.",
      "Regue com suco de limão fresco para temperar e evitar que a maçã escureça. Sirva a seguir."
    ],
    prepTime: "10 min",
    servings: 2,
    difficulty: "Fácil",
    savedFoodKg: 0.5,
    savedCo2Kg: 0.6,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "batatas-rusticas-queijo",
    title: "Batatas rústicas ao alho e queijo",
    description: "Batatas douradas no forno com alho amassado e finalizadas com queijo derretido por cima.",
    ingredients: ["batata", "alho", "queijo"],
    instructions: [
      "Lave bem as batatas e corte-as em gomos (estilo rústico).",
      "Misture as batatas com dentes de alho levemente esmagados em uma assadeira.",
      "Leve ao forno por 25 minutos até dourarem.",
      "Retire do forno, salpique o queijo por cima e retorne por mais 5 minutos até derreter."
    ],
    prepTime: "35 min",
    servings: 3,
    difficulty: "Fácil",
    savedFoodKg: 0.7,
    savedCo2Kg: 1.1,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sopa-cenoura-batata",
    title: "Sopa aveludada de cenoura e batata",
    description: "Uma sopa cremosa e nutritiva que combina cenoura e batata, refogadas com cebola e alho.",
    ingredients: ["cenoura", "batata", "cebola", "alho"],
    instructions: [
      "Pique a cebola, o alho, a cenoura e as batatas em pedaços médios.",
      "Refogue a cebola e o alho em uma panela.",
      "Adicione a cenoura e a batata, cubra com água e cozinhe em fogo médio por 20 minutos.",
      "Quando os legumes estiverem bem macios, bata no liquidificador até obter um creme aveludado. Sirva quente."
    ],
    prepTime: "30 min",
    servings: 4,
    difficulty: "Fácil",
    savedFoodKg: 0.8,
    savedCo2Kg: 1.3,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
  }
];

