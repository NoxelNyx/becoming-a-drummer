'use client'

import React, { FC, ReactElement } from 'react';
import { Typography, AppBar, Toolbar, Avatar, IconButton, Tabs } from '@mui/material';
import { Launch } from '@mui/icons-material';
import ProjectTab from './components/ProjectTab';
import ProjectLauncher from './components/ProjectLauncher';
import Logo from '@/src/components/Logo';
import { useAuthContext, auth } from '@/src/firebase/provider';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';
import { Menu, MenuItem, ListItemIcon, Popover, Box, Input } from '@mui/material';
import { Logout, Key } from '@mui/icons-material';

import {
    fetchProjectsAsync,
    setProjectAsync,
    addProjectAsync,
    deleteProjectAsync,
    selectProjectNavState
} from './slice';
import Project from '@/src/interfaces/Project';
import ShareDialog from '../ShareDialog';

type ProjectNavProps = {
    className?: string
};

const ProjectNav: FC<ProjectNavProps> = ({ className }): ReactElement => {
    const user = useAuthContext();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const avatarChar = user?.displayName ? user.displayName.charAt(0).toLocaleUpperCase() : user?.email?.charAt(0).toLocaleUpperCase();
    const { projects } = useAppSelector(selectProjectNavState);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<null | HTMLElement>(null);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [projectLauncherOpen, setProjectLauncherOpen] = React.useState(false);
    const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
    const [selectedProjectShare, setSelectedProjectShare] = React.useState<Project | null>(null);
    const [apiKey, setApiKey] = React.useState(localStorage.getItem('yt_api_key') || '');
    const { projectId: activeProjectId } = useParams();

    React.useEffect(() => {
        if (user !== null)
            dispatch(fetchProjectsAsync(user.uid));
    }, [user, dispatch]);

    React.useEffect(() => {
        if (shareDialogOpen) {
            const updatedProject = projects.find(project => project.id === selectedProjectShare?.id);
            setSelectedProjectShare(updatedProject || null);
        }
    }, [projects, shareDialogOpen, selectedProjectShare]);

    const handleSignOut = () => {
        setMenuOpen(false);
        router.push('/');
        auth.signOut();
    };

    const handlePopoverOpen = () => {
        setPopoverOpen(true);
        setPopoverAnchorEl(menuAnchorEl);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
        setPopoverAnchorEl(null);
    };

    const handleUserMenuOpen = (event: any) => {
        setMenuOpen(true);
        setMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setMenuOpen(false);
        setMenuAnchorEl(null);
    };

    const handleSetApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem('yt_api_key', event.target.value);
        setApiKey(event.target.value);
        handlePopoverClose();
    };

    const handleProjectOpen = async (project: Project) => {
        setProjectLauncherOpen(false);

        if (user !== null && !project.open)
            await dispatch(setProjectAsync({ uid: user.uid, project: { ...project, open: true } }));

        router.push(`/project/${project.id}`);
    }

    const handleProjectLauncherClose = () => {
        setProjectLauncherOpen(false);
    };

    const handleProjectCreate = async (sourceId: string, title: string, projectType: string) => {
        if (user === null) return;

        const res = await dispatch(addProjectAsync({ 
            uid: user.uid, 
            project: {
                id: '',
                videoId: sourceId,
                title, 
                open: true,
                type: projectType,
                sections: [],
                gsBookmarks: [],
                shared: false,
                sharedWith: [{ id: user.uid, email: user.email || '', isOwner: true }],
                sharedWithIds: [],
                inContentLibrary: false
            } 
        })) as any;

        router.push(`/project/${res.payload.id}`);
    };

    const handleProjectDelete = async (id: string) => {
        if (user === null) return;

        if (activeProjectId === id)
            router.push('/');

        await dispatch(deleteProjectAsync({ uid: user.uid, id }));
    };

    const handleProjectClose = async (project: Project) => {
        if (user === null) return;

        if (activeProjectId === project.id)
            router.push('/');

        await dispatch(setProjectAsync({ uid: user.uid, project: { ...project, open: false } }));
    };

    const handleProjectShare = (project: Project) => {
        setSelectedProjectShare(project);
        setShareDialogOpen(true);
    };

    const handleShareDialogClose = () => {
        setSelectedProjectShare(null);
        setShareDialogOpen(false);
    };

    return (
        <React.Fragment>
            {user !== null &&
                <AppBar position="static" className={className}>
                    <Toolbar>
                        <Link href="/"><Logo height={40} /></Link>
                        <IconButton 
                            color="secondary"
                            aria-label="add"
                            sx={{ marginTop: '15px', marginLeft: '.5rem' }}
                            onClick={() => setProjectLauncherOpen(true)}>
                            <Launch />
                        </IconButton>
                        <Tabs 
                            sx={{ marginBottom: '-15px', maxWidth: '85%' }}
                            variant="scrollable"
                            scrollButtons="auto"
                            value={false}>
                            {projects.map((project, index) => {
                                if (project.open)
                                    return (
                                        <ProjectTab
                                            key={index}
                                            project={project}
                                            handleProjectDelete={handleProjectDelete}
                                            handleProjectClose={handleProjectClose}
                                            handleProjectShare={handleProjectShare} />
                                    )}
                            )}
                        </Tabs>
                        <Avatar sx={{ ml: 2, cursor: 'pointer', marginLeft: 'auto' }} onClick={handleUserMenuOpen}>{avatarChar}</Avatar>
                        {!popoverOpen &&
                            <Menu
                                anchorEl={menuAnchorEl}
                                open={menuOpen}
                                onClose={handleUserMenuClose}
                                elevation={1}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                <MenuItem onClick={handlePopoverOpen}>
                                    <ListItemIcon>
                                        <Key fontSize="small" />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Set YT API Key</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleSignOut}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Sign Out</Typography>
                                </MenuItem>
                            </Menu>
                        }
                        <Popover
                            open={popoverOpen}
                            anchorEl={popoverAnchorEl}
                            onClose={handlePopoverClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            color='secondary'
                            elevation={7}>
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                    <Input
                                        size='small'
                                        color='secondary'
                                        onChange={handleSetApiKey}
                                        value={apiKey} />
                                </Box>
                            </Box>
                        </Popover>
                    </Toolbar>
                </AppBar>
            }
            <ProjectLauncher
                open={projectLauncherOpen}
                projects={projects}
                handleProjectOpen={handleProjectOpen}
                handleProjectLauncherClose={handleProjectLauncherClose}
                handleProjectCreate={handleProjectCreate} />
            <ShareDialog
                open={shareDialogOpen}
                project={selectedProjectShare as Project}
                handleShareDialogClose={handleShareDialogClose} />
        </React.Fragment>
    );
};

export default ProjectNav;
