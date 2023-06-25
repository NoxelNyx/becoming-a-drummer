import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSections, addSection } from './api';
import { AppState } from '@/src/redux/store';

export interface Section {
    id?: string,
    start?: number,
    end?: number,
    repeat?: boolean,
    gsParams?: string,
    active: boolean
}

export interface VideoEmbedState {
    sections: Section[]
}

const initialState = {
    sections: [] as Section[]
};

export const getSectionsAsync = createAsyncThunk(
    'section/fetch',
    async (args: { uid: string, videoId: string }) => {
        return await fetchSections(args.uid, args.videoId);
    }
);

export const addSectionAsync = createAsyncThunk(
    'section/add',
    async (args: { uid: string, videoId: string, newSection: Section }) => {
        args.newSection.repeat = true;
        return await addSection(args.uid, args.videoId, args.newSection);
    }
);

export const videoEmbedSlice = createSlice({
    name: 'videoEmbed',
    initialState,
    reducers: {
        activateSection: (state, action: PayloadAction<string>) => {
            state.sections = state.sections.map((section) => {
                if (section.active)
                    section.active = false;
                
                if (section.id === action.payload)
                    section.active = true;

                return section;
            });
        },
        deactivateSection: (state, action: PayloadAction<string>) => {
            state.sections = state.sections.map((section) => {
                if (section.id === action.payload)
                    section.active = false;

                return section;
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addSectionAsync.fulfilled, (state, action) => {
            state.sections.push(action.payload as any);
        })
        .addCase(getSectionsAsync.fulfilled, (state, action) => {
            state.sections = action.payload as Section[];
        });
    },
});

export const selectVideoEmbedState = (state: AppState) => state.videoEmbed;

export const {
    activateSection,
    deactivateSection
} = videoEmbedSlice.actions;

export default videoEmbedSlice.reducer;
