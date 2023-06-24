import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { fetchBookmarks } from './api';

export interface Bookmark {
    videoId?: string,
    title: string,
    duration: string,
}

export interface PracticeSession {
    videoId?: string,
    tempo: number,
    note: string
};

export interface PracticePanelState {
    practiceSessions: PracticeSession[],
    bookmarks: Bookmark[]
};

const initialState: PracticePanelState = {
    practiceSessions: [],
    bookmarks: []
}

export const getBookmarksAsync = createAsyncThunk(
    'bookmarks/fetch',
    async (uid: string) => {
        const bookmarks = await fetchBookmarks(uid);

        return bookmarks;
    }
);

export const practicePanelSlice = createSlice({
    name: 'practicePanel',
    initialState,
    reducers: {
        newPracticeSession: (state, action: PayloadAction<string>) => {
            state.practiceSessions.push({ videoId: action.payload } as PracticeSession);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBookmarksAsync.pending, (state) => {
        })
        .addCase(getBookmarksAsync.fulfilled, (state, action) => {
            state.bookmarks = action.payload as any;
        });
    }
});

export const selectPracticePanelState = (state: AppState) => state.practicePanel;

export const {
    newPracticeSession
} = practicePanelSlice.actions;

export default practicePanelSlice.reducer;
