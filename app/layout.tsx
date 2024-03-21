import React from 'react'
import { Metadata } from 'next';

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
                {children}
            </body>
        </html>
    )
}
