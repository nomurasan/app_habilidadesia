import { RankInfo } from '../types';

export const RANKS: Record<string, RankInfo> = {
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

export const getRank = (xp: number): RankInfo => {
  if (xp <= 3000) return RANKS.PADAWAN;
  if (xp <= 7500) return RANKS.JEDI;
  return RANKS.YODA;
};
