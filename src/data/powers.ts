import { Brain, Sparkles, MessageSquare, PenTool, Play, BookOpen, Search, Layers, Target, Zap, UserCheck, Shield, Calendar, Clock, CheckSquare, Mail, Users, Megaphone, FileText, FileSearch, HelpCircle, FileCheck, EyeOff, ShieldAlert, Activity, TrendingUp, Cpu, Key, Lock, Network, Lightbulb } from 'lucide-react';

export interface AIPower {
  id: string;
  category: string;
  title: string;
  objective: string;
  applicationContext: string;
  practicalExample: string;
  expectedBenefits: string[];
  icon: string;
  image: string;
  
  // Legacy fields for complete backward compatibility
  shortDescription?: string;
  fullDescription?: string;
  detailedDescription?: string;
  detailedExamples?: { title: string; description: string }[];
  cases?: string[];
  tools?: string[];
  security?: string;
  related?: string[];
}

export const CATEGORIES: Record<string, { label: string; icon: any }> = {
  'Produtividade Pessoal': { label: 'Produtividade Pessoal', icon: Clock },
  'Comunicação': { label: 'Comunicação', icon: MessageSquare },
  'Pesquisa': { label: 'Pesquisa', icon: Search },
  'Apoio à Decisão': { label: 'Apoio à Decisão', icon: Brain },
  'Organização': { label: 'Organização', icon: Layers },
  'Inteligência Analítica': { label: 'Inteligência Analítica', icon: TrendingUp },
  'Segurança': { label: 'Segurança', icon: Shield },
  'Colaboração': { label: 'Colaboração', icon: Users },
};

