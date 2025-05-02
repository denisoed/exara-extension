export const Theme = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const NodeEnv = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];

export type Language = {
  value: string;
  label: string;
};

export interface ClarificationHistory {
  question: string;
  answer: string;
}

export interface Context {
  pageTitle: string;
  pageDescription: string;
}

export enum FloatingPopupState {
  Preview = "preview",
  Loading = "loading",
  Answer = "answer",
  LimitReached = "limit-reached",
}

export enum ExplanationStyle {
  CHILD = "child",
  BEGINNER = "beginner",
  STUDENT = "student",
  ANALOGY = "analogy",
}

export enum TriggerPosition {
  UNDER_CURSOR = "under-cursor",
  PINNED_RIGHT_SIDE = "pinned-right-side",
}

export type OpenAIResponse = {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  status?: string;
  message?: string;
};

export interface SelectionTextMessageData {
  question: string;
  context: string;
}

export interface ClarificationMessageData {
  originalQuestion: string;
  originalAnswer: string;
  clarificationQuestion: string;
  context: string;
}

export interface ExplainSimplerMessageData {
  question: string;
  context: string;
  style: ExplanationStyle;
}

export interface PopupState {
  text: string;
  context: string;
  x: number;
  y: number;
}

export type MessageData = string | number | boolean | object;
