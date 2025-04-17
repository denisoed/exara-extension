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

export enum FloatingPopupState {
  Preview = "preview",
  Loading = "loading",
  Answer = "answer",
}

export enum ExplanationStyle {
  CHILD = "child",
  BEGINNER = "beginner",
  STUDENT = "student",
}
