'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { searchGoogle, getContentDetails } from './api';

export interface GoogleVideo {
    id: object,
    snippet: object,
    contentDetails: object
};

export interface SearchState {
    query?: string | null,
    videos: [GoogleVideo]
};

const initialState: SearchState = {
    query: '',
    videos: [{
        id: {
            videoId: 'woI6t8dCQcQ'
        },
        snippet: {
            title: 'How to be a drummer',
            description: 'A video about how to be a drummer.',
            thumbnails: {
                medium: {
                    url: 'https://i.ytimg.com/vi/woI6t8dCQcQ/mqdefault.jpg'
                }
            }
        },
        contentDetails: {
            duration: 'PT15M33S'
        }
    }]
};

export const searchExternalAsync = createAsyncThunk(
    'search/searchExternal',
    async (query: string) => {
        //let data = await searchGoogle(query);
        //const videoIds = data.items.map((item: any) => { return item.id.videoId });
        //const contentDetails = await getContentDetails(videoIds);
        //const videosWithContentDetails: any = await addContentDetails(data, contentDetails);
        const videosWithContentDetails: any = initialState.videos

        return videosWithContentDetails;
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchExternalAsync.pending, (state) => {
        })
        .addCase(searchExternalAsync.fulfilled, (state, action) => {
            state.videos = action.payload;
        });
    }
});

export const selectSearchState = (state: AppState) => state.search;

export const {
    setQuery
} = searchSlice.actions;

export default searchSlice.reducer;

async function addContentDetails(videos: any, contentDetails: any) {
    let data: GoogleVideo[] = new Array<GoogleVideo>();

    videos.items.forEach((video: any) => {
        const relevantDetails = contentDetails.items.filter((cd: any) => {
            return video.id.videoId === cd.id
        })[0];

        data.push({
            contentDetails: {
                duration: relevantDetails.contentDetails.duration
            },
            ...video
        })
    });

    return data;
};
