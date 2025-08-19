export interface AxeResults {
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: Array<{
      html: string;
      target: string[];
    }>;
  }>;
  passes: Array<{
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
  }>;
  timestamp: string;
  url: string;
}

export interface AIAnalysis {
  topFixes: string[];
  nextSteps: string[];
  priorityOrder: string[];
  estimatedEffort: string;
}
