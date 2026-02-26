import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

interface OrganizationState {
  activeOrganizationId: string | null;
}

const initialState: OrganizationState = {
  activeOrganizationId: null,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setActiveOrganization(state, action: PayloadAction<string | null>) {
      state.activeOrganizationId = action.payload;
    },
  },
});

export const { setActiveOrganization } = organizationSlice.actions;

export const selectActiveOrganizationId = (state: RootState) =>
  state.organization.activeOrganizationId;

export default organizationSlice.reducer;
