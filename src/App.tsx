import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Shield,
  Zap,
  Star,
  Trophy,
  History,
  LayoutGrid,
  Menu,
  X,
  Target,
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { AI_POWERS, CATEGORIES, AIPower } from './data/powers';
import { Challenge, Mission } from './types';
import { ALL_CHALLENGES } from './data/challenges';
import { MISSIONS } from './data/missions';
import { SuperPowerCard } from './components/SuperPowerCard';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { signOut } from 'firebase/auth';
import { DashboardSection } from './components/DashboardSection';

// Modular child components
import { Navigation } from './components/Navigation';
import { HomeSectionView } from './components/HomeSectionView';
import { QuizSectionView } from './components/QuizSectionView';
import { LevelSelectionView } from './components/LevelSelectionView';
import { MissionsSectionView } from './components/MissionsSectionView';
import { DeckSectionView } from './components/DeckSectionView';
import { AdminSectionView } from './components/AdminSectionView';
import { AppStateProvider } from './contexts/AppStateContext';

type GameState = 'home' | 'level-selection' | 'game' | 'deck' | 'results' | 'missions' | 'dashboards' | 'admin' | 'autoconhecimento';

interface Company {
  id: string;
  name: string;
  ownerId?: string;
  createdAt: any;
}

interface UserProfile {
  userId: string;
  email: string;
  xp: number;
  unlockedPowers: string[];
  currentMissionIndex: number;
  missionProgress: any;
  companyId?: string;
  isAdmin?: boolean;
  lastActive: any;
  createdAt: any;
  surveyCompleted?: boolean;
  skillsSurvey?: Record<string, { current: number; target: number }>;
  completedQuizzes?: string[];
}

interface RankInfo {
  name: string;
  image: string;
  description: string;
  color: string;
}

const RANKS: Record<string, RankInfo> = {
  PADAWAN: {
    name: 'Padawan',
    image: 'https://static.wikia.nocookie.net/starwars/images/5/59/ObiWan.png',
    description: 'Dia 1: Descobrindo a IA e suas habilidades iniciais.',
    color: 'text-orange-400'
  },
  JEDI: {
    name: 'Jedi',
    image: 'https://static.wikia.nocookie.net/starwars/images/3/3d/LukeSkywalker.png',
    description: 'Dia 2: Aplicando a IA no trabalho e processos do dia a dia.',
    color: 'text-orange-500'
  },
  YODA: {
    name: 'Mestre Yoda',
    image: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
    description: 'Dia 3: Pensando a IA de forma estratégica e imaginando o futuro.',
    color: 'text-emerald-400'
  }
};

