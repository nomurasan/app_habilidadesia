import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import { z } from "zod";

dotenv.config();

// --- ZOD PAYLOAD SCHEMAS ---
const gerarRelatorioSchema = z.object({
  email: z.string().email(),
  xp: z.number().int().nonnegative(),
  unlockedPowers: z.array(z.string()),
  completedMissions: z.record(z.string(), z.boolean()),
  skillsSurvey: z.record(z.string(), z.object({
    current: z.number().int().min(1).max(5),
    target: z.number().int().min(1).max(5)
  })).nullable().optional()
});

const quizFeedbackSchema = z.object({
  scenario: z.string().min(5),
  correctAnswer: z.string().min(1),
  selectedAnswer: z.string().min(1),
  level: z.string().min(1)
});

const adviseSchema = z.object({
  mission: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    context: z.string().min(1),
    reflection: z.string().min(1),
    recommendedPowerIds: z.array(z.string()).optional(),
    advisorHint: z.string().optional()
  }),
  selectedPowers: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1)
  })),
  userExplanation: z.string().min(5)
});

const rewriteSchema = z.object({
  mission: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    context: z.string().min(1)
  }),
  selectedPowers: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1)
  })),
  currentExplanation: z.string().optional()
});

// AI Failure Tracker (Observability registry)
const aiFailureTracker: Array<{
  timestamp: string;
  correlationId: string;
  endpoint: string;
  userId: string;
  error: string;
}> = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- STRUCTURED LOGGING & CORRELATION ID MIDDLEWARE ---
  app.use((req: any, res, next) => {
    const correlationId = (req.headers["x-correlation-id"] as string) || crypto.randomUUID();
    req.correlationId = correlationId;
    res.setHeader("X-Correlation-ID", correlationId);

    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const log = {
        timestamp: new Date().toISOString(),
        correlationId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
        userId: req.user?.uid || "unauthenticated",
        ip: req.ip,
      };
      console.log(`[REQUEST_LOG] ${JSON.stringify(log)}`);
    });
    next();
  });

  // --- NATIVE SECURITY HEADERS MIDDLEWARE ("HELMET") ---
  app.use((req, res, next) => {
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
  });

  // --- STRICT CORS MIDDLEWARE ---
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedDomains = [
      "https://ais-dev-yuwfc3wzhqqcdyz7ct5nwh-215403610963.us-west2.run.app",
      "https://ais-pre-yuwfc3wzhqqcdyz7ct5nwh-215403610963.us-west2.run.app"
    ];
    if (origin && allowedDomains.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // --- SANITIZATION AGAINST XSS & HTML INJECTION ---
  function sanitizeInput(content: any): any {
    if (typeof content === "string") {
      return content
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
        .replace(/<\/?[^>]+(>|$)/g, ""); // Strip any HTML tags completely
    }
    if (Array.isArray(content)) {
      return content.map(sanitizeInput);
    }
    if (content !== null && typeof content === "object") {
      const sanitized: any = {};
      for (const key of Object.keys(content)) {
        sanitized[key] = sanitizeInput(content[key]);
      }
      return sanitized;
    }
    return content;
  }

  app.use((req, res, next) => {
    if (req.body) {
      req.body = sanitizeInput(req.body);
    }
    next();
  });

  // --- FIREBASE APP CONFIG LOADING ---
  let firebaseConfig: any = {};
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch (err) {
    console.error("Could not load firebase-applet-config.json:", err);
  }

  // --- JWT AUTH MIDDLEWARE (FIREBASE SECURED) ---
  const authenticateFirebaseUser = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Cabeçalho de autorização inválido ou ausente." });
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ error: "Token JWT não fornecido." });
    }

    try {
      // 1. Verify token directly with Google Firebase Identity Toolkit
      const identityRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!identityRes.ok) {
        return res.status(401).json({ error: "Token de autenticação inválido ou expirado." });
      }

      const identityData: any = await identityRes.json();
      const firebaseUser = identityData.users?.[0];
      if (!firebaseUser) {
        return res.status(401).json({ error: "Usuário correspondente não foi localizado." });
      }

      // 2. Fetch User Profile from Firestore REST API to evaluate organization/permissions
      const firestoreDb = firebaseConfig.firestoreDatabaseId || "(default)";
      const userDocUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firestoreDb}/documents/users/${firebaseUser.localId}`;
      
      const firestoreRes = await fetch(userDocUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!firestoreRes.ok) {
        return res.status(403).json({ error: "Permissões insuficientes no banco de dados Firestore." });
      }

      const firestoreData: any = await firestoreRes.json();
      const fields = firestoreData.fields || {};

      req.user = {
        uid: firebaseUser.localId,
        email: fields.email?.stringValue || firebaseUser.email || "",
        companyId: fields.companyId?.stringValue || "",
        isAdmin: fields.isAdmin?.booleanValue || false,
        xp: fields.xp?.integerValue ? parseInt(fields.xp.integerValue, 10) : 0,
      };

      next();
    } catch (e: any) {
      console.error("Authentication middleware failure:", e.message || e);
      return res.status(500).json({ error: "Erro de processamento na camada de segurança." });
    }
  };

  // --- RATE LIMITING MIDDLEWARE ---
  const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 20; // Max 20 calls per user per minute

  const rateLimiterMiddleware = async (req: any, res: any, next: any) => {
    const key = req.user?.uid || req.ip || "anonymous";
    const now = Date.now();

    // 1. Clustered High-Availability Mode (Optional Firestore REST Distributed store)
    if (process.env.ENABLE_CLUSTERED_RATE_LIMIT === "true" && firebaseConfig.projectId) {
      try {
        const firestoreDb = firebaseConfig.firestoreDatabaseId || "(default)";
        const docUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firestoreDb}/documents/rate_limits/${key}`;
        
        const docRes = await fetch(docUrl);
        let limit: any = null;
        if (docRes.ok) {
          const docData: any = await docRes.json();
          const fields = docData.fields || {};
          limit = {
            count: fields.count?.integerValue ? parseInt(fields.count.integerValue, 10) : 0,
            resetTime: fields.resetTime?.integerValue ? parseInt(fields.resetTime.integerValue, 10) : 0
          };
        }

        if (!limit || now >= limit.resetTime) {
          const newResetTime = now + RATE_LIMIT_WINDOW_MS;
          await fetch(docUrl, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fields: {
                count: { integerValue: "1" },
                resetTime: { integerValue: newResetTime.toString() }
              }
            })
          }).catch(() => {});
          return next();
        }

        const newCount = limit.count + 1;
        await fetch(docUrl + "?updateMask.fieldPaths=count", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              count: { integerValue: newCount.toString() }
            }
          })
        }).catch(() => {});

        if (newCount > RATE_LIMIT_MAX_REQUESTS) {
          console.warn(`[RATE LIMIT EXCEEDED - CLUSTERED] User UID/IP: ${key}, RequestCount: ${newCount}`);
          return res.status(429).json({
            success: false,
            data: null,
            error: "Limite de solicitações atingido. Por favor, aguarde um minuto antes de tentar novamente.",
            traceId: req.correlationId
          });
        }
        return next();
      } catch (err) {
        console.error("Clustered rate limiting error, falling back to local memory:", err);
      }
    }

    // 2. Default: Single-Instance High Performance In-Memory Store
    let limit = rateLimitStore.get(key);

    if (!limit || now >= limit.resetTime) {
      limit = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
      rateLimitStore.set(key, limit);
      return next();
    }

    limit.count++;
    if (limit.count > RATE_LIMIT_MAX_REQUESTS) {
      console.warn(`[RATE LIMIT EXCEEDED] User UID/IP: ${key}, Endpoint: ${req.originalUrl}, Requests: ${limit.count}`);
      return res.status(429).json({
        success: false,
        data: null,
        error: "Limite de solicitações atingido. Por favor, aguarde um minuto antes de tentar novamente.",
        traceId: req.correlationId
      });
    }

    next();
  };

  // --- AI SECURITY ABUSE AUDITING ---
  async function auditAIUsage(userId: string, companyId: string, model: string, prompt: string, response: string, endpoint: string) {
    const timestamp = new Date().toISOString();
    const promptTokens = Math.ceil((prompt || "").length / 4);
    const completionTokens = Math.ceil((response || "").length / 4);
    const totalTokens = promptTokens + completionTokens;
    const estimatedCost = totalTokens * 0.000002; // Estimate baseline

    const auditLog = {
      user_id: userId,
      company_id: companyId,
      provider: model.includes("gpt") ? "OpenAI" : "Gemini",
      model,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      estimated_cost: estimatedCost,
      endpoint,
      created_at: timestamp
    };

    console.log(`[AUDITLOG_AI_USAGE] ${JSON.stringify(auditLog)}`);

    try {
      const firestoreDb = firebaseConfig.firestoreDatabaseId || "(default)";
      const saveUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firestoreDb}/documents/ai_usage`;

      const payload = {
        fields: {
          userId: { stringValue: userId },
          companyId: { stringValue: companyId },
          provider: { stringValue: auditLog.provider },
          model: { stringValue: model },
          promptTokens: { integerValue: promptTokens.toString() },
          completionTokens: { integerValue: completionTokens.toString() },
          totalTokens: { integerValue: totalTokens.toString() },
          estimatedCost: { doubleValue: estimatedCost },
          endpoint: { stringValue: endpoint },
          createdAt: { stringValue: timestamp }
        }
      };

      await fetch(saveUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err: any) {
      console.error("Failed to write to ai_usage audit collection:", err.message || err);
    }
  }

  // --- GOOGLE GEMINI & OPENAI ENGINES ---
  const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  async function getAIResponse(
    prompt: string,
    context: { endpoint: string; correlationId: string; userId: string }
  ) {
    const rawOpenAIKey = process.env.OPENAI_API_KEY?.trim();
    let openaiKey = rawOpenAIKey;

    if (rawOpenAIKey) {
      const match = rawOpenAIKey.match(/sk-[a-zA-Z0-9_-]{32,}/);
      if (match) openaiKey = match[0];
    }

    if (openaiKey && openaiKey.startsWith('sk-')) {
      try {
        const openaiClient = new OpenAI({ apiKey: openaiKey });
        const response = await openaiClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        const content = response.choices[0].message.content || "";
        if (content) return content;
      } catch (error: any) {
        console.error("OpenAI Error:", error.message || error);
        aiFailureTracker.push({
          timestamp: new Date().toISOString(),
          correlationId: context.correlationId,
          endpoint: context.endpoint,
          userId: context.userId,
          error: `OpenAI: ${error.message || String(error)}`
        });
      }
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.7,
          }
        });
        return response.text || "";
      } catch (error: any) {
        console.error("Gemini Error:", error.message || error);
        aiFailureTracker.push({
          timestamp: new Date().toISOString(),
          correlationId: context.correlationId,
          endpoint: context.endpoint,
          userId: context.userId,
          error: `Gemini: ${error.message || String(error)}`
        });
        throw new Error(`AI error (Gemini): ${error.message || "Failed to generate response"}`);
      }
    }

    const noAiConfigErr = "No valid AI configuration found. Please check both OpenAI and Gemini keys in the Secrets panel.";
    aiFailureTracker.push({
      timestamp: new Date().toISOString(),
      correlationId: context.correlationId,
      endpoint: context.endpoint,
      userId: context.userId,
      error: noAiConfigErr
    });
    throw new Error(noAiConfigErr);
  }

  // --- HEALTH CHECK ENDPOINT ---
  app.get("/api/health", (req: any, res) => {
    const data = {
      status: "ok",
      firebase: firebaseConfig.projectId ? "configured" : "missing",
      openai: process.env.OPENAI_API_KEY ? "configured" : "missing",
      gemini: process.env.GEMINI_API_KEY ? "configured" : "missing",
      uptime: process.uptime(),
      version: "1.0.0-production"
    };
    res.json({
      success: true,
      data,
      error: null,
      traceId: req.correlationId,
      ...data
    });
  });

  // --- AI FAILURE TELEMETRY (ADMIN ONLY) ---
  app.get("/api/admin/ai-failures", authenticateFirebaseUser, (req: any, res) => {
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
  });

  // --- PROTECTED API ROUTES ---

  // API Route for Generating Executive Diagnostic Reports
  app.post("/api/gerar-relatorio", authenticateFirebaseUser, rateLimiterMiddleware, async (req: any, res) => {
    // Validate request payload with Zod
    const validation = gerarRelatorioSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
    }

    const { email, xp, unlockedPowers, completedMissions, skillsSurvey } = validation.data;

    try {
      const prompt = `
        Você é um Grão-Mestre Jedi em IA e Especialista em Transformação Digital Executiva.
        Gere um Relatório Diagnóstico de IA detalhado e altamente personalizado para este participante.

        DADOS DO PARTICIPANTE:
        - Nome/Email: ${email || "Iniciante"}
        - XP Acumulado: ${xp || 0}
        - Habilidades Desbloqueadas: ${JSON.stringify(unlockedPowers || [])}
        - Missões Concluídas: ${JSON.stringify(completedMissions || {})}
        - Pesquisa de Habilidades (Auto-avaliação): ${JSON.stringify(skillsSurvey || {})}

        ESTRUTURA DO RELATÓRIO DO CONSELHO JEDI (Gere um relatório formatado em seções claras usando Markdown):
        1. **DIAGNÓSTICO DA FORÇA DA IA (Status Atual)**:
           Analise as habilidades desbloqueadas do usuário e seu XP para determinar o nível real de maestria e proficiência técnica atual (focando nos pilares em que o participante se destaca).
        
        2. **RECOMENDAÇÕES PARA A JORNADA (Próximos Passos)**:
           Aponte as lacunas entre a proficiência atual e as metas de habilidades mencionadas na pesquisa de habilidades (skillsSurvey) ou no seu ranking (Padawan/Jedi/Yoda). Forneça recomendações práticas para fortalecer a "força" da IA.
        
        3. **PLANO DE IMPACTO OPERACIONAL**:
           Como esse participante pode liderar ou aplicar initiatives de IA em sua organização ou equipe a partir do seu deck de habilidades atual.
        
        4. **CONSELHO DO MESTRE JEDI**:
           Um conselho final motivador, estratégico e profundo, que conecte os conceitos da filosofia Jedi com a ética e o futuro da inteligência artificial.

         Regras adicionais:
         - O tom deve ser corporativo, altamente profissional, ao mesmo tempo que carrega metáforas elegantes do universo de Star Wars de forma equilibrada (menos lúdica e mais voltada para liderança e inovação estratégica).
         - Use formatação Markdown (negrito, listas com marcadores, cabeçalhos de seção com ##).
         - Responda em Português.
       `;

      const relatorio = await getAIResponse(prompt, {
        endpoint: "/api/gerar-relatorio",
        correlationId: req.correlationId,
        userId: req.user.uid
      });
      await auditAIUsage(req.user.uid, req.user.companyId, "gemini-2.5-flash", prompt, relatorio, "/api/gerar-relatorio");
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
  });

  // API Route for Quiz Feedback
  app.post("/api/quiz-feedback", authenticateFirebaseUser, rateLimiterMiddleware, async (req: any, res) => {
    // Validate request payload with Zod
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
        correlationId: req.correlationId,
        userId: req.user.uid
      });
      await auditAIUsage(req.user.uid, req.user.companyId, "gemini-2.5-flash", prompt, feedback, "/api/quiz-feedback");
      res.json({
        success: true,
        data: { feedback },
        error: null,
        traceId: req.correlationId,
        feedback
      });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: error.message,
        traceId: req.correlationId
      });
    }
  });

  // API Route for AI Advisor
  app.post("/api/advise", authenticateFirebaseUser, rateLimiterMiddleware, async (req: any, res) => {
    // Validate request payload with Zod
    const validation = adviseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Corpo da requisição inválido.", details: validation.error.format() });
    }

    const { mission, selectedPowers, userExplanation } = validation.data;

    try {
      const prompt = `
        Você é um Assitente de IA especializado e mentor técnico em Inteligência Artificial.
        
        MISSÃO: ${mission.title} - ${mission.subtitle}
        CONTEXTO: ${mission.context}
        REFLEXÃO: ${mission.reflection}
        
        HABILIDADES RECOMENDADAS (Conhecimento): ${mission.recommendedPowerIds?.join(', ') || ''}
        DICA TÉCNICA (Hint): ${mission.advisorHint}
        
        HABILIDADES SELECIONADAS PELO USUÁRIO: ${selectedPowers.map((p: any) => p.title).join(', ')}
        EXPLICAÇÃO DO USUÁRIO: ${userExplanation}
        
        INSTRUÇÕES:
        1. Analise se as habilidades selecionadas fazem sentido para a missão.
        2. Dê um aconselhamento curto (máximo 2-3 parágrafos) em linguagem clara, direta e PROFISSIONAL. 
        3. Fale de forma inspiradora mas neutra (NÃO use o estilo do Mestre Yoda).
        4. No final do seu conselho, inclua uma seção chamada "DICA PARA MISSÃO 10/10" indicando claramente o que falta na descrição ou nos cards para a solução ser perfeita.
        5. No final de tudo, dê uma nota de 0 a 10 para a estratégia.
      `;

      const advice = await getAIResponse(prompt, {
        endpoint: "/api/advise",
        correlationId: req.correlationId,
        userId: req.user.uid
      });
      await auditAIUsage(req.user.uid, req.user.companyId, "gemini-2.5-flash", prompt, advice, "/api/advise");
      res.json({
        success: true,
        data: { advice },
        error: null,
        traceId: req.correlationId,
        advice
      });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: error.message,
        traceId: req.correlationId
      });
    }
  });

  // API Route for AI Assistant Rewriting (Normal Language)
  app.post("/api/rewrite", authenticateFirebaseUser, rateLimiterMiddleware, async (req: any, res) => {
    // Validate request payload with Zod
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
        correlationId: req.correlationId,
        userId: req.user.uid
      });
      await auditAIUsage(req.user.uid, req.user.companyId, "gemini-2.5-flash", prompt, rewrittenText, "/api/rewrite");
      res.json({
        success: true,
        data: { rewrittenText },
        error: null,
        traceId: req.correlationId,
        rewrittenText
      });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({
        success: false,
        data: null,
        error: error.message,
        traceId: req.correlationId
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
