import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AppError } from '../utils/errors';

export class AuthService {
  public static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  public static async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err: any) {
      console.error('Google Auth Failed in Service:', err);
      if (err.code === 'auth/unauthorized-domain') {
        throw new AppError(
          err.message,
          'UNAUTHORIZED_DOMAIN',
          'Este domínio não está autorizado no Console do Firebase (Authentication > Authorized domains).'
        );
      }
      throw new AppError(err.message, 'GOOGLE_AUTH_FAILED', 'Falha na autenticação com sua conta Google.');
    }
  }

  public static async loginAsGuest(): Promise<User> {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (err: any) {
      console.error('Guest Auth Failed in Service:', err);
      if (err.code === 'auth/admin-restricted-operation') {
        throw new AppError(
          err.message,
          'GUEST_DISABLED',
          'O login como vistante (anônimo) está desativado no Console do Firebase.'
        );
      }
      throw new AppError(err.message, 'GUEST_AUTH_FAILED', 'Falha ao autenticar sua sessão como visitante.');
    }
  }

  public static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err: any) {
      throw new AppError(err.message, 'LOGOUT_FAILED', 'Erro ao encerrar sua sessão de usuário.');
    }
  }
}
