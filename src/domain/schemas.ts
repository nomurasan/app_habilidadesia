import { z } from 'zod';

// Schema for Company / Team
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome da turma/empresa é obrigatório'),
  ownerId: z.string().optional(),
  createdAt: z.any().optional(),
  logoUrl: z.string().url().optional(),
  domain: z.string().optional(),
});

// Schema for User Profiles
export const UserProfileSchema = z.object({
  userId: z.string(),
  email: z.string().email('E-mail inválido'),
  xp: z.number().nonnegative(),
  unlockedPowers: z.array(z.string()),
  currentMissionIndex: z.number().nonnegative(),
  missionProgress: z.record(z.string(), z.any()),
  companyId: z.string().optional(),
  isAdmin: z.boolean().optional(),
  lastActive: z.any().optional(),
  createdAt: z.any().optional(),
  surveyCompleted: z.boolean().optional(),
  skillsSurvey: z.record(z.string(), z.object({
    current: z.number().min(1).max(5),
    target: z.number().min(1).max(5),
  })).optional(),
});

// Schema for Missions
export const MissionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  subtitle: z.string(),
  context: z.string(),
  items: z.array(z.string()),
  reflection: z.string(),
  expectedResults: z.array(z.string()),
  recommendedPowerIds: z.array(z.string()),
  advisorHint: z.string(),
});

// Schema for Quiz Answers and Response Payloads
export const QuizResponseSchema = z.object({
  userId: z.string(),
  challengeId: z.number(),
  level: z.enum(['PADAWAN', 'JEDI', 'YODA']),
  selectedPowerId: z.string(),
  isCorrect: z.boolean(),
  responseTimeSeconds: z.number().optional(),
  xpEarned: z.number(),
  timestamp: z.any().optional(),
});

// Schema for AI Evaluation / Advisor feedbacks
export const AIEvaluationSchema = z.object({
  evaluationId: z.string().optional(),
  userId: z.string(),
  missionId: z.string(),
  chosenSkills: z.array(z.string()).max(4, 'No máximo 4 habilidades permitidas'),
  userDraftText: z.string().min(10, 'A justificativa do draft deve conter pelo menos 10 caracteres'),
  assistantResponse: z.string(),
  timestamp: z.any().optional(),
});

// Schema for API payloads / interactions for security validation
export const APIPayloadSchema = z.object({
  prompt: z.string(),
  systemInstruction: z.string().optional(),
  model: z.string().optional(),
  userId: z.string().optional(),
  companyId: z.string().optional(),
});

// Type definitions inferred from Schemas
export type CompanyType = z.infer<typeof CompanySchema>;
export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type MissionType = z.infer<typeof MissionSchema>;
export type QuizResponseType = z.infer<typeof QuizResponseSchema>;
export type AIEvaluationType = z.infer<typeof AIEvaluationSchema>;
export type APIPayloadType = z.infer<typeof APIPayloadSchema>;
