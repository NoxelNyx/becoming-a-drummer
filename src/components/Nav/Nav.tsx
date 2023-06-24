'use client'

import React, { FC, ReactElement } from 'react';
import { Typography, AppBar, Toolbar, Avatar } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SearchBar from './components/SearchBar';
import { useAppSelector } from '@/src/redux/hooks';
import { selectSharedState } from '@/src/redux/slice';
import Logo from '@/src/components/Logo';
import { useAuthContext, auth } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type NavProps = {
    className?: string
};

const Nav: FC<NavProps> = ({ className }): ReactElement => {
    const user = useAuthContext();
    const router = useRouter();

    const handleSignOut = () => {
        auth.signOut();
    };

    return (
        <React.Fragment>
            {user !== null &&
                <AppBar position="static" className={className}>
                    <Toolbar>
                        <Link href="/"><Logo height={40} /></Link>
                        <SearchBar className="mx-6" />
                        <Avatar className="ml-2" onClick={handleSignOut}>T</Avatar>
                    </Toolbar>
                </AppBar>
            }
        </React.Fragment>
    );
};

export default Nav
