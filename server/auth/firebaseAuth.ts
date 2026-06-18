import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

// Load Firebase configuration
let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (err) {
  console.error("Could not load firebase-applet-config.json in firebaseAuth:", err);
}

export function getFirebaseConfig() {
  return firebaseConfig;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    companyId: string;
    isAdmin: boolean;
    xp: number;
  };
  correlationId?: string;
}

export const authenticateFirebaseUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
