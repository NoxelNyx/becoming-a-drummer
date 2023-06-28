import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchGsBookmarks, addGsBookmark, deleteGsBookmark } from './api';
import { AppState } from '@/src/redux/store';

export interface GsBookmark {
    id?: string,
    url?: string,
    videoId?: string,
    title?: string,
    active?: boolean,
};

export interface LessonPanelState {
    gsBookmarks: GsBookmark[]
}

const initialState = {
    gsBookmarks: [] as GsBookmark[]
};

export const getGsBookmarksAsync = createAsyncThunk(
    'gsBookmarks/fetch',
    async (args: { uid: string, videoId: string }) => {
        return await fetchGsBookmarks(args.uid, args.videoId);
    }
);

export const addGsBookmarkAsync = createAsyncThunk(
    'gsBookmarks/add',
    async (args: { uid: string, newGsBookmark: GsBookmark }) => {
        return await addGsBookmark(args.uid, args.newGsBookmark);
    }
);

export const deleteGsBookmarkAsync = createAsyncThunk(
    'gsBookmarks/delete',
    async (args: { uid: string, gsBookmarkId: string }) => {
        return await deleteGsBookmark(args.uid, args.gsBookmarkId);
    }
);

export const lessonPanelSlice = createSlice({
    name: 'lessonPanel',
    initialState,
    reducers: {
        setActive: (state, action: PayloadAction<string>) => {
            state.gsBookmarks = state.gsBookmarks.map((gsBookmark) => {
                if (gsBookmark.active)
                    gsBookmark.active = false;
                
                if (gsBookmark.id === action.payload)
                    gsBookmark.active = true;

                return gsBookmark;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getGsBookmarksAsync.fulfilled, (state, action) => {
            state.gsBookmarks = action.payload as GsBookmark[];
        })
        .addCase(addGsBookmarkAsync.fulfilled, (state, action) => {
            state.gsBookmarks.push(action.payload as GsBookmark);
        })
        .addCase(deleteGsBookmarkAsync.fulfilled, (state, action) => {
            state.gsBookmarks = state.gsBookmarks.filter((gsBookmark) => {
                return gsBookmark.id !== action.payload;
            });
        });
    },
});

export const selectLessonPanelState = (state: AppState) => state.lessonPanel;

export const { setActive } = lessonPanelSlice.actions;

export default lessonPanelSlice.reducer;
