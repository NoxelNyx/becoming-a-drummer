import React, { FC, useState } from 'react';
import { Button, Typography, IconButton, Box, Grid, Card, Stack } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';
import SectionCard from './components/SectionCard';
import {
    selectPracticePanelState,
    addBookmarkAsync,
    Bookmark as BookmarkType,
    deleteBookmarkAsync
} from '../PracticePanel/slice';
import {
    Section,
    selectVideoEmbedState,
    deactivateSections,
    addLocalSection,
    getSectionsAsync,
} from './slice';

type VideoEmbedProps = {
    videoId: string
};

const styles = {
    bookmarkBtn: {
        mb: 2
    }
};

const VideoEmbed: FC<VideoEmbedProps> = ({ videoId }) => {
    let playerRef = React.useRef<any>(null);
    let bookmarkRef = React.useRef<BookmarkType | null>(null);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const { bookmarks } = useAppSelector(selectPracticePanelState);
    const { sections } = useAppSelector(selectVideoEmbedState);
    const dispatch = useAppDispatch();
    const user = useAuthContext();
    const options = {
        height: '480',
        width: '853'
    };

    const bookmarked = bookmarks.map((bookmark: BookmarkType) => {
        if (bookmark.videoId === videoId) {
            bookmarkRef.current = bookmark;

            return true;
        }

        return false;
    }).length > 0;

    const increasePlaybackRate = async () => {
        const currentRate = await playerRef.current?.getPlaybackRate() as number;
        const newRate = Math.round((currentRate + .05) * 100) / 100;

        playerRef.current?.setPlaybackRate(newRate);
        setPlaybackRate(newRate);
    };

    const decreasePlaybackRate = async () => {
        const currentRate = await playerRef.current?.getPlaybackRate() as number;
        const newRate = Math.round((currentRate - .05) * 100) / 100;

        playerRef.current?.setPlaybackRate(newRate);
        setPlaybackRate(newRate);
    };

    const onPlayerReady = (e: YouTubeEvent) => {
        playerRef.current = e.target;

        dispatch(getSectionsAsync({ uid: user?.uid as string, videoId: videoId as string }));
    };

    const resetSections = () => {
        dispatch(deactivateSections());
    };

    const onBookmarkClick = () => {
        if (bookmarked)
            dispatch(deleteBookmarkAsync({
                uid: user?.uid as string,
                bookmarkId: bookmarkRef.current?.id as string
            }));
        else
            dispatch(addBookmarkAsync({
                uid: user?.uid as string,
                newBookmark: {
                    videoId: videoId as string,
                    title: playerRef.current.getVideoData().title,
                    duration: playerRef.current.getDuration(),
                }
            }));
    };

    const handleNewSectionClick = () => {
        dispatch(addLocalSection({
            start: playerRef.current.getCurrentTime(),
            end: playerRef.current.getCurrentTime() + 10,
            repeat: true,
            active: false
        }));
    };

    return (
        <Box className="video-embed" display='flex' justifyContent={'center'}>
            <Box className="section-list align-top" display='inline-block' minWidth={250} maxHeight={500} sx={{ mr: 2 }}>
                <Button
                    sx={{
                        width: '100%',
                        marginBottom: '1rem',
                        borderRadius: '0',
                    }}
                    onClick={handleNewSectionClick}
                    color="secondary"
                    variant='outlined'>+</Button>
                <Box overflow={'scroll'} maxHeight={425} sx={{ overflowX: 'visible' }} className='hide-scrollbar'>
                    <Stack spacing={2}>
                        {
                            sections.map((section: Section, index: number) => {
                                return (
                                    <SectionCard
                                        key={section.id}
                                        id={section.id as string}
                                        start={section.start as number}
                                        end={section.end as number}
                                        playerRef={playerRef.current}
                                        active={section.active as boolean}
                                        playbackRate={playbackRate}
                                        index={index}
                                        videoId={videoId} />
                                );
                            })
                        }
                    </Stack>
                </Box>
            </Box>
            <Box className="video-container" display='inline-block' sx={{ mr: '10rem' }}>
                <YouTube
                    opts={options}
                    videoId={videoId as string}
                    iframeClassName='mx-auto'
                    className='inline-block'
                    onReady={onPlayerReady}
                    onPause={resetSections}
                    onEnd={resetSections} />
                <Box className='action-buttons align-top' display='inline-block' justifyContent='space-between' flexDirection='column'>
                    <Box>
                        <IconButton
                            aria-label="bookmark"
                            size="large"
                            sx={styles.bookmarkBtn}
                            onClick={onBookmarkClick}
                            edge="end">
                            {bookmarked
                                ? <Bookmark color='secondary' />
                                : <BookmarkBorder color='secondary' />
                            }
                        </IconButton>
                    </Box>
                    <Box>
                        <Button onClick={increasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mb: 1 }}>+</Button>
                        <br />
                        <Typography variant='h6' component='span'>{playbackRate}</Typography>
                        <br />
                        <Button onClick={decreasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mt: 1 }}>-</Button>
                        <br />
                    </Box>
                </Box>
            </Box>
        </Box>);
};

export default VideoEmbed;
