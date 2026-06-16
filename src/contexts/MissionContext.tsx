import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { useMissions } from '../hooks/useMissions';
import { Mission } from '../types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MissionContextType {
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
  missionCards: Record<string, string[]>;
  setMissionCards: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  userExplanations: Record<string, string>;
  setUserExplanations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  advisorResponses: Record<string, string>;
  setAdvisorResponses: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isAskingAdvisor: boolean;
  isRewriting: boolean;
  isAdvisorModalOpen: boolean;
  setIsAdvisorModalOpen: (open: boolean) => void;
  isPresentingDeck: boolean;
  setIsPresentingDeck: (presenting: boolean) => void;
  isSaving: boolean;
  activeMissionsList: Mission[];
  handleSlotToggle: (missionId: string, powerId: string) => void;
  handleExplanationChange: (missionId: string, text: string) => void;
  askAdvisor: (powers: any[]) => Promise<void>;
  rewriteNarrative: (powers: any[]) => Promise<void>;
  completeMission: () => Promise<void>;
  completedMissions: Record<string, boolean>;
  setCompletedMissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuthContext();
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userProfile?.missionProgress) {
      const progress = userProfile.missionProgress;
      const newCompleted: Record<string, boolean> = {};
      Object.keys(progress).forEach((missionId) => {
        newCompleted[missionId] = true;
      });
      setCompletedMissions(newCompleted);
    } else {
      setCompletedMissions({});
    }
  }, [userProfile]);

  const handleSaveProgress = async (missionId: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    // Dynamic update matching actual schema saved
    await updateDoc(userDocRef, {
      [`missionProgress.${missionId}`]: {
        cards: missionsState.missionCards[missionId] || [],
        explanation: missionsState.userExplanations[missionId] || '',
        updatedAt: new Date().toISOString(),
      },
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setCompletedMissions((prev) => ({ ...prev, [missionId]: true }));
  };

  const missionsState = useMissions(handleSaveProgress);

  return (
    <MissionContext.Provider
      value={{
        ...missionsState,
        completedMissions,
        setCompletedMissions,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMissionContext = () => {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMissionContext must be used within a MissionProvider');
  }
  return context;
};
