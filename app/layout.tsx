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
import ProjectNav from '@/src/components/ProjectNav';
import HelpPanel from '@/src/components/HelpPanel';
import { AuthContextProvider } from '@/src/firebase/provider';
import { usePathname } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const inter = Inter({ subsets: ['latin'] });

let theme: Theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

theme = responsiveFontSizes(theme);

export function getCurrentBreakpoint() {
    const breakpoints = theme.breakpoints.values;
    const width = window.innerWidth;

    if (width < breakpoints.sm)
        return 'xs';
    else if (width < breakpoints.md)
        return 'sm';
    else if (width < breakpoints.lg)
        return 'md';
    else if (width < breakpoints.xl)
        return 'lg';
    else
        return 'xl';
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <html lang="en">
            <body className={inter.className} style={{ overflow: 'hidden' }}>
                <ProgressBar
                    height="4px"
                    color={theme.palette.secondary.dark}
                    options={{ showSpinner: false }}
                    shallowRouting />
                <AuthContextProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ProviderWrapper>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Container className="App h-screen" maxWidth="xl">
                                    <Grid container className={pathname === '/' ? 'h-screen' : ''}>
                                        <Grid item xs={12} className="max-h-20">
                                            <ProjectNav />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {children}
                                        </Grid>
                                    </Grid>
                                </Container>
                                <HelpPanel />
                            </LocalizationProvider>
                        </ProviderWrapper>
                    </ThemeProvider>
                </AuthContextProvider>
                <Analytics />
            </body>
        </html>
    )
}
