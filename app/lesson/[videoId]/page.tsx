'use client'

import React from 'react';
import { styled } from '@mui/system';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import VideoEmbed from '@/src/components/VideoEmbed';
import LessonPanel from '@/src/components/LessonPanel';

const styles = {
    root: {
        textAlign: 'center',
        marginTop: '3rem',
    }
};

const Div = styled('div')(styles);

export default function LessonPage({
    params 
}: {
    params: { videoId: string }
}) {
    const user = useAuthContext();
    const router = useRouter();

    React.useEffect(() => {
        if (user === null)
            router.push('/');
    }, [user, router]);

    return (
        <Div sx={styles.root}>
            <VideoEmbed videoId={params.videoId} />
            <LessonPanel videoId={params.videoId} className='mt-3 w-full' />
        </Div>
    );
}
