import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Play, LayoutGrid, Gamepad2, Target, BarChart2, Shield, ChevronRight } from 'lucide-react';
import { GameState } from '../types';

interface HomeSectionViewProps {
  score: number;
  setGameState: (state: GameState) => void;
  setActiveVideo: (video: { title: string; url: string } | null) => void;
}

export const HomeSectionView: React.FC<HomeSectionViewProps> = ({
  score,
  setGameState,
  setActiveVideo,
}) => {
  return (
    <motion.div
      key="home-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="min-h-full flex flex-col items-center justify-center p-8 text-center space-y-12 max-w-4xl mx-auto"
    >
      <div className="space-y-6">
        {/* Mobile XP Total element */}
        <div className="md:hidden inline-flex flex-col items-center px-6 py-2 bg-zello-orange/10 rounded-2xl border border-zello-orange/20 min-w-[125px] max-w-fit mx-auto mb-4 select-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zello-orange/60 leading-none">XP Total</span>
          <span className="text-xl font-black text-zello-orange tabular-nums mt-1">{score.toLocaleString()}</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-xs font-black uppercase tracking-widest">
          <Star size={14} className="fill-zello-orange" />
          Jornada de Aprendizado
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase italic font-sans">
          DOMINE A <br /> <span className="text-zello-orange">FORÇA DA IA</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Três dimensões para você explorar: Deck de Habilidades, Quizzes de Conhecimento e Missões Táticas.
        </p>

        <div className="flex justify-center pt-2 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07]">
            <div className="relative shrink-0">
              {/* Outer spinning ring / glow */}
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

              {/* Lightsaber Active Badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5">Mestre Nomura</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                "Treine a sua mente e domine o poder da inteligência artificial para conquistar novos patamares!"
              </p>

              <div className="pt-2">
                <button
                  onClick={() =>
                    setActiveVideo({
                      title: 'Como Funciona a Jornada?',
                      url: 'https://www.youtube.com/embed/vq01pL4Hjoc?rel=0',
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn font-sans"
                >
                  <Play size={10} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                  Como Funciona a Jornada?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <button
          onClick={() => setGameState('deck')}
          className="group relative flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-98"
        >
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
            <LayoutGrid size={120} />
          </div>
          <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors">
            <LayoutGrid className="text-slate-400 group-hover:text-zello-orange" size={32} />
          </div>
          <div className="text-left select-none">
            <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white font-sans">Deck</div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Colecione Habilidades</div>
          </div>
        </button>

        <button
          onClick={() => setGameState('level-selection')}
          className="group relative flex flex-col items-start gap-4 p-8 bg-zello-orange hover:brightness-110 rounded-3xl transition-all duration-300 shadow-[0_0_50px_-10px_rgba(240,90,40,0.4)] border border-white/20 overflow-hidden cursor-pointer active:scale-98"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform pointer-events-none">
            <Gamepad2 size={120} />
          </div>
          <div className="p-4 bg-white/10 rounded-2xl">
            <Gamepad2 className="text-white" size={32} />
          </div>
          <div className="text-left relative z-10 select-none">
            <div className="font-black text-3xl uppercase italic tracking-tighter text-white font-sans">Quizzes</div>
            <div className="text-white/80 font-semibold text-xs uppercase tracking-wider mt-1">Acumule XP e Ranks</div>
          </div>
        </button>

        <button
          onClick={() => setGameState('missions')}
          className="group relative flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-98"
        >
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
            <Target size={120} />
          </div>
          <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors">
            <Target className="text-slate-400 group-hover:text-zello-orange" size={32} />
          </div>
          <div className="text-left select-none">
            <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white font-sans">Missões</div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Resolução de Casos</div>
          </div>
        </button>

        <button
          onClick={() => setGameState('dashboards')}
          className="md:col-span-3 group relative flex items-center justify-between gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden text-left cursor-pointer active:scale-99"
        >
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
            <BarChart2 size={120} />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors shrink-0">
              <BarChart2 className="text-slate-400 group-hover:text-zello-orange" size={32} />
            </div>
            <div>
              <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white font-sans">Dashboard Executivo</div>
              <div className="text-slate-500 font-medium text-sm leading-relaxed mt-1 max-w-xl">
                Monitore o diagnóstico de competências da equipe, analise a maturidade média e gere relatórios com IA.
              </div>
            </div>
          </div>
          <ChevronRight size={24} className="text-slate-600 group-hover:translate-x-1 transition-transform group-hover:text-zello-orange" />
        </button>
      </div>
    </motion.div>
  );
};
