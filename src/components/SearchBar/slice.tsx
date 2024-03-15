'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { searchGoogle, getContentDetails } from './api';
import moment from 'moment';

export interface GoogleVideo {
    id: object,
    snippet: object,
    contentDetails: object
};

export interface SearchState {
    videos: GoogleVideo[]
};

const initialState: SearchState = {
    videos: [] as GoogleVideo[]/*{
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
            duration: 933
        }
    }*/
};

export const searchExternalAsync = createAsyncThunk(
    'search/searchExternal',
    async (query: string) => {
        let data = await searchGoogle(query);
        const videoIds = data.items.map((item: any) => { return item.id.videoId });
        const contentDetails = await getContentDetails(videoIds);
        const videosWithContentDetails: any = await addContentDetails(data, contentDetails);

        return videosWithContentDetails;
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        resetVideos: (state) => {
            state.videos = [] as GoogleVideo[];
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
    resetVideos
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
                duration: moment.duration(relevantDetails.contentDetails.duration).asSeconds()
            },
            ...video
        })
    });

    return data;
};
