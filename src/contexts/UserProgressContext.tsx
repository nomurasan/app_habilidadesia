import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { RankInfo } from '../types';

interface UserProgressContextType {
  xp: number;
  rank: RankInfo;
  unlockedPowers: string[];
  awardXP: (points: number) => Promise<void>;
  unlockPower: (powerId: string, costXp?: number) => Promise<void>;
}

const RANKS = {
  PADAWAN: {
    name: 'Padawan',
    image: 'https://static.wikia.nocookie.net/starwars/images/5/59/ObiWan.png',
    description: 'Dia 1: Descobrindo a IA e suas habilidades iniciais.',
    color: 'text-orange-400'
  },
  JEDI: {
    name: 'Jedi',
    image: 'https://static.wikia.nocookie.net/starwars/images/3/3d/LukeSkywalker.png',
    description: 'Dia 2: Aplicando a IA no trabalho e processos do dia a dia.',
    color: 'text-orange-500'
  },
  YODA: {
    name: 'Mestre Yoda',
    image: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
    description: 'Dia 3: Pensando a IA de forma estratégica e imaginando o futuro.',
    color: 'text-emerald-400'
  }
};

const getRank = (xp: number): RankInfo => {
  if (xp <= 3000) return RANKS.PADAWAN;
  if (xp <= 7500) return RANKS.JEDI;
  return RANKS.YODA;
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, awardXP, unlockPower } = useAuthContext();
  const [xp, setXp] = useState(0);
  const [unlockedPowers, setUnlockedPowers] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile) {
      setXp(userProfile.xp || 0);
      setUnlockedPowers(userProfile.unlockedPowers || []);
    }
  }, [userProfile]);

  const rank = getRank(xp);

  return (
    <UserProgressContext.Provider
      value={{
        xp,
        rank,
        unlockedPowers,
        awardXP,
        unlockPower
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgressContext = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgressContext must be used within a UserProgressProvider');
  }
  return context;
};
