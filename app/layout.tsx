import React from 'react'
import { Metadata } from 'next';
import App from '@/src/components/App';

export const metadata: Metadata = {
    title: 'becomingadrummer.com',
    description: 'A web app with practice tools designed to help you become a drummer.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ overflowX: 'hidden' }}>
                <App>
                    {children}
                </App>
            </body>
        </html>
    )
}
