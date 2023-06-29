'use client'

import React, { FC, ReactElement } from 'react';
import { Typography, AppBar, Toolbar, Avatar } from '@mui/material';
import SearchBar from './components/SearchBar';
import Logo from '@/src/components/Logo';
import { useAuthContext, auth } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, MenuItem, ListItemIcon, Popover, Box, Input } from '@mui/material';
import { Logout, Key } from '@mui/icons-material';

type NavProps = {
    className?: string
};

const Nav: FC<NavProps> = ({ className }): ReactElement => {
    const user = useAuthContext();
    const router = useRouter();
    const avatarChar = user?.displayName ? user.displayName.charAt(0).toLocaleUpperCase() : user?.email?.charAt(0).toLocaleUpperCase();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<null | HTMLElement>(null);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [apiKey, setApiKey] = React.useState(localStorage.getItem('yt_api_key') || '');

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

    return (
        <React.Fragment>
            {user !== null &&
                <AppBar position="static" className={className}>
                    <Toolbar>
                        <Link href="/"><Logo height={40} /></Link>
                        <SearchBar className="mx-6" />
                        <Avatar sx={{ ml: 2, cursor: 'pointer' }} onClick={handleUserMenuOpen}>{avatarChar}</Avatar>
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
        </React.Fragment>
    );
};

export default Nav
