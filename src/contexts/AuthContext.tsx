import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserProfile } from '../types';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: any;
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  authError: string | null;
  isAuthenticating: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  awardXP: (points: number) => Promise<void>;
  unlockPower: (powerId: string, costXp?: number) => Promise<void>;
  saveSurvey: (companyId: string, survey: Record<string, { current: number; target: number }>) => Promise<void>;
  resetProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    loading: authLoading,
    error: authErrorState,
    authError,
    isAuthenticating,
    loginWithGoogle,
    loginAnonymously,
    logout
  } = useAuth();

  const {
    userProfile,
    loading: profileLoading,
    errorProfile: profileError,
    awardXP,
    unlockPower,
    saveSurvey,
    resetProfile
  } = useUserProfile(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: authLoading,
        error: authErrorState,
        userProfile,
        profileLoading,
        profileError,
        authError,
        isAuthenticating,
        loginWithGoogle,
        loginAnonymously,
        logout,
        awardXP,
        unlockPower,
        saveSurvey,
        resetProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
