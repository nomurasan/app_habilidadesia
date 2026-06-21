export type GameState =
  | 'home'
  | 'level-selection'
  | 'game'
  | 'deck'
  | 'results'
  | 'missions'
  | 'dashboards'
  | 'admin'
  | 'autoconhecimento';

export interface Company {
  id: string;
  name: string;
  ownerId?: string;
  createdAt: any;
  logoUrl?: string;
  domain?: string;
}

export interface UserProfile {
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

export interface RankInfo {
  name: string;
  image: string;
  description: string;
  color: string;
}

export interface AIUsageAudit {
  id?: string;
  userId: string;
  companyId: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  endpoint: string;
  createdAt: string;
}

export interface Mission {
  id: number;
  title: string;
  context: string;
  reflection: string;
  challenge: string;
  expectedResult: string;
  maturityDescription: string;
  recommendedSkillIds: number[];
  hiddenReferenceSolution: string;

  // Optional fields for perfect UI backward compatibility
  subtitle?: string;
  items?: string[];
  expectedResults?: string[];
  recommendedPowerIds?: string[];
  advisorHint?: string;
}

export interface RecommendedSkill {
  skillId: number;
  weight: number;
  role: 'primary' | 'secondary';
}

export interface Challenge {
  id: number;
  level: 'PADAWAN' | 'JEDI' | 'YODA';
  title: string;
  scenario: string;
  correctSkillIds: number[];
  incorrectSkillIds: number[];
  recommendedSkills?: RecommendedSkill[];
  explanation: string;
}

export interface AIPower {
  id: string;
  category: string;
  title: string;
  objective: string;
  applicationContext: string;
  practicalExample: string;
  expectedBenefits: string[];
  icon: string;
  image: string;
  
  // Legacy fields preserved for complete backward compatibility
  shortDescription?: string;
  fullDescription?: string;
  detailedDescription?: string;
  detailedExamples?: { title: string; description: string }[];
  cases?: string[];
}

export interface TeamMaturityMetric {
  subject: string;
  A: number;
}

export interface TeamSkillDist {
  name: string;
  value: number;
}

export interface TeamEvolutionItem {
  name: string;
  xp: number;
}

export interface TopSkillItem {
  id?: string;
  name: string;
  count: number;
}

export interface TeamStats {
  totalXp: number;
  teamMaturity: TeamMaturityMetric[];
  teamSkillDist: TeamSkillDist[];
  teamEvolution: TeamEvolutionItem[];
  topSkills: TopSkillItem[];
}
