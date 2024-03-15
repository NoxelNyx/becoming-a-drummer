import React, { FC, ReactElement } from 'react';
import { Card, Box, CardActionArea, Typography, CardContent, CardMedia } from '@mui/material';
import Thumbnail from '@/src/components/Thumbnail';

type SearchResultProps = {
    key: string,
    url: string,
    title: string,
    description: string,
    duration: number,
    id: string,
    handlePopoverClose: () => void,
    handleOnSelect: (id: string, title: string, thumbnailUrl: string) => void
}

const styles = {
    root: {
        marginTop: '1rem',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#000'
        },
        display: 'flex',
        height: 200,
        width: 200
    }
}

const SearchResult: FC<SearchResultProps> = ({ id, url, title, description, duration, handlePopoverClose, handleOnSelect }): ReactElement => {
    const handleClick = () => {
        handlePopoverClose();
        handleOnSelect(id, title, url);
    };

    return (
        <Box marginRight={3} maxHeight={215}>
            <Card sx={styles.root} onClick={handleClick} elevation={6}>
                <CardActionArea>
                    <CardMedia sx={{ height: 120, position: 'absolute', top: '0' }}>
                        <Thumbnail url={url} description={description} duration={duration} />
                    </CardMedia>
                    <CardContent sx={{ position: 'absolute', top: '100px' }}>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}

export default SearchResult
