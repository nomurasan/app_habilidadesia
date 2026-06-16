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
  id: string;
  title: string;
  subtitle: string;
  context: string;
  items: string[];
  reflection: string;
  expectedResults: string[];
  recommendedPowerIds: string[];
  advisorHint: string;
}

export interface Challenge {
  id: number;
  level: 'PADAWAN' | 'JEDI' | 'YODA';
  title: string;
  scenario: string;
  correctPowerId: string;
  distractors: string[];
  explanation: string;
}

export interface AIPower {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  detailedDescription?: string;
  detailedExamples?: { title: string; description: string }[];
  cases: string[];
  icon: string;
  image: string;
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
