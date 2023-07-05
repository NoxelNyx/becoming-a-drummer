import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography, CardHeader, Divider, Chip } from '@mui/material';
import { useAppDispatch } from '@/src/redux/hooks';
import { addGsBookmarkAsync } from '@/src/components/LessonPanel/slice';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import filters from '@/src/components/FilterBar/filters.json';

type CommunityContent = {
    title: string,
    videoTitle: string,
    description: string,
    videoId: string,
    params: string,
    keywords: string[]
};


export default function CommunityContent({ title, videoTitle, description, videoId, params, keywords }: CommunityContent) {
    const user = useAuthContext();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleClick = async () => {
        await dispatch(addGsBookmarkAsync({ uid: user?.uid as string, newGsBookmark: { title, videoId, params, shared: true } }));
        router.push(`/video/${videoId}`);
    };

    return (
        <Card sx={{ display: 'flex' }}>
            <CardActionArea onClick={handleClick}>
                <CardHeader
                    title={videoTitle}
                    avatar={
                        <CardMedia
                            component="img"
                            sx={{ width: 100, height: '100%', display: 'inline-flex' }}
                            image={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                            alt={title} />
                    } />
                <Divider />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                        <Typography component="div">
                            {title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 1 }}>
                            {
                                keywords.map((keyword, index) => {
                                    const isTypeFilter = filters.type.includes(keyword);

                                    return <Chip key={index} label={keyword} sx={{ mr: 1, mt: 1 }} size='small' color={isTypeFilter ? 'secondary' : 'default'} />
                                })
                            }
                        </Box>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
}
