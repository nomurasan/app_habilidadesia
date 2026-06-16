import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Zap,
  Target,
  Brain,
  Star,
  Users,
  BarChart3,
  BarChart2,
  TrendingUp,
  Shield,
  Lightbulb,
  MessageSquare,
  Cpu,
  Compass,
  ArrowUpRight,
  LayoutGrid,
  Quote,
  Loader2,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { AIPower, AI_POWERS, CATEGORIES } from '../data/powers';
import { Mission, MISSIONS } from '../data/missions';
import { auth } from '../lib/firebase';
import { TeamStats, TeamMaturityMetric } from '../types';

interface DashboardSectionProps {
  score: number;
  currentRank: { name: string; color: string; image: string };
  unlockedPowers: string[];
  completedMissions: Record<string, boolean>;
  missionCards: Record<string, string[]>;
  teamStats: TeamStats | null;
  userProfile?: {
    email: string;
    skillsSurvey?: Record<string, { current: number; target: number }>;
  } | null;
  onWatchVideo?: (title: string, url: string) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  score,
  currentRank,
  unlockedPowers,
  completedMissions,
  missionCards,
  teamStats,
  userProfile,
  onWatchVideo
}) => {
  // Mock data for charts - in a real app these would come from aggregate Firestore queries
  const maturityData = [
    { subject: 'Produtividade', A: Math.min(80, (unlockedPowers.length * 5) + 30), fullMark: 100 },
    { subject: 'Criatividade', A: Math.min(85, (Object.keys(completedMissions).length * 10) + 20), fullMark: 100 },
    { subject: 'Automação', A: Math.min(75, (unlockedPowers.filter(p => ['9', '10', '11'].includes(p)).length * 15) + 20), fullMark: 100 },
    { subject: 'Comunicação', A: Math.min(90, (unlockedPowers.filter(p => ['1', '2', '6', '8'].includes(p)).length * 15) + 30), fullMark: 100 },
    { subject: 'Estratégia', A: Math.min(70, (score / 200) + 10), fullMark: 100 },
    { subject: 'Ética/IA', A: 85, fullMark: 100 },
  ];

  const skillDistribution = Object.keys(CATEGORIES).map(cat => ({
    name: cat,
    value: unlockedPowers.filter(p => {
      const power = AI_POWERS.find(ap => ap.id === p);
      return power?.category === cat;
    }).length
  })).filter(c => c.value > 0);

  const teamEvolutionData = teamStats?.teamEvolution || [
    { name: 'Encontro 1', xp: 1200, maturity: 30 },
    { name: 'Encontro 2', xp: 3400, maturity: 45 },
    { name: 'Encontro 3', xp: 5100, maturity: 62 },
    { name: 'Encontro 4', xp: 7200, maturity: 78 },
  ];

  const topSkillsData = teamStats?.topSkills || [
    { name: 'ChatGPT', count: 45 },
    { name: 'Midjourney', count: 32 },
    { name: 'Gemini', count: 38 },
    { name: 'Claude', count: 25 },
    { name: 'Copilot', count: 41 },
  ];

  const xpEvolutionData = [
    { name: 'Day 1', xp: 400 },
    { name: 'Day 2', xp: 900 },
    { name: 'Day 3', xp: 1500 },
    { name: 'Day 4', xp: 2200 },
    { name: 'Day 5', xp: 2800 },
    { name: 'Day 6', xp: 3500 },
    { name: 'Day 7', xp: score },
  ];

  const COLORS = ['#F05A28', '#ff7b4d', '#ff9c7a', '#ffa500', '#ff8c00', '#ff4500'];

  const [activeTab, setActiveTab] = React.useState<'individual' | 'team'>('individual');
  const individualGradId = React.useMemo(() => `area-grad-ind-${Math.random().toString(36).substring(2, 9)}`, []);
  const teamGradId = React.useMemo(() => `area-grad-team-${Math.random().toString(36).substring(2, 9)}`, []);

  // Integrated AI diagnostic report generator State and Controllers
  const [relatorio, setRelatorio] = React.useState<string | null>(null);
  const [isLoadingRelatorio, setIsLoadingRelatorio] = React.useState<boolean>(false);
  const [errRelatorio, setErrRelatorio] = React.useState<string | null>(null);

  const formatBoldText = (text: string, lineIndex: number | string = '') => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`bold-${lineIndex}-${index}`} className="text-white font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return <span key={`text-${lineIndex}-${index}`}>{part}</span>;
    });
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return <h4 key={`h4-${i}`} className="text-lg font-black text-zello-orange uppercase italic mt-6 mb-3 border-b border-zello-orange/10 pb-1">{trimmed.replace('## ', '')}</h4>;
      }
      if (trimmed.startsWith('# ')) {
        return <h3 key={`h3-${i}`} className="text-xl font-black text-white uppercase italic mt-8 mb-4">{trimmed.replace('# ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        return (
          <li key={`li-${i}`} className="ml-4 list-disc text-slate-300 font-medium leading-relaxed my-1">
            {formatBoldText(content, `li-${i}`)}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={`empty-${i}`} className="h-2"></div>;
      }
      return <p key={`p-${i}`} className="text-slate-300 font-medium leading-relaxed my-2">{formatBoldText(trimmed, `p-${i}`)}</p>;
    });
  };

  const handleGerarRelatorio = async () => {
    setIsLoadingRelatorio(true);
    setErrRelatorio(null);
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch('/api/gerar-relatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          email: userProfile?.email || '',
          xp: score,
          unlockedPowers,
          completedMissions,
          skillsSurvey: userProfile?.skillsSurvey || {},
        }),
      });

      if (!response.ok) {
        throw new Error('Houve uma falha na calibração do Holocron ao tentar gerar o relatório.');
      }

      const data = await response.json();
      setRelatorio(data.relatorio);
    } catch (err: any) {
      console.error(err);
      setErrRelatorio(err.message || 'Erro de conexão com o servidor ao carregar relatório');
    } finally {
      setIsLoadingRelatorio(false);
    }
  };

  return (
    <div className="space-y-16 py-12">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center xl:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Trophy size={14} className="fill-zello-orange" />
            Central de Inteligência
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">DASHBOARDS <br /> <span className="text-zello-orange">DE EVOLUÇÃO</span></h2>
        </div>

        {/* Arte da Chamada do Vídeo do Mestre Nomura */}
        {onWatchVideo && (
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/15 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07] text-left">
            <div className="relative shrink-0">
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
                <Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
              </div>
            </div>
            
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5 font-sans">Mestre Nomura</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                "Os dados mostram o seu progresso na Força da IA. Entenda a sua evolução para direcionar melhor suas táticas."
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => onWatchVideo('Dashboard & Evolução', 'https://www.youtube.com/embed/FPt80Av44ug?rel=0')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn"
                >
                  <Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                  Como Funciona o Dashboard?
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-6 items-center xl:items-end w-full xl:w-auto shrink-0">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-zello-orange text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Participante
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-zello-orange text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Turma
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-end">
            <div className="px-6 py-4 bg-zello-orange text-white rounded-[24px] shadow-[0_0_40px_rgba(240,90,40,0.3)] min-w-[160px] group transition-all hover:scale-105">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-80 block mb-1">XP ACUMULADO</span>
              <div className="text-3xl font-black tabular-nums italic">{score.toLocaleString()}</div>
            </div>
            <div className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-[24px] min-w-[160px] transition-all hover:border-white/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">PADAWAN / JEDI</span>
              <div className={`text-3xl font-black italic ${currentRank.color}`}>{currentRank.name}</div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'individual' ? (
        <motion.div 
          key="individual-dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Individual Maturity - Radar */}
        <div className="lg:col-span-1 p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zello-orange/50 transition-all group-hover:w-2"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zello-orange/20 flex items-center justify-center text-zello-orange">
              <Zap size={20} />
            </div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Evolução da Maturidade</h4>
          </div>
          
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                   name="Sua Maturidade"
                   dataKey="A"
                   stroke="#F05A28"
                   fill="#F05A28"
                   fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-4">Pilar de Skills Individuais</p>
        </div>

        {/* Categories Distribution - Pie */}
        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8 relative group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7b4d]/20 flex items-center justify-center text-[#ff7b4d]">
              <Target size={20} />
            </div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Habilidades por Categoria</h4>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="name"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`skill-pie-cell-v6-${entry.name}-${index}-${skillDistribution.length}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
             {skillDistribution.map((item, index) => (
               <div key={`skill-leg-item-v6-${item.name}-${index}-${skillDistribution.length}`} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Daily XP XP Progress - Area */}
        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8 relative group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zello-orange/20 flex items-center justify-center text-zello-orange">
              <Zap size={20} />
            </div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Evolução de XP</h4>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpEvolutionData}>
                <defs>
                   <linearGradient id={individualGradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#F05A28" fillOpacity={1} fill={`url(#${individualGradId})`} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center px-2">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Início</span>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hoje</span>
          </div>
        </div>
      </div>

          <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zello-orange to-transparent"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zello-orange/10 rounded-2xl flex items-center justify-center border border-zello-orange/20 text-zello-orange shadow-[0_0_20px_rgba(240,90,40,0.15)]">
                  <Star size={28} className="fill-zello-orange text-zello-orange" />
                </div>
                <div>
                  <h5 className="text-zello-orange text-xs font-black uppercase tracking-widest">Diagnóstico de Inteligência</h5>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Conselho Consultivo de IA</h3>
                </div>
              </div>
              
              {!relatorio && (
                <button
                  onClick={handleGerarRelatorio}
                  disabled={isLoadingRelatorio}
                  className="px-8 py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(240,90,40,0.2)] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {isLoadingRelatorio ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Sincronizando Holocron...
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="fill-white" />
                      Gerar Relatório Completo
                    </>
                  )}
                </button>
              )}
            </div>

            {isLoadingRelatorio && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-zello-orange" size={48} />
                <div className="text-center">
                  <p className="text-sm font-black uppercase text-slate-400 tracking-wider animate-pulse">Lendo arquivos do Holocron e calculando maestria...</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Isso pode levar alguns segundos</p>
                </div>
              </div>
            )}

            {errRelatorio && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-medium flex items-center gap-3">
                <AlertTriangle size={18} />
                <span>{errRelatorio}</span>
                <button onClick={handleGerarRelatorio} className="underline font-black uppercase ml-auto hover:text-white cursor-pointer">Tentar Novamente</button>
              </div>
            )}

            {relatorio && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4 text-left max-w-4xl"
              >
                <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
                  {renderMarkdown(relatorio)}
                </div>
                
                <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setRelatorio(null);
                    }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Gerar Novo Relatório
                  </button>
                </div>
              </motion.div>
            )}

            {!relatorio && !isLoadingRelatorio && (
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-slate-400">Gere um diagnóstico customizado com base no seu XP de {score.toLocaleString()} pontos, as habilidades adquiridas e sua avaliação de soft skills.</p>
              </div>
            )}
          </div>

          {/* Feedback Mestre Nomura */}
          <div className="p-8 rounded-[32px] bg-zello-orange/10 border border-zello-orange/20 space-y-6 relative overflow-hidden">
            <Quote className="absolute top-10 right-10 text-zello-orange opacity-10 pointer-events-none" size={120} />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500/20 shadow-lg overflow-hidden">
                <img src="/Mestre Nomura.png" alt="Mestre Nomura" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h5 className="text-zello-orange text-xs font-black uppercase tracking-widest">Feedback do Mentor</h5>
                <div className="text-xl font-black text-white italic uppercase">Mestre Nomura diz:</div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              <p className="text-slate-300 italic font-medium leading-relaxed">
                "Grande potencial eu vejo em você. O caminho da automação deve seguir. Menos tempo operando, mais tempo criando, é o que o futuro exige. A força das habilidades de Automação Inteligente você deve fortalecer."
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-zello-orange border border-zello-orange/30">Focar em Automação</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-zello-orange border border-zello-orange/30">Expandir Multimodal</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="team-dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <BarChart2 size={20} />
                  </div>
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Engajamento Coletivo</h4>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-bold text-slate-400">Participação</span>
                </div>
              </div>
              
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={teamEvolutionData}>
                    <defs>
                      <linearGradient id={teamGradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                    <YAxis stroke="#475569" fontSize={10} fontWeight="bold" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1e293b', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="stepAfter" dataKey="xp" stroke="#3b82f6" fillOpacity={1} fill={`url(#${teamGradId})`} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-slate-400 font-medium text-center italic">A turma atingiu um pico de excelência no último encontro.</p>
            </div>

            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ff9c7a]/20 flex items-center justify-center text-[#ff9c7a]">
                  <LayoutGrid size={20} />
                </div>
                <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Interesse por Skill</h4>
              </div>
              <div className="space-y-6">
                 {topSkillsData.map((skill, index) => (
                   <div key={`team-skill-row-v5-${skill.id || skill.name}-${index}-${topSkillsData.length}`} className="space-y-1">
                     <div className="flex justify-between items-end">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{skill.name}</span>
                       <span className="text-sm font-black text-white">{skill.count}%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${skill.count}%` }}
                         className="h-full bg-zello-orange rounded-full"
                       />
                     </div>
                   </div>
                 ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-6">IA Generativa lidera a curva de aprendizado do grupo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
             {/* Mapa de Oportunidades */}
             <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Oportunidades de Impacto</h4>
                </div>
                
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'RH', v: 85 },
                      { name: 'MKT', v: 45 },
                      { name: 'Sales', v: 65 },
                      { name: 'Ops', v: 90 },
                      { name: 'TI', v: 75 }
                    ]}>
                      <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1e293b', borderRadius: '16px' }}
                      />
                      <Bar dataKey="v" radius={[10, 10, 0, 0]}>
                         {[
                           { name: 'RH', v: 85 },
                           { name: 'MKT', v: 45 },
                           { name: 'Sales', v: 65 },
                           { name: 'Ops', v: 90 },
                           { name: 'TI', v: 75 }
                         ].map((entry, index) => (
                           <Cell key={`opp-bar-cell-v5-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-slate-400 font-medium">Potencial máximo detectado em <span className="text-green-500 font-black">Operações Corporativas</span>.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
               {[
                 { label: 'Maturidade Média', val: teamStats ? `${Math.round(teamStats.teamMaturity.reduce((s: number, m: TeamMaturityMetric) => s + m.A, 0) / 6)}%` : '78%', icon: Target, color: 'text-blue-500' },
                 { label: 'XP Total Turma', val: teamStats ? teamStats.totalXp.toLocaleString() : '124k', icon: Zap, color: 'text-zello-orange' },
                 { label: 'Skills Coletivas', val: teamStats ? teamStats.topSkills.length.toString() : '4', icon: Trophy, color: 'text-yellow-500' },
                 { label: 'Participantes', val: 'Ativos', icon: BarChart2, color: 'text-green-500' },
               ].map((stat, idx) => (
                 <div key={`stat-grid-team-box-v5-${stat.label}-${idx}`} className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col items-center justify-center space-y-3 hover:border-white/20 transition-all text-center">
                   <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                     <stat.icon size={32} />
                   </div>
                   <div>
                     <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">{stat.label}</span>
                     <div className={`text-4xl font-black italic uppercase ${stat.color}`}>{stat.val}</div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
