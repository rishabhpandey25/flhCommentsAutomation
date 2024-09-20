import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UUID } from 'crypto';

interface Repository {
  repoId: UUID;
  name: string;
  projectId: UUID;
}

interface ProjectRepoState {
  repos: Repository[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface RepoState {
  [projectId: string]: ProjectRepoState;
}

const initialState: RepoState = {};

export const fetchReposByProjectId = createAsyncThunk('repos/fetchReposByProjectId', async (projectId: UUID) => {
  const response = await axios.get(`/api/repos?projectId=${projectId}`);
  return { projectId, repos: response.data };
});

const repoSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReposByProjectId.pending, (state, action) => {
        const projectId = action.meta.arg;
        if (!state[projectId]) {
          state[projectId] = { repos: [], status: 'loading', error: null };
        } else {
          state[projectId].status = 'loading';
        }
      })
      .addCase(fetchReposByProjectId.fulfilled, (state, action) => {
        const { projectId, repos } = action.payload;
        state[projectId] = { repos, status: 'succeeded', error: null };
      })
      .addCase(fetchReposByProjectId.rejected, (state, action) => {
        const projectId = action.meta.arg;
        state[projectId].status = 'failed';
        state[projectId].error = action.error.message || 'Failed to fetch repositories';
      });
  },
});

export default repoSlice.reducer;
