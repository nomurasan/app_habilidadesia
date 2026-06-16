import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { AuthService } from '../services/AuthService';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const loginWithGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await AuthService.loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.userMessage || 'Erro de autenticação com o Google');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginAnonymously = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await AuthService.loginAsGuest();
    } catch (err: any) {
      setAuthError(err.userMessage || 'Erro ao entrar como visitante');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await AuthService.logout();
    } catch (err: any) {
      setAuthError(err.userMessage || 'Erro ao efetuar logout');
    }
  };

  return {
    user,
    loading,
    error,
    authError,
    isAuthenticating,
    loginWithGoogle,
    loginAnonymously,
    logout,
  };
}
