import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Challenge } from '../types';
import { AI_POWERS, AIPower } from '../data/powers';

interface QuizSectionViewProps {
  levelChallenges: Challenge[];
  currentChallengeIndex: number;
  currentChallenge: Challenge | null;
  selectedLevel: 'PADAWAN' | 'JEDI' | 'YODA' | null;
  score: number;
  selectedPower: string | null;
  isAnswered: boolean;
  timeLeft: number;
  aiFeedback: string | null;
  isAiFeedbackLoading: boolean;
  handleSelection: (powerId: string) => void;
  nextChallenge: () => void;
  setActiveVideo: (video: { title: string; url: string } | null) => void;
}

export const QuizSectionView: React.FC<QuizSectionViewProps> = ({
  levelChallenges,
  currentChallengeIndex,
  currentChallenge,
  selectedLevel,
  score,
  selectedPower,
  isAnswered,
  timeLeft,
  aiFeedback,
  isAiFeedbackLoading,
  handleSelection,
  nextChallenge,
  setActiveVideo,
}) => {
  if (!currentChallenge) {
    return (
      <div className="p-12 text-center text-slate-400">
        Nenhum desafio carregado para este nível. Redirecionando...
      </div>
    );
  }

  // Pick options matching either the correct power or the challenge's distractors
  const options = AI_POWERS.filter((p) =>
    [currentChallenge.correctPowerId, ...(currentChallenge.distractors || [])].includes(p.id)
  );

  const correct = options.find((p) => p.id === currentChallenge.correctPowerId);
  const others = options.filter((p) => p.id !== currentChallenge.correctPowerId);

  // Uniquely deduplicate options to avoid key collision
  const finalOptions = Array.from(
    new Map([correct, ...others.slice(0, 5)].filter(Boolean).map((p) => [p!.id, p!])).values()
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <motion.div
      key="game-section-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-[1400px] mx-auto space-y-8 p-4 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-sans">
              Desafio: {currentChallenge.title || 'Caso Técnico'}
            </h3>
            <button
              onClick={() =>
                setActiveVideo({
                  title: 'Quizzes (Desafios)',
                  url: 'https://www.youtube.com/embed/cl00Nor2OAk?rel=0',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-zello-orange/30 text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer group font-sans"
            >
              <LucideIcons.Play size={8} className="fill-slate-400 group-hover:fill-white text-slate-400 group-hover:text-white" />
              Como Funciona o Quiz
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 select-none">
            {levelChallenges.map((_, idx) => (
              <div
                key={`ch-prog-dot-final-${selectedLevel}-${idx}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentChallengeIndex
                    ? 'w-12 bg-zello-orange'
                    : idx < currentChallengeIndex
                    ? 'w-6 bg-zello-orange/40'
                    : 'w-6 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-4 select-none ${
              timeLeft < 10 ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                timeLeft < 10 ? 'bg-red-500/20' : 'bg-zello-orange/20'
              }`}
            >
              <LucideIcons.Timer className={timeLeft < 10 ? 'text-red-500' : 'text-zello-orange'} size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Tempo</span>
              <span className={`text-lg font-black tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 select-none">
            <div className="w-8 h-8 rounded-full bg-zello-orange/20 flex items-center justify-center">
              <LucideIcons.Target className="text-zello-orange" size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Progresso</span>
              <span className="text-lg font-black text-white">
                {currentChallengeIndex + 1} / {levelChallenges.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-zello-orange"></div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 select-none">
                <div className="p-2 bg-zello-orange/10 rounded-lg">
                  <LucideIcons.ShieldAlert className="text-zello-orange" size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-zello-orange">Cenário de Operação</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold leading-tight text-white tracking-tight italic select-text font-sans">
                "{currentChallenge.scenario}"
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finalOptions.map((power, idx) => {
              const isCorrectBtn = power.id === currentChallenge.correctPowerId;
              const isSelectedBtn = selectedPower === power.id;
              
              return (
                <button
                  key={`game-opt-btn-${currentChallenge.id}-${power.id}-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleSelection(power.id)}
                  className={`
                    p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group h-32 flex flex-col justify-between cursor-pointer active:scale-98
                    ${
                      isAnswered && isCorrectBtn
                        ? 'bg-zello-orange/20 border-zello-orange ring-4 ring-zello-orange/20 shadow-[0_0_20px_rgba(240,90,40,0.4)]'
                        : isAnswered && isSelectedBtn && !isCorrectBtn
                        ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : isAnswered
                        ? 'bg-white/2 opacity-40 border-white/5'
                        : 'bg-white/5 border-white/10 hover:border-zello-orange/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="relative z-10 flex flex-col h-full justify-between select-none">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-zello-orange group-hover:text-white transition-colors ${
                        isAnswered && isCorrectBtn ? 'bg-zello-orange text-white' : ''
                      }`}
                    >
                      {React.createElement((LucideIcons as any)[power.icon] || LucideIcons.Zap, { size: 16 })}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        {power.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight font-sans">{power.title}</h4>
                    </div>
                  </div>
                  {isAnswered && isCorrectBtn && (
                    <div className="absolute top-4 right-4 text-zello-orange">
                      <LucideIcons.CheckCircle2 size={20} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-zello-orange text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 shrink-0 select-none">
                  {selectedPower === currentChallenge.correctPowerId ? (
                    <LucideIcons.Trophy size={32} />
                  ) : (
                    <LucideIcons.X size={32} />
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase italic leading-none font-sans">
                    {selectedPower === currentChallenge.correctPowerId ? 'Excelente, Jedi!' : 'Treine mais, Padawan!'}
                  </h4>
                  <p className="text-white/80 font-medium text-sm mt-2 max-w-xl">
                    {selectedPower === currentChallenge.correctPowerId
                      ? `Explicação: ${currentChallenge.explanation}`
                      : 'Essa não era a resposta ideal para este cenário. Estude o conselho do Mestre para se aperfeiçoar.'}
                  </p>
                </div>
              </div>
              <button
                onClick={nextChallenge}
                className="px-8 py-4 bg-white text-zello-orange font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-100 transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-lg font-sans"
              >
                {currentChallengeIndex === levelChallenges.length - 1 ? 'Finalizar Missão' : 'Próximo Desafio'}
              </button>
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block space-y-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl min-h-[220px] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange mb-4 select-none font-sans">Conselho do Mentor:</h4>
              <div className="min-h-[100px]">
                {isAiFeedbackLoading ? (
                  <div className="flex flex-col gap-2.5 animate-pulse select-none">
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                    <div className="h-3 bg-white/10 rounded w-5/6"></div>
                    <div className="h-3 bg-white/10 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400 leading-relaxed font-medium">
                    {isAnswered
                      ? aiFeedback || currentChallenge.explanation
                      : 'Para cada desafio, uma habilidade específica de IA deve ser aplicada. Analise os objetivos do caso corporativo antes de descarregar os seus poderes.'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5 select-none">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-500/20 relative border border-emerald-500/30">
                <img
                  src="/Mestre Nomura.png"
                  alt="Mestre Nomura"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {isAiFeedbackLoading && (
                  <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                    <LucideIcons.Loader2 className="text-white animate-spin" size={16} />
                  </div>
                )}
              </div>
              <span className="text-xs font-black text-white uppercase italic tracking-wider">Mestre Nomura</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
