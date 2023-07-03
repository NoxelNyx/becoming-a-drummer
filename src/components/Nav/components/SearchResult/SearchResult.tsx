import React, { FC, ReactElement } from 'react';
import { Card, Box, CardActionArea, Typography, CardContent, CardMedia } from '@mui/material';
import { setCurrentVideoId } from '@/src/redux/slice';
import { setQuery } from '@/src/components/Nav/components/SearchBar/slice';
import { useAppDispatch } from '@/src/redux/hooks';
import Thumbnail from '../../../Thumbnail';
import Link from 'next/link';

type SearchResultProps = {
    key: string,
    url: string,
    title: string,
    description: string,
    duration: number,
    videoId: string,
    handlePopoverClose: () => void
}

const styles = {
    root: {
        marginTop: '1rem',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#000'
        },
        display: 'flex',
        height: 'auto',
        width: 200
    }
}

const SearchResult: FC<SearchResultProps> = ({ videoId, url, title, description, duration, handlePopoverClose }): ReactElement => {
    const dispatch = useAppDispatch();

    const handleClick = () => {
        handlePopoverClose();
        dispatch(setCurrentVideoId(videoId));
        dispatch(setQuery(''));
    };

    return (
        <Box marginRight={3}>
            <Link href={'/video/' + videoId}>
                <Card sx={styles.root} onClick={handleClick} elevation={6}>
                    <CardActionArea>
                        <CardMedia>
                            <Thumbnail url={url} description={description} duration={duration} />
                        </CardMedia>
                        <CardContent>
                            {title}
                            </CardContent>
                    </CardActionArea>
                </Card>
            </Link>
        </Box>
    )
}

export default SearchResult
