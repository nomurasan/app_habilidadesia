import { getFirebaseConfig } from "../auth/firebaseAuth";

export async function auditAIUsage(
  userId: string,
  companyId: string,
  model: string,
  prompt: string,
  response: string,
  endpoint: string
) {
  const firebaseConfig = getFirebaseConfig();
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

  if (firebaseConfig.projectId) {
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
}
