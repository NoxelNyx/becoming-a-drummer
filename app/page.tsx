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
            <Grid item display={{ xs: 'none', sm: 'flex' }} sm={user ? 12 : 7} md={user ? 12 : 8} lg={user ? 12 : 9} justifyContent="center">
                <Logo sizes="100vh" height={500} className='mx-auto' />
            </Grid>
            {user === null &&
                <Grid item xs={12} sm={5} md={4} lg={3}>
                    <LoginCard />
                </Grid>
            }
        </Grid>
    );
}
