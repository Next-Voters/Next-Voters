export type OnboardingStep = 1 | 2 | 3;

export type OnboardingMode = "subscribe" | "request";

export interface CityRequest {
  city: string;
}

export interface OnboardingState {
  city: string;
  cityRequest: CityRequest | null;
  topics: string[];
}

export const INITIAL_STATE: OnboardingState = {
  city: "",
  cityRequest: null,
  topics: [],
};
