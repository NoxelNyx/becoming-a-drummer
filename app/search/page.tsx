'use client'

import React, { FC, ReactElement } from 'react';
import { Grid, Typography } from '@mui/material';
import { selectSearchState } from '@/src/components/Nav/components/SearchBar/slice';
import { useAppSelector } from '@/src/redux/hooks';
import SearchResult from '@/src/components/Nav/components/SearchResult';

const styles = {
    root: {
    }
};

export default function SearchPage(): ReactElement {
    const { videos } = useAppSelector(selectSearchState);

    return (
        <Grid item xs={12} className="mt-3">
            <Typography variant="h4">Results</Typography>
            <hr />
            {videos.map((video: any) =>
                <SearchResult
                    key={video.id.videoId}
                    videoId={video.id.videoId}
                    duration={video.contentDetails.duration}
                    url={video.snippet.thumbnails.medium.url}
                    title={video.snippet.title}
                    description={video.snippet.description} />
            )}
        </Grid>
    );
}
