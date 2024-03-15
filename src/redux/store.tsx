'use client'

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sharedReducer from './slice';
import lessonPanelReducer from '@/src/components/LessonPanel/slice';
import projectNavReducer from '@/src/components/ProjectNav/slice';
import searchState from '@/src/components/SearchBar/slice';

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        lessonPanel: lessonPanelReducer,
        projectNav: projectNavReducer,
        search: searchState
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
