'use client'

import React from 'react';
import { Grid, Typography } from '@mui/material';
import Logo from '@/src/components/Logo';
import LoginCard from '@/src/components/LoginCard';
import { useAuthContext } from '@/src/firebase/provider';

export default function Home() {
    const user = useAuthContext();

    return (
        <Grid item container alignItems="center">
            <Grid item xs={user ? 12 : 9} justifyContent="center">
                <Logo sizes="100vh" height={500} className='mx-auto' />
            </Grid>
            {user === null &&
                <Grid item xs={3}>
                    <LoginCard />
                </Grid>
            }
        </Grid>
    );
}
