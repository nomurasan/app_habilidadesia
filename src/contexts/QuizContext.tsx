import React, { createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import { Challenge } from '../types';

interface QuizContextType {
  selectedLevel: 'PADAWAN' | 'JEDI' | 'YODA' | null;
  setSelectedLevel: (level: 'PADAWAN' | 'JEDI' | 'YODA' | null) => void;
  levelChallenges: Challenge[];
  currentChallengeIndex: number;
  currentChallenge: Challenge | null;
  score: number;
  selectedPower: string | null;
  isAnswered: boolean;
  timeLeft: number;
  aiFeedback: string | null;
  isAiFeedbackLoading: boolean;
  startChallengeTimer: () => void;
  handleSelection: (powerId: string) => Promise<void>;
  nextChallenge: () => boolean;
  resetQuizState: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, awardXP, unlockPower } = useAuthContext();
  const unlockedPowers = userProfile?.unlockedPowers || [];

  const handleSaveProgress = async (newScore: number, updatedUnlocked: string[]) => {
    const xpDiff = newScore - (userProfile?.xp || 0);
    if (xpDiff > 0) {
      await awardXP(xpDiff);
    }
    for (const powerId of updatedUnlocked) {
      if (!unlockedPowers.includes(powerId)) {
        await unlockPower(powerId, 0);
      }
    }
  };

  const quizState = useQuiz(unlockedPowers, handleSaveProgress);

  return (
    <QuizContext.Provider value={quizState}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};
