import { auth } from '../lib/firebase';
import { AppError } from '../utils/errors';

export class AIService {
  public static async generateDiagnosticReport(payload: {
    email: string;
    xp: number;
    unlockedPowers: string[];
    completedMissions: Record<string, boolean>;
    skillsSurvey: Record<string, { current: number; target: number }> | null;
  }): Promise<string> {
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      if (!idToken) throw new AppError('Usuário não autenticado', 'UNAUTHENTICATED');

      const response = await fetch('/api/gerar-relatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new AppError(errData.error || 'Falha ao processar relatório diagnóstico', 'API_ERROR');
      }

      const data = await response.json();
      return data.relatorio || '';
    } catch (err: any) {
      console.error('Diagnostic report compilation error:', err);
      throw err;
    }
  }
}
