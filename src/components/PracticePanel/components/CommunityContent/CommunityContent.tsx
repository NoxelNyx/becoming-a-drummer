import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useAppDispatch } from '@/src/redux/hooks';
import { addGsBookmarkAsync } from '@/src/components/LessonPanel/slice';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';

export default function CommunityContent({ title, videoTitle, description, videoId, params }: { title: string, videoTitle: string, description: string, videoId: string, params: string}) {
    const user = useAuthContext();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleClick = async () => {
        await dispatch(addGsBookmarkAsync({ uid: user?.uid as string, newGsBookmark: { title, videoId, params, shared: true } }));
        router.push(`/video/${videoId}`);
    };

    return (
        <Card sx={{ display: 'flex' }}>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'flex-start' }} onClick={handleClick}>
                <CardMedia
                    component="img"
                    sx={{ width: 100, height: '100%' }}
                    image={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                    alt={title} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                            {videoTitle}
                        </Typography>
                        <Typography component="div" marginTop={2}>
                            {title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {description}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
}
