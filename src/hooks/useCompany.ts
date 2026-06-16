import { useState, useEffect } from 'react';
import { Company, UserProfile } from '../types';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CompanyService } from '../services/CompanyService';

export function useCompany(
  userProfile: UserProfile | null,
  isAdmin: boolean | undefined,
  gameState: string
) {
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);

  // 1. Sync available companies list
  useEffect(() => {
    const unsubscribe = CompanyRepository.subscribeCompanies((companies) => {
      setAvailableCompanies(companies);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync Whitelist (if company owner / admin is active)
  useEffect(() => {
    if (!userProfile?.companyId || !isAdmin) {
      setWhitelist([]);
      return;
    }
    const unsubscribe = CompanyRepository.subscribeWhitelist(
      userProfile.companyId,
      (emails) => {
        setWhitelist(emails);
      }
    );
    return () => unsubscribe();
  }, [userProfile?.companyId, isAdmin]);

  // 3. Sync Company Users (for team stats / analytics)
  useEffect(() => {
    if (!userProfile?.companyId) {
      setCompanyUsers([]);
      return;
    }
    const unsubscribe = UserRepository.subscribeCompanyUsers(
      userProfile.companyId,
      (users) => {
        setCompanyUsers(users);
      }
    );
    return () => unsubscribe();
  }, [userProfile?.companyId]);

  // 4. Sync All Users globally (if gameState is 'admin' and user is global admin)
  useEffect(() => {
    if (gameState !== 'admin') {
      setAllUsers([]);
      return;
    }
    const unsubscribe = UserRepository.subscribeAllUsers(
      (users) => {
        setAllUsers(users);
      },
      (err) => {
        console.warn('Listing all users ignored (expected for non-global admin):', err);
      }
    );
    return () => unsubscribe();
  }, [gameState]);

  const createCompany = async (
    name: string,
    ownerId: string,
    logoUrl?: string,
    domain?: string
  ) => {
    return CompanyService.createCompany(name, ownerId, logoUrl, domain);
  };

  const updateCompany = async (companyId: string, data: Partial<Company>) => {
    return CompanyService.updateCompany(companyId, data);
  };

  const deleteCompany = async (companyId: string) => {
    return CompanyService.deleteCompany(companyId);
  };

  const addEmailToWhitelist = async (companyId: string, email: string) => {
    return CompanyService.addToCompanyWhitelist(companyId, email);
  };

  const removeEmailFromWhitelist = async (companyId: string, email: string) => {
    return CompanyService.removeFromCompanyWhitelist(companyId, email);
  };

  return {
    availableCompanies,
    whitelist,
    allUsers,
    companyUsers,
    createCompany,
    updateCompany,
    deleteCompany,
    addEmailToWhitelist,
    removeEmailFromWhitelist,
  };
}
