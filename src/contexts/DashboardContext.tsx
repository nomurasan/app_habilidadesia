import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { TeamStats, UserProfile } from '../types';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AI_POWERS } from '../data/powers';
import { useAIReport } from '../hooks/useAIReport';

interface DashboardContextType {
  teamStats: TeamStats | null;
  loading: boolean;
  companyUsersList: UserProfile[];
  reportText: string | null;
  isGeneratingReport: boolean;
  reportError: string | null;
  generateUserReport: () => Promise<string>;
  clearUserReport: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuthContext();
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [companyUsersList, setCompanyUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    reportText,
    isGenerating: isGeneratingReport,
    reportError,
    generateReport,
    clearReport,
  } = useAIReport();

  useEffect(() => {
    if (!userProfile?.companyId) {
      setTeamStats(null);
      setCompanyUsersList([]);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'users'), where('companyId', '==', userProfile.companyId));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const teamUsers = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          userId: doc.id,
        }) as UserProfile);

        setCompanyUsersList(teamUsers);

        const totalXp = teamUsers.reduce((sum, u) => sum + (u.xp || 0), 0);

        const maturityMap: Record<string, number> = {
          'Produtividade': 0,
          'Criatividade': 0,
          'Automação': 0,
          'Comunicação': 0,
          'Estratégia': 0,
          'Ética/IA': 0,
        };

        teamUsers.forEach((u) => {
          const powers = u.unlockedPowers || [];
          const missions = Object.keys(u.missionProgress || {}).length;
          maturityMap['Produtividade'] += Math.min(80, powers.length * 5 + 30);
          maturityMap['Criatividade'] += Math.min(85, missions * 10 + 20);
          maturityMap['Automação'] += Math.min(75, powers.filter((p) => ['9', '10', '11'].includes(p)).length * 15 + 20);
          maturityMap['Comunicação'] += Math.min(90, powers.filter((p) => ['1', '2', '6', '8'].includes(p)).length * 15 + 30);
          maturityMap['Estratégia'] += Math.min(70, (u.xp || 0) / 200 + 10);
          maturityMap['Ética/IA'] += 85;
        });

        const userCount = teamUsers.length || 1;
        const teamMaturity = Object.keys(maturityMap).map((subject) => ({
          subject,
          A: Math.round(maturityMap[subject] / userCount),
        }));

        const powerFreq: Record<string, number> = {};
        teamUsers.forEach((u) => {
          (u.unlockedPowers || []).forEach((p) => {
            powerFreq[p] = (powerFreq[p] || 0) + 1;
          });
        });

        const topSkills = Object.entries(powerFreq)
          .map(([id, count]) => ({
            id,
            name: AI_POWERS.find((p) => p.id === id)?.title || id,
            count: Math.round((count / userCount) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const teamEvolution = [
          { name: 'Início', xp: 0 },
          { name: 'Meio', xp: Math.round(totalXp / 2) },
          { name: 'Hoje', xp: totalXp },
        ];

        setTeamStats({
          totalXp,
          teamMaturity,
          teamSkillDist: [],
          teamEvolution,
          topSkills,
        });
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userProfile?.companyId]);

  const generateUserReport = async () => {
    if (!user || !userProfile) throw new Error('User not registered or not loaded');
    const completedMissions: Record<string, boolean> = {};
    if (userProfile.missionProgress) {
      Object.keys(userProfile.missionProgress).forEach((missionId) => {
        completedMissions[missionId] = true;
      });
    }

    return generateReport({
      email: userProfile.email,
      xp: userProfile.xp || 0,
      unlockedPowers: userProfile.unlockedPowers || [],
      completedMissions,
      skillsSurvey: userProfile.skillsSurvey || null,
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        teamStats,
        loading,
        companyUsersList,
        reportText,
        isGeneratingReport,
        reportError,
        generateUserReport,
        clearUserReport: clearReport,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
