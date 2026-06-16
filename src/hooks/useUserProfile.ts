import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { User } from 'firebase/auth';

export function useUserProfile(user: User | null | undefined) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Realtime synchronization from Firestore
    const unsubscribe = UserRepository.subscribeUserProfile(user.uid, (profile) => {
      if (profile) {
        setUserProfile(profile);
      } else {
        // If profile doesn't exist, bootstrap or initialize it
        UserService.createProfile(user.uid, user.email || 'iniciante@jedi.io')
          .then((newProfile) => {
            setUserProfile(newProfile);
          })
          .catch((err) => {
            console.error('Failed to bootstrap profile:', err);
            setErrorProfile('Incapaz de inicializar perfil no banco de dados.');
          });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const saveSurvey = async (
    companyId: string,
    survey: Record<string, { current: number; target: number }>
  ) => {
    if (!user) return;
    try {
      await UserService.saveSurveyCompletion(user.uid, companyId, survey);
    } catch (err: any) {
      console.error('Error saving survey:', err);
      throw err;
    }
  };

  const awardXP = async (points: number) => {
    if (!user) return;
    try {
      await UserService.awardXP(user.uid, points);
    } catch (err: any) {
      console.error('Error awarding XP:', err);
      throw err;
    }
  };

  const unlockPower = async (powerId: string, costXp = 0) => {
    if (!user) return;
    try {
      await UserService.unlockPower(user.uid, powerId, costXp);
    } catch (err: any) {
      console.error('Error unlocking power:', err);
      throw err;
    }
  };

  const resetProfile = async () => {
    if (!user) return;
    try {
      await UserService.resetProfile(user.uid);
    } catch (err: any) {
      console.error('Error resetting profile:', err);
      throw err;
    }
  };

  return {
    userProfile,
    loading,
    errorProfile,
    saveSurvey,
    awardXP,
    unlockPower,
    resetProfile,
  };
}
