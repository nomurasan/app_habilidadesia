import React from 'react';
import { motion } from 'motion/react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Zap, Sparkles } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Força a exibição da tela de seleção de conta
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('ERRO DE AUTORIZAÇÃO: Você precisa adicionar o domínio atual no Console do Firebase em Authentication > Settings > Authorized domains.\n\nDomínio para copiar:\nais-dev-ugky6fiu6l3wsx3zh2zetf-143772396173.us-east5.run.app');
      } else {
        alert('Erro ao entrar com Google: ' + error.message);
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error('Guest login failed:', error);
      if (error.code === 'auth/admin-restricted-operation') {
        alert('O login anônimo está desativado. Ative o provedor "Anônimo" no Console Firebase.');
      } else {
        alert('Erro ao entrar como visitante: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zello-black text-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans border-8 border-zello-black/20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-zello-orange/10 blur-[120px] rounded-full pointer-events-none -z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md space-y-12 text-center"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} className="fill-zello-orange" />
            Inicie sua Jornada
          </div>
          
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-zello-orange rounded-3xl shadow-[0_0_50px_rgba(240,90,40,0.5)] mb-8">
            <Zap className="w-12 h-12 text-white fill-white" />
            <div className="absolute -inset-4 bg-zello-orange/20 blur-xl rounded-full -z-10"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
            JORNADA <br/> JEDI
          </h1>
          <p className="text-slate-400 font-medium">
            Sincronize seu perfil para salvar seu progresso, <br className="hidden md:block"/> desbloquear habilidades e subir no ranking.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-5 bg-zello-orange text-white font-black uppercase tracking-[0.2em] text-sm rounded-3xl hover:brightness-110 transition-all active:scale-95 shadow-[0_0_40px_rgba(240,90,40,0.3)] flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">ou</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-4 bg-white/5 border-2 border-white/10 text-slate-400 font-black uppercase tracking-[0.2em] text-xs rounded-3xl hover:border-white/30 hover:text-white transition-all active:scale-95"
          >
            Modo Visitante (Sem Salvar Nuvem)
          </button>

          {isSafari && isIframe && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left space-y-2 mt-4">
              <p className="font-black uppercase tracking-wider text-[10px] text-amber-400">⚠️ Usuário de Safari / iOS:</p>
              <p className="leading-relaxed">
                Você está visualizando o app dentro do iFrame do Google AI Studio. Devido às restrições de cookies do Safari (ITP), o login com o Google ou carregamento de dados pode não persistir aqui dentro.
              </p>
              <p className="leading-relaxed font-bold">
                👉 Clique no botão de "Nova Aba" (canto superior direito da tela de preview) para abrir a URL direta do aplicativo para uma experiência perfeita!
              </p>
            </div>
          )}
        </div>
        
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
          Ao entrar, você concorda com os termos de letramento <br/> digital e conformidade ética de IA.
        </p>
      </motion.div>

      {/* Decorative pulse */}
      <div className="absolute -bottom-64 -left-64 w-128 h-128 bg-zello-orange/5 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute -top-64 -right-64 w-128 h-128 bg-zello-orange/5 blur-[120px] rounded-full animate-pulse"></div>
    </div>
  );
};
