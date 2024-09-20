import { configureStore } from '@reduxjs/toolkit';
import orgReducer from './slices/orgSlice';
import projectReducer from './slices/projectSlice';
import repoReducer from './slices/repoSlice';
import prReducer from './slices/prSlice';
import commentReducer from './slices/commentSlice';

const store = configureStore({
  reducer: {
    org: orgReducer,
    project: projectReducer,
    repo: repoReducer,
    pr: prReducer,
    comments: commentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
