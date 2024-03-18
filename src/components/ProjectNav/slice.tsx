import { createSlice, PayloadAction, createAsyncThunk, current } from '@reduxjs/toolkit';
import { AppState } from '@/src/redux/store';
import { fetchProject, fetchProjects, setProject, addProject, deleteProject } from './api';
import Project from '@/src/interfaces/Project';

export interface ProjectNavState {
    projects: Project[]
};

const initialState: ProjectNavState = {
    projects: []
};

export const fetchProjectAsync = createAsyncThunk(
    'project/fetch',
    async (args: { uid: string, id: string }) => {
        return await fetchProject(args.uid, args.id);
    }
);

export const fetchProjectsAsync = createAsyncThunk(
    'projects/fetch',
    async (uid: string) => {
        return await fetchProjects(uid);
    }
);

export const setProjectAsync = createAsyncThunk(
    'projects/set',
    async (args: { uid: string, project: Project }) => {
        return await setProject(args.uid, args.project);
    }
);

export const addProjectAsync = createAsyncThunk(
    'projects/new',
    async (args: { uid: string, project: Project }) => {
        return await addProject(args.uid, args.project);
    }
);

export const deleteProjectAsync = createAsyncThunk(
    'projects/delete',
    async (args: { uid: string, id: string }) => {
        return await deleteProject(args.uid, args.id);
    }
);

export const projectNavSlice = createSlice({
    name: 'projectNav',
    initialState,
    reducers: {
        setProjectLocal: (state, action: PayloadAction<Project>) => {
            const index = state.projects.findIndex(project => project.id === action.payload.id);
            
            state.projects[index] = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjectsAsync.fulfilled, (state, action) => {
            state.projects = action.payload as Project[];
        })
        .addCase(setProjectAsync.fulfilled, (state, action) => {
            const index = state.projects.findIndex(project => project.id === action.payload.id);
            
            state.projects[index] = action.payload;
        })
        .addCase(addProjectAsync.fulfilled, (state, action) => {
            state.projects.push(action.payload);
        })
        .addCase(deleteProjectAsync.fulfilled, (state, action) => {
            state.projects = state.projects.filter(project => project.id !== action.payload);
        });
    }
});

export const selectProjectNavState = (state: AppState) => state.projectNav;
export const selectProject = (id: string) => (state: AppState) => state.projectNav.projects.find(project => project.id === id);

export const {
    setProjectLocal
} = projectNavSlice.actions;

export default projectNavSlice.reducer;
