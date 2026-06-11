import { Brain, Sparkles, MessageSquare, PenTool, Play, BookOpen, Search, Layers, Target, Zap, UserCheck, Shield } from 'lucide-react';

export interface AIPower {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  detailedDescription?: string;
  detailedExamples?: { title: string; description: string }[];
  cases: string[];
  icon: string;
  image: string;
}

export const CATEGORIES: Record<string, { label: string; icon: any }> = {
  'Padawan': { label: 'Padawan', icon: Brain },
  'Jedi': { label: 'Jedi', icon: Target },
  'Mestre Yoda': { label: 'Mestre Yoda', icon: Shield },
};

export const AI_POWERS: AIPower[] = [
  // DIA 1 - PADAWAN (Descobrir IA)
  {
    id: '1',
    category: 'Padawan',
    title: 'Diálogo Inteligente',
    shortDescription: 'Conversar de forma natural com a IA para esclarecer dúvidas e ter ideias.',
    fullDescription: 'Aprender a conversar com a inteligência artificial para tirar dúvidas, ter novas ideias ou resolver problemas cotidianos de maneira rápida.',
    detailedDescription: 'Saber dialogar com a IA é como ter um colega de trabalho paciente e experiente disponível a qualquer hora. Você pode fazer perguntas, pedir conselhos e ir ajustando as respostas através de uma conversa simples e direta, até chegar exatamente ao resultado que precisa.',
    detailedExamples: [
      { title: 'ChatGPT (O Consultor Paciente)', description: 'Imagina que você tem um amigo gigante que sabe tudo sobre todos os assuntos do mundo. Quando você não sabe como realizar uma tarefa complexa, você senta com ele, vai explicando o que quer fazer, e ele te dá dicas fáceis passo a passo até você terminar!' },
      { title: 'Google Gemini (O Assistente de Brainstorming)', description: 'Sabe quando você quer inventar um projeto diferente mas faltam ideias criativas? Esse amiguinho ouve o que você já pensou e sugere caminhos espertos, conversando de volta com você até a planejamento ficar perfeito.' },
      { title: 'Claude AI (O Tutor de Projetos)', description: 'É como ter um mentor de negócios muito carinhoso. Se você não entendeu uma regra corporativa, ele te explica com histórias divertidas e exemplos didáticos do dia a dia até você compreender de verdade.' }
    ],
    cases: ['Brainstorming de planos de ação', 'Simulação de conversas com clientes', 'Esclarecimento rápido de dúvidas gerais'],
    icon: 'MessageSquare',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '2',
    category: 'Padawan',
    title: 'Escrita Inteligente',
    shortDescription: 'Produzir textos, e-mails e relatórios de forma ágil, clara e profissional.',
    fullDescription: 'Aprender a produzir rascunhos, redigir mensagens corporativas e estruturar relatórios de impacto a partir de poucas palavras.',
    detailedDescription: 'A escrita assistida por IA ajuda você a vencer definitivamente o bloqueio da folha em branco. Com ela, você digita algumas ideias soltas e a ferramenta produz um e-mail formal, uma proposta comercial organizada ou corrige o tom de um texto para torná-lo mais polido e profissional.',
    detailedExamples: [
      { title: 'Microsoft Copilot no Word (A Caneta Mágica)', description: 'Imagina uma caneta mágica que, quando você escreve "quero avisar a equipe sobre a reunião", ela mesma capricha e escreve um comunicado de trabalho lindo, com termos comerciais adequados e sem nenhum erro!' },
      { title: 'Jasper AI (O Auxiliar de Redação)', description: 'Sabe quando você quer contar para o mercado que o seu produto é fantástico? Esse ajudante te auxilia a bolar anúncios super criativos e descrições divertidas que deixam os clientes com muita vontade de conhecer.' },
      { title: 'Outlook Smart Reply (O Sugeridor de Bilhetes)', description: 'É como ter um secretário sentado ao seu lado. Quando alguém te manda uma pergunta de trabalho, ele lê e já deixa três cartõezinhos com respostas elegantes prontinhos para você só escolher a melhor e enviar.' }
    ],
    cases: ['Redação de comunicados internos', 'Criação de propostas de vendas', 'Ajuste de tom de voz corporativo'],
    icon: 'PenTool',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '3',
    category: 'Padawan',
    title: 'Leitura Inteligente',
    shortDescription: 'Interpretar e extrair informações de PDFs e documentos longos.',
    fullDescription: 'Aprender a analisar relatórios técnicos, PDFs regulatórios e atas extensas para encontrar de forma ágil as respostas.',
    detailedDescription: 'Em vez de gastar horas lendo manuais gigantescos ou relatórios densos, você usa a IA para fazer a triagem da informação. Você faz perguntas diretas ao documento de forma natural, e a IA localiza as páginas exatas, resume os pilares fundamentais e explica pontos técnicos.',
    detailedExamples: [
      { title: 'Google NotebookLM (O Resumidor Inteligente)', description: 'Sabe quando você recebe aquele relatório longo e sem figuras? Esse robozinho lê todas as páginas em um milissegundo e te conta os pontos mais urgentes e importantes com uma historinha de forma bem descomplicada!' },
      { title: 'Acrobat AI Assistant (A Lupa Procura-Pistas)', description: 'É como ter um detetive de óculos que ajuda a procurar pistas em um livro de regras. Se você pergunta "o que acontece se o cliente atrasar?", ele aponta no manual em qual linha e parágrafo exatos está a resposta certa.' },
      { title: 'ChatPDF (O Conversador de Documentos)', description: 'Sabe aquelas apostilas cheias de letrinhas miúdas? Esse amiguinho se transforma em um colega que já decorou as folhas inteiras. Você conversa diretamente com ele e ele te explica as fórmulas difíceis de um jeito bem moleza.' }
    ],
    cases: ['Resumo executivo de relatórios trimestrais', 'Leitura e extração de cláusulas contratuais', 'Identificação de regras em manuais técnicos'],
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '4',
    category: 'Padawan',
    title: 'Pesquisa Avançada',
    shortDescription: 'Buscar dados na internet e validar a confiabilidade das fontes.',
    fullDescription: 'Aprender a navegar na web cruzando informações de fontes confiáveis com o suporte analítico da IA.',
    detailedDescription: 'Esta competência consiste em ir além das buscas tradicionais do Google. Você usa a IA de pesquisa em tempo real para rastrear dezenas de sites concorrentes ao mesmo tempo, sintetizar respostas corporativas coerentes e indicar as referências originais para tomadas de decisão seguras.',
    detailedExamples: [
      { title: 'Perplexity AI (O Curador da Internet)', description: 'Imagina que você quer descobrir o que as outras lojas estão vendendo e pergunta para esse mestre. Ele corre em toda a vizinhança da web, descobre o resultado, faz um resumo claro e te dá os endereços de onde obteve a informação.' },
      { title: 'SciSpace (O Desatador de Nós de Estudos)', description: 'Se você mostra a ele uma pesquisa cheia de termos ou gráficos complicados, ele decifra tudo com simpatia e te explica os conceitos mais difíceis da ciência como se estivesse batendo um papo amigável sobre curiosidades.' },
      { title: 'Consensus AI (O Buscador sem Mentiras)', description: 'É como uma biblioteca especial onde só entram materiais comprovados em laboratório. Quando você pergunta o que ajuda na produtividade, ele vai direto nos relatórios científicos sérios para te garantir a verdade.' }
    ],
    cases: ['Análise de competidores de mercado', 'Validação acadêmica e técnica de dados', 'Busca em tempo real de notícias setoriais'],
    icon: 'Search',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '5',
    category: 'Padawan',
    title: 'Aprendizado Inteligente',
    shortDescription: 'Aprender novos assuntos e conceitos usando a IA como apoio.',
    fullDescription: 'Transformar a IA em uma mentora pessoal de estudos e capacitação profissional altamente adaptável ao seu ritmo.',
    detailedDescription: 'Saber aprender com IA acelera seu aprimoramento profissional. Você pode pedir que ela monte cronogramas de estudo estruturados, gere simulados práticos para testar seus conhecimentos e explique temas técnicos complexos através de analogias simples que fixam de verdade na memória.',
    detailedExamples: [
      { title: 'ChatGPT (O Professor de Bolso)', description: 'Um professor que mora na tela e nunca se cansa de responder suas dúvidas. Se você não entendeu uma fórmula de matemática, pode pedir para ele explicar como se contasse uma piada de parquinho com doces!' },
      { title: 'Khanmigo (O Incentivador de Descobertas)', description: 'Um instrutor que faz os exercícios junto com você. Ele não te dá as respostas de graça, mas faz perguntas espertas para instigar seu raciocínio, ajudando a encontrar a saída correta por conta própria!' },
      { title: 'NotebookLM Audio Overview (O Podcast Escolar)', description: 'Imagina pegar uma apostila de regras burocráticas enormes e convertê-la em uma mesa de debate por áudio, onde dois locutores super bem-humorados conversam brincando sobre as matérias do seu estudo.' }
    ],
    cases: ['Montagem de roteiros de estudo personalizados', 'Criação de testes e simulados interativos', 'Uso de analogias didáticas para temas complexos'],
    icon: 'Brain',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '6',
    category: 'Padawan',
    title: 'Comunicação Inteligente',
    shortDescription: 'Adaptar mensagens, traduzir conteúdos e comunicar com empatia.',
    fullDescription: 'Derrubar barreiras de comunicação linguística ou visual e traduzir pensamentos de forma clara para cada audiência.',
    detailedDescription: 'A comunicação eficaz com IA envolve adaptar seus materiais corporativos de maneira natural para diferentes públicos. Permite gerar e-mails traduzidos sem soar artificial, extrair roteiros multilíngues eficientes e produzir narrações de alta expressividade com avatares de voz e vídeo realistas.',
    detailedExamples: [
      { title: 'DeepL Translator (O Tradutor Fluido)', description: 'Se você precisa conversar com um fornecedor internacional, essa ferramenta transforma suas frases no modo exato e simpático que as pessoas de lá falam, para garantir uma conversa agradável e sem atropelos!' },
      { title: 'ElevenLabs (A Voz que Transmite Sentimento)', description: 'Sabe quando você digita um aviso de RH e quer que ele seja ouvido de forma afetuosa? Esse robô lê seu recado rindo, respirando e mudando o tom de voz como se fosse uma pessoa de verdade falando ao telefone.' },
      { title: 'HeyGen (O Apresentador do Teatrinho de Vídeo)', description: 'É ter um bonequinho virtual bem simpático falando na tela! Você escreve o recado e o bonequinho mexe a boca, pisca e mexe os braços ensinando os tutoriais exatamente como se fosse um profissional experiente.' }
    ],
    cases: ['Tradução comercial multilíngue', 'Criação de vídeos corporativos com avatares virtuais', 'Locução humanizada de comunicados internos'],
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },

  // DIA 2 - JEDI (Aplicar IA)
  {
    id: '7',
    category: 'Jedi',
    title: 'Criação Multimodal',
    shortDescription: 'Gerar e editar imagens, vídeos e sonorizações profissionais integradas.',
    fullDescription: 'Materializar conceitos criativos em layouts visuais, peças publicitárias e pequenas mídias utilizando IA generativa de forma ágil.',
    detailedDescription: 'É a fronteira da cocriação de alta expressividade. Essa habilidade permite a elaboração de layouts de produtos, imagens fotorrealistas sofisticadas de estúdio e a sonorização de pequenas produções comerciais sem requerer domínio de editores visuais pesados.',
    detailedExamples: [
      { title: 'Midjourney / DALL-E (O Pintor de Sonhos)', description: 'Sabe quando você fecha os olhos e imagina um copo de suco flutuando nas nuvens com pedras coloridas? Você conta para ele em palavras e ele pinta um quadro perfeito, idêntico a uma foto profissional de loja!' },
      { title: 'Canva Magic Studio (O Estojo Mágico com Tesouras)', description: 'Um estojo cheio de lápis e adesivos que cortam por mágica. O robô limpa fundos de retratos, ajeita as figuras fora de esquadro e monta posts inteiros em segundos, sem você deixar as sobras de papel caindo no chão!' },
      { title: 'Sora da OpenAI (O Diretor de Cinema Digital)', description: 'É como ter uma miniatura de estúdio cinematográfico no computador. Você dita um texto criativo e ele monta um filminho com movimentos de câmera reais de cinema super suaves e fofinhos do jeito que você pensou.' }
    ],
    cases: ['Peças visuais e anúncios para mídias sociais', 'Edição acelerada de fotografias de produtos', 'Geração de conceitos artísticos visuais inovadores'],
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '8',
    category: 'Jedi',
    title: 'Storytelling Estratégico',
    shortDescription: 'Desenvolver narrativas envolventes e diagramar apresentações de slides imersivas.',
    fullDescription: 'Utilizar a inteligência artificial para estruturar argumentos persuasivos, roteirizar discursos e desenhar apresentações executivas coerentes.',
    detailedDescription: 'Mais importante do que slides bonitos é uma história eloquente e persuasiva. Com a IA do Storytelling Estratégico, você organiza seus relatórios no formato de uma jornada imersiva e gera em pouquíssimo tempo apresentações diagramadas de alto nível visual sem precisar alinhar margens manualmente.',
    detailedExamples: [
      { title: 'Gamma App (O Teatrinho de Slides Instantâneo)', description: 'Você descreve sua história em poucas palavras uma única vez e o designer robô cria um álbum inteiro de slides coloridos com desenhos coerentes e letras elegantes num abrir e fechar de olhos!' },
      { title: 'Tome App (O Contador de Histórias Narrativas)', description: 'Um ajudante que junta belas gravuras com argumentos cativantes. Ele te ajuda a expor uma ideia para as pessoas na escola de um jeito tão interessante que todos ficam sentados olhando o projeto quietinhos.' },
      { title: 'Beautiful.ai (O Imã Mágico de Alinhamento)', description: 'É como desenhar com uma régua de imã. Toda vez que você solta imagens ou textos na página, o quadro os puxa para ficarem perfeitamente centralizados e lindos para a reunião, impedindo bagunças.' }
    ],
    cases: ['Pitch de negócios para captação de recursos', 'Apresentações comerciais para fechamento de vendas', 'Roteirização estruturada de discursos corporativos'],
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '9',
    category: 'Jedi',
    title: 'Atendimento Inteligente',
    shortDescription: 'Integrar assistentes inteligentes com bases de dados empresariais.',
    fullDescription: 'Conectar chat cognitivo a planilhas de estoque ou manuais a fim de garantir retornos resolutivos automáticos.',
    detailedDescription: 'Proporcione respostas ágeis aos clientes de forma natural. O atendimento cognitivo com IA compreende solicitações espontâneas, pesquisa rapidamente em sistemas integrados (como bases do CRM, planilhas ou inventário) e devolve a resposta pertinente imediatamente sem fluxos engessados.',
    detailedExamples: [
      { title: 'Supabase + LangChain (O Duende Vigilante de Estoques)', description: 'Imagina um duendinho dentro do armário do estoque. Quando um cliente pergunta "vocês ainda têm a caneta azul?", o duende corre rápido na planilha secreta do depósito, confere e grita informando o estoque certinho!' },
      { title: 'Flowise AI (O Construtor de Trilhos de Brinquedo)', description: 'É construir trilhos de trenzinho interativos conectando blocos de cores espertas. Se o comprador quer o rastreamento, o trilho leva o trem ali; se quer alterar dados, leva lá de forma automatizada.' },
      { title: 'Salesforce Einstein (O Detetive que Encontra Pacotes)', description: 'Quando o comprador liga ansioso dizendo "cadê meu doce?", esse profissional põe o chapéu de detetive corporativo, olha os sistemas e avisa em qual rua o carteiro está andando com a caixinha.' }
    ],
    cases: ['Consulta automática de disponibilidade física de estoque', 'Suporte interno de TI voltado para colaboradores', 'Canais de autoatendimento integrados a ERPs comerciais'],
    icon: 'Target',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '10',
    category: 'Jedi',
    title: 'Automação Inteligente',
    shortDescription: 'Conectar diferentes ferramentas e automatizar processos sem digitar códigos.',
    fullDescription: 'Desenhar fluxos integrados que transferem dados e disparam ações repetitivas de forma totalmente coordenada.',
    detailedDescription: 'Evite o desgaste das tarefas cotidianas burocráticas de copiar e colar. A automação habilitada por IA permite conectar e-mails, planilhas organizacionais e sistemas legados: quando um cliente preenche um cadastro no site, o fluxo analisa as respostas, cria uma linha, agenda o envio e encaminha um e-mail.',
    detailedExamples: [
      { title: 'n8n / Zapier (A Pista Mágica de Dominós)', description: 'É enfileirar pedrinhas de dominó no computador. Quando o comprador faz o pagamento (derruba a primeira pedra), as outras caem sozinhas num piscar: emite o recibo, avisa o time de expedição e manda parabéns!' },
      { title: 'Zapier Central (A Assistente Secreta Noturna)', description: 'Uma fadinha trabalhadora que vigia seus e-mails enquanto você dorme. Toda vez que recebe um formulário de cliente, ela arquiva com carinho e deixa a pasta perfeita para você começar as tarefas de manhã sem perder tempo!' },
      { title: 'UiPath (O Robo-Copiator Ultra-Veloz)', description: 'Um braço robótico que clica de forma transparente na tela do computador. Ele copia infinitos nomes em planilhas chatas e cola em outro site sozinho para você não estressar os seus dedinhos digitando.' }
    ],
    cases: ['Triagem e sincronização automatizada de leads comerciais', 'Geração de faturas automatizadas por gatilhos de vendas', 'Atualização cadastral inter-sistemas sem interfaces nativas'],
    icon: 'Play',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  },

  // DIA 3 - MESTRE YODA (Futuro Estratégico)
  {
    id: '11',
    category: 'Mestre Yoda',
    title: 'Agentes Inteligentes',
    shortDescription: 'Projetar sistemas autônomos que planejam e executam missões completas.',
    fullDescription: 'Criar robôs integrados com capacidade de usar navegadores, acionar ferramentas externas e sanar os próprios erros.',
    detailedDescription: 'O patamar mais elevado de aplicação consiste em projetar agentes autônomos. Você fornece apenas uma missão geral ("pesquise 10 hotéis executivos em Fortaleza com preço abaixo de R$ 400"), e o agente define as tarefas, navega, pesquisa orçamentos de quartos, compara e gera a indicação pronta.',
    detailedExamples: [
      { title: 'AutoGPT / AgentGPT (O Explorador de Brinquedos)', description: 'Você dá um mapa e pede para encontrar o chocolate mais docinho do bairro. Esse robô sai sozinho, entra em todas as lojas virtuais, analisa preços e ingredientes e só volta quando organizar uma lista perfeita!' },
      { title: 'CrewAI (O Trabalho em Equipe dos Bonecos)', description: 'Imagina três bonequinhos amigos cooperando de forma espontânea na sua mesa. O primeiro faz o cartaz, o segundo confere se existem erros e o terceiro traduz em espanhol. Eles ajeitam tudo de forma autônoma!' },
      { title: 'Devin AI (O Engenheiro que Constrói Parquinhos)', description: 'É como ter um mestre de obras digital veloz. Você pede um brinquedo novo em 3D, ele abre sua maleta física de martelos, arruma os remendos se a engrenagem falhar e te entrega a atração totalmente pronta.' }
    ],
    cases: ['Mapeamento de fornecedores e pesquisas de mercado autônomas', 'Operação em equipe de IAs com objetivos de triagens complexas', 'Geração autônoma de relatórios estruturados e auditorias técnicas'],
    icon: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '12',
    category: 'Mestre Yoda',
    title: 'Governança e IA Responsável',
    shortDescription: 'Mitigar vazamentos de dados de negócios e garantir segurança e ética no uso de IA.',
    fullDescription: 'Implementar diretrizes, filtros éticos e metodologias seguras para que as ferramentas de IA operem de forma em conformidade.',
    detailedDescription: 'O uso corporativo de Inteligência Artificial demanda profunda responsabilidade. Esta competência foca em privacidade (removendo CPFs, segredos industriais e telefones antes de usar ferramentas públicas), auditoria de equidade algorítmica e transparência nas decisões corporativas.',
    detailedExamples: [
      { title: 'Mecanismo de Anonimização (O Filtro Limpa-Segredos)', description: 'Um filtro protetor super caprichoso que vigia suas cartinhas. Ele apaga seu telefone real e seu nome do papel antes de enviar a folha para os computadores da internet, mantendo sua vida e dados em total segredo!' },
      { title: 'Análise de Igualdade (A Balança Amistosa de Brincadeiras)', description: 'Um juiz de brincadeiras muito bacana que observa se as regras são justas e divertidas para todo mundo, de forma que nenhuma criança seja discriminada ou saia chateada de fora de alguma rodada seletiva.' },
      { title: 'LIME / SHAP (O Revelador de Linhas de Raciocínio)', description: 'Sabe quando você pergunta rindo "papai, por que você tomou essa decisão?" e ele te mostra calmamente pecinha por pecinha do seu julgamento de um jeito claríssimo para você ter a certeza lógica daquilo que ocorreu.' }
    ],
    cases: ['Comitês corporativos de governança e ética empresarial em IA', 'Definição de boas práticas de confidencialidade com dados financeiros', 'Auditoria contra discriminação estatística em algoritmos preditivos'],
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
  }
];

