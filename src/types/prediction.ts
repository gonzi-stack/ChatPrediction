// Types for the prediction system
export interface Message {
  user: string;
  content: string;
  timestamp: number;
}

export interface PredictionPattern {
  trigger: string;
  responses: string[];
  frequency: number;
}

export interface PredictionStats {
  totalMessages: number;
  uniquePatterns: number;
}