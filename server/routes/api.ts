import { Router } from "express";
import { authenticateFirebaseUser } from "../auth/firebaseAuth";
import { rateLimiterMiddleware, aiQuotaMiddleware } from "../middleware/security";
import {
  handleGerarRelatorio,
  handleQuizFeedback,
  handleAdvise,
  handleRewrite,
  handleAIFailuresLog,
} from "../controllers/aiController";

const apiRouter = Router();

// --- PUBLIC ROUTE ---
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    version: "1.0.0-production"
  });
});

// --- PROTECTED ROUTES ---
apiRouter.use(authenticateFirebaseUser);
apiRouter.use(rateLimiterMiddleware);

// Daily AI quota applied specifically to AI generation routes
apiRouter.post("/gerar-relatorio", aiQuotaMiddleware, handleGerarRelatorio);
apiRouter.post("/quiz-feedback", aiQuotaMiddleware, handleQuizFeedback);
apiRouter.post("/advise", aiQuotaMiddleware, handleAdvise);
apiRouter.post("/rewrite", aiQuotaMiddleware, handleRewrite);

// Admin-only route
apiRouter.get("/admin/ai-failures", handleAIFailuresLog);

export default apiRouter;
