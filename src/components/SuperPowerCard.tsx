import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, AIPower } from '../data/powers';
import * as LucideIcons from 'lucide-react';

interface SuperPowerCardProps {
  power: AIPower;
  isLocked?: boolean;
  onClick?: () => void;
  onConsult?: () => void;
}

export const SuperPowerCard: React.FC<SuperPowerCardProps> = ({ power, isLocked = false, onClick, onConsult }) => {
  const IconComponent = (LucideIcons as any)[power.icon] || LucideIcons.Zap;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative w-full min-h-[220px] group cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 bg-zello-black shadow-2xl transition-all duration-500 group-hover:border-zello-orange/50 group-hover:shadow-[0_0_40px_rgba(240,90,40,0.2)]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={power.image} 
            alt={power.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zello-black via-zello-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zello-black/90 via-zello-black/20 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full p-8 flex flex-col justify-between z-10">
          {/* Top Section: Category, Icon & Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zello-orange/20 backdrop-blur-md border border-zello-orange/30 flex items-center justify-center text-zello-orange shadow-[0_0_20px_rgba(240,90,40,0.3)] group-hover:bg-zello-orange group-hover:text-white transition-all duration-300">
                <IconComponent size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{power.category}</span>
                </div>
                <div className="flex items-center gap-1.5 pl-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-zello-orange uppercase tracking-[0.2em] leading-none">Habilidade</span>
                  <span className="text-sm font-black text-white italic tracking-tighter leading-none">#{power.id.padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Title, Objective and Details button */}
          <div className="space-y-4 max-w-full relative">
            <div className={`space-y-1 ${onConsult ? 'pr-24' : ''}`}>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-zello-orange transition-colors">
                {power.title}
              </h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {power.objective}
              </p>
            </div>

            {onConsult && (
              <div className="absolute bottom-0 right-0 z-30">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConsult();
                  }}
                  className="px-3 py-1.5 bg-zello-orange text-white hover:brightness-110 active:scale-95 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_15px_rgba(240,90,40,0.4)]"
                >
                  <LucideIcons.Eye size={11} />
                  Detalhes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-20"></div>
        
        {/* Holographic Glow Border */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-zello-orange/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
      </div>
    </motion.div>
  );
};
