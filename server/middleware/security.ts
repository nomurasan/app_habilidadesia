import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getFirebaseConfig, AuthenticatedRequest } from "../auth/firebaseAuth";

// In-Memory Rate Limiting default store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests/min

export const correlationIdMiddleware = (req: any, res: Response, next: NextFunction) => {
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
};

export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
};

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
};

export function sanitizeInput(content: any): any {
  if (typeof content === "string") {
    return content
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "");
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

export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

export const rateLimiterMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const key = req.user?.uid || req.ip || "anonymous";
  const now = Date.now();
  const firebaseConfig = getFirebaseConfig();

  // 1. Clustered High-Availability Mode (Firestore REST Distributed store)
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
    console.warn(`[RATE LIMIT EXCEEDED] User/IP: ${key}, Endpoint: ${req.originalUrl}, Requests: ${limit.count}`);
    return res.status(429).json({
      success: false,
      data: null,
      error: "Limite de solicitações atingido. Por favor, aguarde um minuto antes de tentar novamente.",
      traceId: req.correlationId
    });
  }

  next();
};

// --- DAILY AI QUOTA INTERFACE & MIDDLEWARE ---
const aiQuotaStore = new Map<string, { count: number; resetTime: number }>();
const DAILY_QUOTA_RESET_MS = 24 * 60 * 60 * 1000;
const MAX_DAILY_AI_REQUESTS = 50;

export const aiQuotaMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.uid;
  if (!userId) {
    return next();
  }

  const now = Date.now();
  let quota = aiQuotaStore.get(userId);

  if (!quota || now >= quota.resetTime) {
    quota = { count: 1, resetTime: now + DAILY_QUOTA_RESET_MS };
    aiQuotaStore.set(userId, quota);
    return next();
  }

  quota.count++;
  if (quota.count > MAX_DAILY_AI_REQUESTS) {
    console.warn(`[AI QUOTA EXCEEDED] User UID: ${userId}, Count: ${quota.count}`);
    return res.status(429).json({
      success: false,
      data: null,
      error: `Você excedeu a sua cota diária de IA de ${MAX_DAILY_AI_REQUESTS} solicitações para proteger os custos da plataforma. Tente novamente amanhã ou contate o administrador.`,
      traceId: req.correlationId
    });
  }

  next();
};
