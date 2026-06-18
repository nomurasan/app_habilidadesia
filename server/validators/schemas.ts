import { z } from "zod";

export const gerarRelatorioSchema = z.object({
  email: z.string().email(),
  xp: z.number().int().nonnegative(),
  unlockedPowers: z.array(z.string()),
  completedMissions: z.record(z.string(), z.boolean()),
  skillsSurvey: z.record(z.string(), z.object({
    current: z.number().int().min(1).max(5),
    target: z.number().int().min(1).max(5)
  })).nullable().optional()
});

export const quizFeedbackSchema = z.object({
  scenario: z.string().min(5),
  correctAnswer: z.string().min(1),
  selectedAnswer: z.string().min(1),
  level: z.string().min(1)
});

export const adviseSchema = z.object({
  mission: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    context: z.string().min(1),
    reflection: z.string().min(1),
    recommendedPowerIds: z.array(z.string()).optional(),
    recommendedSkillIds: z.array(z.number()).optional(),
    hiddenReferenceSolution: z.string().optional(),
    advisorHint: z.string().optional()
  }),
  selectedPowers: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1)
  })),
  userExplanation: z.string().min(5)
});

export const rewriteSchema = z.object({
  mission: z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    context: z.string().min(1)
  }),
  selectedPowers: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1)
  })),
  currentExplanation: z.string().optional()
});
