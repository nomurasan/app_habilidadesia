import { Challenge } from '../types';

export const ALL_CHALLENGES: Challenge[] = [
  // ==========================================
  // PADAWAN - NÍVEL INICIAL (Questões 1 a 10)
  // Conforme diretriz: 1 Habilidade correta e exatamente 5 erradas (total 6)
  // ==========================================
  {
    id: 1,
    level: 'PADAWAN',
    title: 'Agenda Lotada',
    scenario: 'Você possui dezenas de compromissos distribuídos ao longo da semana, reuniões conflitantes e atividades pessoais que precisam ser conciliadas. Deseja utilizar IA para reorganizar automaticamente sua agenda.',
    correctSkillIds: [1],
    incorrectSkillIds: [2, 3, 4, 6, 10],
    explanation: '• Habilidade Correta: **Organizar Agenda (01)** resolve conflitos de horários imediatos de forma equilibrada.\n• Habilidades Incorretas: Planejar Semana ou Priorizar Atividades focam na estratégia semanal e no backlog de tarefas, enquanto Elaborar E-mails, Resumir Conteúdos ou Analisar Cenários não operam sobre calendários.\n• Recomendação: Utilize **Organizar Agenda** para alinhar choques de compromissos no calendário diário e recuperar blocos de foco.'
  },
  {
    id: 2,
    level: 'PADAWAN',
    title: 'Planejamento da Semana',
    scenario: 'Na segunda-feira você precisa organizar todas as entregas da equipe, definir prioridades e distribuir atividades ao longo dos próximos cinco dias úteis.',
    correctSkillIds: [2],
    incorrectSkillIds: [1, 3, 5, 10, 11],
    explanation: '• Habilidade Correta: **Planejar Semana (02)** estrutura a visão integrada dos próximos cinco dias úteis corporativos.\n• Habilidades Incorretas: Organizar Agenda atua no calendário diário de compromissos, Priorizar Atividades decide o que fazer primeiro em lote, enquanto Criar Comunicados, Analisar Cenários ou Gerar Alternativas não organizam o cronograma de Sprints.\n• Recomendação: Combine o **Planejar Semana** no início da semana para obter controle absoluto sobre a carga operacional de entregas do time.'
  },
  {
    id: 3,
    level: 'PADAWAN',
    title: 'Muitas Pendências',
    scenario: 'Existem mais de cinquenta tarefas abertas e você precisa decidir rapidamente quais devem ser executadas primeiro para maximizar os resultados do time.',
    correctSkillIds: [3],
    incorrectSkillIds: [1, 2, 6, 10, 11],
    explanation: '• Habilidade Correta: **Priorizar Atividades (03)** aplica critérios objetivos (como matriz de impacto x esforço) para selecionar o foco crítico de forma racional.\n• Habilidades Incorretas: Organizar Agenda e Planejar Semana alinham as tarefas ao calendário, enquanto Resumir Conteúdos, Analisar Cenários e Gerar Alternativas não ajudam na ordenação analítica de um backlog que já existe.\n• Recomendação: Ao se deparar com sobrecarga, utilize **Priorizar Atividades** para determinar seu foco de valor e delegue ou agende o resto.'
  },
  {
    id: 4,
    level: 'PADAWAN',
    title: 'Resposta para Cliente',
    scenario: 'Você recebeu apenas alguns tópicos e precisa enviar um e-mail profissional para um cliente comunicando uma alteração importante em um projeto.',
    correctSkillIds: [4],
    incorrectSkillIds: [5, 6, 8, 9, 12],
    explanation: '• Habilidade Correta: **Elaborar E-mails (04)** assegura regras gramaticais e estruturas táticas adequadas para comunicação um-para-um direta corporativa.\n• Habilidades Incorretas: Criar Comunicados foca no público amplo, Resumir Conteúdos sintetiza materiais longos, enquanto Estudo de Novos Temas, Curadoria ou Uso Seguro não redigem mensagens de relação interpessoal.\n• Recomendação: Utilize **Elaborar E-mails** fornecendo marcadores simples e pedindo à IA que calibre o tom com empatia e clareza.'
  },
  {
    id: 5,
    level: 'PADAWAN',
    title: 'Aviso para Toda a Empresa',
    scenario: 'O RH precisa informar uma mudança no horário de expediente para todos os colaboradores de forma clara e padronizada.',
    correctSkillIds: [5],
    incorrectSkillIds: [1, 2, 4, 6, 12],
    explanation: '• Habilidade Correta: **Criar Comunicados (05)** estrutura mensagens institucionais voltadas à padronização, clareza editorial e disseminação uniforme de alta escala.\n• Habilidades Incorretas: Organizar Agenda ou Planejar Semana são de produtividade pessoal, enquanto Elaborar E-mails é focado em interações bilaterais e Resumir sintetiza conteúdos brutos.\n• Recomendação: Use **Criar Comunicados** para garantir isenção, empatia corporativa e neutralidade ao enviar informativos gerais de cultura.'
  },
  {
    id: 6,
    level: 'PADAWAN',
    title: 'Documento Muito Grande',
    scenario: 'Você recebeu um relatório com mais de 150 páginas e precisa entender rapidamente os principais pontos antes de uma reunião executiva.',
    correctSkillIds: [6],
    incorrectSkillIds: [4, 5, 7, 9, 10],
    explanation: '• Habilidade Correta: **Resumir Conteúdos (6)** extrai e sintetiza com exatidão premissas-chave e conclusões essenciais de textos longos e burocráticos.\n• Habilidades Incorretas: Redigir e-mails ou comunicados geram novos textos ativos, Pesquisa Profunda busca novidades externas, e Curadoria seleciona fontes, mas não condensa um documento específico que já está em mãos.\n• Recomendação: Passe o arquivo à IA utilizando **Resumir Conteúdos** e peça insights focado no seu cargo, extraindo valor prático imediato.'
  },
  {
    id: 7,
    level: 'PADAWAN',
    title: 'Benchmark de Mercado',
    scenario: 'A diretoria pediu um levantamento completo sobre tendências de Inteligência Artificial utilizadas por empresas concorrentes.',
    correctSkillIds: [7],
    incorrectSkillIds: [6, 8, 9, 10, 11],
    explanation: '• Habilidade Correta: **Pesquisa Profunda (07)** realiza buscas na web, minera concorrentes locais/globais e mapeia tendências estruturadas com base empírica ativa.\n• Habilidades Incorretas: Resumir ou Estudar digerem informações dadas, Curadoria gerencia coleções e Analisar Cenários prevê impactos internos de decisões.\n• Recomendação: Adote a **Pesquisa Profunda** para trazer fontes ricas do mundo externo, fornecendo base sólida para sua tomada de decisão.'
  },
  {
    id: 8,
    level: 'PADAWAN',
    title: 'Aprender Blockchain',
    scenario: 'Você nunca estudou Blockchain e precisa compreender rapidamente seus conceitos fundamentais para participar de uma reunião técnica.',
    correctSkillIds: [8],
    incorrectSkillIds: [6, 7, 9, 10, 12],
    explanation: '• Habilidade Correta: **Estudo de Novos Temas (08)** usa a inteligência artificial como mentora didática, simplificando conceitos áridos emanalogias de fácil assimilação rápida.\n• Habilidades Incorretas: Pesquisar ou Curar trazem e filtram dados, enquanto Resumir ou Uso Seguro não estruturam trilhas pedagógicas de aprendizagem.\n• Recomendação: Formule prompts de **Estudo de Novos Temas** pedindo explicações como se você fosse um iniciante, criando analogias divertidas para quebrar a frieza técnica.'
  },
  {
    id: 9,
    level: 'PADAWAN',
    title: 'Muitos Artigos Científicos',
    scenario: 'Você encontrou centenas de artigos sobre um mesmo tema e precisa selecionar apenas aqueles realmente relevantes para sua pesquisa.',
    correctSkillIds: [9],
    incorrectSkillIds: [6, 7, 8, 10, 12],
    explanation: '• Habilidade Correta: **Curadoria de Conteúdo (09)** filtra, cataloga e audita grandes volumes documentais para reter exclusivamente o que é útil, seguro e aplicável.\n• Habilidades Incorretas: Pesquisar apenas coleta, Estudar ensina, enquanto Resumir ou Analisar Cenários trabalham após a seleção das fontes de confiança.\n• Recomendação: Execute uma **Curadoria de Conteúdo** rigorosa sobre suas fontes de dados para blindar seu relatório final contra premissas errôneas.'
  },
  {
    id: 10,
    level: 'PADAWAN',
    title: 'Escolha Estratégica',
    scenario: 'A empresa pretende lançar um novo produto e deseja comparar diferentes possibilidades antes de tomar uma decisão.',
    correctSkillIds: [10],
    incorrectSkillIds: [3, 7, 9, 11, 12],
    explanation: '• Habilidade Correta: **Analisar Cenários (10)** levanta premissas prospectivas, modelando prós, contras e ramificações estatísticas ou comerciais de hipóteses organizacionais.\n• Habilidades Incorretas: Priorizar ordena tarefas, Pesquisa e Curadoria filtram dados lidos, e Uso Seguro evita riscos diretos do uso do software generativo.\n• Recomendação: Conecte o **Analisar Cenários** a dados reais de mercado para projetar os melhores caminhos antes de fazer escolhas dispendiosas.'
  },

  // ==========================================
  // JEDI - NÍVEL INTERMEDIÁRIO (Questões 11 a 20)
  // Conforme diretriz: exatamente 2 Habilidades Corretas e 4 Erradas (total 6)
  // ==========================================
  {
    id: 11,
    level: 'JEDI',
    title: 'Organização Completa',
    scenario: 'Você precisa reorganizar sua agenda semanal, redistribuir compromissos, ajustar reuniões que estão sobrepostas e garantir que todas as entregas importantes sejam realizadas dentro do prazo.',
    correctSkillIds: [1, 2],
    incorrectSkillIds: [3, 4, 6, 10],
    explanation: '• Habilidades Corretas: **Organizar Agenda (01)** resolve as sobreposições de reuniões na hora e **Planejar Semana (02)** sintoniza a carga e escopo de entregas dos cinco dias corporativos.\n• Habilidades Incorretas: Priorizar Atividades é para tarefas gerais sem calendário direto, Elaborar E-mails é comunicação tática e Resumir Conteúdos ou Analisar Cenários não interferem na alocação de tempo.\n• Recomendação: Use **Planejar Semana** para definir as metas mestras e, logo em seguida, use **Organizar Agenda** para acomodá-las fisicamente em blocos livres do calendário.'
  },
  {
    id: 12,
    level: 'JEDI',
    title: 'Gestão do Backlog',
    scenario: 'Sua equipe possui dezenas de demandas pendentes. É necessário organizar o trabalho da semana e definir quais atividades devem ser executadas primeiro.',
    correctSkillIds: [2, 3],
    incorrectSkillIds: [1, 6, 10, 11],
    explanation: '• Habilidades Corretas: **Planejar Semana (02)** dimensiona o fôlego da equipe para o cronograma semanal e **Priorizar Atividades (03)** determina a ordem analítica correta de execução para o time.\n• Habilidades Incorretas: Organizar Agenda lida com calendários de compromissos diários, enquanto Resumir, Analisar Cenários ou Gerar Alternativas não organizam nem ordenam a fila física acumulada.\n• Recomendação: Conecte o **Priorizar Atividades** para identificar o que realmente importa e use **Planejar Semana** para acionar a execução ao longo do tempo.'
  },
  {
    id: 13,
    level: 'JEDI',
    title: 'Pesquisa Executiva',
    scenario: 'O CEO solicitou um estudo completo sobre Inteligência Artificial Generativa e deseja receber um resumo executivo baseado em fontes confiáveis.',
    correctSkillIds: [6, 7],
    incorrectSkillIds: [4, 5, 8, 10],
    explanation: '• Habilidades Corretas: **Resumir Conteúdos (06)** formata um documento limpo e focado sobre os pontos-chave e **Pesquisa Profunda (07)** rastreia a internet em busca de fontes inovadoras fidedignas de mercado.\n• Habilidades Incorretas: Criar Comunicados ou Elaborar E-mails são de divulgação ativa, Estudo de Novos Temas atua no aprendizado pessoal e Analisar Cenários projeta desdobramentos de decisões específicas.\n• Recomendação: Realize primeiro a **Pesquisa Profunda** para varrer o mercado externo e use o **Resumir Conteúdos** para sintetizar os melhores dados em um memorando direto de alto impacto.'
  },
  {
    id: 14,
    level: 'JEDI',
    title: 'Comunicado Institucional',
    scenario: 'Será necessário enviar um e-mail para gestores e publicar um comunicado oficial para todos os colaboradores sobre uma mudança organizacional.',
    correctSkillIds: [4, 5],
    incorrectSkillIds: [1, 2, 6, 12],
    explanation: '• Habilidades Corretas: **Elaborar E-mails (04)** calibra a diplomacia refinada ponto-a-ponto com gestores e **Criar Comunicados (05)** uniformiza a divulgação institucional para todas as mídias da empresa.\n• Habilidades Incorretas: Organizar Agenda e Planejar Semana alinham horários cotidianos, enquanto Resumir sintetiza conteúdos brutos e Uso Seguro da IA cuida de compliance e anonimização.\n• Recomendação: Com a IA, utilize **Elaborar E-mails** de forma próxima com os decisores-chave e **Criar Comunicados** para assegurar tom neutro e institucional nas mídias de alta escala.'
  },
  {
    id: 15,
    level: 'JEDI',
    title: 'Estudo Estruturado',
    scenario: 'Você precisa aprender rapidamente um novo assunto utilizando materiais confiáveis e selecionando apenas os conteúdos mais relevantes.',
    correctSkillIds: [8, 9],
    incorrectSkillIds: [6, 7, 10, 12],
    explanation: '• Habilidades Corretas: **Estudo de Novos Temas (08)** formula rotas didáticas e analogias pedagógicas excelentes e **Curadoria de Conteúdo (09)** audita fontes descartando ruídos e fake news.\n• Habilidades Incorretas: Resumir sintetiza dados brutos, Pesquisa Profunda apenas varre e coleta documentos da internet, enquanto Analisar Cenários projeta as ramificações de uma ação estratégica comercial.\n• Recomendação: Utilize **Curadoria de Conteúdo** para pinçar os documentos mais confiáveis e repasse-os ao **Estudo de Novos Temas** guiando seu aprendizado.'
  },
  {
    id: 16,
    level: 'JEDI',
    title: 'Decisão de Investimento',
    scenario: 'A empresa pretende investir em uma nova tecnologia e precisa comparar riscos, oportunidades e possíveis alternativas antes da decisão.',
    correctSkillIds: [10, 11],
    incorrectSkillIds: [3, 7, 9, 12],
    explanation: '• Habilidades Corretas: **Analisar Cenários (10)** projeta desfechos hipotéticos e matrizes de impacto e **Gerar Alternativas (11)** abre o escopo de decisão trazendo novas oportunidades e escapes operacionais.\n• Habilidades Incorretas: Priorizar Atividades organiza backlogs internos, Pesquisa Profunda coleta dados na web, enquanto Curadoria audita e Uso Seguro lida com sigilo informacional da IA.\n• Recomendação: Utilize **Gerar Alternativas** para desviar de monopólios corporativos tecnológicos e avalie todos em **Analisar Cenários** mapeando as opções de maior retorno.'
  },
  {
    id: 17,
    level: 'JEDI',
    title: 'Segurança na Pesquisa',
    scenario: 'Antes de enviar documentos internos para uma IA, você precisa identificar informações sensíveis e verificar se as fontes utilizadas são confiáveis.',
    correctSkillIds: [9, 12],
    incorrectSkillIds: [4, 6, 7, 10],
    explanation: '• Habilidades Corretas: **Curadoria de Conteúdo (09)** escaneia as fontes de sustentação analisando confiabilidade e **Uso Seguro da IA (12)** anonimiza CPFs, telefones e termos de propriedade intelectual sigilosa.\n• Habilidades Incorretas: Elaborar E-mails ou Resumir Conteúdos são ferramentas de formatação, Pesquisa Profunda traz dados da rede sem filtrar sigilos, e Analisar Cenários projeta tendências de mercado.\n• Recomendação: Aplique sempre o **Uso Seguro da IA** limpando quaisquer registros sensíveis antes de submeter os dados para a **Curadoria** via IA.'
  },
  {
    id: 18,
    level: 'JEDI',
    title: 'Planejamento de Evento',
    scenario: 'Será realizado um grande evento corporativo envolvendo diversas reuniões, fornecedores e entregas distribuídas ao longo do mês.',
    correctSkillIds: [1, 2],
    incorrectSkillIds: [3, 5, 10, 11],
    explanation: '• Habilidades Corretas: **Organizar Agenda (01)** alinha o sincronismo de compromissos críticos diários corporativos e **Planejar Semana (02)** desenha o cronograma das frentes operacionais ao longo de 4 semanas.\n• Habilidades Incorretas: Priorizar Atividades ordena demandas gerais mas não as sincroniza no tempo, Criar Comunicados redige avisos à imprensa e Analisar Cenários ou Gerar Alternativas não organizam o fluxo físico temporal.\n• Recomendação: Comece estruturando as Sprints do evento com **Planejar Semana** e use **Organizar Agenda** para travar os alinhamentos semanais e blindar o tempo de foco da sua equipe.'
  },
  {
    id: 19,
    level: 'JEDI',
    title: 'Resposta Estratégica',
    scenario: 'Um cliente enviou uma reclamação extensa e você precisa compreender rapidamente o problema antes de elaborar uma resposta formal.',
    correctSkillIds: [4, 6],
    incorrectSkillIds: [5, 9, 10, 12],
    explanation: '• Habilidades Corretas: **Elaborar E-mails (04)** calibra o tom diplomático, formal e resolutivo da mensagem de retratação e **Resumir Conteúdos (06)** separa o ruído emocional dos fatos operacionais na reclamação dele.\n• Habilidades Incorretas: Criar Comunicados foca no grande público de forma neutra, enquanto Curadoria, Analisar Cenários e Uso Seguro não condensam textos recebidos nem redigem respostas diretas.\n• Recomendação: Utilize **Resumir Conteúdos** para desmembrar a crítica do cooperado em marcadores simples de problemas e use **Elaborar E-mails** pedindo soluções claras.'
  },
  {
    id: 20,
    level: 'JEDI',
    title: 'Pesquisa para Inovação',
    scenario: 'A empresa pretende lançar um novo serviço e precisa pesquisar tendências internacionais para propor soluções inovadoras.',
    correctSkillIds: [7, 11],
    incorrectSkillIds: [6, 8, 9, 10],
    explanation: '• Habilidades Corretas: **Pesquisa Profunda (07)** faz varredura ampla de novidades e modelos ao nível global e **Gerar Alternativas (11)** quebra monopólios mentais na equipe de inovação sugerindo abordagens engenhosas.\n• Habilidades Incorretas: Resumir ou Estudar digerem materiais prontos e estáticos, Curadoria cataloga o acervo local atual e Analisar Cenários trabalha após as alternativas serem estabelecidas.\n• Recomendação: Acione a **Pesquisa Profunda** para importar benchmarks globais disruptivos e use **Gerar Alternativas** para moldar esses modelos de acordo com a sua comunidade local.'
  },

  // ==========================================
  // YODA - NÍVEL AVANÇADO (Questões 21 a 30)
  // Conforme diretriz: entre 3 e 5 Habilidades Corretas e as demais erradas (total 6)
  // ==========================================
  {
    id: 21,
    level: 'YODA',
    title: 'Transformação Digital',
    scenario: 'Sua área passará por uma transformação completa e será necessário reorganizar processos, definir prioridades e propor novos caminhos para aumentar a produtividade.',
    correctSkillIds: [2, 3, 11],
    incorrectSkillIds: [1, 10, 12],
    explanation: '• Habilidades Corretas: **Planejar Semana (02)** para desenhar novas rotinas das Sprints, **Priorizar Atividades (03)** definindo o foco analítico da escassez temporal e **Gerar Alternativas (11)** para pivotar fluxos quebrados de equipe.\n• Habilidades Incorretas: Organizar Agenda lida com calendário imediato (micro), Analisar Cenários mapeia premissas futuras de macro e Uso Seguro lida com sigilo informacional da IA.\n• Recomendação: Conecte **Gerar Alternativas** para desenhar caminhos ágeis inovadores, use **Priorizar Atividades** para selecionar o cerne e faça o onboarding com **Planejar Semana**.'
  },
  {
    id: 22,
    level: 'YODA',
    title: 'Due Diligence Tecnológica',
    scenario: 'Você recebeu centenas de documentos técnicos e precisa pesquisar referências, selecionar conteúdos relevantes, resumir as principais conclusões e garantir que nenhuma informação sensível seja exposta.',
    correctSkillIds: [6, 7, 9, 12],
    incorrectSkillIds: [10, 11],
    explanation: '• Habilidades Corretas: **Resumir Conteúdos (06)** formata as conclusões essenciais de documentos áridos, **Pesquisa Profunda (07)** valida fontes externas de conciliação, **Curadoria de Conteúdo (09)** pinça de forma cirúrgica materiais fidedignos e **Uso Seguro da IA (12)** anonimiza e protege ativos da LGPD corporativo.\n• Habilidades Incorretas: Analisar Cenários e Gerar Alternativas operam na modelagem pós-estudo ou na tomada de decisões, mas não lidam com o letramento documental inicial.\n• Recomendação: Execute o **Uso Seguro da IA** para anonimizar os dados, aplique **Curadoria** e **Pesquisa Profunda** para coletar e auditar os materiais, e finalize gerando o book com **Resumir Conteúdos**.'
  },
  {
    id: 23,
    level: 'YODA',
    title: 'Planejamento Executivo',
    scenario: 'Um diretor possui uma agenda extremamente sobrecarregada e precisa reorganizar compromissos, definir prioridades e estruturar toda a semana.',
    correctSkillIds: [1, 2, 3],
    incorrectSkillIds: [4, 10, 11],
    explanation: '• Habilidades Corretas: **Organizar Agenda (01)** resolve conflitos urgentes de calendário diário imediato, **Planejar Semana (02)** equilibra as cargas a médio prazo e **Priorizar Atividades (03)** define o backlog analítico estratégico de foco.\n• Habilidades Incorretas: Elaborar E-mails trata de texto interpessoal, enquanto Analisar Cenários ou Gerar Alternativas especulam hipóteses comerciais de inovação.\n• Recomendação: Mestre Yoda diz: ordene o foco com **Priorizar Atividades**, agende blocos de foco utilizando **Planejar Semana** e reconcilie reuniões conflituosas com **Organizar Agenda**.'
  },
  {
    id: 24,
    level: 'YODA',
    title: 'Pesquisa Estratégica',
    scenario: 'A empresa deseja entrar em um novo mercado e precisa estudar o segmento, selecionar fontes relevantes, comparar cenários e propor alternativas de atuação.',
    correctSkillIds: [7, 9, 10, 11],
    incorrectSkillIds: [6, 12],
    explanation: '• Habilidades Corretas: **Pesquisa Profunda (07)** coleta dados reais e atualizados do setor, **Curadoria de Conteúdo (09)** descarta fake news e seleciona materiais adequados, **Analisar Cenários (10)** projeta flutuações e riscos, e **Gerar Alternativas (11)** provê múltiplas pontes de expansão e opções ágeis.\n• Habilidades Incorretas: Resumir Conteúdos apenas sintetiza textos fornecidos estáticos e Uso Seguro da IA cuida de conformidade LGPD de usuários e termos do sistema generativo.\n• Recomendação: Sinergia total! Use **Pesquisa Profunda** e **Curadoria** para obter dados excelentes externos, crie estratégias múltiplas inovadoras com **Gerar Alternativas** e valide a resiliência de cada uma via **Analisar Cenários**.'
  },
  {
    id: 25,
    level: 'YODA',
    title: 'Comunicação Corporativa',
    scenario: 'Após uma crise institucional, será necessário compreender rapidamente diversos relatórios, produzir um comunicado oficial e enviar mensagens específicas para clientes estratégicos.',
    correctSkillIds: [4, 5, 6],
    incorrectSkillIds: [9, 10, 12],
    explanation: '• Habilidades Corretas: **Elaborar E-mails (04)** calibra a diplomacia minuciosa individualizada com clientes, **Criar Comunicados (05)** uniformiza a divulgação institucional geral de marca nas mídias e **Resumir Conteúdos (06)** foca nos fatos de valor dos relatórios de crise.\n• Habilidades Incorretas: Curadoria cataloga acervos, Analisar Cenários prevê planos comerciais e Uso Seguro da IA lida com políticas técnicas do prompt.\n• Recomendação: Use **Resumir Conteúdos** para mapear os pontos concretos da crise, redija o aviso da empresa com **Criar Comunicados** para a comunidade e mitigue as dúvidas com clientes via **Elaborar E-mails**.'
  },
  {
    id: 26,
    level: 'YODA',
    title: 'Aprendizado Acelerado',
    scenario: 'Você precisa estudar uma nova regulamentação, selecionar materiais relevantes e produzir um resumo executivo para toda a equipe.',
    correctSkillIds: [6, 8, 9],
    incorrectSkillIds: [7, 10, 12],
    explanation: '• Habilidades Corretas: **Resumir Conteúdos (06)** ajuda a extrair sínteses corporativas curtas das premissas complexas legais, **Estudo de Novos Temas (08)** didatiza o conteúdo complexo em rotas rápidas e ensina de forma ativa, e **Curadoria de Conteúdo (09)** escolhe e audita as fontes normativas corretas vigentes.\n• Habilidades Incorretas: Pesquisa Profunda busca novidades na internet sem base estática dada, Analisar Cenários projeta tendências financeiras comerciais futuras, e Uso Seguro de IA foca em sigilo computacional de dados.\n• Recomendação: Conecte o **Curadoria** para selecionar exclusivamente os ofícios emitidos corretos vigentes, aprenda-os em tempo recorde via **Estudo** e produza uma cartilha rápida e acessível com **Resumir Conteúdos**.'
  },
  {
    id: 27,
    level: 'YODA',
    title: 'Projeto Inovador',
    scenario: 'Uma equipe multidisciplinar precisa criar uma solução inédita para reduzir custos operacionais analisando diversos cenários possíveis.',
    correctSkillIds: [7, 10, 11],
    incorrectSkillIds: [3, 9, 12],
    explanation: '• Habilidades Corretas: **Pesquisa Profunda (07)** coleta modelos disruptivos globais de processos operacionais modernos, **Analisar Cenários (10)** projeta a resiliência e viabilidade financeira de cada solução dada, e **Gerar Alternativas (11)** quebra modelos tradicionais obsoletos de equipe e traz novas ideias operacionais.\n• Habilidades Incorretas: Priorizar Atividades ordena backlogs manuais correntes, Curadoria seleciona livros locais e Uso Seguro lida com segurança e governança no prompt das IAs.\n• Recomendação: Inove combinando a **Pesquisa Profunda** de dados externos de mercado e **Gerar Alternativas** em workshops criativos, analisando as planilhas de fôlego com **Analisar Cenários**.'
  },
  {
    id: 28,
    level: 'YODA',
    title: 'Implantação de IA Corporativa',
    scenario: 'Antes da implantação de IA em um processo interno, é necessário avaliar riscos, garantir conformidade com a LGPD e estruturar alternativas para uma adoção segura.',
    correctSkillIds: [10, 11, 12],
    incorrectSkillIds: [3, 7, 9],
    explanation: '• Habilidades Corretas: **Analisar Cenários (10)** levanta impactos futuros jurídicos do modelo de IA a adotar, **Gerar Alternativas (11)** cria caminhos híbridos de redundância humana operacional e **Uso Seguro da IA (12)** dita as barreiras de segurança ativa contra vazamentos informacionais.\n• Habilidades Incorretas: Priorizar Atividades ordena tarefas simples, Pesquisa Profunda varre a web e Curadoria cataloga fontes dadas de forma estática.\n• Recomendação: O **Uso Seguro da IA** é indispensável para governança de dados pessoais. Use **Gerar Alternativas** para prever fugas e faça simulações de impacto preventivas através do **Analisar Cenários**.'
  },
  {
    id: 29,
    level: 'YODA',
    title: 'Onboarding Inteligente',
    scenario: 'Um novo colaborador precisa aprender rapidamente sobre a empresa utilizando materiais selecionados automaticamente e receber um plano de estudos personalizado.',
    correctSkillIds: [2, 8, 9],
    incorrectSkillIds: [1, 5, 6],
    explanation: '• Habilidades Corretas: **Planejar Semana (02)** agenda as rotinas de introdução ao longo dos dias úteis, **Estudo de Novos Temas (08)** guia a ambientação técnica com trilhas de autotreinamento interativo de IA e **Curadoria de Conteúdo (09)** separa as documentações atualizadas do RH descartando manuais antigos obsoletos.\n• Habilidades Incorretas: Organizar Agenda atua no calendário diário micro do gestor, Criar Comunicados envia notícias a todos e Resumir Conteúdos cria resumos curtos mas não planeja itinerários pedagógicos.\n• Recomendação: Ative a **Curadoria de Conteúdo** para mapear as apostilas corretas, use **Estudo de Novos Temas** para guiar o aprendizado interativo e organize o cronograma na esteira de **Planejar Semana**.'
  },
  {
    id: 30,
    level: 'YODA',
    title: 'Líder Aumentado por IA',
    scenario: 'Um gestor precisa organizar sua agenda, estudar um novo mercado, analisar oportunidades, definir prioridades e comunicar sua estratégia para a equipe utilizando IA como assistente.',
    correctSkillIds: [1, 3, 5, 7, 10],
    incorrectSkillIds: [12],
    explanation: '• Habilidades Corretas: **Organizar Agenda (01)** dita os horários dos comitês, **Priorizar Atividades (03)** decide onde focar em face da escassez, **Criar Comunicados (05)** espelha a estratégia de forma unificada e transparente, **Pesquisa Profunda (07)** engaja mineração externa de dados globais e **Analisar Cenários (10)** avalia as opções comerciais.\n• Habilidades Incorretas: Embora o Uso Seguro da IA seja excelente para proteção de dados gerais, ele não atua na estruturação ativa destas atividades específicas descritas que são focos diretos do prompt.\n• Recomendação: A maestria máxima está na orquestração: use a **Pesquisa Profunda** e **Analisar Cenários** para fundamentar sua decisão, filtre via **Priorizar**, controle seu tempo com **Organizar Agenda** e engaje o time via **Criar Comunicados**.'
  }
];
