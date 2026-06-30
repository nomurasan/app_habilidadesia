import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ChevronRight, 
  Check, 
  Sparkles, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';

interface Company {
  id: string;
  name: string;
  ownerId?: string;
  createdAt: any;
}

interface OnboardingScreenProps {
  user: any;
  availableCompanies: Company[];
  onComplete: (companyId: string, skillsSurvey: Record<string, { current: number; target: number }>) => void | Promise<void>;
  initialCompanyId?: string;
  initialSkillsSurvey?: Record<string, { current: number; target: number }>;
  isEditMode?: boolean;
  isAdmin?: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  user, 
  availableCompanies, 
  onComplete,
  initialCompanyId = '',
  isEditMode = false,
  isAdmin = false
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [savingLoading, setSavingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (initialCompanyId && initialCompanyId !== 'null' && initialCompanyId !== 'undefined') {
      setSelectedCompanyId(initialCompanyId);
    } else {
      setSelectedCompanyId('');
    }
  }, [initialCompanyId]);

  const handleFinishOnboarding = async () => {
    if (!isCreatingNew && (!selectedCompanyId || selectedCompanyId === 'null' || selectedCompanyId === 'undefined')) {
      setErrorMessage('Por favor, selecione sua empresa ou turma para continuar.');
      return;
    }
    if (isCreatingNew && !newCompanyName.trim()) {
      setErrorMessage('Por favor, digite o nome da nova empresa.');
      return;
    }

    setSavingLoading(true);
    setErrorMessage('');
    try {
      let finalCompanyId = selectedCompanyId;

      // Create new company if requested
      if (isCreatingNew) {
        if (!isAdmin) {
          throw new Error('Apenas administradores podem registrar novas empresas.');
        }
        const companyRef = doc(collection(db, 'companies'));
        finalCompanyId = companyRef.id;
        await setDoc(companyRef, {
          id: finalCompanyId,
          name: newCompanyName.trim(),
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
      }

      if (!finalCompanyId || finalCompanyId === 'null' || finalCompanyId === 'undefined') {
        throw new Error('Identificação de empresa ou turma inválida.');
      }

      await onComplete(finalCompanyId, {});
    } catch (err: any) {
      console.error("Failed completing onboarding:", err);
      setErrorMessage('Ocorreu um erro ao salvar suas informações de perfil: ' + (err?.message || err));
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className={isEditMode ? "w-full max-w-4xl mx-auto text-slate-100 flex flex-col font-sans" : "min-h-screen bg-zello-black text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans"}>
      {/* Background radial glow */}
      {!isEditMode && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-zello-orange/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      )}
      
      <div className={isEditMode ? "w-full z-10" : "w-full max-w-2xl z-10 my-4"}>
        {/* Header Indicator */}
        <div className="flex items-center justify-between px-6 py-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zello-orange flex items-center justify-center text-white shadow-[0_0_15px_rgba(240,90,40,0.4)]">
              <Sparkles size={16} className="fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Configuração de Acesso</span>
              <h2 className="text-sm font-black uppercase italic tracking-tight text-white leading-none">
                Perfil Organizacional
              </h2>
            </div>
          </div>
        </div>

        <motion.div
          type="sub-component"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/10 space-y-8 shadow-[0_0_50px_rgba(240,90,40,0.05)] relative overflow-hidden"
          id="onboarding-step-1-card"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zello-orange to-transparent"></div>
          
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-xs font-black uppercase tracking-widest">
              <Building2 size={12} />
              Vinculação Corporativa
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
              Qual é a sua <span className="text-zello-orange font-black">Empresa ou Turma</span>?
            </h1>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Para carregar os desafios, metas organizacionais e o dashboard de equipe, precisamos que você indique onde você atua.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-6">
            {!isCreatingNew ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zello-orange uppercase tracking-[0.2em] px-1">Selecione uma Turma/Empresa Existente</label>
                  <div className="relative">
                    <select
                      value={selectedCompanyId}
                      onChange={(e) => {
                        setSelectedCompanyId(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-900 border-2 border-white/10 rounded-2xl p-5 pr-10 text-white font-bold text-base focus:border-zello-orange focus:bg-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>-- Clique para selecionar --</option>
                      {availableCompanies.map((comp, idx) => (
                        <option key={`comp-opt-${comp.id || 'id'}-${idx}`} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                   <div className="h-px flex-1 bg-white/10"></div>
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ou</span>
                   <div className="h-px flex-1 bg-white/10"></div>
                 </div>

                 <button
                   type="button"
                   onClick={() => {
                     setIsCreatingNew(true);
                     setErrorMessage('');
                   }}
                   className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-zello-orange/30 text-white font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                 >
                   <Plus size={16} />
                   Nova Organização / Turma Não Listada
                 </button>
               </div>
             ) : (
               <div className="space-y-5">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-zello-orange uppercase tracking-[0.2em] px-1">Nome da Nova Turma ou Empresa</label>
                   <input 
                     type="text"
                     value={newCompanyName}
                     onChange={(e) => {
                       setNewCompanyName(e.target.value);
                       setErrorMessage('');
                     }}
                     placeholder={isAdmin ? "Ex: Minha Empresa Corp" : "Apenas administradores podem cadastrar"}
                     className="w-full bg-slate-900 border-2 border-white/10 focus:border-zello-orange rounded-2xl p-5 text-white font-bold text-base outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                     autoFocus
                     disabled={!isAdmin}
                   />
                 </div>

                 {!isAdmin && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3">
                     <AlertCircle size={16} className="shrink-0" />
                     <span>Atenção: O cadastramento de novas empresas é permitido apenas para usuários administradores (ADMIN).</span>
                   </div>
                 )}

                 <button
                   type="button"
                   onClick={() => {
                     setIsCreatingNew(false);
                     setNewCompanyName('');
                     setErrorMessage('');
                   }}
                   className="text-xs font-bold text-slate-400 hover:text-white transition-all underline"
                 >
                   Voltar para a seleção de turmas existentes
                 </button>
               </div>
             )}
           </div>

           <div className="pt-4 flex justify-end">
             <button
               type="button"
               onClick={handleFinishOnboarding}
               disabled={savingLoading || (isCreatingNew && !isAdmin)}
               className="px-8 py-5 bg-zello-orange text-white font-black uppercase tracking-[0.15em] text-sm rounded-2xl hover:brightness-110 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_35px_rgba(240,90,40,0.25)] flex items-center gap-2"
             >
              {savingLoading ? (
                'Processando...'
              ) : (
                <>
                  {isEditMode ? 'Salvar Configurações' : 'Concluir Cadastro'}
                  <Check size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
