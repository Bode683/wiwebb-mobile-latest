import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

interface OnboardingState {
  completed: boolean;
}

const initialState: OnboardingState = {
  completed: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.completed = true;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const { completeOnboarding, resetOnboarding } = onboardingSlice.actions;

export const selectOnboardingCompleted = (state: RootState) => state.onboarding.completed;

export default onboardingSlice.reducer;
