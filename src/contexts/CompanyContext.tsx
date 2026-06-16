import React, { createContext, useContext } from 'react';
import { useCompany } from '../hooks/useCompany';
import { useAuthContext } from './AuthContext';
import { Company, UserProfile } from '../types';

interface CompanyContextType {
  availableCompanies: Company[];
  whitelist: string[];
  allUsers: UserProfile[];
  companyUsers: UserProfile[];
  createCompany: (name: string, ownerId: string, logoUrl?: string, domain?: string) => Promise<Company>;
  updateCompany: (companyId: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (companyId: string) => Promise<void>;
  addEmailToWhitelist: (companyId: string, email: string) => Promise<void>;
  removeEmailFromWhitelist: (companyId: string, email: string) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ gameState: string; children: React.ReactNode }> = ({ gameState, children }) => {
  const { userProfile } = useAuthContext();
  const isAdmin = userProfile?.isAdmin;

  const companyState = useCompany(userProfile, isAdmin, gameState);

  return (
    <CompanyContext.Provider value={companyState}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};
