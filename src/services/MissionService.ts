import { auth } from '../lib/firebase';
import { AppError } from '../utils/errors';
import { MISSIONS } from '../data/missions';

export class MissionService {
  public static getMissions() {
    return MISSIONS;
  }

  public static async fetchAdvisorAdvice(
    mission: any,
    selectedPowers: any[],
    userExplanation: string
  ): Promise<string> {
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      if (!idToken) throw new AppError('Usuário não autenticado', 'UNAUTHENTICATED');

      const response = await fetch('/api/advise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          mission,
          selectedPowers,
          userExplanation,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new AppError(errData.error || 'Erro ao consultar o Conselheiro Jedi', 'API_ERROR');
      }

      const data = await response.json();
      return data.advice || '';
    } catch (err: any) {
      console.error('Advisor advice call error:', err);
      throw err;
    }
  }

  public static async fetchRewrittenNarrative(
    mission: any,
    selectedPowers: any[],
    currentExplanation: string
  ): Promise<string> {
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      if (!idToken) throw new AppError('Usuário não autenticado', 'UNAUTHENTICATED');

      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          mission,
          selectedPowers,
          currentExplanation,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new AppError(errData.error || 'Erro de rede ao reescrever narrativa', 'API_ERROR');
      }

      const data = await response.json();
      return data.rewrittenText || '';
    } catch (err: any) {
      console.error('Narrative rewriting error:', err);
      throw err;
    }
  }
}
