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
import { AI_POWERS, CATEGORIES, AIPower, Challenge } from './data/powers';
import { ALL_CHALLENGES } from './data/challenges';
import { MISSIONS, Mission } from './data/missions';
import { SuperPowerCard } from './components/SuperPowerCard';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { signOut } from 'firebase/auth';
import { DashboardSection } from './components/DashboardSection';

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
    name: 'Mestre Nomura',
    image: '/Mestre Nomura.png',
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
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [viewingPower, setViewingPower] = useState<AIPower | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionCards, setMissionCards] = useState<Record<string, string[]>>({});
  const [userExplanations, setUserExplanations] = useState<Record<string, string>>({});
  const [advisorResponses, setAdvisorResponses] = useState<Record<string, string>>({});
  const [isAskingAdvisor, setIsAskingAdvisor] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isPresentingDeck, setIsPresentingDeck] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
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
          
          // Auto-promote the requested user to admin if they are not yet (case-insensitive)
          if (user.email?.toLowerCase() === 'nomura.eduardo@gmail.com' && !data.isAdmin) {
            console.log("Auto-promoting nomura.eduardo@gmail.com to admin...");
            updateDoc(userDocRef, { isAdmin: true }).catch(e => console.error("Admin promote fail:", e));
          }

          setUserProfile(data);
          setScore(data.xp || 0);
          setUnlockedPowers(data.unlockedPowers || []);
          
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
      handleAnswer(''); // Auto-submit on timeout
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isAnswered]);

  const startLevel = (level: 'PADAWAN' | 'JEDI' | 'YODA') => {
    // Filter and shuffle challenges for the selected level
    const available = ALL_CHALLENGES.filter(c => c.level === level);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);
    
    setLevelChallenges(selected);
    setSelectedLevel(level);
    setCurrentChallengeIndex(0);
    setTimeLeft(60);
    setIsActive(true);
    setIsAnswered(false);
    setSelectedPower(null);
    setAiFeedback(null);
    setGameState('game');
  };

  const handleAnswer = async (powerId: string) => {
    if (isAnswered || !user) return;
    
    const selectedPowerData = powerId ? AI_POWERS.find(p => p.id === powerId) : null;
    const correctPowerData = AI_POWERS.find(p => p.id === currentChallenge.correctPowerId);

    setSelectedPower(powerId);
    setIsAnswered(true);
    setIsActive(false);

    // Call AI Feedback API
    setIsAiFeedbackLoading(true);
    try {
      const response = await fetch('/api/quiz-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: currentChallenge.scenario,
          correctAnswer: correctPowerData?.title || 'Desconhecida',
          selectedAnswer: selectedPowerData?.title || 'Nenhuma/Tempo Esgotado',
          level: selectedLevel
        }),
      });
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      setAiFeedback(currentChallenge.explanation); // Fallback to static explanation
    } finally {
      setIsAiFeedbackLoading(false);
    }
    
    if (powerId === currentChallenge.correctPowerId) {
      // Points calculation: Base 1000 + Time Bonus (up to 500)
      const timeBonus = Math.floor((timeLeft / 60) * 500);
      const pointsEarned = 1000 + timeBonus;
      const newScore = score + pointsEarned;
      const newUnlocked = unlockedPowers.includes(powerId) 
        ? unlockedPowers 
        : [...unlockedPowers, powerId];

      setScore(newScore);
      setUnlockedPowers(newUnlocked);

      // Sync to Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          xp: newScore,
          unlockedPowers: newUnlocked,
          lastActive: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const nextChallenge = async () => {
    if (!user) return;

    if (currentChallengeIndex < levelChallenges.length - 1) {
      const nextIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIndex);
      setIsAnswered(false);
      setSelectedPower(null);
      setAiFeedback(null);
      setTimeLeft(60);
      setIsActive(true);

      // We don't necessarily sync mission index per level if it's a quiz session
    } else {
      setGameState('results');
    }
  };

  const restartGame = async () => {
    if (!user) return;
    
    setScore(0);
    setCurrentChallengeIndex(0);
    setIsAnswered(false);
    setSelectedPower(null);
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
    <div className="min-h-screen bg-zello-black text-slate-100 flex flex-col relative overflow-hidden font-sans border-t-8 md:border-8 border-zello-black/20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-zello-orange/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 px-6 md:px-12 flex items-center justify-between bg-zello-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setGameState('home')}>
          <div className="w-10 h-10 bg-zello-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(240,90,40,0.4)]">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter leading-none text-white">JORNADA JEDI</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-zello-orange uppercase tracking-widest leading-none">A FORÇA ESTÁ COM VOCÊ</span>
              {currentCompany && (
                <>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">{currentCompany.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setGameState('deck')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${gameState === 'deck' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Deck
            </button>
            <button 
              onClick={() => setGameState('level-selection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${gameState === 'level-selection' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Quizzes
            </button>
            <button 
              onClick={() => setGameState('missions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${gameState === 'missions' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Missões
            </button>
            <button 
              onClick={() => setGameState('dashboards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${gameState === 'dashboards' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              Dashboard
            </button>
            {/* Perfil menu option removed */}
            {true && (
              <button 
                onClick={() => userProfile?.isAdmin && setGameState('admin')}
                disabled={!userProfile?.isAdmin}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${gameState === 'admin' ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'} disabled:opacity-25 disabled:cursor-not-allowed`}
                title={!userProfile?.isAdmin ? "Acesso exclusivo para Administradores" : "Painel do Administrador"}
              >
                Admin
              </button>
            )}
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
          >
            <LogOut size={14} />
            Sair
          </button>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-zello-orange font-bold uppercase tracking-widest leading-none">Rank Atual</span>
            <span className={`text-sm font-black uppercase italic ${currentRank.color}`}>{currentRank.name}</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 bg-zello-orange/10 rounded-2xl border border-zello-orange/20 min-w-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zello-orange/60 leading-none">XP Total</span>
            <span className="text-lg font-black text-zello-orange tabular-nums">{score.toLocaleString()}</span>
          </div>
        </div>
      </nav>

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
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-full flex flex-col items-center justify-center p-8 text-center space-y-12 max-w-4xl mx-auto"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-xs font-black uppercase tracking-widest">
                  <Star size={14} className="fill-zello-orange" />
                  Jornada de Aprendizado
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase italic">
                  DOMINE A <br/> <span className="text-zello-orange">FORÇA DA IA</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  Três dimensões para você explorar: Deck de Habilidades, Quizzes de Conhecimento e Missões Táticas.
                </p>
                <div className="flex justify-center pt-2 w-full">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07]">
                    <div className="relative">
                      {/* Outer spinning ring / glow */}
                      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-zello-orange to-yellow-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="relative w-24 h-24 rounded-full border-2 border-zello-orange overflow-hidden shadow-[0_0_25px_rgba(240,90,40,0.4)] bg-zinc-950 flex items-center justify-center">
                        <img 
                          src="/Mestre Nomura.png"
                          alt="Mestre Nomura"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                        {/* Glowing orange lightsaber beam overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zello-orange/15 to-transparent pointer-events-none"></div>
                      </div>
                      
                      {/* Lightsaber Active Badge */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                        <LucideIcons.Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left space-y-2 flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5">Mestre Nomura</h3>
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                        "Treine a sua mente e domine o poder da inteligência artificial para conquistar novos patamares!"
                      </p>
                      
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveVideo({
                            title: 'Como Funciona a Jornada?',
                            url: 'https://www.youtube.com/embed/vq01pL4Hjoc?rel=0'
                          })}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn"
                        >
                          <LucideIcons.Play size={10} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                          Como Funciona a Jornada?
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <button
                  onClick={() => setGameState('deck')}
                  className="group relative flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-white">
                    <LucideIcons.LayoutGrid size={120} />
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors">
                    <LucideIcons.LayoutGrid className="text-slate-400 group-hover:text-zello-orange" size={32} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white">Deck</div>
                    <div className="text-slate-500 font-medium">Colecione habilidades</div>
                  </div>
                </button>

                <button
                  onClick={() => setGameState('level-selection')}
                  className="group relative flex flex-col items-start gap-4 p-8 bg-zello-orange hover:brightness-110 rounded-3xl transition-all duration-300 shadow-[0_0_50px_-10px_rgba(240,90,40,0.4)] border border-white/20 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                    <LucideIcons.Gamepad2 size={120} />
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <LucideIcons.Gamepad2 className="text-white" size={32} />
                  </div>
                  <div className="text-left relative z-10">
                    <div className="font-black text-3xl uppercase italic tracking-tighter text-white">Quizzes</div>
                    <div className="text-white/70 font-medium">Cenários de múltipla escolha</div>
                  </div>
                </button>

                <button
                  onClick={() => setGameState('missions')}
                  className="group relative flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity text-white">
                    <Target size={120} />
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors">
                    <Target className="text-slate-400 group-hover:text-zello-orange" size={32} />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white">Missões</div>
                    <div className="text-slate-500 font-medium">Resolva desafios reais</div>
                  </div>
                </button>

                <button
                  onClick={() => setGameState('dashboards')}
                  className="md:col-span-3 group relative flex items-center justify-between gap-4 p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-3xl transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-zello-orange/10 transition-colors">
                      <LucideIcons.BarChart3 className="text-slate-400 group-hover:text-zello-orange" size={32} />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-3xl text-slate-200 uppercase italic tracking-tighter group-hover:text-white">Dashboard</div>
                      <div className="text-slate-500 font-medium">Acompanhe sua maturidade e a força da sua turma</div>
                    </div>
                  </div>
                  <LucideIcons.ArrowRight className="text-slate-500 group-hover:text-zello-orange transition-all group-hover:translate-x-2" size={32} />
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'level-selection' && (
            <motion.div
              key="level-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[1400px] mx-auto p-8 space-y-12"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-4 text-center lg:text-left flex-1">
                  <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Escolha seu Quiz</h2>
                  <p className="text-slate-400 font-medium">Selecione o nível de dificuldade e a quantidade de perguntas</p>
                  
                  <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                    <div className="flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-white/10 w-fit">
                      <span className="text-xs font-black uppercase tracking-widest text-zello-orange shrink-0">Nº PERGUNTAS:</span>
                      <div className="flex items-center gap-2">
                        {[1, 3, 5, 10].map((num) => (
                          <button
                            key={`q-count-${num}`}
                            onClick={() => setQuestionCount(num)}
                            className={`w-10 h-10 rounded-xl font-black transition-all ${questionCount === num ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                          >
                            {num}
                          </button>
                        ))}
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={questionCount}
                          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                          className="ml-4 accent-zello-orange"
                        />
                        <span className="w-8 text-center font-black text-zello-orange">{questionCount}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setGameState('home')}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </div>

                {/* Arte da Chamada do Vídeo do Mestre Nomura */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/15 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07] text-left">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-zello-orange to-yellow-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative w-24 h-24 rounded-full border-2 border-zello-orange overflow-hidden shadow-[0_0_25px_rgba(240,90,40,0.4)] bg-zinc-950 flex items-center justify-center">
                      <img 
                        src="/Mestre Nomura.png"
                        alt="Mestre Nomura"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zello-orange/15 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <LucideIcons.Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left space-y-2 flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5 font-sans">Mestre Nomura</h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                      "Dê o primeiro passo para testar seus conhecimentos. O aprendizado real vem dos desafios superados. Que a força esteja com você!"
                    </p>
                    
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveVideo({
                          title: 'Como Funciona o Quiz?',
                          url: 'https://www.youtube.com/embed/ImwqltRINI8?rel=0'
                        })}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn"
                      >
                        <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                        Como Funciona o Quiz?
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['PADAWAN', 'JEDI', 'YODA'] as const).map((level, lIdx) => (
                  <button
                    key={`lvl-sel-final-${level}-${lIdx}`}
                    onClick={() => startLevel(level)}
                    className="group relative flex flex-col items-center gap-6 p-10 rounded-[32px] bg-white/5 border border-white/10 hover:border-zello-orange/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-zello-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-32 h-32 rounded-full border-4 border-zello-orange/20 p-2 overflow-hidden group-hover:scale-110 transition-transform bg-zello-black/40">
                      <img 
                        src={RANKS[level].image} 
                        alt={RANKS[level].name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-center relative z-10">
                      <h3 className={`text-2xl font-black uppercase italic transition-colors ${RANKS[level].color}`}>
                        {RANKS[level].name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-2 font-medium">
                        {RANKS[level].description}
                      </p>
                    </div>
                    <div className="mt-4 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-zello-orange group-hover:border-zello-orange transition-colors">
                      Iniciar Quiz
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setGameState('home')}
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Voltar ao Início
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-[1400px] mx-auto space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                      Desafio {currentChallenge.title}
                    </h3>
                    <button
                      onClick={() => setActiveVideo({
                        title: 'Quizzes (Desafios)',
                        url: 'https://www.youtube.com/embed/cl00Nor2OAk?rel=0'
                      })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-zello-orange/30 text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer group"
                    >
                      <LucideIcons.Play size={8} className="fill-slate-400 group-hover:fill-white text-slate-400 group-hover:text-white" />
                      Como Funciona o Quiz
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {levelChallenges.map((_, idx) => (
                      <div 
                        key={`ch-prog-dot-final-${selectedLevel}-${idx}`} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          idx === currentChallengeIndex ? 'w-12 bg-zello-orange' : 
                          idx < currentChallengeIndex ? 'w-6 bg-zello-orange/40' : 'w-6 bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-4 ${timeLeft < 10 ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${timeLeft < 10 ? 'bg-red-500/20' : 'bg-zello-orange/20'}`}>
                      <LucideIcons.Timer className={timeLeft < 10 ? 'text-red-500' : 'text-zello-orange'} size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Tempo</span>
                      <span className={`text-lg font-black tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-zello-orange/20 flex items-center justify-center">
                      <Target className="text-zello-orange" size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Progresso</span>
                      <span className="text-lg font-black text-white">{currentChallengeIndex + 1} / {levelChallenges.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-zello-orange"></div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zello-orange/10 rounded-lg">
                          <ShieldAlert className="text-zello-orange" size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-zello-orange">Cenário de Operação</span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold leading-tight text-white tracking-tight italic">
                        "{currentChallenge.scenario}"
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(() => {
                      const options = AI_POWERS.filter(p => 
                        [currentChallenge.correctPowerId, ...currentChallenge.distractors].includes(p.id)
                      );
                      
                      // Ensure correct one is always there, and we have max 6 items
                      const correct = options.find(p => p.id === currentChallenge.correctPowerId);
                      const others = options.filter(p => p.id !== currentChallenge.correctPowerId);
                      
                      // Take up to 5 others to make a total of 6
                      const rawOptions = [correct, ...others.slice(0, 5)].filter((p): p is AIPower => !!p);
                      
                      // Deduplicate by ID to guarantee rendering uniqueness
                      const finalOptions = Array.from(new Map(rawOptions.map(p => [p.id, p])).values())
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

                      return finalOptions.map((power, idx) => (
                      <button
                        key={`game-opt-btn-${currentChallenge.id}-${power.id}-${idx}`}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(power.id)}
                        className={`
                          p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group h-32 flex flex-col justify-between
                          ${isAnswered && power.id === currentChallenge.correctPowerId 
                            ? 'bg-zello-orange/20 border-zello-orange ring-4 ring-zello-orange/20 shadow-[0_0_20px_rgba(240,90,40,0.4)]' 
                            : isAnswered && selectedPower === power.id && power.id !== currentChallenge.correctPowerId
                            ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : isAnswered 
                            ? 'bg-white/2 opacity-40 border-white/5'
                            : 'bg-white/5 border-white/10 hover:border-zello-orange/50 hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-zello-orange group-hover:text-white transition-colors ${isAnswered && power.id === currentChallenge.correctPowerId ? 'bg-zello-orange text-white' : ''}`}>
                            {React.createElement((LucideIcons as any)[power.icon] || Zap, { size: 16 })}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">{power.category}</span>
                            <h4 className="text-sm font-bold text-white leading-tight">{power.title}</h4>
                          </div>
                        </div>
                        {/* Status Dots */}
                        {isAnswered && power.id === currentChallenge.correctPowerId && (
                          <div className="absolute top-4 right-4 text-zello-orange">
                            <LucideIcons.CheckCircle2 size={20} />
                          </div>
                        )}
                      </button>
                    ));
                    })()}
                  </div>

                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-3xl bg-zello-orange text-white flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                          {selectedPower === currentChallenge.correctPowerId ? <Trophy size={32} /> : <LucideIcons.X size={32} />}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black uppercase italic leading-none">
                            {selectedPower === currentChallenge.correctPowerId ? 'Excelente, Jedi!' : 'Treine mais, Padawan!'}
                          </h4>
                          <p className="text-white/80 font-medium text-sm mt-1">
                            {selectedPower === currentChallenge.correctPowerId 
                              ? `Explicação: ${currentChallenge.explanation}` 
                              : 'Essa não era a resposta ideal para este cenário.'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={nextChallenge}
                        className="px-8 py-4 bg-white text-zello-orange font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap active:scale-95"
                      >
                        {currentChallengeIndex === levelChallenges.length - 1 ? 'Finalizar Missão' : 'Próximo Desafio'}
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="hidden lg:block space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl min-h-[200px] flex flex-col">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange mb-4">Seu Mentor Diz:</h4>
                    <div className="flex-1">
                      {isAiFeedbackLoading ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                          <div className="h-3 bg-white/10 rounded w-full"></div>
                          <div className="h-3 bg-white/10 rounded w-5/6"></div>
                          <div className="h-3 bg-white/10 rounded w-4/6"></div>
                        </div>
                      ) : (
                        <p className="text-sm italic text-slate-400 leading-relaxed">
                          {isAnswered 
                            ? (aiFeedback || currentChallenge.explanation)
                            : "Para cada desafio, uma habilidade específica de IA deve ser aplicada. Pense no objetivo final do negócio antes de escolher o algoritmo."}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-500/20 relative border border-emerald-500/30">
                        <img src="/Mestre Nomura.png" alt="Mestre Nomura" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        {isAiFeedbackLoading && (
                          <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                            <LucideIcons.Loader2 className="text-white animate-spin" size={16} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white">Mestre Nomura</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'missions' && (
            <motion.div 
              key="missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[1400px] mx-auto space-y-12 p-6 md:p-12"
            >
              {!selectedMission ? (
                <div key="mission-list-container" className="space-y-12">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
                    <div className="space-y-4 text-center lg:text-left flex-1 font-sans">
                      <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Missões Táticas</h2>
                      <p className="text-slate-400 font-medium">Selecione uma missão para explorar cenários reais de aplicação de IA</p>
                      
                      <div className="flex justify-center lg:justify-start">
                        <button 
                          onClick={() => setGameState('home')}
                          className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors"
                        >
                          Voltar ao Início
                        </button>
                      </div>
                    </div>

                    {/* Arte da Chamada do Vídeo do Mestre Nomura */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/15 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07] text-left">
                      <div className="relative shrink-0">
                        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-zello-orange to-yellow-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative w-24 h-24 rounded-full border-2 border-zello-orange overflow-hidden shadow-[0_0_25px_rgba(240,90,40,0.4)] bg-zinc-950 flex items-center justify-center">
                          <img 
                            src="/Mestre Nomura.png"
                            alt="Mestre Nomura"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zello-orange/15 to-transparent pointer-events-none"></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                          <LucideIcons.Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-left space-y-2 flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5 font-sans">Mestre Nomura</h3>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                          "As missões táticas vão exigir foco e sabedoria. Conecte as melhores ferramentas de IA da sua coleção para resolver casos práticos e reais!"
                        </p>
                        
                        <div className="pt-2">
                          <button
                            onClick={() => setActiveVideo({
                              title: 'Como Funcionam as Missões?',
                              url: 'https://www.youtube.com/embed/G1rbjZL8o8E?rel=0'
                            })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn"
                          >
                            <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                            Como Funcionam as Missões?
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MISSIONS.map((mission, idx) => (
                      <button
                        key={`msn-card-list-v4-${mission.id}-${idx}`}
                        onClick={() => setSelectedMission(mission)}
                        className={`group relative p-8 bg-white/5 border rounded-3xl text-left transition-all duration-300 overflow-hidden ${
                          completedMissions[mission.id] 
                            ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                            : 'border-white/10 hover:border-zello-orange/50'
                        }`}
                      >
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-zello-orange text-xs font-black uppercase tracking-[0.2em]">{mission.title}</div>
                            {completedMissions[mission.id] && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                <LucideIcons.CheckCircle2 className="text-green-500" size={12} />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Concluída</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-2xl font-black text-white italic leading-tight uppercase group-hover:text-zello-orange transition-colors">{mission.subtitle}</h4>
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-4">
                            Ver Detalhes <LucideIcons.ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Target size={80} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={`mission-details-${selectedMission.id}`} className="space-y-12">
                  <button 
                    onClick={() => setSelectedMission(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                  >
                    <LucideIcons.ArrowLeft size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Voltar para Missões</span>
                  </button>

                  <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zello-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(240,90,40,0.4)]">
                            <Target className="text-white" size={24} />
                          </div>
                          <div>
                            <div className="text-zello-orange text-xs font-black uppercase tracking-[0.2em]">{selectedMission.title}</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic leading-tight uppercase">{selectedMission.subtitle}</h2>
                          </div>
                        </div>

                        <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-zello-orange"></div>
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">Contexto da Missão</h4>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200">
                              {selectedMission.context}
                            </p>
                            {selectedMission.items.length > 0 && (
                              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {selectedMission.items.map((item, idx) => (
                                  <li key={`msn-item-f-${selectedMission.id}-${idx}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zello-orange" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="pt-8 border-t border-white/5 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">O grupo deverá refletir:</h4>
                            <p className="text-2xl md:text-3xl font-black italic text-white leading-tight">
                              "{selectedMission.reflection}"
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">Resultado Esperado</h4>
                            <ul className="space-y-4">
                              {selectedMission.expectedResults.map((result, idx) => (
                                <li key={`msn-res-f-${selectedMission.id}-${idx}`} className="flex items-start gap-4">
                                  <div className="w-6 h-6 rounded-lg bg-zello-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Star size={12} className="text-zello-orange fill-zello-orange" />
                                  </div>
                                  <span className="text-slate-400 font-medium leading-relaxed">{result}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">Maturidade & Evolução</h4>
                            <div className="space-y-4">
                              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Esta missão avalia sua capacidade de conectar objetivos de negócio com tecnologias de IA. 
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                  <span>Dificuldade</span>
                                  <span className="text-zello-orange">Avançado</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div className="w-3/4 h-full bg-zello-orange" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">Seleção dos Cards</h4>
                          <span className="px-2 py-1 bg-zello-orange/20 rounded-md text-[10px] font-bold text-zello-orange uppercase tracking-widest">Obrigatório</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4" key={`mission-slots-container-${selectedMission.id}`}>
                          {[0, 1, 2, 3].map((slotIdx) => {
                            const currentMissionId = selectedMission?.id || 'none';
                            const powerId = selectedMission ? missionCards[selectedMission.id]?.[slotIdx] : null;
                            const power = powerId ? AI_POWERS.find(p => p.id === powerId) : null;

                            return (
                              <button
                                key={`mission-slot-unique-${currentMissionId}-${slotIdx}`}
                                onClick={() => {
                                  setIsSelectingForMission(true);
                                  setGameState('deck');
                                }}
                                className={`aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all group relative overflow-hidden ${
                                  power 
                                    ? 'border-zello-orange/50 bg-zello-orange/5' 
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                              >
                                {power ? (
                                  <>
                                    <div className="text-zello-orange mb-2">
                                      {React.createElement(LucideIcons[power.icon as keyof typeof LucideIcons] as any, { size: 24 })}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight text-white">
                                      {power.title}
                                    </span>
                                    <div 
                                      className="absolute top-1 right-1 p-1 hover:text-white text-slate-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedMission) {
                                          const current = missionCards[selectedMission.id] || [];
                                          const next = [...current];
                                          next.splice(slotIdx, 1);
                                          setMissionCards({ ...missionCards, [selectedMission.id]: next });
                                        }
                                      }}
                                    >
                                      <LucideIcons.X size={14} />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <LucideIcons.Plus className="text-slate-600 group-hover:text-slate-400 mb-2" size={20} />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400">Add Card</span>
                                  </>
                                )}
                              </button>
                            );
                          })}
                        </div>

                          <button 
                            onClick={() => {
                              if (selectedMission && (missionCards[selectedMission.id] || []).length > 0) {
                                setIsPresentingDeck(true);
                              } else {
                                setIsSelectingForMission(true);
                                setGameState('deck');
                              }
                            }}
                            className="w-full py-4 bg-zello-orange text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.2)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                          >
                            <LucideIcons.LayoutGrid size={16} />
                            {(selectedMission && (missionCards[selectedMission.id] || []).length > 0) ? 'Ver / Editar Deck' : 'Explorar Meu Deck'}
                          </button>
                        </div>

                        <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zello-orange">Descrição da sua Solução</h4>
                        </div>
                        <div className="relative group">
                          <textarea
                            placeholder="Explique como você pretende usar as habilidades selecionadas para resolver esta missão..."
                            className={`w-full bg-zello-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 text-sm focus:border-zello-orange/50 transition-all min-h-[150px] outline-none ${isRewriting ? 'opacity-50 pointer-events-none' : ''}`}
                            value={selectedMission ? userExplanations[selectedMission.id] || '' : ''}
                            onChange={(e) => {
                              if (selectedMission) {
                                setUserExplanations(prev => ({ ...prev, [selectedMission.id]: e.target.value }));
                              }
                            }}
                          />
                          {isRewriting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-zello-black/20 backdrop-blur-[2px] rounded-2xl">
                              <div className="flex flex-col items-center gap-2">
                                <LucideIcons.Loader2 className="animate-spin text-zello-orange" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zello-orange animate-pulse">Assistente elaborando descrição...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          disabled={isRewriting || !selectedMission || (missionCards[selectedMission.id] || []).length === 0}
                          onClick={async () => {
                            if (!selectedMission) return;
                            setIsRewriting(true);
                            try {
                              const powers = (missionCards[selectedMission.id] || []).map(id => AI_POWERS.find(p => p.id === id)).filter(Boolean);
                              const resp = await fetch('/api/rewrite', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  mission: selectedMission,
                                  selectedPowers: powers,
                                  currentExplanation: userExplanations[selectedMission.id] || ''
                                })
                              });
                              
                              if (!resp.ok) {
                                const errData = await resp.json();
                                throw new Error(errData.error || 'Erro ao processar IA');
                              }
                              
                              const data = await resp.json();
                              if (data.rewrittenText) {
                                setUserExplanations(prev => ({ ...prev, [selectedMission.id]: data.rewrittenText }));
                              }
                            } catch (e: any) {
                              console.error(e);
                              alert(`Erro: ${e.message}. Verifique as chaves de API nas configurações.`);
                            } finally {
                              setIsRewriting(false);
                            }
                          }}
                          className="w-full py-4 bg-zello-orange/10 hover:bg-zello-orange/20 border border-zello-orange/30 rounded-2xl text-xs font-black uppercase tracking-widest text-zello-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          {isRewriting ? (
                            <>
                              <LucideIcons.Loader2 className="animate-spin" size={16} />
                              Elaborando redação...
                            </>
                          ) : (
                            <>
                              <LucideIcons.Bot className="group-hover:scale-110 transition-transform" size={16} />
                              Mestre Nomura: Me ajude a descrever a solução
                            </>
                          )}
                        </button>

                        <button
                          disabled={isAskingAdvisor || !selectedMission || (missionCards[selectedMission.id] || []).length === 0}
                          onClick={async () => {
                            if (!selectedMission) return;
                            setIsAskingAdvisor(true);
                            try {
                              const powers = (missionCards[selectedMission.id] || []).map(id => AI_POWERS.find(p => p.id === id)).filter(Boolean);
                              const resp = await fetch('/api/advise', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  mission: selectedMission,
                                  selectedPowers: powers,
                                  userExplanation: userExplanations[selectedMission.id] || ''
                                })
                              });

                              if (!resp.ok) {
                                const errorData = await resp.json();
                                throw new Error(errorData.error || 'Erro ao consultar o mestre');
                              }

                              const data = await resp.json();
                              if (data.advice) {
                                setAdvisorResponses({ ...advisorResponses, [selectedMission.id]: data.advice });
                                setIsAdvisorModalOpen(true);
                              }
                            } catch (e: any) {
                              console.error(e);
                              alert(`Erro: ${e.message || "Falha na conexão com a IA"}`);
                            } finally {
                              setIsAskingAdvisor(false);
                            }
                          }}
                          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAskingAdvisor ? (
                            <>
                              <LucideIcons.Loader2 className="animate-spin" size={16} />
                              Consultando Mestre Nomura...
                            </>
                          ) : (
                            <>
                              <LucideIcons.Bot size={16} />
                              Mestre Nomura: Avaliar minha estratégia
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={async () => {
                            if (!user || !selectedMission) return;
                            setIsSaving(true);
                            try {
                              const userDocRef = doc(db, 'users', user.uid);
                              await updateDoc(userDocRef, {
                                [`missionProgress.${selectedMission.id}`]: {
                                  cards: missionCards[selectedMission.id] || [],
                                  explanation: userExplanations[selectedMission.id] || '',
                                  updatedAt: new Date().toISOString()
                                },
                                lastActive: serverTimestamp(),
                                updatedAt: serverTimestamp()
                              });
                              setCompletedMissions(prev => ({ ...prev, [selectedMission.id]: true }));
                              setSelectedMission(null);
                              alert("Progresso da missão salvo com sucesso!");
                            } catch (e) {
                              handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          className="flex-1 py-4 bg-zello-orange text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.2)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                          {isSaving ? <LucideIcons.Loader2 className="animate-spin" size={16} /> : <LucideIcons.Save size={16} />}
                          SALVAR PROCESSO
                        </button>
                        <button
                          onClick={() => {
                            if (selectedMission) {
                              const nextCards = { ...missionCards };
                              const nextExplanations = { ...userExplanations };
                              delete nextCards[selectedMission.id];
                              delete nextExplanations[selectedMission.id];
                              setMissionCards(nextCards);
                              setUserExplanations(nextExplanations);
                            }
                            setSelectedMission(null);
                          }}
                          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

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
                  className="w-full max-w-[1300px] max-h-[92vh] bg-zello-black border-2 border-zello-orange rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(240,90,40,0.3)] flex flex-col md:flex-row"
                >
                  {/* Left: Card Visual */}
                  <div className="w-full md:w-[380px] relative h-48 md:h-auto shrink-0 border-r border-white/5">
                    <img 
                      src={viewingPower.image} 
                      alt={viewingPower.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zello-black via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6">
                       <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-zello-orange/20 backdrop-blur-md border border-zello-orange/30 flex items-center justify-center text-zello-orange shadow-[0_0_20px_rgba(240,90,40,0.3)]">
                          {React.createElement((LucideIcons as any)[viewingPower.icon] || LucideIcons.Zap, { size: 24 })}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zello-orange uppercase tracking-[0.3em] leading-none">Habilidade</span>
                          <span className="text-3xl font-black text-white italic tracking-tighter leading-none mt-1">#{viewingPower.id.padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Detailed Info */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3">
                        <div className="px-3 py-1 bg-zello-orange/10 border border-zello-orange/20 rounded-full inline-block">
                          <span className="text-[9px] font-black text-zello-orange uppercase tracking-widest">{viewingPower.category}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tight leading-none">{viewingPower.title}</h2>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-semibold">
                          {viewingPower.detailedDescription || viewingPower.fullDescription}
                        </p>
                      </div>

                      {viewingPower.detailedExamples && viewingPower.detailedExamples.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zello-orange">Exemplos de Utilização</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {viewingPower.detailedExamples.map((example, idx) => (
                              <div key={`power-example-${viewingPower.id}-${idx}`} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 group hover:border-zello-orange/30 transition-all flex flex-col">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-zello-orange group-hover:shadow-[0_0_10px_rgba(240,90,40,1)] transition-all"></div>
                                  <h5 className="text-xs font-black text-white uppercase italic tracking-tight">{example.title}</h5>
                                </div>
                                <p className="text-slate-400 text-[11px] leading-relaxed flex-1">{example.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8 pt-3 flex justify-end shrink-0 border-t border-white/5">
                      <button
                        onClick={() => setViewingPower(null)}
                        className="px-8 py-3.5 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <LucideIcons.ArrowLeft size={14} />
                        Voltar ao Deck
                      </button>
                    </div>
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
                      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full border-4 border-zello-orange overflow-hidden bg-white/10 p-1.5 shadow-[0_0_30px_rgba(240,90,40,0.5)]">
                        <img src="https://img.icons8.com/fluency/512/robot.png" alt="Assistente" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="text-zello-orange text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Recado do Assistente Técnico</div>
                        <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tight leading-none">{selectedMission.subtitle}</h3>
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

          {gameState === 'deck' && (
            <motion.div 
              key="deck"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[1400px] mx-auto space-y-12 mb-20 p-6"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-4 text-center lg:text-left">
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                    {isSelectingForMission ? 'Selecione até 4 Habilidades' : 'Seu Deck de Habilidades'}
                  </h3>
                  <p className="text-zello-orange font-bold uppercase tracking-widest text-xs mt-2">
                    {isSelectingForMission 
                      ? `${(missionCards[selectedMission?.id || ''] || []).length}/4 cards selecionados`
                      : `Explore as ${AI_POWERS.length} habilidades fundamentais de IA`
                    }
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {isSelectingForMission && (
                      <button 
                        onClick={() => {
                          setIsSelectingForMission(false);
                          setGameState('missions');
                        }}
                        className="px-8 py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(240,90,40,0.4)] hover:brightness-110 active:scale-95 transition-all"
                      >
                        Confirmar Seleção
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsSelectingForMission(false);
                        setGameState(isSelectingForMission ? 'missions' : 'home');
                      }}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </div>

                {/* Arte da Chamada do Vídeo do Mestre Nomura */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/15 rounded-[32px] max-w-lg w-full shadow-2xl hover:border-zello-orange/30 transition-all duration-300 group hover:bg-white/[0.07] text-left">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-zello-orange to-yellow-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative w-24 h-24 rounded-full border-2 border-zello-orange overflow-hidden shadow-[0_0_25px_rgba(240,90,40,0.4)] bg-zinc-950 flex items-center justify-center">
                      <img 
                        src="/Mestre Nomura.png"
                        alt="Mestre Nomura"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zello-orange/15 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-900 border border-zello-orange flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <LucideIcons.Zap size={14} className="text-zello-orange fill-zello-orange animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left space-y-2 flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-[9px] bg-zello-orange/20 text-zello-orange border border-zello-orange/30 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Jedi Mentor</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <h3 className="text-lg font-black text-white italic uppercase tracking-wider mb-0.5 font-sans">Mestre Nomura</h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">
                      "As habilidades de IA são as ferramentas do seu sabre de luz. Aprenda a selecioná-las para criar soluções extraordinárias!"
                    </p>
                    
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveVideo({
                          title: 'Como Funciona o Deck?',
                          url: 'https://www.youtube.com/embed/Ko8iu2LiH-4?rel=0'
                        })}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zello-orange hover:bg-zello-orange/90 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(240,90,40,0.3)] hover:shadow-[0_0_30px_rgba(240,90,40,0.5)] transition-all duration-300 cursor-pointer group/btn"
                      >
                        <LucideIcons.Play size={8} className="fill-white text-white group-hover/btn:scale-110 transition-transform" />
                        Como Funciona o Deck?
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {AI_POWERS.map((power, idx) => {
                  const isSelected = selectedMission && (missionCards[selectedMission.id] || []).includes(power.id);
                  const isFull = selectedMission && (missionCards[selectedMission.id] || []).length >= 4;

                  return (
                    <div 
                      key={`dk-card-f-${power.id}-${idx}`} 
                      className={`relative cursor-pointer transition-all duration-300 ${isSelected ? 'scale-[1.02]' : ''}`}
                      onClick={() => {
                        if (isSelectingForMission && selectedMission) {
                          const current = missionCards[selectedMission.id] || [];
                          if (current.includes(power.id)) {
                            setMissionCards({
                              ...missionCards,
                              [selectedMission.id]: current.filter(id => id !== power.id)
                            });
                          } else if (current.length < 4) {
                            setMissionCards({
                              ...missionCards,
                              [selectedMission.id]: [...current, power.id]
                            });
                          }
                        } else {
                          setViewingPower(power);
                        }
                      }}
                    >
                      <SuperPowerCard 
                        power={power} 
                        isLocked={false}
                        onClick={() => {
                          if (!isSelectingForMission) {
                            setViewingPower(power);
                          }
                        }}
                      />
                      {isSelectingForMission && (
                        <div className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-zello-orange border-white text-white rotate-0' 
                            : 'bg-zello-black/40 border-white/20 text-transparent rotate-90'
                        }`}>
                          <LucideIcons.Check size={20} />
                        </div>
                      )}
                      {isSelectingForMission && isFull && !isSelected && (
                        <div className="absolute inset-0 bg-zello-black/60 z-10 rounded-[32px] pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
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
      </main>

      <footer className="h-16 border-t border-white/5 px-6 md:px-12 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-zello-black">
        <div className="hidden md:block">© 2024 Jornada Jedi • Bioética em IA</div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm sm:max-w-md bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(240,90,40,0.25)] relative flex flex-col h-[85vh] max-h-[75vh]"
            >
              {/* Header with Title and Close button */}
              <div className="p-5 flex items-center justify-between border-b border-white/5 bg-zinc-900 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zello-orange/10 flex items-center justify-center text-zello-orange">
                    <LucideIcons.Play size={16} className="fill-zello-orange text-zello-orange" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-wider leading-none">{activeVideo.title}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1.5 block">Tutorial em Vídeo</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LucideIcons.X size={16} />
                </button>
              </div>

              {/* Video Player Box */}
              <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-2 overflow-hidden">
                <iframe
                  src={
                    activeVideo.url + 
                    (activeVideo.url.includes('?') ? '&' : '?') + 
                    'autoplay=1&mute=0'
                  }
                  title={activeVideo.title}
                  className="w-full h-full rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
