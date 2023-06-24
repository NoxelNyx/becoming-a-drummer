import React, { FC, ReactElement } from 'react';
import { Grid, Paper } from '@mui/material';
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
    duration: string,
    videoId: string
}

const styles = {
    root: {
        marginTop: '1rem',
        marginBottom: '2rem',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#000'
        }
    }
}

const SearchResult: FC<SearchResultProps> = ({ videoId, url, title, description, duration }): ReactElement => {
    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(setCurrentVideoId(videoId));
        dispatch(setQuery(''));
    };

    return (
        <Link href={'/lesson/' + videoId}>
            <Paper sx={styles.root} square onClick={handleClick}>
                <Grid container justifyContent="flex-start">
                    <Grid item className="mr-1">
                        <Thumbnail url={url} title={title} duration={duration} />
                    </Grid>
                    <Grid item xs={12} sm container className="mt-1">
                        <Grid item xs container direction="column">
                            <Grid item xs>
                                <h2 className="mt-0">{title}</h2>
                                {description}
                            </Grid>
                            <Grid item>
                                
                            </Grid>
                            <Grid item>
                                
                            </Grid>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Link>
    )
}

export default SearchResult
