import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

export type SecurityType =
  | 'wpa2-personal'
  | 'wpa3-personal'
  | 'wpa2-enterprise'
  | 'open';

export type ConfigMode = 'standard' | 'custom';

export interface WifiConfig {
  ssid: string;
  password: string;
  securityType: SecurityType;
  vlanId: number | null;
  shareable: boolean;
}

interface OnboardingState {
  completed: boolean;
  orgName: string | null;
  configMode: ConfigMode | null;
  wifiConfigs: WifiConfig[];
}

const initialState: OnboardingState = {
  completed: false,
  orgName: null,
  configMode: null,
  wifiConfigs: [],
};

interface SaveOnboardingPayload {
  orgName?: string;
  configMode: ConfigMode;
  ssid?: string;
  wifiPassword?: string;
  securityType?: SecurityType;
  vlanId?: number | null;
}

const slugify = (input: string) =>
  input
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'tenant';

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    saveOnboardingResult(state, action: PayloadAction<SaveOnboardingPayload>) {
      const data = action.payload;
      const orgName = data.orgName?.trim() || state.orgName || 'Organization';
      state.orgName = orgName;
      state.configMode = data.configMode;

      if (data.configMode === 'custom' && data.ssid) {
        state.wifiConfigs = [
          {
            ssid: data.ssid,
            password: data.wifiPassword ?? '',
            securityType: data.securityType ?? 'wpa2-personal',
            vlanId: data.vlanId ?? null,
            shareable: true,
          },
        ];
      } else {
        const slug = slugify(orgName);
        state.wifiConfigs = [
          {
            ssid: `${slug}-tenant-SSID`,
            password: '',
            securityType: 'wpa2-personal',
            vlanId: null,
            shareable: false,
          },
          {
            ssid: `${slug}-guest`,
            password: '',
            securityType: 'open',
            vlanId: null,
            shareable: true,
          },
        ];
      }
    },
    completeOnboarding(state) {
      state.completed = true;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const { saveOnboardingResult, completeOnboarding, resetOnboarding } =
  onboardingSlice.actions;

export const selectOnboardingCompleted = (state: RootState) =>
  state.onboarding.completed;

export const selectOnboardingOrgName = (state: RootState) =>
  state.onboarding.orgName;

export const selectWifiConfigs = (state: RootState) =>
  state.onboarding.wifiConfigs ?? [];

export const selectPrimaryWifiConfig = createSelector(
  selectWifiConfigs,
  (configs) => configs[0] ?? null,
);

export default onboardingSlice.reducer;
