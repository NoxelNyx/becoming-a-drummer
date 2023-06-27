import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSections, addSection, updateSection, deleteSection } from './api';
import { AppState } from '@/src/redux/store';

export interface Section {
    id?: string,
    start?: number,
    end?: number,
    repeat?: boolean,
    gsParams?: string,
    active?: boolean,
    videoId?: string
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
    async (args: { uid: string, newSection: Section }) => {
        args.newSection.repeat = true;
        return await addSection(args.uid, args.newSection);
    }
);

export const updateSectionAsync = createAsyncThunk(
    'section/update',
    async (args: { uid: string, section: Section }) => {
        return await updateSection(args.uid, args.section);
    }
);

export const deleteSectionAsync = createAsyncThunk(
    'section/delete',
    async (args: { uid: string, sectionId: string }) => {
        return await deleteSection(args.uid, args.sectionId);
    }
);

export const videoEmbedSlice = createSlice({
    name: 'videoEmbed',
    initialState,
    reducers: {
        addLocalSection: (state, action: PayloadAction<Section>) => {
            state.sections.push(action.payload);
        },
        deleteLocalSection: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            state.sections.splice(index, 1);
        },
        activateSection: (state, action: PayloadAction<string>) => {
            state.sections = state.sections.map((section) => {
                if (section.active)
                    section.active = false;
                
                if (section.id === action.payload)
                    section.active = true;

                return section;
            });
        },
        deactivateSections: (state) => {
            state.sections = state.sections.map((section) => {
                if (section.active)
                    section.active = false;

                return section;
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addSectionAsync.fulfilled, (state, action) => {
            state.sections.push(action.payload as Section);
        })
        .addCase(getSectionsAsync.fulfilled, (state, action) => {
            state.sections = action.payload as Section[];
        })
        .addCase(deleteSectionAsync.fulfilled, (state, action) => {
            state.sections = state.sections.filter((section) => {
                return section.id !== action.payload;
            });
        })
        .addCase(updateSectionAsync.fulfilled, (state, action) => {
            state.sections = state.sections.map((section) => {
                if (section.id === action.payload.id)
                    return action.payload;
                
                return section;
            });
        });
    },
});

export const selectVideoEmbedState = (state: AppState) => state.videoEmbed;

export const {
    activateSection,
    deactivateSections,
    addLocalSection,
    deleteLocalSection
} = videoEmbedSlice.actions;

export default videoEmbedSlice.reducer;
