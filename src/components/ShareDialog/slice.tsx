import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { searchUsers, addShareLink } from './api';
import User from '@/src/interfaces/User';

export interface ShareDialogState {
    searchResults: User[]
};

const initialState = {
    searchResults: [] as User[]
};

export const searchUsersAsync = createAsyncThunk(
    'shareDialog/search',
    async (query: string ) => {
        return await searchUsers(query);
    }
);

export const addShareLinkAsync = createAsyncThunk(
    'shareDialog/addShareLink',
    async (args: { projectId: string, userId: string }) => {
        return await addShareLink(args.projectId, args.userId);
    }
);

export const shareDialogSlice = createSlice({
    name: 'shareDialog',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
            state.searchResults = action.payload;
        });
    }
});

export const selectShareDialogState = (state: AppState) => state.shareDialog;

export const { clearSearchResults } = shareDialogSlice.actions;

export default shareDialogSlice.reducer;