import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { translateFirebaseError } from '../utils/errors';

export class UserRepository {
  public static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { userId: snap.id, ...snap.data() } as UserProfile;
      }
      return null;
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, data);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, data);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static async deleteUserProfile(userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await deleteDoc(docRef);
    } catch (err) {
      throw translateFirebaseError(err);
    }
  }

  public static subscribeUserProfile(
    userId: string,
    callback: (profile: UserProfile | null) => void
  ): () => void {
    const docRef = doc(db, 'users', userId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          callback({ userId: snap.id, ...snap.data() } as UserProfile);
        } else {
          callback(null);
        }
      },
      (err) => {
        console.error('Subscription error for user profile:', err);
      }
    );
  }

  public static subscribeAllUsers(
    callback: (users: UserProfile[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const q = query(collection(db, 'users'));
    return onSnapshot(
      q,
      (snap) => {
        const users = snap.docs.map((d) => ({ ...d.data(), userId: d.id } as UserProfile));
        // Deduplicate
        const uniqueUsers = Array.from(new Map(users.map((u) => [u.userId, u])).values());
        callback(uniqueUsers);
      },
      (err) => {
        console.error('Subscription error for all users list:', err);
        if (onError) onError(translateFirebaseError(err));
      }
    );
  }

  public static subscribeCompanyUsers(
    companyId: string,
    callback: (users: UserProfile[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    return onSnapshot(
      q,
      (snap) => {
        const users = snap.docs.map((d) => ({ ...d.data(), userId: d.id } as UserProfile));
        const uniqueUsers = Array.from(new Map(users.map((u) => [u.userId, u])).values());
        callback(uniqueUsers);
      },
      (err) => {
        console.error('Subscription error for company users:', err);
        if (onError) onError(translateFirebaseError(err));
      }
    );
  }
}
