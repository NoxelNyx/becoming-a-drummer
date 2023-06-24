'use client'

import './globals.css'
import { Inter } from 'next/font/google';
import { ProviderWrapper } from '@/src/redux/provider';
import { createTheme, Theme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from '@/src/components/Nav';
import PracticePanel from '@/src/components/PracticePanel';
import { AuthContextProvider } from '@/src/firebase/provider';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Becoming a Drummer',
    description: 'Learn how to play the drums.',
};

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
                <AuthContextProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ProviderWrapper>
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
                        </ProviderWrapper>
                    </ThemeProvider>
                </AuthContextProvider>
            </body>
        </html>
    )
}
