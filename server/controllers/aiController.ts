import { Response } from "express";
import { AuthenticatedRequest } from "../auth/firebaseAuth";
import { getAIResponse } from "../ai/client";
import { auditAIUsage } from "../ai/audit";
import { aiFailureTracker } from "../monitoring/tracker";
import {
  gerarRelatorioSchema,
  quizFeedbackSchema,
  adviseSchema,
  rewriteSchema,
} from "../validators/schemas";

export async function handleGerarRelatorio(req: AuthenticatedRequest, res: Response) {
  const validation = gerarRelatorioSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
  }

  const { email, xp, unlockedPowers, completedMissions, skillsSurvey } = validation.data;

  try {
    const prompt = `
      Você é um Grão-Mestre Jedi em IA e Especialista em Transformação Digital Executiva.
      Gere um Relatório Diagnóstico de Competências Profissionais Avançadas em IA para este participante, avaliando seu progresso na transição de conhecimento técnico para maturidade de liderança corporativa.

      DADOS DO PARTICIPANTE:
      - Nome/Email: ${email || "Iniciante"}
      - XP Acumulado: ${xp || 0}
      - Competências Desbloqueadas: ${JSON.stringify(unlockedPowers || [])}
      - Missões Concluídas: ${JSON.stringify(completedMissions || {})}
      - Pesquisa de Habilidades (Auto-avaliação de Maturidade): ${JSON.stringify(skillsSurvey || {})}

      ESTRUTURA DO RELATÓRIO DO CONSELHO JEDI (Gere um relatório formatado em seções claras usando Markdown):
      1. **MAESTRIA NAS COMPETÊNCIAS PROFISSIONAIS (Diagnóstico)**:
         Avalie as competências profissionais desbloqueadas do participante (como Comunicação, Produtividade Inteligente, Curadoria, Pensamento Crítico e Segurança/LGPD) e seu XP, traçando o seu nível real de maturidade. Identifique forças no processo decisório e postura analítica.
      
      2. **RECOMENDAÇÕES PARA EVOLUÇÃO (Gaps & Trilhas)**:
         Mapeie oportunidades de desenvolvimento baseando-se nos gaps entre as competências atuais e as metas de maturidade tática corporativa (skillsSurvey) ou o ranking (Padawan/Jedi/Yoda). recomende ações estruturadas fáceis de aplicar para fortalecer as habilidades mais críticas de liderança e ceticismo construtivo.
      
      3. **PLANO DE IMPACTO OPERACIONAL SEGURO (LGPD & Eficiência)**:
         Como este profissional pode disseminar melhores práticas de governança, anonimização de dados, prevenção de vieses e automação inteligente cooperativa em sua equipe e organização, mitigando riscos de reputação.
      
      4. **CONSELHO DA ORDEM DOS MESTRES**:
         Um parecer estratégico altamente executivo e inspirador, que conecte a postura Jedi de zelo, equilíbrio e autodesenvolvimento contínuo aos desafios reais da segurança da informação, ética corporativa e o futuro da inteligência artificial.

       Regras adicionais:
       - O tom deve ser estritamente corporativo, altamente maduro, utilizando metáforas profundas da Ordem Jedi de forma sóbria e equilibrada (sem infantilizar a experiência, direcionando o foco às carreiras de liderança).
       - Use formatação Markdown rica (negrito para termos chave, listas estruturadas, cabeçalhos de seção com ##).
       - Responda inteiramente em Português.
     `;

    const relatorio = await getAIResponse(prompt, {
      endpoint: "/api/gerar-relatorio",
      correlationId: req.correlationId || "",
      userId: req.user?.uid || ""
    });
    await auditAIUsage(
      req.user?.uid || "",
      req.user?.companyId || "",
      "gemini-2.5-flash",
      prompt,
      relatorio,
      "/api/gerar-relatorio"
    );
    res.json({
      success: true,
      data: { relatorio },
      error: null,
      traceId: req.correlationId,
      relatorio
    });
  } catch (error: any) {
    console.error("AI Error generating report:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
      traceId: req.correlationId
    });
  }
}

