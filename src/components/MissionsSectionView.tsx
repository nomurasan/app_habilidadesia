import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Mission, Company, AIPower } from '../types';
import { MISSIONS } from '../data/missions';
import { AI_POWERS } from '../data/powers';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase';

interface MissionsSectionViewProps {
  user: any;
  completedMissions: Record<string, boolean>;
  setCompletedMissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  missionCards: Record<string, string[]>;
  setMissionCards: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  userExplanations: Record<string, string>;
  setUserExplanations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  advisorResponses: Record<string, string>;
  setAdvisorResponses: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
  setIsSelectingForMission: (val: boolean) => void;
  setIsPresentingDeck: (val: boolean) => void;
  setGameState: (state: any) => void;
  setActiveVideo: (video: { title: string; url: string } | null) => void;
  isRewriting: boolean;
  setIsRewriting: (val: boolean) => void;
  isAskingAdvisor: boolean;
  setIsAskingAdvisor: (val: boolean) => void;
  isSaving: boolean;
  setIsSaving: (val: boolean) => void;
  setIsAdvisorModalOpen: (val: boolean) => void;
  currentCompany: Company | null;
  setViewingPower: (power: AIPower | null) => void;
}

export const MissionsSectionView: React.FC<MissionsSectionViewProps> = ({
  user,
  completedMissions,
  setCompletedMissions,
  missionCards,
  setMissionCards,
  userExplanations,
  setUserExplanations,
  advisorResponses,
  setAdvisorResponses,
  selectedMission,
  setSelectedMission,
  setIsSelectingForMission,
  setIsPresentingDeck,
  setGameState,
  setActiveVideo,
  isRewriting,
  setIsRewriting,
  isAskingAdvisor,
  setIsAskingAdvisor,
  isSaving,
  setIsSaving,
  setIsAdvisorModalOpen,
  currentCompany,
  setViewingPower,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  const currentMissionId = selectedMission?.id || 'none';
  const currentSlots = selectedMission ? missionCards[selectedMission.id] || [] : [];

  const handleRewriteDesc = async () => {
    if (!selectedMission) return;
    setIsRewriting(true);
    setErrorMessage('');
    try {
      const powers = currentSlots
        .map((id) => AI_POWERS.find((p) => p.id === id))
        .filter(Boolean);

      const idToken = user ? await user.getIdToken() : '';
      const resp = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          mission: selectedMission,
          selectedPowers: powers,
          currentExplanation: userExplanations[selectedMission?.id] || '',
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Erro ao processar IA');
      }

      const data = await resp.json();
      if (data.rewrittenText) {
        setUserExplanations((prev) => ({ ...prev, [selectedMission.id]: data.rewrittenText }));
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(`Erro ao gerar redação: ${e.message}`);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleAskAdvisor = async () => {
    if (!selectedMission) return;
    setIsAskingAdvisor(true);
    setErrorMessage('');
    try {
      const powers = currentSlots
        .map((id) => AI_POWERS.find((p) => p.id === id))
        .filter(Boolean);

      const idToken = user ? await user.getIdToken() : '';
      const resp = await fetch('/api/advise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          mission: selectedMission,
          selectedPowers: powers,
          userExplanation: userExplanations[selectedMission.id] || '',
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || 'Erro ao consultar o mestre');
      }

      const data = await resp.json();
      if (data.advice) {
        setAdvisorResponses((prev) => ({ ...prev, [selectedMission.id]: data.advice }));
        setIsAdvisorModalOpen(true);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(`Erro ao consultar conselho: ${e.message}`);
    } finally {
      setIsAskingAdvisor(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!user || !selectedMission) return;
    setIsSaving(true);
    setErrorMessage('');
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        [`missionProgress.${selectedMission.id}`]: {
          cards: currentSlots,
          explanation: userExplanations[selectedMission.id] || '',
          updatedAt: new Date().toISOString(),
        },
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCompletedMissions((prev) => ({ ...prev, [selectedMission.id]: true }));
      setSelectedMission(null);
    } catch (e: any) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
      setErrorMessage('Erro ao persistir progresso no Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      key="missions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-12 p-4 md:p-8"
    >
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 select-none">
          <LucideIcons.AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedMission ? (
        <div key="mission-list-container" className="space-y-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
            <div className="space-y-4 text-center lg:text-left flex-1 font-sans">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
                Missões Táticas
              </h2>
              <p className="text-slate-400 font-medium">
                Selecione uma missão para explorar cenários reais de aplicação de IA
              </p>

              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={() => setGameState('home')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer font-sans"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>

            {/* Mestre Nomura Coaching banner */}
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
                  "As missões táticas vão exigir foco e sabedoria. Combine as competências profissionais da sua coleção para resolver os desafios estratégicos reais!"
                </p>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      setActiveVideo({
                        title: 'Como Funcionam as Missões?',
                        url: 'https://www.youtube.com/embed/G1rbjZL8o8E?rel=0',
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn font-sans"
                  >
                    <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                    Como Funcionam as Missões?
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
            {MISSIONS.map((mission, idx) => (
              <button
                key={`msn-card-list-v4-${mission.id}-${idx}`}
                onClick={() => setSelectedMission(mission)}
                className={`group relative p-8 bg-white/5 border rounded-3xl text-left transition-all duration-300 overflow-hidden cursor-pointer active:scale-98 ${
                  completedMissions[mission.id]
                    ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                    : 'border-white/10 hover:border-zello-orange/50'
                }`}
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-zello-orange text-xs font-black uppercase tracking-[0.2em]">Missão {mission.id}</div>
                    {completedMissions[mission.id] && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <LucideIcons.CheckCircle2 className="text-green-500" size={12} />
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Concluída</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-white italic leading-tight uppercase group-hover:text-zello-orange transition-colors font-sans">
                    {mission.title}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-4">
                    Ver Detalhes{' '}
                    <LucideIcons.ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <LucideIcons.Target size={80} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div key={`mission-details-${selectedMission.id}`} className="space-y-12">
          <button
            onClick={() => setSelectedMission(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
          >
            <LucideIcons.ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-widest font-sans">Voltar para Missões</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zello-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(240,90,40,0.4)] shrink-0 select-none">
                    <LucideIcons.Target className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-zello-orange text-xs font-black uppercase tracking-[0.2em] select-none">
                      Domine o Poder da IA
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic leading-tight uppercase font-sans">
                      {selectedMission.title}
                    </h2>
                  </div>
                </div>

                <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-zello-orange"></div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange select-none font-sans">
                      Contexto da Missão
                    </h4>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 select-text">
                      {selectedMission.context}
                    </p>
                    {selectedMission.items && selectedMission.items.length > 0 && (
                      <ul className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6 select-none">
                        {selectedMission.items.map((item, idx) => (
                          <li
                            key={`msn-item-f-${selectedMission.id}-${idx}`}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-slate-400"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-zello-orange" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange select-none font-sans">
                      O grupo deverá refletir:
                    </h4>
                    <p className="text-2xl md:text-3xl font-black italic text-white leading-tight select-text">
                      "{selectedMission.reflection}"
                    </p>
                  </div>

                  {selectedMission.challenge && (
                    <div className="pt-8 border-t border-white/5 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange select-none font-sans">
                        Desafio Proposto
                      </h4>
                      <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 select-text">
                        {selectedMission.challenge}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 select-none">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange font-sans">Resultado Esperado</h4>
                    <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                      {selectedMission.expectedResult || (selectedMission.expectedResults && selectedMission.expectedResults[0])}
                    </p>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange font-sans">Maturidade & Evolução</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                        {selectedMission.maturityDescription || "Esta missão avalia sua capacidade de conectar objetivos corporativos com as competências estruturais de IA."}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Dificuldade</span>
                          <span className="text-zello-orange">Avançado</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-zello-orange" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange font-sans">Seleção dos Cards</h4>
                  <span className="px-2 py-1 bg-zello-orange/20 rounded-md text-[10px] font-bold text-zello-orange uppercase tracking-widest select-none">
                    Obrigatório
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4" key={`mission-slots-container-${selectedMission.id}`}>
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const powerId = currentSlots[slotIdx];
                    const power = powerId ? AI_POWERS.find((p) => p.id === powerId) : null;

                    return (
                      <button
                        key={`mission-slot-unique-${currentMissionId}-${slotIdx}`}
                        onClick={() => {
                          setIsSelectingForMission(true);
                          setGameState('deck');
                        }}
                        className={`aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all group relative overflow-hidden cursor-pointer ${
                          power
                            ? 'border-zello-orange/50 bg-zello-orange/5 shadow-[0_0_15px_rgba(240,90,40,0.1)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {power ? (
                          <>
                            <div className="text-zello-orange mb-2 select-none">
                              {React.createElement(
                                (LucideIcons as any)[power.icon] || LucideIcons.Zap,
                                { size: 24 }
                              )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight text-white select-none">
                              {power.title}
                            </span>
                            <button
                              type="button"
                              className="mt-3 px-2 py-1 bg-zello-orange/20 hover:bg-zello-orange text-white border border-zello-orange/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 z-30 cursor-pointer shadow-[0_0_10px_rgba(240,90,40,0.2)]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingPower(power);
                              }}
                            >
                              <LucideIcons.Eye size={9} />
                              Consultar
                            </button>
                            <div
                              className="absolute top-1 right-1 p-1 hover:text-white text-slate-500 cursor-pointer z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = [...currentSlots];
                                next.splice(slotIdx, 1);
                                setMissionCards((prev) => ({ ...prev, [selectedMission.id]: next }));
                              }}
                            >
                              <LucideIcons.X size={14} />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center select-none">
                            <LucideIcons.Plus className="text-slate-600 group-hover:text-slate-400 mb-2" size={20} />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400">
                              Add Card
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (currentSlots.length > 0) {
                      setIsPresentingDeck(true);
                    } else {
                      setIsSelectingForMission(true);
                      setGameState('deck');
                    }
                  }}
                  className="w-full py-4 bg-zello-orange text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.2)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <LucideIcons.LayoutGrid size={16} />
                  {currentSlots.length > 0 ? 'Ver / Editar Deck' : 'Explorar Meu Deck'}
                </button>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <div className="flex items-center justify-between select-none">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange font-sans">
                    Descrição da sua Solução
                  </h4>
                </div>
                <div className="relative group">
                  <textarea
                    placeholder="Explique detalhadamente como pretende orquestrar as competências selecionadas para resolver esta missão de forma produtiva, ética e segura..."
                    className={`w-full bg-zello-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 text-sm focus:border-zello-orange/50 transition-all min-h-[160px] outline-none ${
                      isRewriting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    value={userExplanations[selectedMission.id] || ''}
                    onChange={(e) => {
                      setUserExplanations((prev) => ({ ...prev, [selectedMission.id]: e.target.value }));
                    }}
                  />
                  {isRewriting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zello-black/25 backdrop-blur-[2px] rounded-2xl select-none">
                      <div className="flex flex-col items-center gap-2">
                        <LucideIcons.Loader2 className="animate-spin text-zello-orange" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zello-orange animate-pulse">
                          Sintonizando a Força...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    disabled={isRewriting || currentSlots.length === 0}
                    onClick={handleRewriteDesc}
                    className="w-full py-4 bg-zello-orange/10 hover:bg-zello-orange/20 border border-zello-orange/30 rounded-2xl text-xs font-black uppercase tracking-widest text-zello-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer font-sans"
                  >
                    {isRewriting ? (
                      <>
                        <LucideIcons.Loader2 className="animate-spin" size={16} />
                        Elaborando redação...
                      </>
                    ) : (
                      <>
                        <img
                          src="https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png"
                          alt="Mestre Yoda"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-zello-orange/35 group-hover:scale-110 transition-transform shrink-0"
                        />
                        Mestre Yoda: Narrar minha Solução
                      </>
                    )}
                  </button>

                  <button
                    disabled={isAskingAdvisor || currentSlots.length === 0}
                    onClick={handleAskAdvisor}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer font-sans"
                  >
                    {isAskingAdvisor ? (
                      <>
                        <LucideIcons.Loader2 className="animate-spin" size={16} />
                        Consultando Mestre Nomura...
                      </>
                    ) : (
                      <>
                        <img
                          src="/Mestre Nomura.png"
                          alt="Mestre Nomura"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-white/20 group-hover:scale-110 transition-transform shrink-0"
                        />
                        Mestre Nomura: Avaliar Estratégia
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                    className="flex-1 py-4 bg-zello-orange text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.2)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                  >
                    {isSaving ? (
                      <LucideIcons.Loader2 className="animate-spin" size={16} />
                    ) : (
                      <LucideIcons.Save size={16} />
                    )}
                    Concluir Missão
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMission(null);
                    }}
                    className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer font-sans"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