export const AI_POWERS: AIPower[] = [
  // 1. PRODUTIVIDADE PESSOAL
  {
    id: '1',
    category: 'Produtividade Pessoal',
    title: 'Organizar Agenda',
    objective: 'Auxiliar o usuário na organização inteligente de compromissos, reduzindo conflitos de horários e melhorando a gestão do tempo.',
    applicationContext: 'Utilizada quando há múltiplas reuniões, tarefas ou atividades concorrentes que precisam ser distribuídas de forma equilibrada.',
    practicalExample: 'Um gerente possui 12 reuniões na semana, diversas entregas e atividades pessoais. A IA reorganiza automaticamente os horários sugerindo blocos de foco, pausas e redistribuição das reuniões.',
    expectedBenefits: [
      'Melhor aproveitamento do tempo.',
      'Redução de conflitos de agenda.',
      'Priorização automática.',
      'Aumento da produtividade.',
      'Melhor equilíbrio entre foco e reuniões.'
    ],
    icon: 'Calendar',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Auxiliar o usuário na organização inteligente de compromissos.',
    fullDescription: 'Auxiliar o usuário na organização inteligente de compromissos, reduzindo conflitos de horários e melhorando a gestão do tempo.',
    cases: ['Mapeamento de rotina executiva', 'Otimização de reuniões recorrentes', 'Sincronização de equipes híbridas']
  },
  {
    id: '2',
    category: 'Produtividade Pessoal',
    title: 'Planejar Semana',
    objective: 'Construir um planejamento semanal estruturado baseado em objetivos, prioridades e disponibilidade do usuário.',
    applicationContext: 'Ideal para profissionais que desejam iniciar a semana com clareza sobre entregas e prioridades.',
    practicalExample: 'O usuário informa que deseja finalizar um projeto, estudar IA e praticar exercícios físicos. A IA gera uma agenda semanal equilibrada considerando todos esses objetivos.',
    expectedBenefits: [
      'Organização estratégica.',
      'Melhor distribuição de carga de trabalho.',
      'Redução da procrastinação.',
      'Visibilidade das prioridades.',
      'Acompanhamento das metas.'
    ],
    icon: 'Clock',
    image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Construir um planejamento semanal estruturado baseado em objetivos.',
    fullDescription: 'Construir um planejamento semanal estruturado baseado em objetivos, prioridades e disponibilidade do usuário.',
    cases: ['Estruturação de Sprints', 'Checklist de onboarding semanal', 'Planejamento ágil de equipes']
  },
  {
    id: '3',
    category: 'Produtividade Pessoal',
    title: 'Priorizar Atividades',
    objective: 'Apoiar na definição da ordem ideal de execução das tarefas considerando impacto, urgência e importância.',
    applicationContext: 'Aplicável quando existe excesso de demandas e dificuldade para decidir por onde começar.',
    practicalExample: 'Uma equipe possui 40 demandas abertas. A IA aplica critérios de impacto e urgência e recomenda quais tarefas devem ser executadas primeiro.',
    expectedBenefits: [
      'Foco nas atividades críticas.',
      'Melhor tomada de decisão.',
      'Redução de retrabalho.',
      'Gestão eficiente do backlog.',
      'Aumento da efetividade operacional.'
    ],
    icon: 'CheckSquare',
    image: 'https://images.unsplash.com/photo-1484417894907-623942c8ea29?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Apoiar na definição da ordem ideal de execução das tarefas.',
    fullDescription: 'Apoiar na definição da ordem ideal de execução das tarefas considerando impacto, urgência e importância.',
    cases: ['Mapeamento de gargalos de faturamento', 'Triagem de fluxos no RH', 'Alinhamento de prioridades comerciais']
  },

  // 2. COMUNICAÇÃO
  {
    id: '4',
    category: 'Comunicação',
    title: 'Elaborar E-mails',
    objective: 'Produzir mensagens profissionais claras, objetivas e adaptadas ao público-alvo.',
    applicationContext: 'Utilizado para comunicação corporativa, atendimento, negociação ou relacionamento institucional.',
    practicalExample: 'Um colaborador fornece apenas alguns tópicos e a IA cria um e-mail formal para clientes, ajustando tom, estrutura e cordialidade.',
    expectedBenefits: [
      'Economia de tempo.',
      'Comunicação mais clara.',
      'Redução de ambiguidades.',
      'Padronização de linguagem.',
      'Melhor imagem profissional.'
    ],
    icon: 'Mail',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Produzir mensagens profissionais claras, objetivas e adaptadas.',
    fullDescription: 'Produzir mensagens profissionais claras, objetivas e adaptadas ao público-alvo.',
    cases: ['Proposta comercial de impacto', 'Notas oficiais informativas', 'Respostas rápidas ao cliente']
  },
  {
    id: '5',
    category: 'Comunicação',
    title: 'Criar Comunicados',
    objective: 'Elaborar comunicados internos ou externos de forma estruturada, clara e engajadora.',
    applicationContext: 'Muito utilizado por RH, comunicação interna e gestores de equipes.',
    practicalExample: 'O RH informa apenas "mudança no horário de expediente". A IA gera um comunicado completo, explicando o motivo, os impactos e as orientações aos colaboradores.',
    expectedBenefits: [
      'Comunicação uniforme.',
      'Maior engajamento.',
      'Clareza das mensagens.',
      'Rapidez na elaboração.',
      'Redução de ruídos de comunicação.'
    ],
    icon: 'Megaphone',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Elaborar comunicados internos ou externos estruturados.',
    fullDescription: 'Elaborar comunicados internos ou externos de forma estruturada, clara e engajadora.',
    cases: ['Divulgação da trilha Jornada Jedi', 'Boas-vindas coletivas do onboarding', 'Práticas saudáveis no expediente diário']
  },
  {
    id: '6',
    category: 'Comunicação',
    title: 'Resumir Conteúdos',
    objective: 'Transformar documentos extensos em versões resumidas mantendo os principais conceitos e informações relevantes.',
    applicationContext: 'Aplicável para atas, artigos, contratos, relatórios ou livros.',
    practicalExample: 'Um relatório de 120 páginas é condensado em um resumo executivo contendo apenas os principais indicadores e conclusões.',
    expectedBenefits: [
      'Economia de tempo.',
      'Melhor compreensão.',
      'Rapidez na leitura.',
      'Identificação dos pontos-chave.',
      'Apoio à tomada de decisão.'
    ],
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Transformar documentos extensos em versões resumidas.',
    fullDescription: 'Transformar documentos extensos em versões resumidas mantendo os principais conceitos e informações relevantes.',
    cases: ['Mapeamento de atas financeiras', 'Síntese de novidades fiscais', 'Análise rápida de editais corporativos']
  },

  // 3. PESQUISA
  {
    id: '7',
    category: 'Pesquisa',
    title: 'Pesquisa Profunda',
    objective: 'Realizar pesquisas estruturadas utilizando múltiplas fontes para produzir respostas completas e fundamentadas.',
    applicationContext: 'Ideal para estudos técnicos, benchmarking e análises estratégicas.',
    practicalExample: 'Um gestor solicita um estudo sobre tendências de IA na saúde. A IA pesquisa diversas referências e produtos um relatório consolidado.',
    expectedBenefits: [
      'Maior profundidade analítica.',
      'Melhor qualidade das respostas.',
      'Consolidação de múltiplas fontes.',
      'Economia de tempo.',
      'Apoio à pesquisa científica.'
    ],
    icon: 'Search',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029fa3c?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Realizar pesquisas estruturadas utilizando múltiplas fontes.',
    fullDescription: 'Realizar pesquisas estruturadas utilizando múltiplas fontes para produzir respostas completas e fundamentadas.',
    cases: ['Inteligência de competidores', 'Mapeamento fiscal de inovações', 'Busca científica regulamentar']
  },
  {
    id: '8',
    category: 'Pesquisa',
    title: 'Estudo de Novos Temas',
    objective: 'Facilitar o aprendizado estruturado de assuntos desconhecidos por meio de explicações progressivas e exemplos.',
    applicationContext: 'Utilizado em treinamentos, capacitação profissional ou educação continuada.',
    practicalExample: 'Um usuário deseja aprender Blockchain. A IA cria um plano progressivo iniciando pelos conceitos básicos até aplicações avançadas.',
    expectedBenefits: [
      'Aprendizagem acelerada.',
      'Organização didática.',
      'Maior retenção do conhecimento.',
      'Personalização do conteúdo.',
      'Apoio ao desenvolvimento profissional.'
    ],
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Facilitar o aprendizado estruturado de assuntos desconhecidos.',
    fullDescription: 'Facilitar o aprendizado estruturado de assuntos desconhecidos por meio de explicações progressivas e exemplos.',
    cases: ['Letramento digital acelerado', 'Capacitação ágil de novos colaboradores', 'Autodesenvolvimento profissional contínuo']
  },
  {
    id: '9',
    category: 'Pesquisa',
    title: 'Curadoria de Conteúdo',
    objective: 'Selecionar, organizar e filtrar informações relevantes entre grandes volumes de conteúdo.',
    applicationContext: 'Muito útil para revisão bibliográfica, pesquisas acadêmicas e análise documental.',
    practicalExample: 'A IA recebe centenas de artigos científicos e identifica apenas aqueles realmente relevantes para um tema específico.',
    expectedBenefits: [
      'Redução do excesso de informação.',
      'Identificação de conteúdos relevantes.',
      'Organização temática.',
      'Economia de tempo.',
      'Melhor qualidade das análises.'
    ],
    icon: 'FileSearch',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Selecionar, organizar e filtrar informações relevantes.',
    fullDescription: 'Selecionar, organizar e filtrar informações relevantes entre grandes volumes de conteúdo.',
    cases: ['Análise documental investigativa', 'Triagem de cláusulas de LGPD', 'Mapeamento de conformidade de TI']
  },

  // 4. APOIO À DECISÃO
  {
    id: '10',
    category: 'Apoio à Decisão',
    title: 'Analisar Cenários',
    objective: 'Avaliar diferentes possibilidades futuras considerando riscos, oportunidades e impactos.',
    applicationContext: 'Aplicável em planejamento estratégico, gestão de projetos e tomada de decisão executiva.',
    practicalExample: 'Antes de lançar um produto, a IA apresenta cenários otimista, provável e pessimista considerando diferentes variáveis de mercado.',
    expectedBenefits: [
      'Antecipação de riscos.',
      'Melhor planejamento.',
      'Simulação de alternativas.',
      'Apoio estratégico.',
      'Maior segurança na decisão.'
    ],
    icon: 'Brain',
    image: 'https://images.unsplash.com/photo-1543286386-7a39e2d90bcc?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Avaliar diferentes possibilidades futuras considerando riscos.',
    fullDescription: 'Avaliar diferentes possibilidades futuras considerando riscos, oportunidades e impactos.',
    cases: ['Mapeamento estratégico executivo', 'Contenção de despesas operacionais', 'Otimização de rotas logísticas']
  },
  {
    id: '11',
    category: 'Apoio à Decisão',
    title: 'Gerar Alternativas',
    objective: 'Criar soluções alternativas para um problema quando a abordagem tradicional não é suficiente.',
    applicationContext: 'Muito utilizada em inovação, resolução de problemas complexos e brainstorming.',
    practicalExample: 'Um time não consegue reduzir custos. A IA propõe cinco estratégias diferentes de otimização operacional que não haviam sido consideradas.',
    expectedBenefits: [
      'Estímulo à criatividade.',
      'Ampliação de possibilidades.',
      'Apoio à inovação.',
      'Diversificação de soluções.',
      'Melhor qualidade das decisões.'
    ],
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Criar soluções alternativas para um problema quando tradicional falha.',
    fullDescription: 'Criar soluções alternativas para um problema quando a abordagem tradicional não é suficiente.',
    cases: ['Atração comercial disruptiva', 'Inovação de produtos piloto', 'Otimização de fluxos de RH']
  },

  // 5. SEGURANÇA
  {
    id: '12',
    category: 'Segurança',
    title: 'Uso Seguro da IA',
    objective: 'Orientar o uso responsável da Inteligência Artificial evitando exposição de dados sensíveis e riscos de segurança ou conformidade.',
    applicationContext: 'Fundamental em ambientes corporativos, órgãos públicos e setores regulados.',
    practicalExample: 'Antes de enviar um contrato para análise da IA, o sistema alerta sobre informações confidenciais e sugere a anonimização dos dados sensíveis.',
    expectedBenefits: [
      'Proteção de dados.',
      'Conformidade com a LGPD.',
      'Redução de riscos jurídicos.',
      'Governança da IA.',
      'Uso ético da tecnologia.'
    ],
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    
    // Legacy maps
    shortDescription: 'Orientar o uso responsável da Inteligência Artificial.',
    fullDescription: 'Orientar o uso responsável da Inteligência Artificial evitando exposição de dados sensíveis e riscos de segurança ou conformidade.',
    cases: ['Mapeamento de vazamento de dados', 'Conformidade legal com a LGPD', 'Barreiras éticas corporativas']
  }
];
