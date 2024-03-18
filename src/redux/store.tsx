'use client'

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sharedReducer from './slice';
import lessonPanelReducer from '@/src/components/LessonPanel/slice';
import projectNavReducer from '@/src/components/ProjectNav/slice';
import searchReducer from '@/src/components/SearchBar/slice';
import shareDialogReducer from '@/src/components/ShareDialog/slice';

export const store = configureStore({
    reducer: {
        shared: sharedReducer,
        lessonPanel: lessonPanelReducer,
        projectNav: projectNavReducer,
        search: searchReducer,
        shareDialog: shareDialogReducer,
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
