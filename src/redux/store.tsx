'use client'

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sharedReducer from './slice';
import searchReducer from '@/src/components/Nav/components/SearchBar/slice';
import practicePanelReducer from '@/src/components/PracticePanel/slice';
import videoEmbedReducer from '@/src/components/VideoEmbed/slice';

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        search: searchReducer,
        practicePanel: practicePanelReducer,
        videoEmbed: videoEmbedReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>
