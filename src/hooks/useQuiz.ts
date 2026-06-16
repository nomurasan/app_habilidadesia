import { useState, useEffect, useRef } from 'react';
import { Challenge } from '../types';
import { QuizService } from '../services/QuizService';
import { AIPower } from '../data/powers';

export function useQuiz(
  unlockedPowers: string[],
  onSaveProgress: (newScore: number, updatedUnlocked: string[]) => Promise<void>
) {
  const [selectedLevel, setSelectedLevel] = useState<'PADAWAN' | 'JEDI' | 'YODA' | null>(null);
  const [levelChallenges, setLevelChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiFeedbackLoading, setIsAiFeedbackLoading] = useState(false);

  // Challenge info helpers
  const currentChallenge = levelChallenges[currentChallengeIndex] || null;

  // Reference for timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize challenges when level changes
  useEffect(() => {
    if (selectedLevel) {
      const challenges = QuizService.getChallengesByLevel(selectedLevel);
      // Randomize up to 10 challenges for robust replayability
      const shuffled = [...challenges].sort(() => 0.5 - Math.random()).slice(0, 10);
      setLevelChallenges(shuffled);
      setCurrentChallengeIndex(0);
      setScore(0);
      setSelectedPower(null);
      setIsAnswered(false);
      setAiFeedback(null);
    } else {
      setLevelChallenges([]);
    }
  }, [selectedLevel]);

  // Handle active game timer ticking
  useEffect(() => {
    if (isActive && timeLeft > 0 && !isAnswered) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && isActive) {
      // Time-out: count as answered with "Nenhuma/Tempo Esgotado"
      handleSelection('');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft, isAnswered]);

  const startChallengeTimer = () => {
    setTimeLeft(60);
    setIsAnswered(false);
    setSelectedPower(null);
    setAiFeedback(null);
    setIsActive(true);
  };

  const handleSelection = async (powerId: string) => {
    if (isAnswered || !currentChallenge) return;

    setSelectedPower(powerId);
    setIsAnswered(true);
    setIsActive(false);
    setIsAiFeedbackLoading(true);

    const correctPowerId = currentChallenge.correctPowerId;
    const isCorrect = powerId === correctPowerId;

    let pointsAwarded = 0;
    let nextUnlockedList = [...unlockedPowers];

    if (isCorrect) {
      pointsAwarded = QuizService.calculatePoints(timeLeft);
      if (powerId && !nextUnlockedList.includes(powerId)) {
        nextUnlockedList.push(powerId);
      }
    }

    const nextScore = score + pointsAwarded;
    setScore(nextScore);

    // Sync progress to cloud database immediately via callback
    await onSaveProgress(nextScore, nextUnlockedList);

    // Call AI feedback service with static text fallback
    try {
      // Find power details for names
      const correctText = `Habilidade #${correctPowerId}`;
      const selectedText = powerId ? `Habilidade #${powerId}` : 'Nenhuma/Tempo Esgotado';
      
      const feedback = await QuizService.fetchQuizFeedback(
        currentChallenge.scenario,
        correctText,
        selectedText,
        selectedLevel || 'INICIANTE'
      );
      setAiFeedback(feedback);
    } catch (err) {
      console.warn('UI fall-back using local static explanation:', err);
      setAiFeedback(currentChallenge.explanation);
    } finally {
      setIsAiFeedbackLoading(false);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < levelChallenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
      startChallengeTimer();
      return true;
    }
    return false; // Level is complete
  };

  const resetQuizState = () => {
    setSelectedLevel(null);
    setLevelChallenges([]);
    setCurrentChallengeIndex(0);
    setScore(0);
    setSelectedPower(null);
    setIsAnswered(false);
    setAiFeedback(null);
    setIsActive(false);
  };

  return {
    selectedLevel,
    setSelectedLevel,
    levelChallenges,
    currentChallengeIndex,
    currentChallenge,
    score,
    selectedPower,
    isAnswered,
    timeLeft,
    aiFeedback,
    isAiFeedbackLoading,
    startChallengeTimer,
    handleSelection,
    nextChallenge,
    resetQuizState,
  };
}
