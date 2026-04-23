export type OnboardingStep = 1 | 2 | 3 | 4;

export interface CityRequest {
  city: string;
}

export interface OnboardingState {
  city: string;
  cityRequest: CityRequest | null;
  language: string;
  topics: string[];
}

export const INITIAL_STATE: OnboardingState = {
  city: "",
  cityRequest: null,
  language: "",
  topics: [],
};

export const REQUEST_CITY_VALUE = "__request_city__";
