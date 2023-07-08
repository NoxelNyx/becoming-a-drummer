'use client'

import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ProviderWrapper } from '@/src/redux/provider';
import { createTheme, Theme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from '@/src/components/Nav';
import PracticePanel from '@/src/components/PracticePanel';
import { AuthContextProvider } from '@/src/firebase/provider';
import { usePathname } from 'next/navigation';
import NextNProgress from 'next-nprogress-bar';

const inter = Inter({ subsets: ['latin'] });

let theme: Theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

theme = responsiveFontSizes(theme);

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <html lang="en">
            <body className={inter.className}>
                <NextNProgress
                    height="4px"
                    color={theme.palette.secondary.dark}
                    options={{ showSpinner: false }}
                    shallowRouting
                    appDirectory />
                <AuthContextProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ProviderWrapper>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Container className="App h-screen" maxWidth="xl">
                                    <Grid container className={pathname === '/' ? 'h-screen' : ''}>
                                        <Grid item xs={12} className="max-h-20">
                                            <Nav />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {children}
                                        </Grid>
                                    </Grid>
                                </Container>
                                <PracticePanel />
                            </LocalizationProvider>
                        </ProviderWrapper>
                    </ThemeProvider>
                </AuthContextProvider>
                <Analytics />
            </body>
        </html>
    )
}
