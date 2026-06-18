export interface AIFailure {
  timestamp: string;
  correlationId: string;
  endpoint: string;
  userId: string;
  error: string;
}

export const aiFailureTracker: AIFailure[] = [];

export function trackAIFailure(failure: AIFailure) {
  aiFailureTracker.push(failure);
  if (aiFailureTracker.length > 100) {
    aiFailureTracker.shift(); // keep last 100
  }
}
