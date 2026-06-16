import { useState } from 'react';
import { Mission } from '../data/missions';
import { MissionService } from '../services/MissionService';
import { AIPower } from '../data/powers';
import { AppError } from '../utils/errors';

export function useMissions(
  onSaveProgress: (missionId: string, isCompleted: boolean) => Promise<void>
) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionCards, setMissionCards] = useState<Record<string, string[]>>({});
  const [userExplanations, setUserExplanations] = useState<Record<string, string>>({});
  const [advisorResponses, setAdvisorResponses] = useState<Record<string, string>>({});
  
  const [isAskingAdvisor, setIsAskingAdvisor] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isPresentingDeck, setIsPresentingDeck] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeMissionsList] = useState<Mission[]>(() => MissionService.getMissions());

  // Slot handlers
  const handleSlotToggle = (missionId: string, powerId: string) => {
    const currentList = missionCards[missionId] || [];
    if (currentList.includes(powerId)) {
      setMissionCards({
        ...missionCards,
        [missionId]: currentList.filter((id) => id !== powerId),
      });
    } else if (currentList.length < 4) {
      setMissionCards({
        ...missionCards,
        [missionId]: [...currentList, powerId],
      });
    }
  };

  const handleExplanationChange = (missionId: string, text: string) => {
    setUserExplanations({
      ...userExplanations,
      [missionId]: text,
    });
  };

  const askAdvisor = async (powers: AIPower[]) => {
    if (!selectedMission) return;
    setIsAskingAdvisor(true);
    try {
      const explanation = userExplanations[selectedMission.id] || '';
      const response = await MissionService.fetchAdvisorAdvice(
        selectedMission,
        powers,
        explanation
      );
      setAdvisorResponses({
        ...advisorResponses,
        [selectedMission.id]: response,
      });
      setIsAdvisorModalOpen(true);
    } catch (err: any) {
      console.error('Advisor request error:', err);
      throw err;
    } finally {
      setIsAskingAdvisor(false);
    }
  };

  const rewriteNarrative = async (powers: AIPower[]) => {
    if (!selectedMission) return;
    setIsRewriting(true);
    try {
      const currentText = userExplanations[selectedMission.id] || '';
      const response = await MissionService.fetchRewrittenNarrative(
        selectedMission,
        powers,
        currentText
      );
      setUserExplanations({
        ...userExplanations,
        [selectedMission.id]: response,
      });
    } catch (err: any) {
      console.error('Narrative rewriting call failed:', err);
      throw err;
    } finally {
      setIsRewriting(false);
    }
  };

  const completeMission = async () => {
    if (!selectedMission) return;
    setIsSaving(true);
    try {
      await onSaveProgress(selectedMission.id, true);
    } catch (err) {
      console.error('Failed completing mission:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedMission,
    setSelectedMission,
    missionCards,
    setMissionCards,
    userExplanations,
    setUserExplanations,
    advisorResponses,
    setAdvisorResponses,
    isAskingAdvisor,
    isRewriting,
    isAdvisorModalOpen,
    setIsAdvisorModalOpen,
    isPresentingDeck,
    setIsPresentingDeck,
    isSaving,
    activeMissionsList,
    handleSlotToggle,
    handleExplanationChange,
    askAdvisor,
    rewriteNarrative,
    completeMission,
  };
}
