import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchGsBookmarks, addGsBookmark, deleteGsBookmark, updateGsBookmark } from './api';
import { AppState } from '@/src/redux/store';

export interface GsBookmark {
    id?: string,
    params?: string,
    videoId?: string,
    title?: string,
    active?: boolean,
    shared?: boolean,
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

export const updateGsBookmarkAsync = createAsyncThunk(
    'gsBookmarks/update',
    async (args: { uid: string, gsBookmark: GsBookmark }) => {
        return await updateGsBookmark(args.uid, args.gsBookmark);
    }
);

export const lessonPanelSlice = createSlice({
    name: 'lessonPanel',
    initialState,
    reducers: {
        setActive: (state, action: PayloadAction<{ id: string, active: boolean}>) => {
            state.gsBookmarks = state.gsBookmarks.map((gsBookmark) => {
                if (gsBookmark.active)
                    gsBookmark.active = false;
                
                if (gsBookmark.id === action.payload.id)
                    gsBookmark.active = action.payload.active;

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
        })
        .addCase(updateGsBookmarkAsync.fulfilled, (state, action) => {
            state.gsBookmarks = state.gsBookmarks.map((gsBookmark) => {
                if (gsBookmark.id === action.payload.id)
                    gsBookmark = {...gsBookmark, ...action.payload} as GsBookmark;
                
                return gsBookmark;
            });
        })
    },
});

export const selectLessonPanelState = (state: AppState) => state.lessonPanel;

export const { setActive } = lessonPanelSlice.actions;

export default lessonPanelSlice.reducer;
