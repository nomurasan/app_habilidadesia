import { useState, useEffect, useRef } from 'react';
import { Challenge } from '../types';
import { QuizService } from '../services/QuizService';

export function useQuiz(
  unlockedPowers: string[],
  onSaveProgress: (newScore: number, updatedUnlocked: string[]) => Promise<void>
) {
  const [selectedLevel, setSelectedLevel] = useState<'PADAWAN' | 'JEDI' | 'YODA' | null>(null);
  const [levelChallenges, setLevelChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
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
      setSelectedSkillIds([]);
      setIsAnswered(false);
      setIsAnsweredCorrectly(false);
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
      // Time-out: submit current selection (even if empty) automatically
      confirmAnswers();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft, isAnswered]);

  const startChallengeTimer = () => {
    setTimeLeft(60);
    setIsAnswered(false);
    setIsAnsweredCorrectly(false);
    setSelectedSkillIds([]);
    setAiFeedback(null);
    setIsActive(true);
  };

  const toggleSkillId = (skillId: number) => {
    if (isAnswered) return;
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const confirmAnswers = async () => {
    if (isAnswered || !currentChallenge) return;

    setIsAnswered(true);
    setIsActive(false);
    setIsAiFeedbackLoading(true);

    // Calculate if correct
    const allCorrectSelected = currentChallenge.correctSkillIds.every((id) =>
      selectedSkillIds.includes(id)
    );
    const noIncorrectSelected = !currentChallenge.incorrectSkillIds.some((id) =>
      selectedSkillIds.includes(id)
    );
    
    // Exact match rule: all correct selected, none of incorrect selected
    const correct = allCorrectSelected && noIncorrectSelected;
    setIsAnsweredCorrectly(correct);

    let pointsAwarded = 0;
    const nextUnlockedList = [...unlockedPowers];

    if (correct) {
      pointsAwarded = QuizService.calculatePoints(timeLeft);
      // Unlock all the correct power/skill IDs
      currentChallenge.correctSkillIds.forEach((id) => {
        const idStr = String(id);
        if (!nextUnlockedList.includes(idStr)) {
          nextUnlockedList.push(idStr);
        }
      });
    }

    const nextScore = score + pointsAwarded;
    setScore(nextScore);

    // Sync progress to cloud database immediately via callback
    await onSaveProgress(nextScore, nextUnlockedList);

    // Call AI feedback service with static text fallback
    try {
      const correctText = currentChallenge.correctSkillIds.map((id) => `Habilidade #${id}`).join(', ');
      const selectedText = selectedSkillIds.length > 0
        ? selectedSkillIds.map((id) => `Habilidade #${id}`).join(', ')
        : 'Nenhuma/Tempo Esgotado';

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
    setSelectedSkillIds([]);
    setIsAnswered(false);
    setIsAnsweredCorrectly(false);
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
    selectedSkillIds,
    toggleSkillId,
    isAnswered,
    isAnsweredCorrectly,
    timeLeft,
    aiFeedback,
    isAiFeedbackLoading,
    startChallengeTimer,
    confirmAnswers,
    nextChallenge,
    resetQuizState,
  };
}
