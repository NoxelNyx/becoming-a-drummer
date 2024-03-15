'use client'

import React, { FC, ReactElement } from 'react';
import { Typography, AppBar, Toolbar, Avatar, IconButton, Tabs } from '@mui/material';
import { Launch } from '@mui/icons-material';
import ProjectTab from './components/ProjectTab';
import ProjectLauncher from './components/ProjectLauncher';
import Logo from '@/src/components/Logo';
import { useAuthContext, auth } from '@/src/firebase/provider';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Menu, MenuItem, ListItemIcon, Popover, Box, Input } from '@mui/material';
import { Logout, Key } from '@mui/icons-material';

import {
    getProjectsAsync,
    setProjectAsync,
    addProjectAsync,
    deleteProjectAsync,
    selectProjectNavState
} from './slice';
import Project from '@/src/interfaces/Project';

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
    const [apiKey, setApiKey] = React.useState(localStorage.getItem('yt_api_key') || '');
    const { projectId: activeProjectId } = useParams();

    React.useEffect(() => {
        if (user !== null)
            dispatch(getProjectsAsync(user.uid));
    }, [user, dispatch]);

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
            } 
        })) as any;

        router.push(`/project/${res.payload.id}`);
    }

    const handleProjectDelete = async (id: string) => {
        if (user === null) return;

        if (activeProjectId === id)
            router.push('/');

        await dispatch(deleteProjectAsync({ uid: user.uid, id }));
    }

    const handleProjectClose = async (project: Project) => {
        if (user === null) return;

        if (activeProjectId === project.id)
            router.push('/');

        await dispatch(setProjectAsync({ uid: user.uid, project: { ...project, open: false } }));
    }

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
                            scrollButtons="auto">
                            {projects.map((project, index) => {
                                if (project.open)
                                    return (
                                        <ProjectTab
                                            key={index}
                                            project={project}
                                            handleProjectDelete={handleProjectDelete}
                                            handleProjectClose={handleProjectClose} />
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
        </React.Fragment>
    );
};

export default ProjectNav;
