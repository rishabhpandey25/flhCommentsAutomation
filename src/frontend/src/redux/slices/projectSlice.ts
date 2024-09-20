import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UUID } from 'crypto';

interface Project {
  projectId: UUID;
  name: string;
  orgId: UUID;
}

interface OrgProjectState {
  projects: Project[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface ProjectState {
  [orgId: string]: OrgProjectState;
}

const initialState: ProjectState = {};

export const fetchProjectsByOrgId = createAsyncThunk('projects/fetchProjectsByOrgId', async (orgId: UUID) => {
  const response = await axios.get(`/api/projects?orgId=${orgId}`);
  return { orgId, projects: response.data };
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsByOrgId.pending, (state, action) => {
        const orgId = action.meta.arg;
        if (!state[orgId]) {
          state[orgId] = { projects: [], status: 'loading', error: null };
        } else {
          state[orgId].status = 'loading';
        }
      })
      .addCase(fetchProjectsByOrgId.fulfilled, (state, action) => {
        const { orgId, projects } = action.payload;
        state[orgId] = { projects, status: 'succeeded', error: null };
      })
      .addCase(fetchProjectsByOrgId.rejected, (state, action) => {
        const orgId = action.meta.arg;
        state[orgId].status = 'failed';
        state[orgId].error = action.error.message || 'Failed to fetch projects';
      });
  },
});

export default projectSlice.reducer;
