import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Acesso Democrático ao Conhecimento',
    context: 'A organização está crescendo rapidamente e novas contratações ocorrem semanalmente. O RH recebe diariamente centenas de dúvidas repetitivas relacionadas a férias, benefícios, acesso aos sistemas internos, políticas corporativas, ferramentas utilizadas pela empresa e regras de onboarding. O tempo gasto nessas respostas reduz a capacidade do RH de atuar estrategicamente.',
    reflection: 'Como utilizar Inteligência Artificial para democratizar o acesso ao conhecimento corporativo, garantindo respostas corretas, atualizadas, consistentes e seguras, sem comprometer a privacidade dos dados ou gerar informações incorretas?',
    challenge: 'Proponha uma solução utilizando Inteligência Artificial para reduzir o volume de atendimentos repetitivos do RH, melhorar a experiência do colaborador e garantir respostas corretas e seguras.',
    expectedResult: 'Estruturar uma solução baseada em conhecimento institucional, reduzindo atendimentos repetitivos, melhorando a experiência dos colaboradores e preservando governança e segurança da informação.',
    maturityDescription: 'Avalia a capacidade de utilizar IA para gestão do conhecimento organizacional, demonstrando visão sistêmica, preocupação com governança, segurança, atualização contínua e escalabilidade da solução.',
    recommendedSkillIds: [5, 9, 12],
    hiddenReferenceSolution: 'Utilizar arquitetura RAG baseada em documentos oficiais, curadoria permanente das fontes, mecanismos de proteção contra vazamento de dados, revisão humana para situações críticas, versionamento das bases e atualização contínua.',
    // Backward compatibility UI fields
    subtitle: 'Acesso Democrático ao Conhecimento',
    items: ['políticas de férias', 'benefícios corporativos', 'acesso a sistemas', 'regras de onboarding', 'ferramentas internas'],
    expectedResults: [
      'Estruturar uma solução baseada em conhecimento institucional, reduzindo atendimentos repetitivos',
      'Melhorar a experiência dos colaboradores preservando governança e segurança da informação'
    ],
    recommendedPowerIds: ['5', '9', '12'],
    advisorHint: 'O segredo em assistentes de RH é estruturar limites rígidos de governança. Associe Criar Comunicados (5), Curadoria de Conteúdo (9) e o Uso Seguro da IA (12).'
  },
  {
    id: 2,
    title: 'Sintetizadores de Relatórios Densos',
    context: 'Os líderes de projetos e gestores da corporação sofrem com a sobrecarga informacional que atrasa a tomada de decisão no dia a dia. Eles precisam digerir com rapidez: atas longas de reuniões de conselho, resoluções de órgãos federais regulatórios, e-mails extensos de parceiros de tecnologia e manuais técnicos complexos de softwares legados.',
    reflection: 'Como utilizar o letramento digital de modo a sumariar dados sem perder cláusulas contratuais vitais e garantindo a veracidade do resumo?',
    challenge: 'Desenvolva uma abordagem estruturada usando Inteligência Artificial para condensar relatórios longos e complexos em resumos executivos altamente confiáveis, garantindo que termos contratuais e técnicos críticos não sejam ignorados ou alterados.',
    expectedResult: 'Uma solução para processar múltiplos documentos volumosos, gerando resumos estruturados e acionáveis, acompanhados de um processo claro de checagem humana e rastreabilidade para mitigar alucinações.',
    maturityDescription: 'Mapeia a competência do profissional em filtrar ruídos, sintetizar conhecimento complexo e liderar com ceticismo técnico na validação de dados críticos para tomadas de decisão rápidas e eficazes.',
    recommendedSkillIds: [6, 9],
    hiddenReferenceSolution: 'Utilização de prompts ricos com técnicas de Few-Shot e Engenharia de Contexto, carregamento de documentos em buffers protegidos, identificação de termos contratuais críticos por marcação de texto, uso de ferramentas de extração direta sem reescrever dados sensíveis e auditoria de conformidade com duplo crivo humano.',
    // Backward compatibility UI fields
    subtitle: 'Sintetizadores de Relatórios Densos',
    items: ['atas longas de reuniões de conselho', 'resoluções de órgãos federais regulatórios', 'e-mails extensos de parceiros de tecnologia', 'manuais técnicos de softwares legados'],
    expectedResults: [
      'Proposta de condensação de relatórios densos em resumos executivos confiáveis por IA',
      'Processo de checagem humana e rastreabilidade para mitigar alucinações nas análises'
    ],
    recommendedPowerIds: ['6', '9'],
    advisorHint: 'Gestores exigem máxima síntese com confiabilidade. Associe Resumir Conteúdos (6) e Curadoria de Conteúdo (9) para garantir a veracidade absoluta dos resumos.'
  },
  {
    id: 3,
    title: 'Prototipagem Criativa Acelerada',
    context: 'A equipe de inovação necessita testar e validar rapidamente junto aos diretores um novo layout conceitual de embalagem de produto e banners de divulgação mercadológica. O tempo é crítico e a contratação de profissionais especializados de criação de massa atrasaria o pitch: imagens fotorrealistas de produtos piloto, rascunhos preliminares de banners virtuais, slogans empáticos alinhados à marca e storyboards rápidos para vídeos explicativos.',
    reflection: 'De que maneira ferramentas generativas multimodais podem acelerar a experimentação e como equilibrar a velocidade rápida da máquina com o crivo estético e a verdade humana das entregas?',
    challenge: 'Proponha um pipeline de experimentação rápida multimodal que combine geração de imagens conceituais, slogans e storyboards, mantendo a autenticidade da marca e a qualidade estética sob estrita supervisão criativa.',
    expectedResult: 'Fluxo ágil de design e validação criativa de embalagens e criativos publicitários integrando IA generativa e refinamento humano, acelerando o tempo de lançamento em múltiplos cenários piloto.',
    maturityDescription: 'Capacidade de orquestrar criatividade impulsionada por IA de forma ágil, integrando geração multimodal, consistência estética e inteligência de branding.',
    recommendedSkillIds: [11],
    hiddenReferenceSolution: 'Desenho de fluxos experimentais com ferramentas multimodais integradas, aplicação de prompts guiados por diretrizes da marca (brand guidelines), curadoria contínua das saídas geradas e supervisão direta feita por designers sêniores para certificar o tom artístico, impedindo o plágio involuntário e desalinhamento conceitual.',
    // Backward compatibility UI fields
    subtitle: 'Prototipagem Criativa Acelerada',
    items: ['imagens fotorrealistas de produtos piloto', 'rascunhos preliminares de banners virtuais', 'slogans empáticos alinhados à marca', 'storyboards rápidos para vídeos explicativos'],
    expectedResults: [
      'Pipeline de experimentação ágil multimodal integrando texto, imagens e storyboards',
      'Fluxo de validação de entregas estéticas aliando o crivo criativo do especialista humano à IA'
    ],
    recommendedPowerIds: ['11'],
    advisorHint: 'Aqui, a IA atua como um amplificador de ideias rápidas. Explore a força de Gerar Alternativas (11) para destravar múltiplos conceitos e embalagens.'
  },
  {
    id: 4,
    title: 'Radar de Inteligência e Validação Mercadológica',
    context: 'A diretoria corporativa precisa subsidiar decisões estratégicas urgentes sobre novos competidores e desrupturas digitais. Entretanto, o excesso de informações dispersas, postagens superficiais na internet e dados potencialmente parciais criam insegurança técnica baseada em opiniões mercadológicas conflitantes e pesquisas estáticas antigas.',
    reflection: 'Como o profissional pode agir de forma investigativa e cética, usando robôs de pesquisa sabendo cruzar premissas sem aceitar passivamente o output estatístico gerado pela máquina?',
    challenge: 'Desenhar um hub analítico investigativo de mercado sustentado por ferramentas de pesquisa que localizam, validam e cruzam dados públicos, rebatendo boatos e reportando com exatidão científica as tendências.',
    expectedResult: 'Instaurar rotinas de monitoramento concorrencial inteligente e fidedigno, apresentando fontes claras pesquisadas pelo robô e avaliadas sob rigoroso ceticismo metodológico.',
    maturityDescription: 'Reflete competência em conduzir inteligência competitiva com profundidade, utilizando inteligência de pesquisa com total ceticismo de dados e rigor científico.',
    recommendedSkillIds: [7, 9, 10],
    hiddenReferenceSolution: 'Varredura ativa na web usando motores de busca qualificados, cruzamento de dados de múltiplos relatórios setoriais, uso constante de instrução para citar links e referências diretas, auditoria sistemática contra notícias falsas e modismos mercadológicos, e validação executiva.',
    // Backward compatibility UI fields
    subtitle: 'Radar de Inteligência e Validação Mercadológica',
    items: ['opiniões mercadológicas conflitantes', 'pesquisas estáticas de consultorias antigas', 'risco de notícias falsas e modismos na área de inovação'],
    expectedResults: [
      'Hub analítico de investigação para rastrear novos entrantes e modelos concorrentes',
      'Uso de táticas de inteligência para obrigar a IA a relatar e referenciar as fontes reais'
    ],
    recommendedPowerIds: ['7', '9', '10'],
    advisorHint: 'Ceticismo é fundamental ante relatórios de inteligência. Empregue Pesquisa Profunda (7) e Curadoria de Conteúdo (9) sob a ótica de Analisar Cenários (10).'
  },
  {
    id: 5,
    title: 'Atendimento Integrado Inteligente',
    context: 'A empresa necessita modernizar seus canais para responder com rapidez e precisão a dados individuais dos cooperados, porém enfrenta lentidão pelo isolamento de sistemas internos que forçam os analistas a realizar buscas lentas de faturamento manualmente (prazos de entrega de mercadorias, pontuação atual em planos de benefícios, atualização cadastral de novos fornecedores).',
    reflection: 'Quais competências e cuidados operacionais são exigidos de modo a desenhar um diálogo inteligente que de fato ajude sem frustrar o cliente e mantendo a curadoria humana sob as regras da LGPD?',
    challenge: 'Proponha a arquitetura de um canal de atendimento inteligente integrado a bancos de dados legados corporativos para responder a perguntas rotineiras de faturamento e entregas de forma segura e imediata.',
    expectedResult: 'Uma proposta de autoatendimento fluida e conectada (API/Database), contendo diretrizes rígidas de transição transparente para atendimento humano e mecanismos para preservar sigilo estrito de dados.',
    maturityDescription: 'Avalia o preparo do grupo para projetar interações ricas e conversas integradas com sistemas corporativos, equilibrando agilidade automatizada e controle humano sob conformidade regulatória.',
    recommendedSkillIds: [9, 12],
    hiddenReferenceSolution: 'Mecanismo de orquestração conversacional integrado via APIs seguras com bancos de dados internos criptografados, filtragem de dados pessoais (PII) antes de qualquer interação externa com a IA, definição de regras rígidas para encaminhamento para atendentes humanos no caso de reclamações ou dúvidas complexas, e auditoria de satisfação.',
    // Backward compatibility UI fields
    subtitle: 'Atendimento Integrado Inteligente',
    items: ['prazos de entrega de mercadorias', 'pontuação atual em planos de benefícios', 'atualização cadastral de novos fornecedores'],
    expectedResults: [
      'Proposta de robô transacional conectado via API com bancos corporativos',
      'Protocolos rígidos de segurança sob leis da LGPD e rota direta de escape humano'
    ],
    recommendedPowerIds: ['9', '12'],
    advisorHint: 'Atendimento transacional exige precisão cirúrgica de segurança. Empregue Curadoria de Conteúdo (9) das fontes de dados associada ao Uso Seguro da IA (12).'
  },
  {
    id: 6,
    title: 'Arquitetura de Fluxos de Trabalho Automatizados',
    context: 'O faturamento mensal e o time financeiro desperdiçam dezenas de horas úteis coletando dados de extratos bancários, estruturando e formatando relatórios manuais de despesas em planilhas e encaminhando notificações esparsas por e-mail: digitação manual de extratos, formatação de dados comerciais, envio de cobranças de cortesia por e-mail e solicitações físicas de assinaturas de reembolsos.',
    reflection: 'Como decompor esse problema corporativo histórico em fases sequenciais claras e robotizar essas pontes digitais sem demandar meses de desenvolvimento de softwares complexos de TI?',
    challenge: 'Desenhe um plano de automação de ponta a ponta dos fluxos de contabilidade e reembolso de despesas corporativas, eliminando tarefas manuais repetitivas e acelerando o tempo de conciliação.',
    expectedResult: 'Desenho lógico e operacional do novo fluxo automatizado de coleta e faturamento, integrando extração inteligente de recibos por IA, ferramentas de automatização sem código (No-Code/Low-Code) e auditorias de exceção.',
    maturityDescription: 'Proficiência em engenharia de processos, decomposição de gargalos administrativos e uso tático de inteligência de automação para acelerar a eficiência sem demandar desenvolvimento complexo.',
    recommendedSkillIds: [3, 10],
    hiddenReferenceSolution: 'Implementação de pipeline automatizado usando ferramentas de integração no-code (ex. Make, Zapier), extração de dados estruturados de recibos e notas fiscais por OCR/IA, padronização em planilhas/bancos de dados centralizados, envio automático de alertas de e-mail parametrizados e manutenção de um fluxo humano de aprovação de pagamentos.',
    // Backward compatibility UI fields
    subtitle: 'Arquitetura de Fluxos de Trabalho Automatizados',
    items: ['digitação manual de extratos', 'formatação de dados comerciais', 'envio de cobranças de cortesia por e-mail', 'solicitações físicas de assinaturas de reembolsos'],
    expectedResults: [
      'Decomposição e mapeamento analítico do fluxo manual do faturamento empresarial',
      'Arquitetura automatizada usando robotização no-code e supervisão do assistente'
    ],
    recommendedPowerIds: ['3', '10'],
    advisorHint: 'Automatizar é conectar pontes lógicas. Use o poder de Priorizar Atividades (3) no fôlego de processamento e projete os impactos através de Analisar Cenários (10).'
  },
  {
    id: 7,
    title: 'Orquestração de Agentes Corporativos Autônomos',
    context: 'Durante eventos corporativos globais, a liderança ouve sobre sistemas autônomos que conversam entre si, pesquisam preços, agendam reuniões e tomam passos operacionais completos sem interferência de usuários: agentes inteligentes autônomos, redes cooperativas de robôs de dados e trabalhador virtual executando tarefas complexas por fases.',
    reflection: 'Como o letramento corporativo foca na supervisão destes robôs agregados? Quais barreiras morais, técnicas e operacionais devem existir para governar sistemas autônomos mantendo o Humano-na-Alça?',
    challenge: 'Projete um ecossistema cooperativo de multiagentes autônomos para gerir rotinas de compras ou captação comercial, estruturando limites de poder, escopo de ação e o fluxo de aprovação obrigatório de humanos.',
    expectedResult: 'Um plano operacional consistente para agentes autônomos com limites rígidos de alocação de verbas, relatórios automáticos de auditoria e gatilhos explícitos de intervenção e decisão humana soberana.',
    maturityDescription: 'Avalia a capacidade analítica e de governança do grupo para planejar sistemas corporativos autônomos de alta complexidade com rigor operacional e salvaguardas éticas.',
    recommendedSkillIds: [10, 11],
    hiddenReferenceSolution: 'Uso de frameworks de desenvolvimento de agentes (ex. Langchain, CrewAI), limite de orçamentos e transações impostos por código imutável no backend, validação humana em todas as tomadas de decisões críticas, registro detalhado de logs operacionais auditáveis e rotina diária de verificação técnica dos robôs.',
    // Backward compatibility UI fields
    subtitle: 'Orquestração de Agentes Corporativos Autônomos',
    items: ['agentes inteligentes autônomos', 'redes cooperativas de robôs de dados', 'trabalhador virtual executando tarefas complexas por fases'],
    expectedResults: [
      'Proposta conceitual detalhada para guiar redes cooperativas de robôs de dados',
      'Definição das premissas de fronteiras de ação e limites técnicos de fôlego comercial da IA'
    ],
    recommendedPowerIds: ['10', '11'],
    advisorHint: 'Agentes autônomos trazem alta capacidade, mas exigem rígido controle ético. Equilibre Analisar Cenários (10) e Gerar Alternativas (11).'
  },
  {
    id: 8,
    title: 'Mestrado Corporativo em Governança, Ética e Privacidade',
    context: 'A pressa e o deslumbramento de colaboradores juniores em usar canais externos públicos de IA acenderam o alerta vermelho no conselho corporativo devido a flagrantes riscos de segurança: vazamento de dados proprietários de balanços por cópias de textos, inserção perigosa de CPFs e telefones de clientes no chat, e utilização irracional de respostas estatísticas e vieses de inclusão em decisões de vagas.',
    reflection: 'Quais diretrizes imperativas devem guiar o letramento digital em IA para blindar a corporação, respeitar a privacidade coletiva e zelar pelo compliance regulatório e LGPD?',
    challenge: 'Esboce um comitê e uma política de governança de Inteligência Artificial para a empresa, determinando salvaguardas contra vazamento de propriedade intelectual, proteção contra alucinações e exclusão de vieses preconceituosos de tomada de decisão.',
    expectedResult: 'Instalação de uma cartilha corporativa integrada de boas práticas em IA, ferramentas recomendadas com segurança homologada de TI, além de canal transparente de denúncia e auditoria contínua de modelos.',
    maturityDescription: 'Mapeia a compreensão madura e senil de governança cibernética, responsabilidade social, LGPD e limites éticos indispensáveis na orquestração corporativa de modelos inteligentes.',
    recommendedSkillIds: [12],
    hiddenReferenceSolution: 'Instituição de comitê multidisciplinar de ética e IA, estabelecimento de sandbox corporativo homologado pela TI, filtros automatizados de segurança e anonimização de dados pré-envios, auditoria contínua de vieses em seleções e avaliação algorítmica rigorosa sobre balanços sigilosos.',
    // Backward compatibility UI fields
    subtitle: 'Mestrado Corporativo em Governança, Ética e Privacidade',
    items: ['vazamento de dados proprietários de balanços', 'inserção perigosa de CPFs e telefones no chat público', 'utilização irracional de respostas estatísticas e viés nas vagas'],
    expectedResults: [
      'Planilha e códigos práticos de anonimização e blindagem contra vazamento de dados',
      'Manual interno de conduta e regulamentos éticos para uso livre de modelos públicos'
    ],
    recommendedPowerIds: ['12'],
    advisorHint: 'Segurança e conformidade andam juntas. Use o Uso Seguro da IA (12) como a barreira imperativa e inegociável de governança ética.'
  },
  {
    id: 9,
    title: 'Arquitetos do Letramento e Inovação Empresarial',
    context: 'Como clímax desta Jornada Jedi, os participantes enfrentam o Conselho Maior. Eles devem identificar um processo real que atrasa sua área de trabalho na empresa e desenhar um plano refinado completo aliando inovação, segurança, pragmatismo e colaboração em IA: identificar e quantificar um gargalo real do departamento, selecionar as competências táticas indispensáveis, modelar o prompt robusto com Engenharia de Contexto e determinar o crivo de validação da ética e do Julgamento Humano.',
    reflection: 'De que maneira podemos usar tudo o que foi aprendido para gerar impactos de valor reais, seguros e mensuráveis para nossa equipe e clientes, sob rígiga governança empresarial?',
    challenge: 'Formule um projeto robusto de implantação de Inteligência Artificial na sua área específica de atuação na empresa, resolvendo um gargalo operacional real mapeado e cobrindo métricas, segurança e validação ética.',
    expectedResult: 'Um plano executivo profissional pronto para o Pitch diante da diretoria, combinando diagnóstico claro, arquitetura do fluxo inteligente de processos e pessoas, conformidade com a LGPD e indicadores tangíveis de sucesso.',
    maturityDescription: 'Avalia o nível máximo de prontidão estratégica (Arquiteto de Inovação), integrando habilidades práticas de resolução de problemas, visão corporativa ética, pensamento crítico e liderança transformadora.',
    recommendedSkillIds: [3, 10, 11],
    hiddenReferenceSolution: 'Mapeamento rigoroso de indicadores (KPIs) operacionais, desenho analítico de fluxograma híbrido (IA + humano), política estrita de segurança e anonimização de dados (TI/LGPD) e validação iterativa baseada na verdade e excelência humana.',
    // Backward compatibility UI fields
    subtitle: 'Arquitetos do Letramento e Inovação Empresarial',
    items: ['identificar e quantificar um gargalo real', 'selecionar as competências táticas indispensáveis', 'modelar o prompt robusto com Engenharia de Contexto', 'determinar o crivo de validação da ética e do Julgamento Humano'],
    expectedResults: [
      'Diagnóstico completo e sólido do gargalo de processo departamental selecionado',
      'Proposta executiva robusta integrando inovação ágil, conformidade de dados e KPIs'
    ],
    recommendedPowerIds: ['3', '10', '11'],
    advisorHint: 'Arquiteto Jedi, integre todas as diretrizes da Ordem. Acione Priorizar Atividades (3), Analisar Cenários (10) e Gerar Alternativas (11).'
  }
];