const getRank = (xp: number): RankInfo => {
  if (xp <= 3000) return RANKS.PADAWAN;
  if (xp <= 7500) return RANKS.JEDI;
  return RANKS.YODA;
};

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [gameState, setGameState] = useState<GameState>('home');
  const [selectedLevel, setSelectedLevel] = useState<'PADAWAN' | 'JEDI' | 'YODA' | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [viewingPower, setViewingPower] = useState<AIPower | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionCards, setMissionCards] = useState<Record<string, string[]>>({});
  const [userExplanations, setUserExplanations] = useState<Record<string, string>>({});
  const [advisorResponses, setAdvisorResponses] = useState<Record<string, string>>({});
  const [isAskingAdvisor, setIsAskingAdvisor] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isPresentingDeck, setIsPresentingDeck] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [correctQuizAnswersCount, setCorrectQuizAnswersCount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSelectingForMission, setIsSelectingForMission] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [unlockedPowers, setUnlockedPowers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiFeedbackLoading, setIsAiFeedbackLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [levelChallenges, setLevelChallenges] = useState<Challenge[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companyIdToJoin, setCompanyIdToJoin] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newWhitelistedEmail, setNewWhitelistedEmail] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [companyUsers, setCompanyUsers] = useState<UserProfile[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkEmailText, setBulkEmailText] = useState('');
  const [adminShowAllCompanies, setAdminShowAllCompanies] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);

  const [customAlert, setCustomAlert] = useState<{
    type: 'info' | 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
  } | null>(null);

  const triggerAlert = (message: string, title = 'Notificação', type: 'info' | 'success' | 'error' = 'info') => {
    setCustomAlert({
      type,
      title,
      message,
    });
  };

  const triggerConfirm = (message: string, onConfirm: () => void | Promise<void>, title = 'Confirmar Ação') => {
    setCustomAlert({
      type: 'confirm',
      title,
      message,
      onConfirm,
    });
  };

  const currentRank = getRank(score);
  
  const [teamStats, setTeamStats] = useState<{
    totalXp: number;
    teamMaturity: any[];
    teamSkillDist: any[];
    teamEvolution: any[];
    topSkills: any[];
  } | null>(null);

  useEffect(() => {
    if (!user) {
      setAvailableCompanies([]);
      return;
    }
    // Listen to all companies so we can show list and identify current one
    const unsubscribe = onSnapshot(collection(db, 'companies'), (snapshot) => {
      const companies = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Company));
      // Deduplicate by ID
      const uniqueCompanies = Array.from(new Map(companies.map(c => [c.id, c])).values());
      setAvailableCompanies(uniqueCompanies);
    }, (err) => {
      console.warn("Could not list companies:", err);
    });
    return () => unsubscribe();
  }, [user]);

  // Sync current company info
  useEffect(() => {
    if (!userProfile?.companyId) {
      setCurrentCompany(null);
      return;
    }
    const companyRef = doc(db, 'companies', userProfile.companyId);
    const unsubscribe = onSnapshot(companyRef, (snap) => {
      if (snap.exists()) {
        setCurrentCompany(snap.data() as Company);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `companies/${userProfile.companyId}`));
    return () => unsubscribe();
  }, [userProfile?.companyId]);

  // Firestore Sync: Load Team Data for Dashboards
  useEffect(() => {
    if (gameState !== 'dashboards' || !userProfile?.companyId) return;

    const q = query(collection(db, 'users'), where('companyId', '==', userProfile.companyId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const teamUsers = querySnapshot.docs.map(doc => ({ ...doc.data(), userId: doc.id } as UserProfile));
      
      // Calculate Team Stats
      const totalXp = teamUsers.reduce((sum, u) => sum + (u.xp || 0), 0);
      
      // Maturity Average
      const maturityMap: Record<string, number> = {
        'Produtividade': 0,
        'Criatividade': 0,
        'Automação': 0,
        'Comunicação': 0,
        'Estratégia': 0,
        'Ética/IA': 0
      };

      teamUsers.forEach(u => {
        const powers = u.unlockedPowers || [];
        const missions = Object.keys(u.missionProgress || {}).length;
        maturityMap['Produtividade'] += Math.min(80, (powers.length * 5) + 30);
        maturityMap['Criatividade'] += Math.min(85, (missions * 10) + 20);
        maturityMap['Automação'] += Math.min(75, (powers.filter((p: string) => ['9', '10', '11'].includes(p)).length * 15) + 20);
        maturityMap['Comunicação'] += Math.min(90, (powers.filter((p: string) => ['1', '2', '6', '8'].includes(p)).length * 15) + 30);
        maturityMap['Estratégia'] += Math.min(70, ((u.xp || 0) / 200) + 10);
        maturityMap['Ética/IA'] += 85;
      });

      const userCount = teamUsers.length || 1;
      const teamMaturity = Object.keys(maturityMap).map(subject => ({
        subject,
        A: Math.round(maturityMap[subject] / userCount),
        fullMark: 100
      }));

      // Top Skills Frequency
      const powerFreq: Record<string, number> = {};
      teamUsers.forEach(u => {
        (u.unlockedPowers || []).forEach((p: string) => {
          powerFreq[p] = (powerFreq[p] || 0) + 1;
        });
      });

      const topSkills = Object.entries(powerFreq)
        .map(([id, count]) => ({
          id,
          name: AI_POWERS.find(p => p.id === id)?.title || id,
          count: Math.round((count / userCount) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Team Evolution 
      const teamEvolution = [
        { name: 'Início', xp: 0 },
        { name: 'Meio', xp: Math.round(totalXp / 2) },
        { name: 'Hoje', xp: totalXp },
      ];

      setTeamStats({
        totalXp,
        teamMaturity,
        teamSkillDist: [], 
        teamEvolution,
        topSkills
      });
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    return () => unsubscribe();
  }, [gameState, userProfile]);

  // Sync Current Company Whitelist
  useEffect(() => {
    if (!userProfile?.companyId || !userProfile.isAdmin) return;
    const q = collection(db, 'companies', userProfile.companyId, 'whitelist');
    const unsubscribe = onSnapshot(q, (snap) => {
      setWhitelist(snap.docs.map(doc => doc.id));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'whitelist'));
    return () => unsubscribe();
  }, [userProfile?.companyId, userProfile?.isAdmin]);

  // Sync All Users (Global List for admin)
  useEffect(() => {
    if (gameState !== 'admin') return;
    
    // In admin mode, we can try to load all users
    // Security rules will filter based on permissions
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const users = snap.docs.map(doc => ({
        ...doc.data(),
        userId: doc.id
      } as UserProfile));
      // Deduplicate by userId
      const uniqueUsers = Array.from(new Map(users.map(u => [u.userId, u])).values());
      setAllUsers(uniqueUsers);
    }, (err) => {
      console.warn("Could not list all users (expected if not global admin):", err);
      // We fall back to partial list or just log it
    });
    return () => unsubscribe();
  }, [gameState]);

  // Sync Company Users
  useEffect(() => {
    if (!userProfile?.companyId) return;
    const q = query(collection(db, 'users'), where('companyId', '==', userProfile.companyId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const users = snap.docs.map(doc => ({
        ...doc.data(),
        userId: doc.id
      } as UserProfile));
      // Deduplicate by userId
      const uniqueUsers = Array.from(new Map(users.map(u => [u.userId, u])).values());
      setCompanyUsers(uniqueUsers);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));
    return () => unsubscribe();
  }, [userProfile?.companyId]);

  useEffect(() => {
    if (!user) return;

    let isSubscribed = true;
    const userDocRef = doc(db, 'users', user.uid);

    // Safe initialization block to prevent race conditions or destructive overwriting
    const setupUser = async () => {
      try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists() && isSubscribed) {
          const initialData: UserProfile = {
            userId: user.uid,
            email: user.email || '',
            xp: 0,
            unlockedPowers: [],
            currentMissionIndex: 0,
            missionProgress: {},
            lastActive: serverTimestamp(),
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, initialData);
        }
      } catch (err) {
        console.warn("Error checking/initializing user document:", err);
      }
    };

    let unsubscribe: (() => void) | null = null;

    setupUser().then(() => {
      if (!isSubscribed) return;

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (!isSubscribed) return;
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          
          setUserProfile(data);
          setScore(data.xp || 0);
          setUnlockedPowers(data.unlockedPowers || []);
          setCompletedQuizzes(data.completedQuizzes || []);
          
          // Load mission progress
          if (data.missionProgress) {
            const progress = data.missionProgress;
            const newCards: Record<string, string[]> = {};
            const newExplanations: Record<string, string> = {};
            const newCompleted: Record<string, boolean> = {};
            
            Object.keys(progress).forEach(missionId => {
              newCards[missionId] = progress[missionId].cards || [];
              newExplanations[missionId] = progress[missionId].explanation || '';
              newCompleted[missionId] = true; 
            });
            
            setMissionCards(newCards);
            setUserExplanations(newExplanations);
            setCompletedMissions(newCompleted);
          }
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));
    });

    return () => {
      isSubscribed = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Auto-associate company based on email whitelist after email validation
  useEffect(() => {
    if (!user || !user.email || !userProfile || userProfile.companyId || availableCompanies.length === 0) return;

    const checkAutoJoin = async () => {
      const email = user.email.toLowerCase();
      console.log("Checking if user email is whitelisted in any company:", email);
      
      for (const comp of availableCompanies) {
        try {
          const whitelistDocRef = doc(db, 'companies', comp.id, 'whitelist', email);
          const whitelistSnap = await getDoc(whitelistDocRef);
          
          if (whitelistSnap.exists()) {
            console.log(`Auto-matching found! Whitelisted in company: ${comp.name} (${comp.id})`);
            
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              companyId: comp.id
            });
            
            triggerAlert(
              `Identificamos que seu e-mail pertence à whitelist da empresa "${comp.name}". O vínculo foi realizado automaticamente!`,
              'Vínculo de Turma Automático',
              'success'
            );
            break;
          }
        } catch (error) {
          console.warn(`Error checking whitelist for company ${comp.id}:`, error);
        }
      }
    };

    checkAutoJoin();
  }, [user, userProfile?.companyId, availableCompanies]);

  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim() || !user) return;
    setIsRegisteringCompany(true);
    try {
      // Use Firestore auto-generated ID for better compatibility
      const companyRef = doc(collection(db, 'companies'));
      const companyId = companyRef.id;
      
      await setDoc(companyRef, {
        id: companyId,
        name: newCompanyName.trim(),
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
      
      // Removed: Auto-join the creator as admin of this new company
      // The user must join manually and be promoted by a global admin if needed, 
      // or join if they have the right permission flow.
      // For now, we just join them as a member (optional) or just let them select.
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        companyId: companyId,
        isAdmin: false // Explicitly NOT admin as requested
      });

      setNewCompanyName('');
      setIsCreatingNewCompany(false);
      setAdminShowAllCompanies(false);
      
      triggerAlert(`Organização "${newCompanyName}" registrada com sucesso!\n\nSelecione a turma para começar.`, 'Sucesso', 'success');
    } catch (error: any) {
      console.error('Error creating company:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      triggerAlert(`Falha ao registrar empresa: ${errorMessage}\n\nVerifique as permissões do Firebase ou sua conexão.`, 'Erro', 'error');
    } finally {
      setIsRegisteringCompany(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany || !editingCompany.name.trim()) return;
    try {
      const companyRef = doc(db, 'companies', editingCompany.id);
      await updateDoc(companyRef, {
        name: editingCompany.name
      });
      setEditingCompany(null);
      triggerAlert('Empresa atualizada com sucesso!', 'Sucesso', 'success');
    } catch (error) {
      console.error('Error updating company:', error);
      triggerAlert('Erro ao atualizar empresa.', 'Erro', 'error');
    }
  };

  const handleDeleteCompany = (companyId: string) => {
    console.log("Attempting to delete company:", companyId);
    triggerConfirm(
      'Tem certeza que deseja excluir esta turma/empresa permanentemente? Isso removerá o vínculo de todos os usuários desta turma.',
      async () => {
        try {
          if (!companyId) {
            console.error("No companyId provided to delete");
            return;
          }
          
          // 1. Clean up user profile link FIRST if matching, to close active listeners on subcollections and prevent permission errors
          if (userProfile?.companyId === companyId && user?.uid) {
            console.log("Cleaning up current user's company link first");
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { 
              companyId: null, 
              isAdmin: false,
              surveyCompleted: false // Let them onboarding again cleanly
            });
          }
          
          // 2. Perform the deletion on the database
          await deleteDoc(doc(db, 'companies', companyId));
          console.log("Delete call successful");
          
          triggerAlert('Registro excluído com sucesso do banco de dados.', 'Sucesso', 'success');
        } catch (error: any) {
          console.error('Error deleting company:', error);
          const msg = error?.message || 'Erro desconhecido';
          triggerAlert(`Erro ao excluir empresa: ${msg}`, 'Erro', 'error');
        }
      },
      'Excluir Turma/Empresa'
    );
  };

  const handleAddToWhitelist = async () => {
    if (!newWhitelistedEmail.trim() || !userProfile?.companyId) return;
    try {
      const email = newWhitelistedEmail.trim().toLowerCase();
      // Use email as doc ID to prevent duplicates
      const whitelistRef = doc(db, 'companies', userProfile.companyId, 'whitelist', email);
      await setDoc(whitelistRef, {
        email,
        companyId: userProfile.companyId,
        addedAt: serverTimestamp()
      });
      setNewWhitelistedEmail('');
    } catch (error) {
      console.error('Error whitelisting email:', error);
    }
  };

  const handleRemoveFromWhitelist = async (email: string) => {
    if (!userProfile?.companyId) return;
    try {
      const whitelistRef = doc(db, 'companies', userProfile.companyId, 'whitelist', email);
      await deleteDoc(whitelistRef);
    } catch (error) {
      console.error('Error removing from whitelist:', error);
    }
  };

  const handleBulkWhitelist = async () => {
    const companyId = userProfile?.companyId;
    if (!bulkEmailText.trim() || !companyId) return;
    
    setIsBulkLoading(true);
    try {
      const emails = bulkEmailText
        .split(/[\n,;]/)
        .map(e => e.trim().toLowerCase())
        .filter(e => e.includes('@'));
      
      const uniqueEmails = [...new Set(emails)];
      
      for (const email of uniqueEmails) {
        const whitelistRef = doc(db, `companies/${companyId}/whitelist/${email}`);
        await setDoc(whitelistRef, {
          email,
          companyId,
          addedAt: serverTimestamp()
        });
      }
      
      setBulkEmailText('');
      setIsBulkLoading(false);
      alert(`${uniqueEmails.length} e-mails adicionados com sucesso!`);
    } catch (error) {
      console.error('Error in bulk whitelist:', error);
      setIsBulkLoading(false);
    }
  };

  const handleToggleUserAdmin = async (targetUserId: string, currentIsAdmin: boolean) => {
    if (!userProfile?.isAdmin) {
      triggerAlert('Você precisa de privilégios de administrador para realizar esta ação.', 'Acesso Negado', 'error');
      return;
    }
    if (targetUserId === user?.uid) return;

    const targetAction = !currentIsAdmin ? 'Tornar Administrador' : 'Rebaixar para Participante';

    triggerConfirm(
      `Tem certeza que deseja alterar o perfil deste participante para ${!currentIsAdmin ? 'Administrador' : 'Participante'}?`,
      async () => {
        try {
          const userRef = doc(db, 'users', targetUserId);
          await updateDoc(userRef, {
            isAdmin: !currentIsAdmin
          });
          triggerAlert(`Perfil atualizado com sucesso para ${!currentIsAdmin ? 'Administrador' : 'Participante'}!`, 'Sucesso', 'success');
        } catch (error: any) {
          console.error('Error toggling admin status:', error);
          triggerAlert('Erro ao atualizar privilégios: ' + error.message, 'Erro', 'error');
        }
      },
      targetAction
    );
  };

  const handleDeleteUser = async (targetUserId: string) => {
    if (!userProfile?.isAdmin) {
      triggerAlert('Você precisa de privilégios de administrador para realizar esta ação.', 'Acesso Negado', 'error');
      return;
    }
    if (targetUserId === user?.uid) return;
    
    triggerConfirm(
      'Tem certeza que deseja EXCLUIR permanentemente este usuário da plataforma? Esta ação removerá sua conta e todo o progresso, e não pode ser desfeita.',
      async () => {
        try {
          const userRef = doc(db, 'users', targetUserId);
          await deleteDoc(userRef);
          triggerAlert('Usuário excluído com sucesso da plataforma!', 'Sucesso', 'success');
        } catch (error: any) {
          console.error('Error deleting user:', error);
          triggerAlert('Erro ao excluir usuário: ' + error.message, 'Erro', 'error');
        }
      },
      'Excluir Participante'
    );
  };

  const handleCleanupUsers = async () => {
    if (!userProfile?.companyId || !userProfile.isAdmin) return;
    
    try {
      const q = query(collection(db, 'users'), where('companyId', '==', userProfile.companyId));
      const querySnapshot = await getDocs(q);
      const now = Date.now();
      const twoHoursMs = 2 * 60 * 60 * 1000;
      
      const unauthorized = querySnapshot.docs.filter(docSnap => {
        const data = docSnap.data() as UserProfile;
        if (data.isAdmin) return false;
        
        const isWhitelisted = whitelist.includes(data.email?.toLowerCase());
        const createdAt = data.createdAt?.toDate?.()?.getTime() || 0;
        const isOldEnough = (now - createdAt) > twoHoursMs;
        
        return !isWhitelisted && isOldEnough;
      });
      
      if (unauthorized.length === 0) {
        alert("Nenhum usuário não autorizado encontrado para limpeza.");
        return;
      }
      
      if (!confirm(`Foram encontrados ${unauthorized.length} usuários não autorizados (fora da lista por mais de 2h). Deseja removê-los?`)) {
        return;
      }
      
      for (const docSnap of unauthorized) {
        // Delete from Firestore
        await deleteDoc(docSnap.ref);
      }
      
      alert(`${unauthorized.length} usuários removidos com sucesso.`);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const handleJoinCompany = async (targetCompanyId?: string) => {
    const cid = targetCompanyId || companyIdToJoin;
    if (!cid || !cid.trim() || !user) return;
    
    setIsJoining(true);
    try {
      const companyRef = doc(db, 'companies', cid);
      const companySnap = await getDoc(companyRef);
      
      if (!companySnap.exists()) {
        triggerAlert("ID de empresa/turma não encontrado.", "Erro", "error");
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        companyId: cid,
        isAdmin: true
      });

      setAdminShowAllCompanies(false);

      if (gameState !== 'admin') {
        setGameState('home');
      }
      
      setCompanyIdToJoin('');
    } catch (error: any) {
      console.error('Error joining company:', error);
      const msg = error?.message || 'Erro desconhecido';
      triggerAlert(`Erro ao selecionar a turma: ${msg}`, 'Erro', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  const currentChallenge = levelChallenges[currentChallengeIndex];

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0 && !isAnswered) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      confirmQuizAnswers(); // Auto-submit on timeout
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isAnswered, selectedSkillIds]);

  const startLevel = (level: 'PADAWAN' | 'JEDI' | 'YODA') => {
    // Filter and shuffle challenges for the selected level
    const available = ALL_CHALLENGES.filter(c => c.level === level);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);
    
    setLevelChallenges(selected);
    setSelectedLevel(level);
    setCurrentChallengeIndex(0);
    setCorrectQuizAnswersCount(0); // Reset correct answers counter
    setTimeLeft(60);
    setIsActive(true);
    setIsAnswered(false);
    setIsAnsweredCorrectly(false);
    setSelectedSkillIds([]);
    setAiFeedback(null);
    setGameState('game');
  };

  const toggleSkillId = (skillId: number) => {
    if (isAnswered) return;
    setSelectedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const confirmQuizAnswers = async () => {
    if (isAnswered || !user || !currentChallenge) return;

    setIsAnswered(true);
    setIsActive(false);

    // Evaluate exact match correctness
    const allCorrectSelected = currentChallenge.correctSkillIds.every(id => selectedSkillIds.includes(id));
    const noIncorrectSelected = !currentChallenge.incorrectSkillIds.some(id => selectedSkillIds.includes(id));
    const isCorrect = allCorrectSelected && noIncorrectSelected;
    setIsAnsweredCorrectly(isCorrect);

    // Filter correct skills names for feedback
    const correctPowersList = AI_POWERS.filter(p => currentChallenge.correctSkillIds.includes(Number(p.id)));
    const correctAnswerTitle = correctPowersList.map(p => p.title).join(', ');

    // Filter selected skills names for feedback
    const selectedPowersList = AI_POWERS.filter(p => selectedSkillIds.includes(Number(p.id)));
    const selectedAnswerTitle = selectedPowersList.length > 0 
      ? selectedPowersList.map(p => p.title).join(', ') 
      : 'Nenhuma/Tempo Esgotado';

    // Call AI Feedback API
    setIsAiFeedbackLoading(true);
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch('/api/quiz-feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          scenario: currentChallenge.scenario,
          correctAnswer: correctAnswerTitle || 'Desconhecida',
          selectedAnswer: selectedAnswerTitle,
          level: selectedLevel
        }),
      });
      const data = await response.json();
      setAiFeedback(data.feedback || data.data?.feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      setAiFeedback(currentChallenge.explanation); // Fallback to static explanation
    } finally {
      setIsAiFeedbackLoading(false);
    }
    
    // Sync points and unlocks
    let newScore = score;
    let newUnlockedList = [...unlockedPowers];

    if (isCorrect) {
      setCorrectQuizAnswersCount(prev => prev + 1);
      // Points calculation: Base 1000 + Time Bonus (up to 500)
      const timeBonus = Math.floor((timeLeft / 60) * 500);
      const pointsEarned = 1000 + timeBonus;
      newScore = score + pointsEarned;

      // Unlock all correct skills
      currentChallenge.correctSkillIds.forEach(id => {
        const idStr = String(id);
        if (!newUnlockedList.includes(idStr)) {
          newUnlockedList.push(idStr);
        }
      });

      setScore(newScore);
      setUnlockedPowers(newUnlockedList);
    }

    // Explicitly sync to firestore regardless of correctness (e.g. tracking XP state, or updating unlocked listed)
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        xp: newScore,
        unlockedPowers: newUnlockedList,
        lastActive: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const nextChallenge = async () => {
    if (!user) return;

    if (currentChallengeIndex < levelChallenges.length - 1) {
      const nextIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIndex);
      setIsAnswered(false);
      setIsAnsweredCorrectly(false);
      setSelectedSkillIds([]);
      setAiFeedback(null);
      setTimeLeft(60);
      setIsActive(true);
    } else {
      // Save 100% correctness results to unlock progression levels
      const totalCorrect = correctQuizAnswersCount;
      const totalQuestions = levelChallenges.length;
      
      if (totalCorrect === totalQuestions && totalQuestions > 0 && selectedLevel) {
        if (!completedQuizzes.includes(selectedLevel)) {
          const updatedQuizzes = [...completedQuizzes, selectedLevel];
          setCompletedQuizzes(updatedQuizzes);
          try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
              completedQuizzes: updatedQuizzes,
              lastActive: serverTimestamp()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
          }
        }
      }
      setGameState('results');
    }
  };

  const restartGame = async () => {
    if (!user) return;
    
    setScore(0);
    setCurrentChallengeIndex(0);
    setIsAnswered(false);
    setIsAnsweredCorrectly(false);
    setSelectedSkillIds([]);
    setAiFeedback(null);
    setGameState('game');

    // Reset progress in DB (optional, maybe user wants to keep XP? Let's keep XP but reset mission index)
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        currentMissionIndex: 0,
        lastActive: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zello-black flex items-center justify-center">
        <div className="relative w-20 h-20 animate-spin">
          <Zap className="text-zello-orange w-full h-full fill-zello-orange" />
          <div className="absolute inset-0 bg-zello-orange/20 blur-xl rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-zello-black flex items-center justify-center">
        <div className="relative w-20 h-20 animate-spin">
          <Zap className="text-zello-orange w-full h-full fill-zello-orange" />
          <div className="absolute inset-0 bg-zello-orange/20 blur-xl rounded-full"></div>
        </div>
      </div>
    );
  }

  const isSurveyCompleted = !!(userProfile.surveyCompleted || (userProfile.skillsSurvey && (userProfile.skillsSurvey as any).surveyCompleted));

  if (!isSurveyCompleted) {
    return (
      <OnboardingScreen 
        user={user}
        availableCompanies={availableCompanies}
        initialCompanyId={(userProfile.companyId && userProfile.companyId !== 'null' && userProfile.companyId !== 'undefined') ? userProfile.companyId : ''}
        onComplete={async (companyId, skillsSurvey) => {
          if (!companyId || companyId === 'null' || companyId === 'undefined') {
            console.error("onComplete called with invalid companyId:", companyId);
            return;
          }
          try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
              companyId,
              skillsSurvey,
              surveyCompleted: true,
              lastActive: serverTimestamp()
            });
          } catch (err: any) {
            console.error("Firestore save exception:", err);
            handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
          }
        }}
      />
    );
  }

  return (
    <AppStateProvider gameState={gameState}>
      <div className="min-h-screen bg-zello-black text-slate-100 flex flex-col relative overflow-hidden font-sans border-t-8 md:border-8 border-zello-black/20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-zello-orange/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Navigation */}
      <Navigation
        gameState={gameState}
        setGameState={setGameState}
        score={score}
        currentCompany={currentCompany}
        isAdmin={!!userProfile?.isAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={() => signOut(auth)}
        currentRank={currentRank}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar pb-32">
        <AnimatePresence mode="wait">
          {gameState === 'admin' && (
            <motion.div
              key="admin-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-full p-8 max-w-6xl mx-auto space-y-12"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-[10px] font-black uppercase tracking-widest">
                    <Shield size={12} className="fill-zello-orange" />
                    Portal do Administrador
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white uppercase italic">
                    {userProfile?.companyId && !adminShowAllCompanies && !isCreatingNewCompany && !editingCompany ? 'GESTÃO DA' : 'CONTROLE DE'} <span className="text-zello-orange font-black">{userProfile?.companyId && !adminShowAllCompanies && !isCreatingNewCompany && !editingCompany ? 'TURMA' : 'ACESSO'}</span>
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  {userProfile?.companyId && !adminShowAllCompanies && (
                    <button
                      onClick={() => setAdminShowAllCompanies(true)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:text-white transition-all flex items-center gap-2"
                    >
                      <LucideIcons.List size={14} />
                      Ver Todas Empresas
                    </button>
                  )}
                  {userProfile?.companyId && adminShowAllCompanies && (
                    <button
                      onClick={() => setAdminShowAllCompanies(false)}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:text-white transition-all flex items-center gap-2"
                    >
                      <LucideIcons.Building size={14} />
                      Gerenciar Minha Empresa
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (adminShowAllCompanies && userProfile?.companyId) {
                        setAdminShowAllCompanies(false);
                      } else {
                        setGameState('home');
                      }
                    }}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  >
                    <LucideIcons.ArrowLeft size={20} />
                  </button>
                </div>
              </div>

              {(!userProfile?.companyId || adminShowAllCompanies) ? (
                <div key="company-setup-manager-v2" className="space-y-8">
                  {isCreatingNewCompany || editingCompany ? (
                    <div className="max-w-xl mx-auto p-10 bg-white/5 border border-zello-orange/30 rounded-[40px] space-y-8 text-left shadow-[0_0_50px_rgba(240,90,40,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zello-orange to-transparent"></div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                          {editingCompany ? 'Editar Dados da Empresa' : 'Cadastrar Nova Empresa'}
                        </h3>
                        <button 
                          onClick={() => { setIsCreatingNewCompany(false); setEditingCompany(null); }}
                          className="p-2 text-slate-500 hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-zello-orange uppercase tracking-[.2em] px-1">Nome da Organização ou Turma</label>
                          <input 
                            type="text" 
                            autoFocus
                            value={editingCompany ? editingCompany.name : newCompanyName}
                            onChange={(e) => editingCompany ? setEditingCompany({...editingCompany, name: e.target.value}) : setNewCompanyName(e.target.value)}
                            placeholder="Ex: Zello AI Academy"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-lg placeholder:text-slate-600 focus:border-zello-orange focus:bg-white/10 outline-none transition-all"
                          />
                        </div>
                        <p className="text-xs text-slate-500 font-medium px-1">
                          {editingCompany ? 'As alterações serão aplicadas a todos os membros vinculados.' : 'Ao criar uma nova empresa, você será automaticamente definido como administrador dela.'}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={editingCompany ? handleUpdateCompany : handleCreateCompany}
                          disabled={isRegisteringCompany || (editingCompany ? !editingCompany.name.trim() : !newCompanyName.trim())}
                          className="flex-1 py-5 bg-zello-orange text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:brightness-110 shadow-[0_0_30px_rgba(240,90,40,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isRegisteringCompany ? <LucideIcons.Loader2 className="animate-spin" size={20} /> : (editingCompany ? 'Salvar Alterações' : 'Concluir Cadastro')}
                        </button>
                        <button
                          onClick={() => { setIsCreatingNewCompany(false); setEditingCompany(null); }}
                          className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all"
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-6 rounded-[32px] border border-white/10">
                        <div className="space-y-1">
                          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Empresas & Turmas</h2>
                          <p className="text-sm text-slate-500 font-medium">Selecione sua organização para iniciar a jornada.</p>
                        </div>
                        <button
                          onClick={() => setIsCreatingNewCompany(true)}
                          className="px-8 py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(240,90,40,0.3)] transition-all flex items-center gap-3"
                        >
                          <LucideIcons.PlusCircle size={20} />
                          Registrar Empresa
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableCompanies.length > 0 ? (
                          availableCompanies.map((comp, idx) => (
                            <div 
                              key={`company-listing-card-v6-${comp.id}-${idx}-${availableCompanies.length}-${comp.name.substring(0,3)}`}
                              className="group relative p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-[40px] transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[280px]"
                            >
                              <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-start">
                                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-zello-orange/30 group-hover:bg-zello-orange/10 transition-all">
                                    <LucideIcons.Building size={28} className="text-zello-orange" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setEditingCompany(comp)}
                                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                                      title="Editar"
                                    >
                                      <LucideIcons.Settings size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCompany(comp.id);
                                      }}
                                      className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                                      title="Excluir"
                                    >
                                      <LucideIcons.Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-zello-orange transition-colors">{comp.name}</h3>
                                  <div className="flex items-center gap-3">
                                    <code className="text-[10px] bg-zello-orange/10 px-3 py-1 rounded-full text-zello-orange font-bold font-mono tracking-widest">{comp.id}</code>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinCompany(comp.id);
                                }}
                                className="relative z-10 w-full mt-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl group-hover:bg-zello-orange group-hover:border-zello-orange transition-all flex items-center justify-center gap-3 cursor-pointer"
                              >
                                Selecionar esta Turma
                                <ChevronRight size={14} />
                              </button>
                              
                              <LucideIcons.Building className="absolute -bottom-4 -right-4 text-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none" size={200} />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-24 text-center space-y-6 bg-white/5 border border-white/10 rounded-[40px] border-dashed">
                            <LucideIcons.Building2 size={64} className="text-slate-800 mx-auto" />
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-slate-600 uppercase tracking-tight">Nenhuma turma registrada</h4>
                              <p className="text-slate-500 max-w-xs mx-auto text-sm">Seja o pioneiro e comece a jornada de IA na sua organização.</p>
                            </div>
                            <button 
                              onClick={() => setIsCreatingNewCompany(true)}
                              className="px-8 py-4 bg-zello-orange/10 border border-zello-orange/30 text-zello-orange text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zello-orange hover:text-white transition-all"
                            >
                              Registrar Primeiro Grupo
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Global User List Section */}
                      <div className="pt-16 pb-12 space-y-10 border-t border-white/5">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                               <LucideIcons.Users size={12} />
                               Diretório Global
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">TODOS OS <span className="text-zello-orange">PARTICIPANTES</span></h2>
                            <p className="text-sm text-slate-500 font-medium">Lista de todos os usuários que acessaram a plataforma e seus níveis de acesso.</p>
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL DE USUÁRIOS</span>
                              <div className="text-2xl font-black text-white tabular-nums italic">{allUsers.length}</div>
                            </div>
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ADMINS</span>
                              <div className="text-2xl font-black text-zello-orange tabular-nums italic">{allUsers.filter(u => u.isAdmin).length}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md">
                          <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                            <table className="w-full text-left">
                              <thead className="bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                                <tr key="global-users-header-row-st">
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Participante</th>
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">XP Acumulado</th>
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Rank</th>
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Empresa / Turma</th>
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Atributo</th>
                                  <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {allUsers.map((u, idx) => (
                                  <tr key={`global-list-usr-row-v6-${u.userId || 'u'}-${u.email || 'e'}-${idx}-${allUsers.length}`} className="hover:bg-white/5 transition-colors group/row">
                                    <td className="p-8">
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-zello-orange/10 flex items-center justify-center text-zello-orange font-black text-lg shadow-inner">
                                          {u.email?.[0].toUpperCase() || '?'}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-base font-bold text-white group-hover/row:text-zello-orange transition-colors">{u.email}</span>
                                          <span className="text-[10px] text-slate-500 font-mono tracking-wider opacity-60">ID: {u.userId}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-8 text-center">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-zello-orange/10 rounded-xl text-zello-orange text-sm font-black tabular-nums italic">
                                        {u.xp || 0} XP
                                      </div>
                                    </td>
                                    <td className="p-8 text-center">
                                      <div className={`text-xs font-black uppercase italic ${getRank(u.xp || 0).color}`}>
                                        {getRank(u.xp || 0).name}
                                      </div>
                                    </td>
                                    <td className="p-8 text-center">
                                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {availableCompanies.find(c => c.id === u.companyId)?.name || (
                                          <span className="text-slate-600 italic">Sem Turma</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-8 text-center">
                                      <button
                                        onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                                        disabled={u.userId === user?.uid}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${u.isAdmin ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.4)]' : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'}`}
                                      >
                                        {u.isAdmin ? 'ADMINISTRADOR' : 'PARTICIPANTE'}
                                      </button>
                                    </td>
                                    <td className="p-8 text-right">
                                      <div className="flex items-center justify-end gap-3">
                                        <button
                                          onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                                          disabled={u.userId === user?.uid}
                                          className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-20"
                                          title={u.isAdmin ? "Demitir Admin" : "Tornar Admin"}
                                        >
                                          <LucideIcons.Shield size={18} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(u.userId)}
                                          disabled={u.userId === user?.uid}
                                          className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all disabled:opacity-20"
                                          title="Excluir Usuário"
                                        >
                                          <LucideIcons.UserMinus size={18} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {allUsers.length === 0 && (
                                  <tr key="global-users-empty-placeholder-v5">
                                    <td colSpan={6} className="p-32 text-center">
                                      <div className="space-y-4">
                                        <LucideIcons.UserSearch size={64} className="text-slate-800 mx-auto" />
                                        <p className="text-slate-500 font-bold italic uppercase tracking-widest">Nenhum usuário cadastrado no sistema</p>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div key={`admin-management-panel-final-${userProfile.companyId}`} className="space-y-10">
                  {/* Company Info Header */}
                  <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-zello-orange"></div>
                    <div className="flex items-center gap-8 relative z-10">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                        <LucideIcons.Building size={40} className="text-zello-orange" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">{currentCompany?.name || 'Carregando...'}</h2>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${userProfile?.isAdmin ? 'bg-zello-orange text-white shadow-lg shadow-zello-orange/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                            {userProfile?.isAdmin ? 'Administrador' : 'Observador'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">IDENTIFICADOR: {userProfile?.companyId}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{companyUsers.length} Participantes</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={async () => {
                        if (confirm("Tem certeza que deseja sair desta empresa? Seus dados de XP serão mantidos, mas você perderá o vínculo com a turma.")) {
                          await updateDoc(doc(db, 'users', user?.uid!), {
                            companyId: null,
                            isAdmin: false
                          });
                        }
                      }}
                      className="px-6 py-3 bg-red-500/5 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10"
                    >
                      Desvincular da Turma
                    </button>
                    
                    <LucideIcons.ShieldCheck className="absolute -bottom-10 -right-10 text-white opacity-[0.02]" size={280} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                      {userProfile.isAdmin ? (
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                          <LucideIcons.UserPlus size={120} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Autorizar Acesso</h3>
                          <p className="text-sm text-slate-500 font-medium">Adicione e-mails à lista de permissão da turma.</p>
                        </div>

                        <div className="space-y-6">
                          <div className="flex gap-2">
                             <input 
                              type="email" 
                              value={newWhitelistedEmail}
                              onChange={(e) => setNewWhitelistedEmail(e.target.value)}
                              placeholder="colaborador@empresa.com"
                              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-zello-orange/50 outline-none transition-all"
                            />
                            <button
                              onClick={handleAddToWhitelist}
                              disabled={!newWhitelistedEmail.includes('@')}
                              className="px-6 bg-zello-orange text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:brightness-110 transition-all disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Carga em Lote (CSV/Lista)</label>
                            <textarea
                              value={bulkEmailText}
                              onChange={(e) => setBulkEmailText(e.target.value)}
                              placeholder="cole e-mails separados por linha..."
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-slate-600 focus:border-zello-orange/50 outline-none transition-all resize-none font-mono"
                            />
                            <button
                              onClick={handleBulkWhitelist}
                              disabled={isBulkLoading || !bulkEmailText.trim()}
                              className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                              {isBulkLoading ? <LucideIcons.Loader2 size={16} className="animate-spin" /> : <LucideIcons.UploadCloud size={16} />}
                              Processar Lista
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-3">
                          <div className="flex items-center gap-2 text-blue-400">
                             <LucideIcons.Info size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Segurança</span>
                          </div>
                          <p className="text-[11px] text-blue-300/70 font-medium leading-relaxed">
                            Apenas usuários nesta lista podem acessar a turma após o período de tolerância inicial.
                          </p>
                        </div>
                      </div>
                      ) : (
                        <div className="p-8 bg-zello-orange/5 border border-zello-orange/20 rounded-[40px] space-y-6 text-center">
                          <LucideIcons.Lock className="text-zello-orange mx-auto" size={40} />
                          <div className="space-y-2">
                             <h4 className="text-lg font-black text-white uppercase italic">Modo Visualização</h4>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium">Você pode ver os participantes da sua turma, mas a gestão da lista de autorizados é exclusiva para administradores.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                       {/* Whitelist List (Admin Only) */}
                       {userProfile.isAdmin && (
                         <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden group">
                          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <div className="space-y-1">
                              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Whitelist Autorizada</h3>
                              <p className="text-xs text-slate-500 font-medium">{whitelist.length} e-mails na base de dados</p>
                            </div>
                            <button
                              onClick={handleCleanupUsers}
                              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all flex items-center gap-3"
                            >
                              <LucideIcons.ShieldAlert size={14} />
                              Limpeza de Inativos
                            </button>
                          </div>
                          <div className="p-6 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {whitelist.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {whitelist.slice().sort().map((email, idx) => (
                                  <div key={`whitelist-email-item-${email}-${idx}-${whitelist.length}`} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group/email hover:border-zello-orange/30 transition-all">
                                    <span className="text-sm font-bold text-slate-300 truncate mr-4">{email}</span>
                                    <button 
                                      onClick={() => handleRemoveFromWhitelist(email)}
                                      className="p-2 text-slate-600 hover:text-red-400 transition-all sm:opacity-0 group-hover/email:opacity-100"
                                    >
                                      <LucideIcons.XCircle size={18} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-16 space-y-4">
                                <LucideIcons.Mail className="text-slate-800 mx-auto" size={40} />
                                <p className="text-slate-500 text-sm font-medium italic">Sua lista de autorizados está vazia.</p>
                              </div>
                            )}
                          </div>
                        </div>
                       )}

                       {/* User Management Section (Always visible but restricted actions) */}
                       <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Participantes da Turma</h3>
                            <p className="text-xs text-slate-500 font-medium">Visualizando usuários ativos na organização</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                             <LucideIcons.Users size={20} />
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-white/5">
                              <tr key="company-users-header-row">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Colaborador</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">XP</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Nível</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Poderes</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Missão</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Última Atividade</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Papel</th>
                                {userProfile.isAdmin && <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Controles</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {companyUsers.map((u, idx) => (
                                <tr key={`company-user-row-mng-v6-${u.userId || 'u'}-${u.email || 'e'}-${idx}-${companyUsers.length}`} className="hover:bg-white/5 transition-colors group/row">
                                  <td className="p-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-zello-orange/10 flex items-center justify-center text-zello-orange font-black text-sm">
                                        {u.email?.[0].toUpperCase() || '?'}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover/row:text-zello-orange transition-colors">{u.email}</span>
                                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">UID: {u.userId.slice(0, 8)}...</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-6 text-center tabular-nums">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zello-orange/10 rounded-full text-zello-orange text-xs font-black italic">
                                      {u.xp || 0}
                                    </div>
                                  </td>
                                  <td className="p-6 text-center">
                                    <div className={`text-[10px] font-black uppercase italic ${getRank(u.xp || 0).color}`}>
                                      {getRank(u.xp || 0).name}
                                    </div>
                                  </td>
                                  <td className="p-6 text-center tabular-nums">
                                    <div className="text-sm font-black text-white">
                                      {(u.unlockedPowers || []).length}
                                    </div>
                                  </td>
                                  <td className="p-6 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      {MISSIONS[u.currentMissionIndex]?.title || `Início (${u.currentMissionIndex || 0})`}
                                    </div>
                                  </td>
                                  <td className="p-6 text-center">
                                    <div className="text-[10px] text-slate-500 font-medium">
                                      {u.lastActive?.toDate ? u.lastActive.toDate().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Nunca'}
                                    </div>
                                  </td>
                                  <td className="p-6 text-center">
                                    <button
                                      onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                                      disabled={u.userId === user?.uid}
                                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${u.isAdmin ? 'bg-zello-orange text-white shadow-[0_0_10px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'}`}
                                    >
                                      {u.isAdmin ? 'ADMIN' : 'USER'}
                                    </button>
                                  </td>
                                  {userProfile.isAdmin && (
                                    <td className="p-6">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                                          disabled={u.userId === user?.uid}
                                          title={u.isAdmin ? 'Remover Privilégios' : 'Tornar Administrador'}
                                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-30"
                                        >
                                          <LucideIcons.Shield size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(u.userId)}
                                          disabled={u.userId === user?.uid}
                                          title="Excluir da Plataforma"
                                          className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all disabled:opacity-30"
                                        >
                                          <LucideIcons.UserMinus size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                              {companyUsers.length === 0 && (
                                <tr key="company-users-empty-placeholder-v2">
                                  <td colSpan={userProfile.isAdmin ? 8 : 7} className="p-20 text-center space-y-4">
                                     <LucideIcons.Users2 className="text-slate-800 mx-auto" size={48} />
                                     <p className="text-slate-500 font-medium italic">Nenhum outro participante encontrado nesta turma.</p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {gameState === 'autoconhecimento' && (
            <motion.div
              key="autoconhecimento"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto p-6 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                    Vínculo de Turma / Empresa
                  </h1>
                  <p className="text-sm text-slate-400 mt-2 font-medium">
                    Atualize seu vínculo de turma/empresa de forma instantânea.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={async () => {
                      if (!window.confirm("ATENÇÃO: Deseja realmente REINICIAR seu perfil do zero?\n\nIsso limpará sua empresa, suas respostas de quizzes e seu XP, enviando você de volta ao cadastro inicial.")) return;
                      try {
                        const userDocRef = doc(db, 'users', user!.uid);
                        await updateDoc(userDocRef, {
                          companyId: null,
                          skillsSurvey: null,
                          surveyCompleted: false,
                          xp: 0,
                          unlockedPowers: [],
                          currentMissionIndex: 0,
                          missionProgress: {}
                        });
                        alert("Perfil reiniciado com sucesso! Redirecionando...");
                        window.location.reload();
                      } catch (err: any) {
                        console.error("Erro ao reiniciar perfil:", err);
                        alert("Falha ao reiniciar: " + err?.message);
                      }
                    }}
                    className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-neutral-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                  >
                    <LucideIcons.RefreshCcw size={14} />
                    Reiniciar Perfil (Do Zero)
                  </button>
                  <button
                    onClick={() => setGameState('home')}
                    className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Voltar
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(240,90,40,0.03)] my-4 relative">
                <OnboardingScreen 
                  user={user}
                  availableCompanies={availableCompanies}
                  isEditMode={true}
                  initialCompanyId={(userProfile?.companyId && userProfile.companyId !== 'null' && userProfile.companyId !== 'undefined') ? userProfile.companyId : ''}
                  initialSkillsSurvey={userProfile?.skillsSurvey}
                  onComplete={async (companyId, skillsSurvey) => {
                    if (!companyId || companyId === 'null' || companyId === 'undefined') {
                      console.error("onComplete called with invalid companyId in profile edit:", companyId);
                      return;
                    }
                    try {
                      const userDocRef = doc(db, 'users', user!.uid);
                      await updateDoc(userDocRef, {
                        companyId,
                        skillsSurvey,
                        surveyCompleted: true,
                        lastActive: serverTimestamp()
                      });
                      alert('Vínculo de empresa salvo com sucesso!');
                      setGameState('home');
                    } catch (err: any) {
                      console.error("Exception updating profile:", err);
                      handleFirestoreError(err, OperationType.UPDATE, `users/${user!.uid}`);
                    }
                  }}
                />
              </div>
            </motion.div>
          )}

          {gameState === 'home' && (
            <HomeSectionView
              key="home-section-view-call"
              score={score}
              setGameState={setGameState}
              setActiveVideo={setActiveVideo}
            />
          )}

          {gameState === 'level-selection' && (
            <LevelSelectionView
              key="level-selection-view-call"
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              setGameState={setGameState}
              setActiveVideo={setActiveVideo}
              startLevel={startLevel}
              completedQuizzes={completedQuizzes}
            />
          )}

          {gameState === 'game' && (
            <QuizSectionView
              key="quiz-section-view-call"
              levelChallenges={levelChallenges}
              currentChallengeIndex={currentChallengeIndex}
              currentChallenge={currentChallenge}
              selectedLevel={selectedLevel}
              score={score}
              selectedSkillIds={selectedSkillIds}
              isAnswered={isAnswered}
              isAnsweredCorrectly={isAnsweredCorrectly}
              timeLeft={timeLeft}
              aiFeedback={aiFeedback}
              isAiFeedbackLoading={isAiFeedbackLoading}
              toggleSkillId={toggleSkillId}
              confirmAnswers={confirmQuizAnswers}
              nextChallenge={nextChallenge}
              setActiveVideo={setActiveVideo}
            />
          )}

          {gameState === 'missions' && (
            <MissionsSectionView
              key="missions-section-view-call"
              user={user}
              completedMissions={completedMissions}
              setCompletedMissions={setCompletedMissions}
              missionCards={missionCards}
              setMissionCards={setMissionCards}
              userExplanations={userExplanations}
              setUserExplanations={setUserExplanations}
              advisorResponses={advisorResponses}
              setAdvisorResponses={setAdvisorResponses}
              selectedMission={selectedMission}
              setSelectedMission={setSelectedMission}
              setIsSelectingForMission={setIsSelectingForMission}
              setIsPresentingDeck={setIsPresentingDeck}
              setGameState={setGameState}
              setActiveVideo={setActiveVideo}
              isRewriting={isRewriting}
              setIsRewriting={setIsRewriting}
              isAskingAdvisor={isAskingAdvisor}
              setIsAskingAdvisor={setIsAskingAdvisor}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              setIsAdvisorModalOpen={setIsAdvisorModalOpen}
              currentCompany={currentCompany}
              setViewingPower={setViewingPower}
            />
          )}

          {gameState === 'deck' && (
            <DeckSectionView
              key="deck-section-view-call"
              isSelectingForMission={isSelectingForMission}
              setIsSelectingForMission={setIsSelectingForMission}
              selectedMission={selectedMission}
              missionCards={missionCards}
              setMissionCards={setMissionCards}
              setViewingPower={setViewingPower}
              setGameState={setGameState}
              setActiveVideo={setActiveVideo}
              gameState={gameState}
            />
          )}

          {gameState === 'dashboards' && (
            <motion.div 
              key="dashboards-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-[1400px] mx-auto p-6 md:p-12 mb-32"
            >
              <DashboardSection 
                score={score} 
                currentRank={currentRank}
                unlockedPowers={unlockedPowers}
                completedMissions={completedMissions}
                missionCards={missionCards}
                teamStats={teamStats}
                userProfile={userProfile}
                onWatchVideo={(title, url) => setActiveVideo({ title, url })}
              />
            </motion.div>
          )}

          {gameState === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-12 py-12 text-center"
            >
              <div className="space-y-6">
                <div className="relative inline-block">
                  <div className="w-48 h-48 rounded-full border-8 border-zello-orange p-2 mx-auto overflow-hidden bg-zello-black/40">
                    <img 
                      src={currentRank.image} 
                      alt={currentRank.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-zello-orange text-white font-black uppercase italic text-lg rounded-xl shadow-[0_4px_20px_rgba(240,90,40,0.4)]">
                    {currentRank.name}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">QUIZ <br className="md:hidden"/> CONCLUÍDO!</h2>
                  <p className="text-xl text-slate-400 font-medium">Sua sabedoria agora é de um {currentRank.name}.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
                <div className="flex-1 p-8 rounded-3xl bg-white/5 border border-white/10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">XP Adquirido</span>
                  <div className="text-5xl font-black text-zello-orange mt-2">{score.toLocaleString()}</div>
                </div>
                <div className="flex-1 p-8 rounded-3xl bg-white/5 border border-white/10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Habilidades Coletadas</span>
                  <div className="text-5xl font-black text-white mt-2">{unlockedPowers.length}</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setGameState('level-selection')}
                  className="px-10 py-5 bg-zello-orange text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(240,90,40,0.3)]"
                >
                  Jogar Novamente
                </button>
                <button 
                  onClick={() => setGameState('dashboards')}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                >
                  Ver Dashboard
                </button>
                <button 
                  onClick={() => setGameState('deck')}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                >
                  Ver Meu Deck
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewingPower && (
            <motion.div
              key="power-details-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zello-black/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-[800px] max-h-[88vh] bg-zello-black border-2 border-zello-orange rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(240,90,40,0.3)] flex flex-col"
              >
                {/* Scrollable Container with sequential details 1 to 8 */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-6">
                  {/* 1. Categoria */}
                  {viewingPower.category && (
                    <div id="pwr-detail-category" className="flex justify-start">
                      <div className="px-3 py-1 bg-zello-orange/10 border border-zello-orange/20 rounded-full">
                        <span className="text-[10px] font-black text-zello-orange uppercase tracking-widest">
                          {viewingPower.category}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. Nome da Habilidade */}
                  {viewingPower.title && (
                    <h2 id="pwr-detail-title" className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tight leading-none">
                      {viewingPower.title}
                    </h2>
                  )}

                  {/* 3. Número da Habilidade */}
                  {viewingPower.id && (
                    <div id="pwr-detail-number" className="flex items-center gap-2 text-slate-400">
                      <span className="text-[9px] font-black text-zello-orange uppercase tracking-[0.2em] leading-none">
                        Habilidade
                      </span>
                      <span className="text-2xl font-black text-white italic tracking-tighter leading-none">
                        #{viewingPower.id.padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  {/* 4. Imagem */}
                  {viewingPower.image && (
                    <div id="pwr-detail-image" className="rounded-2xl overflow-hidden border border-white/10 h-64 md:h-80 w-full relative">
                      <img 
                        src={viewingPower.image} 
                        alt={viewingPower.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zello-black via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* 5. Ícone */}
                  {viewingPower.icon && (
                    <div id="pwr-detail-icon" className="flex justify-start">
                      <div className="w-14 h-14 rounded-2xl bg-zello-orange/20 border border-zello-orange/30 flex items-center justify-center text-zello-orange shadow-[0_0_20px_rgba(240,90,40,0.3)]">
                        {React.createElement((LucideIcons as any)[viewingPower.icon] || LucideIcons.Zap, { size: 28 })}
                      </div>
                    </div>
                  )}

                  {/* 6. Contexto de Aplicação */}
                  {viewingPower.applicationContext && (
                    <div id="pwr-detail-context" className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zello-orange">
                        Contexto de Aplicação
                      </h4>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed font-semibold">
                        {viewingPower.applicationContext}
                      </p>
                    </div>
                  )}

                  {/* 7. Exemplo Prático */}
                  {viewingPower.practicalExample && (
                    <div id="pwr-detail-example" className="space-y-2">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zello-orange">
                        Exemplo Prático
                      </h4>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {viewingPower.practicalExample}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 8. Benefícios Esperados */}
                  {viewingPower.expectedBenefits && 
                   Array.isArray(viewingPower.expectedBenefits) && 
                   viewingPower.expectedBenefits.filter(Boolean).length > 0 && (
                    <div id="pwr-detail-benefits" className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zello-orange">
                        Benefícios Esperados
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {viewingPower.expectedBenefits.filter(Boolean).map((benefit, idx) => (
                          <div key={`pwr-benefit-${idx}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-zello-orange/20 transition-all font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-zello-orange shrink-0 shadow-[0_0_8px_rgba(240,90,40,1)]"></div>
                            <span className="text-xs text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. Botão "Voltar ao Deck" */}
                <div id="pwr-detail-footer" className="p-6 md:p-8 pt-3 flex justify-end shrink-0 border-t border-white/5">
                  <button
                    onClick={() => setViewingPower(null)}
                    className="px-8 py-3.5 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <LucideIcons.ArrowLeft size={14} />
                    Voltar ao Deck
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPresentingDeck && selectedMission && (
            <motion.div
              key="presentation-deck-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex flex-col items-center p-6 bg-zello-black/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-8 right-8">
                <button 
                  onClick={() => setIsPresentingDeck(false)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="w-full max-w-[1600px] space-y-12 pb-24 px-4">
                <div className="text-center space-y-4">
                  <div className="px-4 py-2 bg-zello-orange/10 border border-zello-orange/20 rounded-full inline-block">
                    <span className="text-xs font-black text-zello-orange uppercase tracking-[0.3em]">{selectedMission.title}</span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Deck de Apresentação</h2>
                  <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto">Cards selecionados para a solução estratégica da missão.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-8">
                  {(missionCards[selectedMission.id] || [])
                    .map(id => AI_POWERS.find(p => p.id === id))
                    .filter((p): p is AIPower => !!p)
                    .map((power, idx, arr) => {
                      return (
                        <motion.div
                          key={`present-deck-${selectedMission.id}-${power.id}-${idx}-${arr.length}`}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative group cursor-pointer"
                        >
                          <SuperPowerCard 
                            power={power} 
                            isLocked={false} 
                            onClick={() => setViewingPower(power)}
                          />
                          <div className="absolute bottom-4 right-4 w-10 h-10 bg-zello-orange rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(240,90,40,0.5)] z-40 border-2 border-white/20">
                            {idx + 1}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] w-full">
                  <h4 className="text-xs font-black text-zello-orange uppercase tracking-widest mb-4">Estratégia do Time:</h4>
                  <p className="text-2xl md:text-4xl font-bold italic text-white leading-relaxed">
                    "{userExplanations[selectedMission.id] || "Nenhuma descrição fornecida."}"
                  </p>
                </div>

                <div className="flex justify-center pt-8">
                  <div className="flex items-center gap-8 p-6 bg-white/5 rounded-full border border-white/10">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Votos</span>
                      <div className="flex items-center gap-2">
                        <LucideIcons.ThumbsUp className="text-zello-orange" size={24} />
                        <span className="text-3xl font-black text-white tabular-nums">0</span>
                      </div>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-xl font-bold text-zello-orange uppercase tracking-tight">Em Avaliação</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pt-12 pb-8">
                  <button
                    onClick={() => setIsPresentingDeck(false)}
                    className="px-12 py-5 bg-zello-orange text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_rgba(240,90,40,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
                  >
                    <LucideIcons.ArrowLeft size={20} />
                    Voltar para a Missão
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdvisorModalOpen && selectedMission && (
            <motion.div
              key="advisor-response-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zello-black/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-[1200px] max-h-[85vh] bg-zello-black border-2 border-zello-orange rounded-[40px] shadow-[0_0_100px_rgba(240,90,40,0.3)] relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <LucideIcons.Quote size={120} className="text-zello-orange" />
                </div>

                <div className="p-6 md:p-8 pb-3 relative z-10 shrink-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full border-4 border-zello-orange overflow-hidden bg-white/10 shadow-[0_0_30px_rgba(240,90,40,0.5)]">
                      <img src="/Mestre Nomura.png" alt="Mestre Nomura" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-zello-orange text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Recado do Mestre Nomura</div>
                      <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tight leading-none">{selectedMission.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6 relative z-10 custom-scrollbar">
                  <div className="text-slate-200 text-sm md:text-base italic leading-relaxed whitespace-pre-line font-medium border-l-4 border-zello-orange pl-6 md:pl-10 py-1.5">
                    {advisorResponses[selectedMission.id]}
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-3 flex justify-center shrink-0 border-t border-white/5 relative z-10">
                  <button
                    onClick={() => setIsAdvisorModalOpen(false)}
                    className="px-8 py-3.5 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <LucideIcons.ArrowLeft size={16} />
                    Voltar para a Missão
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-16 border-t border-white/5 px-6 md:px-12 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-zello-black">
        <div className="hidden md:block">© 2026 AI SKILLS ARENA • Bioética em IA</div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Interface Sincronizada
          </div>
          <div className="flex items-center gap-4">
            <History size={14} className="cursor-pointer hover:text-white transition-colors" />
            <Shield size={14} className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </footer>

      {/* Custom Alert/Confirm Modal Dialog */}
      <AnimatePresence>
        {customAlert && (
          <motion.div
            key="custom-alert-overlay-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zello-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-zinc-950 border-2 border-white/10 rounded-[32px] p-8 shadow-[0_0_50px_rgba(240,90,40,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-zello-orange to-transparent"></div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    customAlert.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                    customAlert.type === 'error' ? 'bg-red-500/10 text-red-500' :
                    customAlert.type === 'confirm' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-zello-orange/10 text-zello-orange'
                  }`}>
                    {customAlert.type === 'success' ? <LucideIcons.CheckCircle size={24} /> :
                     customAlert.type === 'error' ? <LucideIcons.AlertTriangle size={24} /> :
                     customAlert.type === 'confirm' ? <LucideIcons.HelpCircle size={24} /> :
                     <LucideIcons.Info size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{customAlert.title}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Notificação do Sistema</span>
                  </div>
                </div>

                <div className="text-slate-300 font-medium text-sm leading-relaxed whitespace-pre-line">
                  {customAlert.message}
                </div>

                <div className="flex gap-3 pt-2">
                  {customAlert.type === 'confirm' ? (
                    <>
                      <button
                        onClick={async () => {
                          const originalOnConfirm = customAlert.onConfirm;
                          setCustomAlert(null);
                          if (originalOnConfirm) {
                            await originalOnConfirm();
                          }
                        }}
                        className="flex-1 py-4 bg-zello-orange hover:bg-zello-orange/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(240,90,40,0.25)] transition-all cursor-pointer"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setCustomAlert(null)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setCustomAlert(null)}
                      className="w-full py-4 bg-zello-orange hover:bg-zello-orange/90 text-white font-black uppercase tracking-widest text-xs rounded-xl cursor-pointer transition-all font-bold"
                    >
                      Ok
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Tutorial Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            key="active-video-overlay-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-5xl h-[82vh] sm:h-[85vh] bg-zinc-900 border border-white/10 rounded-[28px] overflow-hidden shadow-[0_0_50px_rgba(240,90,40,0.3)] relative flex flex-col mx-2 sm:mx-4"
            >
              {/* Header with Title and Close button */}
              <div className="p-4 flex items-center justify-between border-b border-white/5 bg-zinc-900 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zello-orange/10 flex items-center justify-center text-zello-orange">
                    <LucideIcons.Play size={16} className="fill-zello-orange text-zello-orange" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-wider leading-none">{activeVideo.title}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1 block">Tutorial em Vídeo</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LucideIcons.X size={16} />
                </button>
              </div>

              {/* Video Player Box - Expands to occupy all remaining screen vertical height */}
              <div className="flex-1 w-full bg-black relative overflow-hidden">
                <iframe
                  src={
                    activeVideo.url.replace('youtube-nocookie.com', 'youtube.com') + 
                    (activeVideo.url.includes('?') ? '&' : '?') + 
                    'autoplay=1'
                  }
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AppStateProvider>
  );
}
