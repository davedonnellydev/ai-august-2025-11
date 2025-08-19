interface Fix {
  rank: number;
  description: string;
}

interface Step {
  order: number;
  description: string;
}

export interface AIAnalysis {
  topFixes: Fix[];
  nextSteps: Step[];
  priorityActions: {
    high: string;
    medium: string;
    low: string;
  };
  estimatedEffort: string;
}
