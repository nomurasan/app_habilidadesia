import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props!: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside React tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/20 rounded-[32px] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <AlertOctagon size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">O Poder falhou...</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Algo inesperado interrompeu a conexão com a força do app. Mas não se preocupe, você pode restaurar tudo com um clique.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-black/40 rounded-xl text-left border border-white/5 font-mono text-xs text-red-400 max-h-32 overflow-auto custom-scrollbar">
                {this.state.error.message || 'Erro desconhecido'}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-zello-orange hover:bg-zello-orange/90 text-white font-black uppercase tracking-wider text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(240,90,40,0.3)]"
            >
              <RotateCcw size={14} />
              Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
