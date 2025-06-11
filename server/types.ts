export interface SentimentConfidenceScores {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentTarget {
  text: string;
  sentiment: string;
  confidenceScores: SentimentConfidenceScores;
}

export interface SentimentAssessment {
  text: string;
  sentiment: string;
}

export interface SentimentOpinion {
  target: SentimentTarget;
  assessments: SentimentAssessment[];
}

export interface SentimentSentence {
  text: string;
  sentiment: string;
  confidenceScores: SentimentConfidenceScores;
  opinions: SentimentOpinion[];
}

export interface SentimentResult {
  documentText: string;
  overallSentiment: string;
  confidenceScores: SentimentConfidenceScores;
  sentences: SentimentSentence[];
}

export interface ApiResponse {
  success: boolean;
  data?: SentimentResult;
  error?: string;
}