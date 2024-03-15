import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import Project from '@/src/interfaces/Project';

export interface SharedState {
    currentProject: Project | undefined;
};

export const initialState: SharedState = {
    currentProject: undefined
};

export const sharedSlice = createSlice({
    name: 'shared',
    initialState,
    reducers: {
        setCurrentProject: (state, action: PayloadAction<Project>) => {
            state.currentProject = action.payload;
        },
    }
});

export const selectSharedState = (state: AppState) => state.shared;
export const selectCurrentProject = (state: AppState) => state.shared.currentProject;

export const {
    setCurrentProject
} = sharedSlice.actions;

export default sharedSlice.reducer;
