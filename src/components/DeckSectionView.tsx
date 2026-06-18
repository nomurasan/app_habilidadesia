import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Mission, GameState } from '../types';
import { AI_POWERS, AIPower } from '../data/powers';
import { SuperPowerCard } from './SuperPowerCard';

interface DeckSectionViewProps {
  isSelectingForMission: boolean;
  setIsSelectingForMission: (val: boolean) => void;
  selectedMission: Mission | null;
  missionCards: Record<string, string[]>;
  setMissionCards: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setViewingPower: (power: AIPower | null) => void;
  setGameState: (state: GameState) => void;
  setActiveVideo: (video: { title: string; url: string } | null) => void;
  gameState: GameState;
}

export const DeckSectionView: React.FC<DeckSectionViewProps> = ({
  isSelectingForMission,
  setIsSelectingForMission,
  selectedMission,
  missionCards,
  setMissionCards,
  setViewingPower,
  setGameState,
  setActiveVideo,
}) => {
  const selectedCount = selectedMission
    ? (missionCards[selectedMission.id] || []).length
    : 0;

  const currentSelectionList = selectedMission
    ? missionCards[selectedMission.id] || []
    : [];

  return (
    <motion.div
      key="deck-section-component"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[1400px] mx-auto space-y-12 mb-20 p-4 md:p-8 font-sans"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4 text-center lg:text-left">
          <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-sans">
            {isSelectingForMission ? 'Selecione até 4 Competências' : 'Seu Deck de Competências'}
          </h3>
          <p className="text-zello-orange font-bold uppercase tracking-widest text-xs mt-2 select-none font-mono">
            {isSelectingForMission
              ? `${selectedCount}/4 competências selecionadas para esta missão`
              : `Explore as ${AI_POWERS.length} competências estratégicas de liderança e IA`}
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {isSelectingForMission && (
              <button
                onClick={() => {
                  setIsSelectingForMission(false);
                  setGameState('missions');
                }}
                className="px-8 py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(240,90,40,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-sans"
              >
                Confirmar Seleção
              </button>
            )}
            <button
              onClick={() => {
                setIsSelectingForMission(false);
                setGameState(isSelectingForMission ? 'missions' : 'home');
              }}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer font-sans"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Mestre Nomura Coach Deck Video Box */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/15 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07] text-left">
          <div className="relative shrink-0 select-none">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-zello-orange to-yellow-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative w-24 h-24 rounded-full border-2 border-zello-orange overflow-hidden shadow-[0_0_25px_rgba(240,90,40,0.4)] bg-zinc-950 flex items-center justify-center">
              <img
                src="/Mestre Nomura.png"
                alt="Mestre Nomura"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zello-orange/15 to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <LucideIcons.Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                Jedi Mentor
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5 font-sans">Mestre Nomura</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
              "As competências profissionais sintonizam a Força ao seu sabre de luz. Aprenda a equilibrá-las de modo a guiar propostas seguras e criativas!"
            </p>

            <div className="pt-2">
              <button
                onClick={() =>
                  setActiveVideo({
                    title: 'Como Funciona o Deck?',
                    url: 'https://www.youtube.com/embed/Ko8iu2LiH-4?rel=0',
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn font-sans"
              >
                <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                Como Funciona o Deck?
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {AI_POWERS.map((power, idx) => {
          const isSelected = selectedMission && currentSelectionList.includes(power.id);
          const isFull = selectedMission && currentSelectionList.length >= 4;

          return (
            <div
              key={`dk-card-f-${power.id}-${idx}`}
              className={`relative cursor-pointer transition-all duration-300 active:scale-98 select-none ${
                isSelected ? 'scale-[1.02]' : ''
              }`}
              onClick={() => {
                if (isSelectingForMission && selectedMission) {
                  const current = missionCards[selectedMission.id] || [];
                  if (current.includes(power.id)) {
                    setMissionCards((prev) => ({
                      ...prev,
                      [selectedMission.id]: current.filter((id) => id !== power.id),
                    }));
                  } else if (current.length < 4) {
                    setMissionCards((prev) => ({
                      ...prev,
                      [selectedMission.id]: [...current, power.id],
                    }));
                  }
                } else {
                  setViewingPower(power);
                }
              }}
            >
              <SuperPowerCard
                power={power}
                isLocked={false}
                onClick={() => {
                  if (!isSelectingForMission) {
                    setViewingPower(power);
                  }
                }}
                onConsult={() => {
                  setViewingPower(power);
                }}
              />
              {isSelectingForMission && (
                <div
                  className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-zello-orange border-white text-white rotate-0'
                      : 'bg-zello-black/40 border-white/20 text-transparent rotate-90'
                  }`}
                >
                  <LucideIcons.Check size={20} />
                </div>
              )}
              {isSelectingForMission && isFull && !isSelected && (
                <div className="absolute inset-0 bg-zello-black/60 z-10 rounded-[32px] pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
