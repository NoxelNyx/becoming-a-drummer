import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { fetchBookmarks, addBookmark, deleteBookmark } from './api';

export interface Bookmark {
    id?: string,
    videoId?: string,
    title: string,
    duration: number,
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
        return await fetchBookmarks(uid);
    }
);

export const addBookmarkAsync = createAsyncThunk(
    'bookmarks/add',
    async (args: { uid: string, newBookmark: Bookmark }) => {
        return await addBookmark(args.uid, args.newBookmark);
    }
);

export const deleteBookmarkAsync = createAsyncThunk(
    'bookmarks/delete',
    async (args: { uid: string, bookmarkId: string }) => {
        return await deleteBookmark(args.uid, args.bookmarkId);
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
        builder.addCase(getBookmarksAsync.fulfilled, (state, action) => {
            state.bookmarks = action.payload as Bookmark[];
        })
        .addCase(addBookmarkAsync.fulfilled, (state, action) => {
            state.bookmarks.push(action.payload as any);
        })
        .addCase(deleteBookmarkAsync.fulfilled, (state, action) => {
            state.bookmarks = state.bookmarks.filter((bookmark) => {
                return bookmark.id !== action.payload;
            });
        });
    }
});

export const selectPracticePanelState = (state: AppState) => state.practicePanel;

export const {
    newPracticeSession
} = practicePanelSlice.actions;

export default practicePanelSlice.reducer;
