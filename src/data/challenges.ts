import { Challenge } from './powers';

export const ALL_CHALLENGES: Challenge[] = [
  // ==========================================
  // PADAWAN - NÍVEL INICIAL (10 Questões)
  // ==========================================
  {
    id: 1,
    level: 'PADAWAN',
    title: 'Suporte Interno Ágil',
    scenario: "A nossa equipe recebe muitas dúvidas repetidas sobre benefícios, férias e onboarding. O RH não consegue responder a todos a tempo.",
    correctPowerId: '1',
    distractors: ['4', '5', '10', '12', '7'],
    explanation: "O Aprendizado Inteligente permite que a IA estude manuais de RH e responda dúvidas frequentes de forma precisa e imediata."
  },
  {
    id: 2,
    level: 'PADAWAN',
    title: 'Otimização de Leitura',
    scenario: "Os gestores gastam muito tempo lendo atas longas e relatórios densos para extrair definições simples de reuniões anteriores.",
    correctPowerId: '2',
    distractors: ['9', '11', '8', '12', '5'],
    explanation: "A Leitura Inteligente é capaz de processar documentos longos e extrair apenas os pontos principais e decisões tomadas."
  },
  {
    id: 3,
    level: 'PADAWAN',
    title: 'Comunicação Profissional',
    scenario: "Muitos colaboradores têm dificuldade em redigir e-mails formais e propostas comerciais, levando muito tempo para revisar textos.",
    correctPowerId: '3',
    distractors: ['5', '8', '9', '12', '7'],
    explanation: "A Escrita Inteligente ajuda a gerar rascunhos profissionais, corrigir tons e garantir que a mensagem seja clara e direta."
  },
  {
    id: 4,
    level: 'PADAWAN',
    title: 'Apresentação Visual Rápida',
    scenario: "A equipe de vendas precisa criar apresentações visuais impactantes para clientes, mas não possui designers disponíveis no momento.",
    correctPowerId: '5',
    distractors: ['1', '8', '12', '9', '3'],
    explanation: "A Criação Multimodal pode gerar imagens e layouts de slides a partir de descrições em texto, acelerando a criação visual."
  },
  {
    id: 5,
    level: 'PADAWAN',
    title: 'Podcast Corporativo',
    scenario: "O CEO quer transformar o relatório anual de 50 páginas em um conteúdo de áudio dinâmico para os funcionários ouvirem no trajeto ao trabalho.",
    correctPowerId: '4',
    distractors: ['2', '6', '10', '11', '12'],
    explanation: "A Comunicação Inteligente permite converter grandes volumes de texto em narrações naturais e formatos de áudio envolventes."
  },
  {
    id: 6,
    level: 'PADAWAN',
    title: 'Brainstorming de Inovação',
    scenario: "O time de marketing está 'travado' e precisa de novas ideias de nomes para um produto, mas as reuniões de criação não estão rendendo.",
    correctPowerId: '6',
    distractors: ['9', '3', '8', '12', '7'],
    explanation: "O Diálogo Inteligente funciona como um parceiro de brainstorming, gerando dezenas de sugestões criativas a partir de um contexto."
  },
  {
    id: 7,
    level: 'PADAWAN',
    title: 'Organização de Wiki Técnica',
    scenario: "A empresa tem milhares de documentos técnicos espalhados. Novos engenheiros levam meses para aprender onde encontrar cada norma.",
    correctPowerId: '1',
    distractors: ['5', '11', '4', '9', '12'],
    explanation: "O Aprendizado Inteligente organiza o conhecimento corporativo e permite consultas por linguagem natural em toda a base técnica."
  },
  {
    id: 8,
    level: 'PADAWAN',
    title: 'Tradução de Contratos',
    scenario: "Recebemos um contrato em chinês de um novo fornecedor. Precisamos de uma tradução técnica urgente que respeite os termos jurídicos.",
    correctPowerId: '4',
    distractors: ['3', '8', '10', '1', '12'],
    explanation: "A Comunicação Inteligente utiliza modelos avançados de tradução que compreendem jargões técnicos e nuances culturais."
  },
  {
    id: 9,
    level: 'PADAWAN',
    title: 'Sentimento do Cliente',
    scenario: "Temos 5.000 comentários de uma pesquisa de satisfação. Precisamos saber rapidamente quais são as principais reclamações e se o tom é de raiva ou decepção.",
    correctPowerId: '2',
    distractors: ['6', '9', '11', '4', '12'],
    explanation: "A Leitura Inteligente identifica padrões emocionais e categoriza grandes volumes de feedback qualitativo automaticamente."
  },
  {
    id: 10,
    level: 'PADAWAN',
    title: 'Rascunho de Política Interna',
    scenario: "Precisamos criar uma política de uso de redes sociais para a empresa, mas não sabemos por onde começar a estrutura do documento.",
    correctPowerId: '3',
    distractors: ['1', '8', '10', '5', '12'],
    explanation: "A Escrita Inteligente pode gerar a estrutura inicial e os pontos fundamentais de documentos normativos em segundos."
  },

  // ==========================================
  // JEDI - NÍVEL INTERMEDIÁRIO (10 Questões)
  // ==========================================
  {
    id: 11,
    level: 'JEDI',
    title: 'Atendimento Personalizado',
    scenario: "Um cliente entra no chat e pergunta: 'Onde está meu pedido 4509?'. O bot atual não sabe acessar o banco de dados de logística.",
    correctPowerId: '8',
    distractors: ['11', '1', '10', '5', '4', '12'],
    explanation: "O Atendimento Inteligente conecta a conversa à base de dados real da empresa para dar respostas específicas sobre status de pedidos."
  },
  {
    id: 12,
    level: 'JEDI',
    title: 'Validação de Tendências',
    scenario: "A diretoria quer saber se o novo imposto anunciado ontem impactará nosso setor, comparando fontes confiáveis e descartando fake news.",
    correctPowerId: '7',
    distractors: ['10', '4', '2', '11', '12', '5'],
    explanation: "A Pesquisa Avançada navega em múltiplas fontes em tempo real, valida a credibilidade e traz uma síntese fundamentada."
  },
  {
    id: 13,
    level: 'JEDI',
    title: 'Sincronização de Dados',
    scenario: "Toda vez que um contrato é assinado no sistema A, alguém precisa copiar os dados para o CRM e para a planilha financeira manualmente.",
    correctPowerId: '9',
    distractors: ['3', '6', '12', '1', '10', '5'],
    explanation: "A Automação Inteligente orquestra o fluxo de dados entre diferentes softwares, garantindo integridade sem erro humano."
  },
  {
    id: 14,
    level: 'JEDI',
    title: 'Pitch de Investimento',
    scenario: "Precisamos convencer a matriz a investir em um novo projeto. O conteúdo é bom, mas o deck de slides não conta uma história envolvente.",
    correctPowerId: '10',
    distractors: ['5', '3', '11', '8', '12', '1'],
    explanation: "O Storytelling Estratégico ajuda a organizar a narrativa de negócio e criar apresentações que vendem visões e projetos."
  },
  {
    id: 15,
    level: 'JEDI',
    title: 'Voz no Inventário',
    scenario: "O pessoal do estoque trabalha com as mãos ocupadas. Eles precisam consultar a quantidade de itens apenas falando, sem usar teclado.",
    correctPowerId: '8',
    distractors: ['4', '1', '11', '9', '6', '12'],
    explanation: "O Atendimento Inteligente pode processar comandos de voz e consultar sistemas de estoque via integração de dados.",
  },
  {
    id: 16,
    level: 'JEDI',
    title: 'Navegação em Sistemas Legados',
    scenario: "Temos um sistema muito antigo de 1990 que não tem API. Precisamos de um robô que 'enxergue' a tela e digite as faturas sozinho.",
    correctPowerId: '9',
    distractors: ['11', '8', '10', '1', '12', '7'],
    explanation: "A Automação Inteligente (RPA com IA) utiliza visão computacional para interagir com interfaces sem integração técnica direta."
  },
  {
    id: 17,
    level: 'JEDI',
    title: 'Curadoria de Artigos Técnicos',
    scenario: "Um pesquisador precisa acompanhar tudo o que sai sobre 'Novas Ligas de Aço' no mundo, recebendo resumos semanais de artigos validados.",
    correctPowerId: '7',
    distractors: ['1', '10', '6', '12', '5', '4'],
    explanation: "A Pesquisa Avançada monitora a produção acadêmica e técnica global, filtrando apenas o que é relevante e verídico."
  },
  {
    id: 18,
    level: 'JEDI',
    title: 'Storytelling em Dados',
    scenario: "A planilha de lucro está cheia de números, mas a diretoria não entende a 'causa raiz' das perdas. Precisamos de um relatório que explique os números como uma jornada.",
    correctPowerId: '10',
    distractors: ['2', '9', '11', '8', '12', '3'],
    explanation: "O Storytelling Estratégico traduz dados frios em narrativas de negócio compreensíveis para tomadores de decisão."
  },
  {
    id: 19,
    level: 'JEDI',
    title: 'Suporte Multinacional',
    scenario: "Nossa central de suporte no Brasil precisa atender um cliente da Alemanha via áudio. Precisamos traduzir a fala de ambos em tempo real.",
    correctPowerId: '4',
    distractors: ['6', '8', '11', '9', '12', '1'],
    explanation: "A Comunicação Inteligente permite a tradução simultânea de voz, permitindo diálogos fluidos entre idiomas diferentes."
  },
  {
    id: 20,
    level: 'JEDI',
    title: 'Automação de Retorno de E-mail',
    scenario: "Recebemos milhares de e-mails de orçamento. A IA deve ler o anexo, verificar se temos o produto e responder o e-mail anexando a proposta.",
    correctPowerId: '9',
    distractors: ['3', '8', '11', '10', '12', '2'],
    explanation: "A Automação Inteligente conecta o recebimento do e-mail (gatilho) com a consulta de estoque e a geração da resposta automática."
  },

  // ==========================================
  // YODA - NÍVEL AVANÇADO (10 Questões)
  // ==========================================
  {
    id: 21,
    level: 'YODA',
    title: 'Operação de Voo Autônoma',
    scenario: "Desejamos que a IA coordene sozinha o agendamento de manutenção, compra de peças e escala de pilotos, reagindo a imprevistos meteorológicos.",
    correctPowerId: '11',
    distractors: ['9', '1', '10', '5', '12', '4'],
    explanation: "Agentes Inteligentes possuem autonomia para tomar uma série de decisões encadeadas e corrigir planos baseados em eventos externos."
  },
  {
    id: 22,
    level: 'YODA',
    title: 'Comitê de Ética Digital',
    scenario: "A nossa IA de seleção de currículos está apresentando um padrão de excluir candidatos de uma determinada região. Precisamos auditar e corrigir esse comportamento.",
    correctPowerId: '12',
    distractors: ['1', '8', '11', '3', '7', '10'],
    explanation: "A Governança e IA Responsável foca na detecção de vieses (bias) e na transparência ética dos algoritmos de decisão."
  },
  {
    id: 23,
    level: 'YODA',
    title: 'Investigação de Mercado Profunda',
    scenario: "A empresa quer prever qual será a próxima grande disrupção no setor de energia, cruzando patentes, discursos de líderes e dados econômicos mundiais.",
    correctPowerId: '1',
    distractors: ['7', '11', '12', '4', '8', '10'],
    explanation: "O Aprendizado Inteligente em escala de 'Big Data' permite correlações complexas impossíveis de serem notadas por humanos."
  },
  {
    id: 24,
    level: 'YODA',
    title: 'Agente de Desenvolvimento (Dev)',
    scenario: "Precisamos de um sistema que receba um erro de código, pesquise a solução, corrija o arquivo, rode os testes e suba a correção sozinho.",
    correctPowerId: '11',
    distractors: ['9', '3', '12', '8', '4', '1'],
    explanation: "Agentes Inteligentes de desenvolvimento podem agir como engenheiros de software autônomos para tarefas específicas de manutenção."
  },
  {
    id: 25,
    level: 'YODA',
    title: 'Proteção de Identidade Corporativa',
    scenario: "Para usar IA externa, precisamos garantir que nomes de clientes e segredos industriais sejam substituídos por códigos antes de saírem da nossa rede.",
    correctPowerId: '12',
    distractors: ['11', '1', '9', '7', '3', '10'],
    explanation: "A Governança implementa camadas de anonimização e segurança para proteger a privacidade dos dados corporativos."
  },
  {
    id: 26,
    level: 'YODA',
    title: 'Ecossistema Multi-Agente',
    scenario: "Queremos uma fábrica de software onde uma IA faz o design, outra escreve o código e uma terceira audita a segurança, todas conversando entre si sem humanos.",
    correctPowerId: '11',
    distractors: ['9', '12', '10', '1', '6', '8'],
    explanation: "A coordenação de múltiplos Agentes Inteligentes permite que diferentes especialidades de IA colaborem para resolver problemas complexos."
  },
  {
    id: 27,
    level: 'YODA',
    title: 'IA Explicável (XAI)',
    scenario: "O governo exige que expliquemos detalhadamente POR QUE nossa IA negou um empréstimo para um cliente específico de forma transparente.",
    correctPowerId: '12',
    distractors: ['1', '11', '8', '10', '7', '3'],
    explanation: "A Governança foca em 'Explainable AI', permitindo que decisões automatizadas sejam compreensíveis e auditáveis."
  },
  {
    id: 28,
    level: 'YODA',
    title: 'Visão de Futuro Estratégico',
    scenario: "A empresa quer simular os próximos 10 anos da economia para decidir se deve construir uma nova fábrica agora ou esperar, considerando 500 variáveis.",
    correctPowerId: '1',
    distractors: ['11', '12', '10', '9', '5', '4'],
    explanation: "Modelos de Aprendizado Inteligente em larga escala podem simular cenários complexos para apoio à decisão estratégica de longo prazo."
  },
  {
    id: 29,
    level: 'YODA',
    title: 'Monitoramento Ético Realtime',
    scenario: "Precisamos de um 'vigia' que bloqueie qualquer resposta da nossa IA que contenha linguagem imprópria ou que exponha opiniões políticas da empresa.",
    correctPowerId: '12',
    distractors: ['11', '9', '8', '1', '10', '3'],
    explanation: "A Governança estabelece filtros de segurança (guardrails) para garantir que a IA se comporte de acordo com os valores da marca."
  },
  {
    id: 30,
    level: 'YODA',
    title: 'Agente de Compras Autônomo',
    scenario: "Desejamos uma IA que monitore preços de matéria-prima no mundo, negocie com fornecedores via chat e feche a compra no melhor momento.",
    correctPowerId: '11',
    distractors: ['9', '8', '12', '10', '4', '1'],
    explanation: "Agentes Inteligentes podem atuar como negociadores autonômos, integrando monitoramento de mercado com execução de tarefas comerciais."
  }
];
