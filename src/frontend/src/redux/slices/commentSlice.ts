import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UUID } from 'crypto';

interface Comment {
  commentId: UUID;
  content: string;
  pullRequestId: UUID;
}

interface PRCommentState {
  comments: Comment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface CommentState {
  [pullRequestId: string]: PRCommentState;
}

const initialState: CommentState = {};

export const fetchCommentsByPullRequestId = createAsyncThunk('comments/fetchCommentsByPullRequestId', async (pullRequestId: UUID) => {
  const response = await axios.get(`/api/comments?pullRequestId=${pullRequestId}`);
  return { pullRequestId, comments: response.data };
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPullRequestId.pending, (state, action) => {
        const pullRequestId = action.meta.arg;
        if (!state[pullRequestId]) {
          state[pullRequestId] = { comments: [], status: 'loading', error: null };
        } else {
          state[pullRequestId].status = 'loading';
        }
      })
      .addCase(fetchCommentsByPullRequestId.fulfilled, (state, action) => {
        const { pullRequestId, comments } = action.payload;
        state[pullRequestId] = { comments, status: 'succeeded', error: null };
      })
      .addCase(fetchCommentsByPullRequestId.rejected, (state, action) => {
        const pullRequestId = action.meta.arg;
        state[pullRequestId].status = 'failed';
        state[pullRequestId].error = action.error.message || 'Failed to fetch comments';
      });
  },
});

export default commentSlice.reducer;
