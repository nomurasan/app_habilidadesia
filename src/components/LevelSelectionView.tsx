import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { GameState } from '../types';
import { RANKS } from '../constants';

interface LevelSelectionViewProps {
  questionCount: number;
  setQuestionCount: (count: number) => void;
  startLevel: (level: 'PADAWAN' | 'JEDI' | 'YODA') => void;
  setGameState: (state: GameState) => void;
  setActiveVideo: (video: { title: string; url: string } | null) => void;
  completedQuizzes?: string[];
}

export const LevelSelectionView: React.FC<LevelSelectionViewProps> = ({
  questionCount,
  setQuestionCount,
  startLevel,
  setGameState,
  setActiveVideo,
  completedQuizzes = [],
}) => {
  const isLevelLocked = (level: 'PADAWAN' | 'JEDI' | 'YODA') => {
    if (level === 'PADAWAN') return false;
    if (level === 'JEDI') {
      return !completedQuizzes.includes('PADAWAN');
    }
    if (level === 'YODA') {
      return !completedQuizzes.includes('JEDI') || !completedQuizzes.includes('PADAWAN');
    }
    return false;
  };

  return (
    <motion.div
      key="level-selection-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-12"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4 text-center lg:text-left flex-1">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-sans">
            Escolha seu Quiz
          </h2>
          <p className="text-slate-400 font-medium">Selecione o nível de dificuldade e a quantidade de perguntas</p>

          <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 w-full sm:w-auto">
              <span className="text-xs font-black uppercase tracking-widest text-zello-orange shrink-0 select-none">
                Nº PERGUNTAS:
              </span>
              <div className="flex items-center gap-2 select-none justify-center">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={`q-count-${num}`}
                    onClick={() => setQuestionCount(num)}
                    className={`w-10 h-10 rounded-xl font-black transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]'
                        : 'bg-white/5 text-slate-500 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="ml-4 accent-zello-orange cursor-pointer"
                />
                <span className="w-8 text-center font-black text-zello-orange tabular-nums">{questionCount}</span>
              </div>
            </div>

            <button
              onClick={() => setGameState('home')}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer active:scale-95 font-sans"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Mestre Nomura Coach Video Card */}
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
              "Dê o primeiro passo para testar seus conhecimentos. O aprendizado real vem dos desafios superados. Que a força esteja com você!"
            </p>

            <div className="pt-2">
              <button
                onClick={() =>
                  setActiveVideo({
                    title: 'Como Funciona o Quiz?',
                    url: 'https://www.youtube.com/embed/ImwqltRINI8?rel=0',
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn font-sans"
              >
                <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                Como Funciona o Quiz?
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
        {(['PADAWAN', 'JEDI', 'YODA'] as const).map((level, lIdx) => {
          const locked = isLevelLocked(level);
          return (
            <button
              key={`lvl-sel-final-${level}-${lIdx}`}
              disabled={locked}
              onClick={() => startLevel(level)}
              className={`group relative flex flex-col items-center gap-6 p-10 rounded-[32px] border transition-all duration-500 overflow-hidden text-center ${
                locked
                  ? 'border-white/5 bg-white/2 opacity-40 cursor-not-allowed filter grayscale'
                  : 'bg-white/5 border-white/10 hover:border-zello-orange/50 cursor-pointer active:scale-98'
              }`}
            >
              {!locked && (
                <div className="absolute inset-0 bg-gradient-to-b from-zello-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
              <div className={`w-32 h-32 rounded-full border-4 border-zello-orange/20 p-2 overflow-hidden bg-zello-black/40 ${!locked ? 'group-hover:scale-110' : ''} transition-transform`}>
                <img
                  src={RANKS[level].image}
                  alt={RANKS[level].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-center relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`text-2xl font-black uppercase italic transition-colors font-sans ${RANKS[level].color}`}>
                    {RANKS[level].name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                    {RANKS[level].description}
                  </p>
                </div>
                {locked && (
                  <p className="text-xs font-bold text-zello-orange mt-4 flex items-center justify-center gap-1.5">
                    <LucideIcons.Lock size={12} className="shrink-0" />
                    <span>
                      {level === 'JEDI'
                        ? 'Requer 100% de acertos no Quiz Padawan'
                        : 'Requer 100% de acertos no Quiz Jedi'}
                    </span>
                  </p>
                )}
              </div>
              <div className={`mt-4 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest font-sans transition-colors ${
                locked
                  ? 'border-white/5 text-slate-600'
                  : 'border-white/10 text-slate-500 group-hover:text-zello-orange group-hover:border-zello-orange'
              }`}>
                {locked ? 'Bloqueado' : 'Iniciar Quiz'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setGameState('home')}
          className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer font-sans"
        >
          Voltar ao Início
        </button>
      </div>
    </motion.div>
  );
};
