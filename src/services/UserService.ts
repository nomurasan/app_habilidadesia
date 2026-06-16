import { UserRepository } from '../repositories/UserRepository';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { AppError } from '../utils/errors';

export class UserService {
  public static async fetchProfile(userId: string): Promise<UserProfile | null> {
    return UserRepository.getUserProfile(userId);
  }

  public static async createProfile(userId: string, email: string): Promise<UserProfile> {
    const defaultProfile: Omit<UserProfile, 'userId'> = {
      email,
      xp: 100, // Starts with baseline 100 XP
      unlockedPowers: ['1', '2'], // Default starter powers
      currentMissionIndex: 0,
      missionProgress: {},
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    await UserRepository.createUserProfile(userId, defaultProfile);
    return { userId, ...defaultProfile } as UserProfile;
  }

  public static async saveSurveyCompletion(
    userId: string,
    companyId: string,
    skillsSurvey: Record<string, { current: number; target: number }>
  ): Promise<void> {
    if (!companyId) throw new AppError('Turma/Empresa id é obrigatório.', 'INVALID_PAYLOAD');
    await UserRepository.updateUserProfile(userId, {
      companyId,
      skillsSurvey,
      surveyCompleted: true,
      lastActive: new Date().toISOString(),
    });
  }

  public static async awardXP(userId: string, points: number): Promise<number> {
    const profile = await UserRepository.getUserProfile(userId);
    if (!profile) throw new AppError('Perfil não localizado', 'USER_NOT_FOUND');
    const newXp = (profile.xp || 0) + points;
    await UserRepository.updateUserProfile(userId, { xp: newXp });
    return newXp;
  }

  public static async unlockPower(userId: string, powerId: string, costXp = 0): Promise<void> {
    const profile = await UserRepository.getUserProfile(userId);
    if (!profile) throw new AppError('Perfil não localizado', 'USER_NOT_FOUND');
    
    if (profile.unlockedPowers.includes(powerId)) {
      return; // Already unlocked
    }

    if (profile.xp < costXp) {
      throw new AppError(
        'XP insuficiente para desbloquear este poder.',
        'INSUFFICIENT_XP',
        `Você precisa de pelo menos ${costXp} XP para adquirir esta habilidade.`
      );
    }

    const updatedPowers = [...profile.unlockedPowers, powerId];
    const remainingXp = profile.xp - costXp;

    await UserRepository.updateUserProfile(userId, {
      unlockedPowers: updatedPowers,
      xp: remainingXp,
    });
  }

  public static async resetProfile(userId: string): Promise<void> {
    const current = await UserRepository.getUserProfile(userId);
    await UserRepository.updateUserProfile(userId, {
      xp: 100,
      unlockedPowers: ['1', '2'],
      currentMissionIndex: 0,
      missionProgress: {},
      skillsSurvey: {},
      surveyCompleted: false,
      lastActive: new Date().toISOString(),
    });
  }
}
