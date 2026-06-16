import { auth } from '../lib/firebase';
import { ALL_CHALLENGES } from '../data/challenges';
import { Challenge } from '../types';
import { AppError } from '../utils/errors';

export class QuizService {
  public static getChallengesByLevel(level: 'PADAWAN' | 'JEDI' | 'YODA'): Challenge[] {
    // Note: in challenges datatypes, level might be defined differently (e.g. capitalized)
    return ALL_CHALLENGES.filter(
      (ch) => ch.level?.toUpperCase() === level.toUpperCase()
    ) as unknown as Challenge[];
  }

  public static async fetchQuizFeedback(
    scenario: string,
    correctAnswerTitle: string,
    selectedAnswerTitle: string,
    level: string
  ): Promise<string> {
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      if (!idToken) throw new AppError('Usuário não autenticado', 'UNAUTHENTICATED');

      const response = await fetch('/api/quiz-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          scenario,
          correctAnswer: correctAnswerTitle,
          selectedAnswer: selectedAnswerTitle,
          level,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new AppError(
          errData.error || 'Erro ao obter feedback da Inteligência Artificial',
          'API_ERROR'
        );
      }

      const data = await response.json();
      return data.feedback || '';
    } catch (err: any) {
      console.warn('Network Error fetching AI feedback, using fallback:', err);
      throw err;
    }
  }

  public static calculatePoints(timeLeftSeconds: number): number {
    // Base 1000 + Time Bonus (up to 500 points depending on 60 second timer)
    const timeBonus = Math.floor((Math.max(0, timeLeftSeconds) / 60) * 500);
    return 1000 + timeBonus;
  }
}
