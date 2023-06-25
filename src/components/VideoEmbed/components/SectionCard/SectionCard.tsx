import React from 'react';
import { Card } from '@mui/material';
import { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { activateSection, deactivateSection  } from '@/src/components/VideoEmbed/slice';

interface SectionCardProps {
    id: string,
    start: number,
    end: number,
    repeat: number,
    gsParams?: string,
    active: boolean,
    playerRef: YouTubePlayer
};

export default function SectionCard({ id, start, end, repeat, gsParams, playerRef, active }: SectionCardProps) {
    let timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const dispatch = useAppDispatch();

    const handleStateChange = (e: any) => {
        if (e.data === 2 || e.data === 0)
            clearTimeout(timeoutRef.current);
    }

    const handleClick = async () => {
        if (active) {
            dispatch(deactivateSection(id));

            clearTimeout(timeoutRef.current);
            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.pauseVideo();
        } else {
            dispatch(activateSection(id));

            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.seekTo(start, true);
            playerRef.playVideo();

            if (repeat) {
                timeoutRef.current = setTimeout(async () => {
                    if (await playerRef.getPlayerState() === 1)
                        handleClick();
                }, (end - start + 1) * 1000);

                playerRef.addEventListener('onStateChange', handleStateChange);
            }
        }
    };

    return (
        <Card sx={{ height: 50, cursor: 'pointer' }} onClick={handleClick} variant={active ? 'outlined' : 'elevation'} color={active ? 'secondary' : 'primary'} elevation={3}>
            <p>Start: {start}</p>
            <p>End: {end}</p>
        </Card>
    )
}
