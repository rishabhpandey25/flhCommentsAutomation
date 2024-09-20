import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UUID } from 'crypto';

// Core organization structure
interface Organization {
  orgId: UUID;
  name: string;
  description: string | null;
}

// Each OrgStatusState will now just hold the Organization data (instead of status per org)
interface OrgStatusState {
  [orgId: string]: Organization;
}

// The overall state will track the status of fetching all orgs
interface OrganizationState {
  organizations: OrgStatusState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: {},
  status: 'idle',
  error: null,
};

// Thunk to fetch all organizations at once
export const fetchAllOrgs = createAsyncThunk('organizations/fetchAllOrgs', async () => {
  const response = await axios.get('/api/organizations');
  return response.data; // Assuming the response is an array of organizations
});

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrgs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrgs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map organizations by orgId
        const orgsArray: Organization[] = action.payload;
        state.organizations = orgsArray.reduce((acc, org) => {
          acc[org.orgId] = org;
          return acc;
        }, {} as OrgStatusState);
      })
      .addCase(fetchAllOrgs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch organizations';
      });
  },
});

export default organizationSlice.reducer;
