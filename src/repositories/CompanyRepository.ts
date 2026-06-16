import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company } from '../types';
import { translateFirebaseError } from '../utils/errors';

export class CompanyRepository {
  public static subscribeCompanies(callback: (companies: Company[]) => void): () => void {
    const q = collection(db, 'companies');
    return onSnapshot(
      q,
      (snap) => {
        const companies = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name || '',
          logoUrl: d.data().logoUrl || '',
          domain: d.data().domain || '',
          createdAt: d.data().createdAt || '',
        } as Company));
        const uniqueCompanies = Array.from(new Map(companies.map((c) => [c.id, c])).values());
        callback(uniqueCompanies);
      },
      (err) => {
        console.error('Subscription error for companies:', err);
      }
    );
  }

  public static async createCompany(companyId: string, data: Partial<Company>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await setDoc(docRef, data);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async updateCompany(companyId: string, data: Partial<Company>): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, data);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async deleteCompany(companyId: string): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId);
      await deleteDoc(docRef);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static subscribeWhitelist(
    companyId: string,
    callback: (emails: string[]) => void
  ): () => void {
    const q = collection(db, 'companies', companyId, 'whitelist');
    return onSnapshot(
      q,
      (snap) => {
        const emails = snap.docs.map((d) => d.id);
        callback(emails);
      },
      (err) => {
        console.error('Subscription error for whitelist:', err);
      }
    );
  }

  public static async addWhitelistEmail(companyId: string, email: string): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId, 'whitelist', email);
      await setDoc(docRef, { addedAt: new Date().toISOString() });
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async removeWhitelistEmail(companyId: string, email: string): Promise<void> {
    try {
      const docRef = doc(db, 'companies', companyId, 'whitelist', email);
      await deleteDoc(docRef);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }
}
