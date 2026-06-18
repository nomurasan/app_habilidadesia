import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Acesso Democrático ao Conhecimento',
    context: 'A empresa está crescendo rapidamente e novos colaboradores são contratados todos os meses. O RH recebe diariamente inúmeras dúvidas sobre férias, benefícios, políticas internas, processos de onboarding e utilização dos sistemas corporativos. Grande parte dessas perguntas já possui resposta documentada, porém a equipe continua dedicando muitas horas para atendimentos repetitivos, reduzindo sua disponibilidade para atividades estratégicas.',
    reflection: 'Como utilizar Inteligência Artificial para facilitar o acesso ao conhecimento organizacional, reduzir retrabalho e melhorar a experiência dos colaboradores, garantindo qualidade, atualização e segurança das informações?',
    challenge: 'Proponha uma estratégia utilizando Inteligência Artificial para reduzir o volume de atendimentos repetitivos realizados pelo RH e tornar o conhecimento corporativo mais acessível.',
    expectedResult: 'Construção de uma solução baseada em conhecimento institucional, reduzindo atendimentos repetitivos, melhorando a experiência dos colaboradores e preservando governança e segurança da informação.',
    maturityDescription: 'Avalia a capacidade de utilizar IA para gestão do conhecimento, promovendo ganho de produtividade, democratização da informação e escalabilidade da solução.',
    recommendedSkillIds: [5, 9, 12],
    hiddenReferenceSolution: 'Implementar uma base de conhecimento estruturada, alimentada por documentos oficiais, com curadoria contínua, mecanismos de atualização, respostas padronizadas e proteção contra exposição de informações sensíveis.',
    // Backward compatibility UI fields
    subtitle: 'Acesso Democrático ao Conhecimento',
    items: ['políticas de férias', 'benefícios corporativos', 'acesso a sistemas', 'regras de onboarding', 'ferramentas internas'],
    expectedResults: [
      'Construção de uma solução baseada em conhecimento institucional, reduzindo atendimentos repetitivos',
      'Melhorar a experiência dos colaboradores preservando governança e segurança da informação'
    ],
    recommendedPowerIds: ['5', '9', '12'],
    advisorHint: 'O segredo em assistentes de RH é estruturar limites rígidos de governança. Associe Criar Comunicados (5), Curadoria de Conteúdo (9) e o Uso Seguro da IA (12).'
  },
  {
    id: 2,
    title: 'Leitura Inteligente de Relatórios Executivos',
    context: 'Você é gestor e recebeu diversos documentos para análise: relatórios financeiros, auditorias, atas de reunião e estudos técnicos. A diretoria precisa tomar decisões em poucas horas e o tempo disponível é insuficiente para leitura integral de todos os materiais.',
    reflection: 'Como utilizar IA para acelerar a compreensão de grandes volumes de informação preservando contexto, qualidade e confiabilidade?',
    challenge: 'Explique como a Inteligência Artificial pode apoiar a análise desses documentos e contribuir para uma tomada de decisão mais rápida e segura.',
    expectedResult: 'Produção de resumos executivos confiáveis, destacando indicadores-chave, riscos, oportunidades e recomendações para apoio à decisão.',
    maturityDescription: 'Mede a capacidade de transformar informação em conhecimento útil para tomada de decisão utilizando IA de forma crítica e responsável.',
    recommendedSkillIds: [6, 7, 9],
    hiddenReferenceSolution: 'Utilizar IA para resumir documentos, identificar indicadores relevantes, validar informações críticas e complementar análises utilizando fontes confiáveis.',
    // Backward compatibility UI fields
    subtitle: 'Leitura Inteligente de Relatórios Executivos',
    items: ['relatórios financeiros', 'auditorias de processos', 'atas de conselho', 'estudos técnicos e manuais'],
    expectedResults: [
      'Produção de resumos executivos confiáveis por IA',
      'Processo de checagem humana e complementaridade com fontes adicionais de pesquisa'
    ],
    recommendedPowerIds: ['6', '7', '9'],
    advisorHint: 'Gestores exigem máxima síntese com confiabilidade. Associe Resumir Conteúdos (6), Pesquisa Profunda (7) e Curadoria de Conteúdo (9) para garantir a veracidade absoluta dos resumos.'
  },
  {
    id: 3,
    title: 'Inovação para Resolver Problemas',
    context: 'Sua organização deseja reduzir em 30% o tempo necessário para executar um processo importante, porém ainda não encontrou uma solução satisfatória. A liderança incentiva o uso da Inteligência Artificial para apoiar a geração de novas ideias.',
    reflection: 'Como utilizar IA para ampliar a criatividade da equipe e apoiar processos estruturados de inovação?',
    challenge: 'Descreva uma estratégia para utilizar Inteligência Artificial na pesquisa de alternativas e geração de soluções inovadoras para o problema apresentado.',
    expectedResult: 'Desenvolvimento de um processo estruturado de inovação utilizando IA para pesquisa, benchmarking e geração de alternativas.',
    maturityDescription: 'Avalia pensamento criativo, capacidade de inovação e utilização estratégica da IA.',
    recommendedSkillIds: [7, 10, 11],
    hiddenReferenceSolution: 'Pesquisa de tendências, benchmarking, construção de cenários futuros e geração estruturada de alternativas.',
    // Backward compatibility UI fields
    subtitle: 'Inovação para Resolver Problemas',
    items: ['pesquisa de tendências', 'benchmarking do mercado', 'construção de cenários', 'geração estruturada de alternativas'],
    expectedResults: [
      'Desenvolvimento de um processo estruturado de inovação utilizando IA',
      'Mapeamento de benchmarks de mercado e geração sistemática de ideias viáveis'
    ],
    recommendedPowerIds: ['7', '10', '11'],
    advisorHint: 'A inovação requer mapeamento e imaginação. Empregue Pesquisa Profunda (7) e Analisar Cenários (10) aliadas ao poder de Gerar Alternativas (11).'
  },
  {
    id: 4,
    title: 'Pesquisa Estratégica para Expansão',
    context: 'Para planejar a expansão da empresa para novos mercados ou produtos, é crucial coletar e analisar um grande volume de dados externos. É necessário identificar concorrentes, tendências tecnológicas e mudanças de comportamento dos consumidores de forma ágil e confiável.',
    reflection: 'De que forma a IA pode apoiar a busca e validação de informações mercadológicas estratégicas para orientar novos rumos corporativos?',
    challenge: 'Elabore um plano estratégico de pesquisa concorrencial e mercadológica potencializado por inteligência analítica, definindo como evitar relatórios superficiais ou desatualizados.',
    expectedResult: 'Mapeamento de concorrência e tendências mercadológicas amparado em fontes confiáveis e análise integrada de dados setoriais.',
    maturityDescription: 'Capacidade de fundamentar tomadas de decisão mercadológicas de alto impacto através de inteligência de dados cruciais de mercado.',
    recommendedSkillIds: [7, 9, 10],
    hiddenReferenceSolution: 'Solução baseada em múltiplas fontes, curadoria e análise comparativa de cenários.',
    // Backward compatibility UI fields
    subtitle: 'Pesquisa Estratégica para Expansão',
    items: ['identificação de concorrentes', 'mapeamento de tendências de consumo', 'análise setorial de mercado', 'estruturação de relatórios'],
    expectedResults: [
      'Mapeamento de concorrência e tendências mercadológicas amparado em fontes de dados',
      'Utilização de análises comparativas e cenários geradas de forma crítica'
    ],
    recommendedPowerIds: ['7', '9', '10'],
    advisorHint: 'Cruze dados externos de fontes variadas. Associe Pesquisa Profunda (7) com Curadoria de Conteúdo (9) e trace estratégias fortes analisando cenários (10).'
  },
  {
    id: 5,
    title: 'Atendimento Inteligente ao Cliente',
    context: 'A empresa busca aprimorar a comunicação de suporte ao cliente final, respondendo dúvidas com agilidade, empatia e alinhamento institucional, garantindo que respostas a questões sensíveis não contenham mentiras ou violem a privacidade.',
    reflection: 'Como equilibrar automação ágil no atendimento com segurança da informação, empatia humana e tom de voz unificado?',
    challenge: 'Desenhe uma proposta de assistência de atendimento automatizada ou semi-assistida por IA que otimize os tempos de resposta mantendo conformidade com as regras da LGPD.',
    expectedResult: 'Fluxo de atendimento com respostas ágeis, templates baseados em diretrizes e barreiras éticas contra o vazamento de dados privados.',
    maturityDescription: 'Competência de gerenciar interações escaláveis com foco na excelência da experiência do usuário, governança e conformidade.',
    recommendedSkillIds: [4, 5, 12],
    hiddenReferenceSolution: 'Solução baseada em assistentes inteligentes, respostas padronizadas e revisão humana.',
    // Backward compatibility UI fields
    subtitle: 'Atendimento Inteligente ao Cliente',
    items: ['agilidade de resposta', 'empatia corporativa', 'cumprimento das regras LGPD', 'tom de voz unificado'],
    expectedResults: [
      'Fluxo de atendimento integrado com respostas ágeis e seguras',
      'Estruturação de templates baseados em diretrizes sob rígida conformidade regulatória'
    ],
    recommendedPowerIds: ['4', '5', '12'],
    advisorHint: 'O atendimento precisa focar em clareza linguística e proteção de dados. Empregue Elaborar E-mails (4) e Criar Comunicados (5) amparados pelo Uso Seguro da IA (12).'
  },
  {
    id: 6,
    title: 'Identificando Oportunidades de Automação',
    context: 'Diversas equipes administrativas na organização dedicam horas de trabalho manual para tarefas burocráticas repetitivas de digitação, reconciliação financeira e envio de lembretes, gerando lentidão de processos.',
    reflection: 'De qual maneira podemos analisar as tarefas diárias, priorizar o que realmente trará mais retorno de eficiência e programar automações de processos?',
    challenge: 'Mapeie um gargalo improdutivo no cotidiano e detalhe uma solução automatizada prioritária para aumentar o fôlego operacional do departamento.',
    expectedResult: 'Cronograma funcional e estruturado de automatização de processos repetitivos, com priorização explícita e impacto previsto.',
    maturityDescription: 'Aptidão em engenharia de processos operacionais de alta eficiência, focando em otimização de tempo e recursos com tecnologias inteligentes de automação.',
    recommendedSkillIds: [2, 3, 11],
    hiddenReferenceSolution: 'Solução baseada em identificação de gargalos, priorização e roadmap incremental.',
    // Backward compatibility UI fields
    subtitle: 'Identificando Oportunidades de Automação',
    items: ['mapeamento de gargalos processuais', 'análise financeira e operacional', 'priorização de fluxos manuais', 'robotização de tarefas'],
    expectedResults: [
      'Cronograma estruturado de automatização de processos repetitivos',
      'Definição clara de roadmaps incrementais para implantação sem ruídos na TI'
    ],
    recommendedPowerIds: ['2', '3', '11'],
    advisorHint: 'Antes de automatizar, planeje e priorize o que trará mais valor. Combine Planejar Semana (2), Priorizar Atividades (3) e Gerar Alternativas (11).'
  },
  {
    id: 7,
    title: 'Assistente Inteligente para Apoio ao Trabalho',
    context: 'Os colaboradores precisam de um copiloto inteligente no dia a dia para auxiliar na redação de relatórios, síntese de reuniões, geração de rascunhos rápidos de propostas comerciais e outras análises cotidianas em ambiente corporativo seguro.',
    reflection: 'Como disponibilizar uma ferramenta de assistência de IA generativa de forma ampla sem expor segredos industriais ou incentivar o uso acrítico de alucinações?',
    challenge: 'Proponha diretrizes de uso e configuração de um assistente virtual corporativo seguro para otimizar o trabalho escritural sem expor dados internos sigilosos.',
    expectedResult: 'Diretrizes de adoção segura de copiloto de produtividade com controle de qualidade e integridade do conhecimento corporativo.',
    maturityDescription: 'Capacidade de liderar a adoção de assistentes cognitivos cotidianos focando em aumento de escala operacional, eficiência individual e ética organizacional.',
    recommendedSkillIds: [6, 9, 11, 12],
    hiddenReferenceSolution: 'Solução baseada em assistente conectado a fontes confiáveis, curadoria, proteção de dados e revisão humana.',
    // Backward compatibility UI fields
    subtitle: 'Assistente Inteligente para Apoio ao Trabalho',
    items:['redação de propostas rápidas', 'síntese de e-mails e atas de reunião', 'proteção contra vazamento de propriedade intelectual', 'refinamento analítico'],
    expectedResults: [
      'Políticas de uso e configuração de assistentes em ambientes homologados de TI',
      'Processo para curar as fontes de conhecimento interno, blindando a privacidade da marca'
    ],
    recommendedPowerIds: ['6', '9', '11', '12'],
    advisorHint: 'O suporte de produtividade do colaborador exige curadoria e proteção cibernética. Associe Resumir Conteúdos (6), Curadoria de Conteúdo (9), Gerar Alternativas (11) e Uso Seguro da IA (12).'
  },
  {
    id: 8,
    title: 'Uso Responsável da Inteligência Artificial',
    context: 'Com a rápida proliferação de soluções generativas na internet, a diretoria exige a estruturação urgente de políticas formais de conformidade jurídica para evitar vazamento de dados de clientes, violação de direitos autorais ou discriminação por algoritmos.',
    reflection: 'Quais salvaguardas regulatórias e princípios de governança devem ser estabelecidos para apoiar a inovação contínua de forma ética e segura?',
    challenge: 'Elabore as diretrizes essenciais para uma Cartilha de Uso Seguro da IA na empresa, determinando papéis de fiscalização e proteção da privacidade.',
    expectedResult: 'Política institucional estabelecida de inovação segura, contendo diretrizes claras de conformidade com a LGPD e barreiras éticas sistêmicas.',
    maturityDescription: 'Nível elevado de maturidade estratégica e ética na orquestração corporativa de modelos de IA, preservando direitos civis, responsabilidade social e reputação da marca.',
    recommendedSkillIds: [9, 10, 11, 12],
    hiddenReferenceSolution: 'Solução baseada em política institucional contemplando LGPD, governança, classificação das informações, treinamento, gestão de riscos e monitoramento contínuo.',
    // Backward compatibility UI fields
    subtitle: 'Uso Responsável da Inteligência Artificial',
    items: ['políticas institucionais de conformidade jurídica', 'salvaguardas da LGPD', 'vazamento de dados privados de colaboradores', 'auditorias sistemáticas de discriminação de algoritmos'],
    expectedResults: [
      'Política corporativa oficial de governança estabelecida contra riscos cibernéticos',
      'Treinamentos contínuos de privacidade de rede e triagem de riscos antes de publicações'
    ],
    recommendedPowerIds: ['9', '10', '11', '12'],
    advisorHint: 'Governança robusta protege o futuro digital da corporação. Tralhe Curadoria de Conteúdo (9), Analise Cenários (10), visualize e Gere Alternativas (11) sob o imperativo de Uso Seguro da IA (12).'
  }
];
