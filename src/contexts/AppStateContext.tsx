import React from 'react';
import { AuthProvider } from './AuthContext';
import { CompanyProvider } from './CompanyContext';
import { UserProgressProvider } from './UserProgressContext';
import { MissionProvider } from './MissionContext';
import { QuizProvider } from './QuizContext';
import { DashboardProvider } from './DashboardContext';

interface AppStateProviderProps {
  gameState: string;
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ gameState, children }) => {
  return (
    <AuthProvider>
      <CompanyProvider gameState={gameState}>
        <UserProgressProvider>
          <MissionProvider>
            <QuizProvider>
              <DashboardProvider>
                {children}
              </DashboardProvider>
            </QuizProvider>
          </MissionProvider>
        </UserProgressProvider>
      </CompanyProvider>
    </AuthProvider>
  );
};

export * from './AuthContext';
export * from './CompanyContext';
export * from './UserProgressContext';
export * from './MissionContext';
export * from './QuizContext';
export * from './DashboardContext';
