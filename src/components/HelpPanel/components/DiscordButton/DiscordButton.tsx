import React from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import DiscordLogoImage from '@/public/discord-logo.png';
import DiscordLogoMiniImage from '@/public/discord-logo-mini.png';

type DiscordButtonProps = {
    variant?: 'mini' | 'full'
};

export default function DiscordButton({ variant }: DiscordButtonProps) {
    const styles = {
        root: {
            position: 'fixed',
            bottom: '5px',
            left: '70px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            zIndex: 9000,
        },
        discordBtn: {
            color: '#fff',
            borderRadius: '3px',
            padding: '3px',
            marginLeft: '5px',
            border: '1px solid rgba(206, 147, 216, 0)'
        }
    }

    return (
        <React.Fragment>
            {variant === 'full'
                ? <Box sx={styles.root}>
                    <Typography display={'inline-flex'} sx={{ marginLeft: '10px' }}>Need more assistance? Join our </Typography>
                    <Link href="https://discord.gg/JREku2XR5n" target='_blank'>
                        <Button sx={styles.discordBtn} variant="outlined" color="secondary">
                            <Image src={DiscordLogoImage} alt="Discord Logo" height="40" />
                        </Button>
                    </Link>
                </Box>
                : <React.Fragment>
                    <Link href="https://discord.gg/JREku2XR5n" style={{ padding: '0px', position: 'fixed', bottom: '10px', left: '70px' }} target='_blank'>
                        <Image src={DiscordLogoMiniImage} alt="Discord Logo" height='40'/>
                    </Link>
                </React.Fragment>
            }
        </React.Fragment>
    );
}