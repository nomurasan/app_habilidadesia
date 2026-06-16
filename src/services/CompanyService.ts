import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company } from '../types';
import { AppError } from '../utils/errors';

export class CompanyService {
  public static async createCompany(
    name: string,
    ownerId: string,
    logoUrl?: string,
    domain?: string
  ): Promise<string> {
    if (!name.trim()) {
      throw new AppError('O nome da empresa/turma não pode ser vazio.', 'INVALID_NAME');
    }
    const cleanId = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (!cleanId) {
      throw new AppError('Nome inválido ou com caracteres proibidos.', 'INVALID_NAME');
    }

    const payload: Partial<Company> = {
      name: name.trim(),
      ownerId,
      logoUrl: logoUrl || '',
      domain: domain || '',
      createdAt: new Date().toISOString(),
    };

    await CompanyRepository.createCompany(cleanId, payload);
    return cleanId;
  }

  public static async updateCompany(
    companyId: string,
    data: Partial<Company>
  ): Promise<void> {
    await CompanyRepository.updateCompany(companyId, data);
  }

  public static async deleteCompany(companyId: string): Promise<void> {
    await CompanyRepository.deleteCompany(companyId);
  }

  public static async addToCompanyWhitelist(companyId: string, email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new AppError('E-mail inválido.', 'INVALID_EMAIL');
    await CompanyRepository.addWhitelistEmail(companyId, cleanEmail);
  }

  public static async removeFromCompanyWhitelist(companyId: string, email: string): Promise<void> {
    await CompanyRepository.removeWhitelistEmail(companyId, email);
  }
}
