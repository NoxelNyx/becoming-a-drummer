import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import { User } from 'firebase/auth';
import { YouTubePlayer } from 'react-youtube';

export interface SharedState {
    currentVideoId?: string,
    currentPlayer?: any
};

export const initialState: SharedState = {
    currentVideoId: undefined,
    currentPlayer: undefined
};

export const sharedSlice = createSlice({
    name: 'shared',
    initialState,
    reducers: {
        setCurrentVideoId: (state, action: PayloadAction<string>) => {
            state.currentVideoId = action.payload;
        }
    }
});

export const selectSharedState = (state: AppState) => state.shared;

export const {
    setCurrentVideoId
} = sharedSlice.actions;

export default sharedSlice.reducer;
