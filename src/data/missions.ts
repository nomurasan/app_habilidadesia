export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  context: string;
  items: string[];
  reflection: string;
  expectedResults: string[];
  recommendedPowerIds: string[];
  advisorHint: string;
}

export const MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Missão 1',
    subtitle: 'O Despertar Digital',
    context: 'A organização está crescendo e novos colaboradores chegam constantemente. Com isso, o time de RH passou a receber um grande volume de dúvidas repetidas sobre:',
    items: ['onboarding', 'benefícios', 'férias', 'acesso a sistemas', 'procedimentos internos'],
    reflection: 'Como a Inteligência Artificial poderia ajudar a transformar o acesso ao conhecimento interno em algo mais rápido, organizado e acessível?',
    expectedResults: [
      'Uma ideia de solução utilizando IA',
      'Como o colaborador interagiria com essa experiência',
      'Quais informações a IA precisaria conhecer',
      'Quais ganhos seriam gerados para a empresa e para os funcionários'
    ],
    recommendedPowerIds: ['1', '9'],
    advisorHint: 'O segredo em bots de RH é a base de conhecimento (RAG). Use Aprendizado Inteligente para conectar documentos e Escrita Inteligente para humanizar as respostas.'
  },
  {
    id: '2',
    title: 'Missão 2',
    subtitle: 'O Mestre dos Resumos',
    context: 'Os gestores da organização estão enfrentando dificuldades para acompanhar:',
    items: ['atas de reunião', 'relatórios extensos', 'documentos técnicos', 'e-mails longos'],
    reflection: 'Como a Inteligência Artificial poderia ajudar pessoas a consumirem informações de forma mais rápida e eficiente?',
    expectedResults: [
      'Uma proposta de apoio inteligente para leitura e organização de conteúdos',
      'Como a IA poderia resumir ou reorganizar informações',
      'Quais benefícios seriam percebidos pelos gestores',
      'Quais tipos de materiais poderiam ser processados pela solução'
    ],
    recommendedPowerIds: ['2', '8'],
    advisorHint: 'Gestores valorizam o tempo. Foque na Extração de Dados para identificar decisões e tarefas pendentes em textos longos.'
  },
  {
    id: '3',
    title: 'Missão 3',
    subtitle: 'O Criador Multimodal',
    context: 'A área de comunicação recebeu uma solicitação urgente para criar materiais internos sobre inovação e IA, porém o tempo disponível é muito curto. A equipe precisa produzir rapidamente:',
    items: ['apresentações', 'banners', 'imagens', 'slogans', 'conteúdos visuais'],
    reflection: 'Como a IA poderia acelerar a criatividade e a produção de conteúdos visuais e apresentações?',
    expectedResults: [
      'Uma ideia de fluxo criativo com IA',
      'Exemplos de conteúdos que poderiam ser gerados',
      'Como a IA ajudaria na velocidade e organização das entregas',
      'Quais etapas ainda dependeriam da criatividade humana'
    ],
    recommendedPowerIds: ['4', '5'],
    advisorHint: 'Criação Multimodal e Comunicação Inteligente são seus aliados. Lembre-se: o roteiro (texto) vem antes da imagem ou áudio.'
  },
  {
    id: '4',
    title: 'Missão 4',
    subtitle: 'Caçadores de Conhecimento',
    context: 'A liderança da empresa precisa tomar decisões rápidas sobre tendências relacionadas à Inteligência Artificial e inovação digital. O problema é que existem muitas informações espalhadas, diferentes fontes apresentam opiniões conflitantes e o tempo para pesquisa é limitado.',
    items: [],
    reflection: 'Como a IA poderia ajudar equipes a pesquisar, organizar e transformar informações em conhecimento útil para tomada de decisão?',
    expectedResults: [
      'Uma proposta de pesquisa inteligente utilizando IA',
      'Como informações poderiam ser organizadas',
      'Como insights importantes seriam destacados',
      'Como reduzir tempo gasto em pesquisas manuais'
    ],
    recommendedPowerIds: ['7', '8'],
    advisorHint: 'Pesquisa Avançada é para validação. Use Extração de Dados para tabular o que diferentes fontes dizem sobre o mesmo tema.'
  },
  {
    id: '5',
    title: 'Missão 5',
    subtitle: 'O Atendimento Inteligente',
    context: 'A empresa recebe diariamente muitas perguntas repetitivas de clientes e colaboradores. As equipes enfrentam filas, demora nas respostas, sobrecarga operacional e dificuldades em manter padrão.',
    items: ['filas', 'demora nas respostas', 'sobrecarga operacional', 'dificuldades em manter padrão'],
    reflection: 'Como a IA poderia melhorar a experiência de atendimento sem perder clareza, acolhimento e eficiência?',
    expectedResults: [
      'Uma ideia de atendimento apoiado por IA',
      'Exemplos de perguntas que poderiam ser automatizadas',
      'Como a IA poderia ajudar na comunicação',
      'Quais benefícios seriam gerados para clientes e equipes internas'
    ],
    recommendedPowerIds: ['10', '11'],
    advisorHint: 'O Atendimento Inteligente requer integração. Explique como a IA acessa dados (estoque, status de pedido) para ser útil.'
  },
  {
    id: '6',
    title: 'Missão 6',
    subtitle: 'O Fluxo Automático',
    context: 'Diversas tarefas repetitivas continuam sendo realizadas manualmente na organização:',
    items: ['copiar informações', 'atualizar planilhas', 'encaminhar solicitações', 'organizar aprovações', 'enviar mensagens'],
    reflection: 'Como a IA e a automação poderiam ajudar a simplificar atividades operacionais do dia a dia?',
    expectedResults: [
      'Uma ideia simples de automação',
      'Qual atividade poderia ser otimizada',
      'Como seria o fluxo ideal',
      'Quais ganhos de produtividade poderiam existir'
    ],
    recommendedPowerIds: ['11', '12'],
    advisorHint: 'Automação Inteligente (Agentes) é sobre orquestração. Foque em como os Agentes podem "conectar" aplicativos diferentes.'
  },
  {
    id: '7',
    title: 'Missão 7',
    subtitle: 'O Futuro dos Agentes',
    context: 'A liderança começou a ouvir sobre agentes inteligentes, copilotos digitais, IA executando tarefas e automações autônomas. Existe curiosidade sobre como será o futuro do trabalho.',
    items: ['agentes inteligentes', 'copilotos digitais', 'IA executando tarefas', 'automações autônomas'],
    reflection: 'Como será o futuro do trabalho com IA atuando como assistente operacional das equipes?',
    expectedResults: [
      'Quais tarefas poderiam ser apoiadas por agentes',
      'Quais benefícios isso poderia trazer',
      'Quais riscos ou cuidados deveriam existir',
      'Uma visão simples de um agente inteligente'
    ],
    recommendedPowerIds: ['11', '12'],
    advisorHint: 'Agentes não substituem humanos, eles estendem nossa capacidade. Pense na relação "Humano-na-Alça" (Human-in-the-loop).'
  },
  {
    id: '8',
    title: 'Missão 8',
    subtitle: 'IA Responsável',
    context: 'Com o crescimento do uso de IA surgiram preocupações: compartilhamento indevido de dados, informações incorretas, fake news, uso exagerado e impactos éticos.',
    items: ['compartilhamento indevido de dados', 'informações incorretas', 'fake news', 'uso exagerado', 'impactos éticos'],
    reflection: 'Quais cuidados são necessários para utilizar IA de forma segura, ética e responsável?',
    expectedResults: [
      'Recomendações de boas práticas',
      'Riscos que devem ser evitados',
      'Orientações para uso responsável',
      'Como equilibrar tecnologia e pensamento crítico'
    ],
    recommendedPowerIds: ['3', '12'],
    advisorHint: 'Segurança é fundamental. Governança de IA não é apenas uma trava, é habilitar o uso seguro para todos.'
  },
  {
    id: 'final',
    title: 'Missão Final',
    subtitle: 'Arquitetos da Inteligência',
    context: 'Após explorar diferentes possibilidades, os grupos receberam um desafio final: imaginar como a IA poderia ajudar a melhorar uma situation real da organização.',
    items: ['um problema', 'uma oportunidade', 'uma dificuldade operacional', 'necessidade de inovação'],
    reflection: 'Como a IA poderia apoiar pessoas, equipes e processos em uma situação real?',
    expectedResults: [
      'O problema escolhido',
      'A ideia da solução',
      'Como seria a experiência do usuário',
      'Quais benefícios seriam gerados',
      'Quais cuidados seriam importantes',
      'Como a IA ajudaria na prática'
    ],
    recommendedPowerIds: ['1', '11'], // Basic starting point
    advisorHint: 'Arquiteto, sua jornada chega ao clímax. Combine habilidades de baixa complexidade com automação para provar o valor rápido (Quick Win).'
  }
];

