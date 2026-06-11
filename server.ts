import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const openai = openaiKey ? new OpenAI({
    apiKey: openaiKey,
  }) : null;

  async function getAIResponse(prompt: string) {
    const rawOpenAIKey = process.env.OPENAI_API_KEY?.trim();
    let openaiKey = rawOpenAIKey;

    if (rawOpenAIKey) {
      // Regex to extract OpenAI key even if surrounded by text
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
        // Fall back to Gemini if OpenAI fails (e.g., 401, quota)
      }
    }

    // Fallback to Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.7,
          }
        });
        return response.text || "";
      } catch (error: any) {
        console.error("Gemini Error:", error.message || error);
        throw new Error(`AI error (Gemini): ${error.message || "Failed to generate response"}`);
      }
    }

    throw new Error("No valid AI configuration found. Please check both OpenAI and Gemini keys in the Secrets panel.");
  }

  // API Route for Generating Executive Diagnostic Reports
  app.post("/api/gerar-relatorio", async (req, res) => {
    const { email, xp, unlockedPowers, completedMissions, skillsSurvey } = req.body;

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
           Como esse participante pode liderar ou aplicar iniciativas de IA em sua organização ou equipe a partir do seu deck de habilidades atual.
        
        4. **CONSELHO DO MESTRE JEDI**:
           Um conselho final motivador, estratégico e profundo, que conecte os conceitos da filosofia Jedi com a ética e o futuro da inteligência artificial.

        Regras adicionais:
        - O tom deve ser corporativo, altamente profissional, ao mesmo tempo que carrega metáforas elegantes do universo de Star Wars de forma equilibrada (menos lúdica e mais voltada para liderança e inovação estratégica).
        - Use formatação Markdown (negrito, listas com marcadores, cabeçalhos de seção com ##).
        - Responda em Português.
      `;

      const relatorio = await getAIResponse(prompt);
      res.json({ relatorio });
    } catch (error: any) {
      console.error("AI Error generating report:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for Quiz Feedback
  app.post("/api/quiz-feedback", async (req, res) => {
    const { scenario, correctAnswer, selectedAnswer, level } = req.body;

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

      const feedback = await getAIResponse(prompt);
      res.json({ feedback });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for AI Advisor
  app.post("/api/advise", async (req, res) => {
    const { mission, selectedPowers, userExplanation } = req.body;

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

      const advice = await getAIResponse(prompt);
      res.json({ advice });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for AI Assistant Rewriting (Normal Language)
  app.post("/api/rewrite", async (req, res) => {
    const { mission, selectedPowers, currentExplanation } = req.body;

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
        3. Integre as habilidades selecionadas na narrativa, explicando logicamente o papel de cada uma na solução final.
        4. O texto deve ser direto e estar pronto para ser utilizado no campo de descrição. 
        5. Não inclua introduções como "Aqui está sua narrativa" ou conclusões.
      `;

      const rewrittenText = await getAIResponse(prompt);
      res.json({ rewrittenText });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
