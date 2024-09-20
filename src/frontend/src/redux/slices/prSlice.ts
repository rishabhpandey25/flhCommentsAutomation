import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UUID } from 'crypto';

interface PullRequest {
  Id: UUID;
  PullRequestId: UUID;
  Title: string;
  CurrentState: string;
  Description: string | null;
  Draft: boolean;
  providerName: string | null;
  sourceBranchRef: string;
  TargetBranchRef: string;
}

interface RepoPRState {
  prs: PullRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface PRStatusState {
  [repoId: string]: RepoPRState;  // Each RepoId will have its own PR state
}

const initialState: PRStatusState = {};

// Thunk to fetch PRs for a specific RepoId
export const fetchPRsByRepoId = createAsyncThunk('prs/fetchPRsByRepoId', async (RepoId: UUID) => {
  const response = await axios.get(`/api/pullRequests?repoId=${RepoId}`);
  const prs: PullRequest[] = response.data;
  return { RepoId, prs };  // Return RepoId along with fetched PRs
});

const prStatusSlice = createSlice({
  name: 'prStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPRsByRepoId.pending, (state, action) => {
        const repoId = action.meta.arg;
        if (!state[repoId]) {
          state[repoId] = {
            prs: [],
            status: 'loading',
            error: null,
          };
        } else {
          state[repoId].status = 'loading';
        }
      })
      .addCase(fetchPRsByRepoId.fulfilled, (state, action) => {
        const { RepoId, prs } = action.payload;
        state[RepoId] = {
          prs,
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchPRsByRepoId.rejected, (state, action) => {
        const repoId = action.meta.arg;
        state[repoId].status = 'failed';
        state[repoId].error = action.error.message || 'Failed to fetch PRs';
      });
  },
});

export default prStatusSlice.reducer;