export async function handleQuizFeedback(req: AuthenticatedRequest, res: Response) {
  const validation = quizFeedbackSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
  }

  const { scenario, correctAnswer, selectedAnswer, level } = validation.data;

  try {
    const prompt = `
      Você é um Especialista em Inteligência Artificial e Mentor Técnico. 
      Analise o seguinte cenário de quiz e forneça um feedback construtivo.

      CENÁRIO: "${scenario}"
      NÍVEL: ${level}
      RESPOSTA CORRETA: ${correctAnswer}
      RESPOSTA SELECIONADA PELO USUÁRIO: ${selectedAnswer}

      INSTRUÇÕES:
      1. Se a resposta estiver CORRETA:
         - Comece com uma congratulação breve e entusiasmada.
         - Explique tecnicamente POR QUE essa é a melhor escolha para o cenário de negócio/processo.
      2. Se a resposta estiver INCORRETA:
         - Explique de forma didática e profissional por que a resposta selecionada não é a mais adequada neste contexto específico.
         - Explique brevemente por que a Resposta Correta seria a ideal.
      3. Mantenha o feedback curto (máximo 4-5 linhas).
      4. Use um tom de mentoria: sábio, técnico mas acessível.
      5. Saia do personagem do Mestre Yoda, use linguagem clara e profissional.
    `;

    const feedback = await getAIResponse(prompt, {
      endpoint: "/api/quiz-feedback",
      correlationId: req.correlationId || "",
      userId: req.user?.uid || ""
    });
    await auditAIUsage(
      req.user?.uid || "",
      req.user?.companyId || "",
      "gemini-2.5-flash",
      prompt,
      feedback,
      "/api/quiz-feedback"
    );
    res.json({
      success: true,
      data: { feedback },
      error: null,
      traceId: req.correlationId,
      feedback
    });
  } catch (error: any) {
    console.error("AI Error generating feedback:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
      traceId: req.correlationId
    });
  }
}

const POWER_TITLES: Record<number, string> = {
  1: 'Organizar Agenda',
  2: 'Planejar Semana',
  3: 'Priorizar Atividades',
  4: 'Elaborar E-mails',
  5: 'Criar Comunicados',
  6: 'Resumir Conteúdos',
  7: 'Pesquisa Profunda',
  8: 'Estudo de Novos Temas',
  9: 'Curadoria de Conteúdo',
  10: 'Analisar Cenários',
  11: 'Gerar Alternativas',
  12: 'Uso Seguro da IA'
};

export async function handleAdvise(req: AuthenticatedRequest, res: Response) {
  const validation = adviseSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
  }

  const { mission, selectedPowers, userExplanation } = validation.data;

  try {
    // 1. Resolve recommended skill titles (support both formats for complete safety)
    const recSkillIds = (mission as any).recommendedSkillIds || [];
    const recPowerIds = (mission as any).recommendedPowerIds || [];
    const resolvedRecIds = new Set<number>();
    recSkillIds.forEach((id: number) => resolvedRecIds.add(id));
    recPowerIds.forEach((id: string) => resolvedRecIds.add(parseInt(id, 10)));
    
    const recommendedSkillTitles = Array.from(resolvedRecIds).map(id => POWER_TITLES[id] || `Habilidade ${id}`);

    // 2. Resolve selected power IDs (as numbers)
    const selectedPowerIds = selectedPowers.map((p: any) => parseInt(p.id, 10)).filter((id: number) => !isNaN(id));
    const selectedPowerTitles = selectedPowers.map((p: any) => p.title);

    // 3. Set-based set coverage comparison
    const correctMatches = selectedPowerIds.filter((id: number) => resolvedRecIds.has(id));
    const missingSkills = Array.from(resolvedRecIds).filter((id: number) => !selectedPowerIds.includes(id));
    const extraSkills = selectedPowerIds.filter((id: number) => !resolvedRecIds.has(id));

    const correctMatchTitles = correctMatches.map((id: number) => POWER_TITLES[id]);
    const missingTitles = missingSkills.map((id: number) => POWER_TITLES[id]);
    const extraTitles = extraSkills.map((id: number) => POWER_TITLES[id]);

    const prompt = `
      Você é o Mestre Conselheiro da Ordem Jedi de IA e Especialista em Transformação Estratégica de Negócios (Mestre Nomura).
      Sua tarefa é analisar criticamente a estratégia desenhada pelo participante para resolver a missão descrita e fornecer uma avaliação estratégica muito robusta.

      DADOS DA MISSÃO CORPORATIVA:
      - Título: ${mission.title}
      - Contexto: ${mission.context}
      - Desafio proposto: ${(mission as any).challenge || "(Não informado)"}
      - Resultado esperado: ${(mission as any).expectedResult || "(Não informado)"}
      - Descrição da Maturidade: ${(mission as any).maturityDescription || "(Não informado)"}
      
      REFERÊNCIA INTERNA DA ACADEMIA (NÃO EXIBIR DIRETAMENTE AO USUÁRIO):
      - Solução de Referência Esperada (Gabarito Semântico): "${(mission as any).hiddenReferenceSolution || "(Sem solução de referência no momento)"}"
      - Habilidades Ideais Recomendadas: ${recommendedSkillTitles.join(', ')}

      COMPETÊNCIAS SELECIONADAS PELO PARTICIPANTE:
      - Habilidades Escolhidas: ${selectedPowerTitles.join(', ')}
      - Habilidades Corretas Selecionadas: ${correctMatchTitles.join(', ') || 'Nenhuma'}
      - Habilidades Faltantes: ${missingTitles.join(', ') || 'Nenhuma'}
      - Habilidades Extras (Não prioritárias): ${extraTitles.join(', ') || 'Nenhuma'}

      ESTRATÉGIA/EXPLICAÇÃO DETALHADA DO PARTICIPANTE:
      "${userExplanation}"

      Analise a coerência da solução do participante frente ao gabarito semântico interno. Considere: entendimento do problema, utilidade das habilidades escolhidas, qualidade operacional da estratégia, criatividade, segurança jurídica/dados (LGPD), clareza e viabilidade real.

      INSTRUÇÕES DE RESPOSTA (Em Português, formate obrigatoriamente com markdown claro):
      Escreva o parecer contendo estritamente as seções abaixo, mantendo um tom de mentor sábio, direto e executivo (Mestre Nomura):

      ### Pontos Fortes
      (Descreva os aspectos positivos e maduros da estratégia apresentada pelo participante).

      ### Oportunidades de Melhoria
      (Descreva lacunas conceituais, falhas táticas ou operacionais e aspectos que podem ser aprimorados).

      ### Avaliação das Habilidades
      (Discuta criticamente os cards escolhidos. Explique de forma didática por que os cards recomendados que foram acertados são de fato cruciais para a missão. Para as habilidades extras ou faltantes, mostre sua contribuição ou se elas desviam do foco).

      ### Recomendações
      (Sugira pelo menos duas dicas práticas adicionais de Engenharia de Contexto, segurança de dados da marca ou supervisão "humano-na-alça" para polir a solução para a nota máxima).

      ### Nota Final
      Atribua uma pontuação numérica inteira de 0 a 100 de forma justa e rigorosa, correspondente ao alinhamento com a Solução de Referência Esperada e os critérios definidos.
      FORMATO DA NOTA (Obrigatório vir isolada em uma nova linha no final do feedback):
      **Nota Final:** [Insira o valor numérico de 0 a 100]/100
    `;

    const advice = await getAIResponse(prompt, {
      endpoint: "/api/advise",
      correlationId: req.correlationId || "",
      userId: req.user?.uid || ""
    });
    await auditAIUsage(
      req.user?.uid || "",
      req.user?.companyId || "",
      "gemini-2.5-flash",
      prompt,
      advice,
      "/api/advise"
    );
    res.json({
      success: true,
      data: { advice },
      error: null,
      traceId: req.correlationId,
      advice
    });
  } catch (error: any) {
    console.error("AI Error generating advice:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
      traceId: req.correlationId
    });
  }
}

