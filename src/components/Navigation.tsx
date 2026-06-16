import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Zap, Menu, X, ChevronRight } from 'lucide-react';
import { getRank } from '../constants';
import { Company, GameState } from '../types';

interface NavigationProps {
  score: number;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  currentCompany: Company | null;
  isAdmin: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  score,
  gameState,
  setGameState,
  currentCompany,
  isAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}) => {
  const currentRank = getRank(score);

  return (
    <>
      <nav id="top-navigation" className="h-20 border-b border-white/5 px-6 md:px-12 flex items-center justify-between bg-zello-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setGameState('home')}>
          <div className="w-10 h-10 bg-zello-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(240,90,40,0.4)]">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter leading-none text-white font-sans">JORNADA JEDI</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-zello-orange uppercase tracking-widest leading-none">A FORÇA ESTÁ COM VOCÊ</span>
              {currentCompany && (
                <>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">{currentCompany.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 animate-fade-in">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setGameState('deck')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer ${gameState === 'deck' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Deck
            </button>
            <button
              onClick={() => setGameState('level-selection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer ${gameState === 'level-selection' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Quizzes
            </button>
            <button
              onClick={() => setGameState('missions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer ${gameState === 'missions' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Missões
            </button>
            <button
              onClick={() => setGameState('dashboards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer ${gameState === 'dashboards' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Dashboard
            </button>
            {isAdmin && (
              <button
                onClick={() => setGameState('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer ${gameState === 'admin' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                Admin
              </button>
            )}
          </div>
          <button
            onClick={onLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            Sair
          </button>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-zello-orange font-bold uppercase tracking-widest leading-none">Rank Atual</span>
            <span className={`text-sm font-black uppercase italic ${currentRank.color}`}>{currentRank.name}</span>
          </div>
          <div className="hidden md:flex flex-col items-center px-4 py-2 bg-zello-orange/10 rounded-2xl border border-zello-orange/20 min-w-[100px] select-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zello-orange/60 leading-none">XP Total</span>
            <span className="text-lg font-black text-zello-orange tabular-nums">{score.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed top-20 left-0 right-0 bottom-0 bg-zello-black/95 backdrop-blur-md border-b border-white/5 flex flex-col justify-between py-8 px-6 overflow-y-auto z-40"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setGameState('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'home' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <span>Início</span>
                <ChevronRight size={16} className={gameState === 'home' ? 'text-zello-orange' : 'text-slate-500'} />
              </button>

              <button
                onClick={() => {
                  setGameState('deck');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'deck' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <span>Deck</span>
                <ChevronRight size={16} className={gameState === 'deck' ? 'text-zello-orange' : 'text-slate-500'} />
              </button>

              <button
                onClick={() => {
                  setGameState('level-selection');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'level-selection' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <span>Quizzes</span>
                <ChevronRight size={16} className={gameState === 'level-selection' ? 'text-zello-orange' : 'text-slate-500'} />
              </button>

              <button
                onClick={() => {
                  setGameState('missions');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'missions' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <span>Missões</span>
                <ChevronRight size={16} className={gameState === 'missions' ? 'text-zello-orange' : 'text-slate-500'} />
              </button>

              <button
                onClick={() => {
                  setGameState('dashboards');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'dashboards' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <span>Dashboard</span>
                <ChevronRight size={16} className={gameState === 'dashboards' ? 'text-zello-orange' : 'text-slate-500'} />
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setGameState('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${gameState === 'admin' ? 'bg-zello-orange/10 border border-zello-orange/30 text-zello-orange' : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'}`}
                >
                  <span>Admin</span>
                  <ChevronRight size={16} className={gameState === 'admin' ? 'text-zello-orange' : 'text-slate-500'} />
                </button>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nível Jedi</span>
                <span className={`text-sm font-black uppercase italic ${currentRank.color}`}>{currentRank.name}</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-black uppercase tracking-wider text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={14} />
                Encerrar Sessão
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
