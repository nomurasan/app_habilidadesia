import { useState } from 'react';
import { AIService } from '../services/AIService';

export function useAIReport() {
  const [reportText, setReportText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const generateReport = async (payload: {
    email: string;
    xp: number;
    unlockedPowers: string[];
    completedMissions: Record<string, boolean>;
    skillsSurvey: Record<string, { current: number; target: number }> | null;
  }) => {
    setIsGenerating(true);
    setReportError(null);
    try {
      const response = await AIService.generateDiagnosticReport(payload);
      setReportText(response);
      return response;
    } catch (err: any) {
      const msg = err.userMessage || 'Incapaz de compilar relatório de diagnóstico de IA.';
      setReportError(msg);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearReport = () => {
    setReportText(null);
    setReportError(null);
  };

  return {
    reportText,
    isGenerating,
    reportError,
    generateReport,
    clearReport,
  };
}
