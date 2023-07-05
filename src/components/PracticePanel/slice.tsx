import { createSlice, PayloadAction, createAsyncThunk, current } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { fetchBookmarks, fetchCommunityContent, addBookmark, deleteBookmark, addCommunityContent } from './api';

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

export interface CommunityContent {
    id?: string,
    videoId?: string,
    title: string,
    videoTitle: string,
    type: string,
    params: string,
    description: string,
    keywords: string[],
}

export interface PracticePanelState {
    practiceSessions: PracticeSession[],
    bookmarks: Bookmark[],
    communityContent: CommunityContent[],
};

const initialState: PracticePanelState = {
    practiceSessions: [],
    bookmarks: [],
    communityContent: [],
};

export const getCommunityContentAsync = createAsyncThunk(
    'communityContent/fetch',
    async (keywords: string[]) => {
        return await fetchCommunityContent(keywords);
    }
);

export const addCommunityContentAsync = createAsyncThunk(
    'communityContent/add',
    async (args: { newCommunityContent: CommunityContent }) => {
        return await addCommunityContent(args.newCommunityContent);
    }
);

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
        resetCommunityContent: (state) => {
            state.communityContent = [];
        },
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
        })
        .addCase(getCommunityContentAsync.fulfilled, (state, action) => {
            state.communityContent = action.payload as CommunityContent[];
        })
    }
});

export const selectFilteredCommunityContent = (communityContent: CommunityContent[], keywords: string[]) => {
    return communityContent.filter((content) => {
        const found = keywords.some((keyword) => {
            return content.keywords.includes(keyword);
        });

        return found;
    });
}

export const selectPracticePanelState = (state: AppState) => state.practicePanel;

export const {
    newPracticeSession,
    resetCommunityContent,
} = practicePanelSlice.actions;

export default practicePanelSlice.reducer;