export interface Challenge {
  id: number;
  level: 'PADAWAN' | 'JEDI' | 'YODA';
  title: string;
  scenario: string;
  correctPowerId: string;
  distractors: string[];
  explanation: string;
}

export const CHALLENGES: Challenge[] = [
  // PADAWAN - Dia 1
  {
    id: 1,
    level: 'PADAWAN',
    title: 'RH Inteligente',
    scenario: "A nossa equipe recebe muitas dúvidas repetidas sobre benefícios, férias e onboarding. O RH de nível básico demora muito para responder todas as solicitações.",
    correctPowerId: '1',
    distractors: ['4', '5', '10', '12', '7'],
    explanation: "O Diálogo Inteligente permite interagir com assistentes de IA para esclarecer dúvidas frequentes de forma rápida e natural."
  },
  {
    id: 2,
    level: 'PADAWAN',
    title: 'Resumindo Reuniões',
    scenario: "Os gestores de equipes de vendas gastam muito tempo lendo atas longas e relatórios técnicos enormes para entender o que foi decidido.",
    correctPowerId: '3',
    distractors: ['9', '11', '8', '12', '5'],
    explanation: "A Leitura Inteligente com IA permite resumir textos, extrair os principais pontos decididos e analisar PDFs longos em poucos segundos."
  },
  {
    id: 3,
    level: 'PADAWAN',
    title: 'Melhorando E-mails',
    scenario: "Os novos analistas possuem dificuldade em estruturar e-mails formais e propostas claras para enviar à diretoria corporativa.",
    correctPowerId: '2',
    distractors: ['5', '8', '9', '12', '7'],
    explanation: "A Escrita Inteligente ajuda a gerar rascunhos estruturados, propostas e adequar o tom de mensagens profissionais rapidamente."
  },
  {
    id: 4,
    level: 'PADAWAN',
    title: 'Pesquisa Estratégica',
    scenario: "A equipe precisa encontrar dados mercadológicos reais e relevantes na web para validar um novo nicho, evitando informações falsas.",
    correctPowerId: '4',
    distractors: ['1', '8', '12', '9', '3'],
    explanation: "A Pesquisa Avançada cruza informações na web e traz dados com fontes reais citadas para decisões mais seguras."
  },

  // JEDI - Dia 2
  {
    id: 5,
    level: 'JEDI',
    title: 'Atendimento Automatizado',
    scenario: "A empresa recebe milhares de solicitações repetitivas de rastreamento de compras. Os atendentes estão sobrecarregados.",
    correctPowerId: '9',
    distractors: ['11', '1', '10', '5', '4', '12'],
    explanation: "O Atendimento Inteligente integra a IA com bases de dados reais, permitindo responder de forma personalizada sobre estoques, pedidos e status."
  },
  {
    id: 6,
    level: 'JEDI',
    title: 'Ensino Acelerado',
    scenario: "Os líderes precisam capacitar a força de vendas em novos produtos regulatórios complexos de forma didática e rápida.",
    correctPowerId: '5',
    distractors: ['10', '4', '2', '11', '12', '7'],
    explanation: "O Aprendizado Inteligente utiliza a IA como tutora particular personalizada para criar roteiros estruturados e simplificar novos conceitos."
  },
  {
    id: 7,
    level: 'JEDI',
    title: 'Organização de Fluxos',
    scenario: "Muitas tarefas repetitivas de transcrever dados de compras entre e-mails e planilhas financeiras são feitas manualmente e geram atrasos.",
    correctPowerId: '10',
    distractors: ['3', '6', '12', '1', '9', '5'],
    explanation: "A Automação Inteligente conecta sistemas e dispara ações coordenadas e automáticas para eliminar tarefas repetitivas."
  },
  {
    id: 8,
    level: 'JEDI',
    title: 'Comunicação Global',
    scenario: "O departamento de marketing deseja expandir seus vídeos e comunicados rápidos para clientes em múltiplos idiomas com alta qualidade e som de voz humana natural.",
    correctPowerId: '6',
    distractors: ['1', '8', '10', '5', '12', '2'],
    explanation: "A Comunicação Inteligente permite traduzir conteúdos de maneira fluida e gerar locuções ou de avatares falantes com entonação humana natural."
  },

  // MESTRE YODA - Dia 3
  {
    id: 9,
    level: 'YODA',
    title: 'Agente Inteligente',
    scenario: "A organização quer criar um robô autônomo de prospecção comercial capaz de pesquisar na web, qualificar leads e montar planilhas completas de decisão sem intervenção humana.",
    correctPowerId: '11',
    distractors: ['9', '1', '10', '5', '12', '4'],
    explanation: "Os Agentes Inteligentes agem de maneira quase totalmente independente para cumprir um objetivo complexo que exige múltiplos passos e ferramentas."
  },
  {
    id: 10,
    level: 'YODA',
    title: 'Direção Visual',
    scenario: "Um time criativo precisa conceber novas embalagens e protótipos de comerciais envolventes em vídeo com altíssima agilidade.",
    correctPowerId: '7',
    distractors: ['5', '8', '12', '11', '4', '2'],
    explanation: "A Criação Multimodal combina comandos textuais com ferramentas inteligentes para gerar imagens, vídeos e sonorizações profissionais integradas."
  },
  {
    id: 11,
    level: 'YODA',
    title: 'Governança',
    scenario: "Os diretores corporativos estão extremamente preocupados com riscos éticos, vazamento de CPFs de clientes no ChatGPT e vieses nas decisões automatizadas.",
    correctPowerId: '12',
    distractors: ['1', '8', '3', '6', '10', '5'],
    explanation: "A Governança e IA Responsável cria as barreiras éticas, filtros de anonimato e validações necessárias para mitigar os riscos corporativos do uso de inteligência artificial."
  }
];