export async function handleRewrite(req: AuthenticatedRequest, res: Response) {
  const validation = rewriteSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
  }

  const { mission, selectedPowers, currentExplanation } = validation.data;

  try {
    const prompt = `
      Você é um Assitente de IA especializado em arquitetura de soluções. O usuário está tentando resolver uma missão de IA e selecionou algumas habilidades (cards).
      Sua tarefa é CONSTRUIR UMA NARRATIVA de alta qualidade, clara e profissional em linguagem natural, que explique como essa solução resolve o problema proposto.

      MISSÃO: ${mission.title} - ${mission.subtitle}
      CONTEXTO: ${mission.context}
      HABILIDADES SELECIONADAS: ${selectedPowers.map((p: any) => p.title).join(', ')}
      O QUE O USUÁRIO JÁ ESCREVEU (Se houver): ${currentExplanation || "(vazio)"}

      REGRAS:
      1. Construa uma narrativa fluida e executiva em 1 ou 2 parágrafos.
      2. Use linguagem natural, clara e profissional (evite o estilo do Mestre Yoda).
      3. Integre as habilidades selecionadas na narrativa, explaining logicamente o papel de cada uma na solução final.
      4. O texto deve ser direto e estar pronto para ser utilizado no campo de descrição. 
      5. Não inclua introduções como "Aqui está sua narrativa" ou conclusões.
    `;

    const rewrittenText = await getAIResponse(prompt, {
      endpoint: "/api/rewrite",
      correlationId: req.correlationId || "",
      userId: req.user?.uid || ""
    });
    await auditAIUsage(
      req.user?.uid || "",
      req.user?.companyId || "",
      "gemini-2.5-flash",
      prompt,
      rewrittenText,
      "/api/rewrite"
    );
    res.json({
      success: true,
      data: { rewrittenText },
      error: null,
      traceId: req.correlationId,
      rewrittenText
    });
  } catch (error: any) {
    console.error("AI Error generating rewritten text:", error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message,
      traceId: req.correlationId
    });
  }
}

export function handleAIFailuresLog(req: AuthenticatedRequest, res: Response) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      data: null,
      error: "Acesso administrativo restrito exigido.",
      traceId: req.correlationId
    });
  }
  const data = {
    failures: aiFailureTracker.slice(-20),
    totalTracked: aiFailureTracker.length
  };
  return res.json({
    success: true,
    data,
    error: null,
    traceId: req.correlationId,
    ...data
  });
}
