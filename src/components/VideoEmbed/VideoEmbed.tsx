import React, { FC, useState } from 'react';
import { Button, Typography, IconButton, Box, Stack, useTheme, useMediaQuery } from '@mui/material';
import { Bookmark, BookmarkBorder, FiberManualRecord, Pause, Share, ShareOutlined } from '@mui/icons-material';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';
import SectionCard from './components/SectionCard';
import dayjs from 'dayjs';
import { getCurrentBreakpoint } from '@/src/components/App';
import { setProjectLocal, setProjectAsync } from '@/src/components/ProjectNav/slice';
import Section from '@/src/interfaces/Section';
import Project from '@/src/interfaces/Project';
import ShareDialog from '../ShareDialog';

type VideoEmbedProps = {
    project: Project
};

const videoSizes = {
    xs: {
        width: '220',
        height: '100%'
    },
    sm: {
        width: '448',
        height: '252'
    },
    md: {
        width: '560',
        height: '315'
    },
    lg: {
        width: '720',
        height: '405'
    },
    xl: {
        width: '860',
        height: '484'
    }
};

const VideoEmbed: FC<VideoEmbedProps> = ({ project }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const user = useAuthContext();
    const currentBreakpoint = getCurrentBreakpoint();
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [recording, setRecording] = useState<boolean>(false);
    const [newSectionStartTime, setNewSectionStartTime] = useState<number>(0);
    const [playerRef, setPlayerRef] = useState<any>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);

    const options = {
        height: videoSizes[currentBreakpoint].height,
        width: videoSizes[currentBreakpoint].width,
    };

    const increasePlaybackRate = async () => {
        const currentRate = await playerRef.getPlaybackRate() as number;
        const newRate = Math.round((currentRate + .05) * 100) / 100;

        playerRef.setPlaybackRate(newRate);
        setPlaybackRate(newRate);
    };

    const decreasePlaybackRate = async () => {
        const currentRate = await playerRef.getPlaybackRate() as number;
        const newRate = Math.round((currentRate - .05) * 100) / 100;

        playerRef.setPlaybackRate(newRate);
        setPlaybackRate(newRate);
    };

    const onPlayerReady = (e: YouTubeEvent) => {
        setPlayerRef(e.target);
    };

    const activateSection = (index: number) => {
        const newSections = project.sections?.map((s, i) => {
            const newSection = { ...s };

            if (i === index)
                newSection.active = true;
            else
                newSection.active = false;

            return newSection;
        });

        dispatch(setProjectLocal({
            ...project,
            sections: newSections
        }));
    };

    const deactivateSections = () => {
        const newSections = project.sections?.map((s) => {
            const newSection = { ...s, active: false };
            return newSection;
        });

        dispatch(setProjectLocal({
            ...project,
            sections: newSections
        }));
    };

    const handleNewSectionClick = () => {
        const startMillisecond = dayjs(newSectionStartTime).valueOf() * 1000;

        if (recording) {
            const endMillisecond = dayjs(playerRef.getCurrentTime()).valueOf() * 1000;

            setRecording(false);
            dispatch(setProjectLocal({ 
                ...project,
                sections: [
                    ...project.sections || [],
                    {
                        isLocal: true,
                        start: startMillisecond, 
                        end: endMillisecond,
                        repeat: true,
                        active: false,
                        defaultEdit: true
                    }
                ]
            }));
        } else {
            setRecording(true);
            setNewSectionStartTime(playerRef.getCurrentTime());
        }
    };

    const handleSaveSection = async (section: Section, index: number) => {
        const newSections = project.sections.map((s, i) => {
            if (i === index)
                return section;

            return s;
        });

        await dispatch(setProjectAsync({
            uid: user?.uid as string,
            project: {
                ...project,
                sections: newSections
            } 
        }));
    };

    const handleRemoveSection = async (index: number, isLocal: boolean) => {
        const newSections = project.sections.filter((s, i) => i !== index);

        if (isLocal)
            dispatch(setProjectLocal({
                ...project,
                sections: newSections
            }));
        else
            await dispatch(setProjectAsync({
                uid: user?.uid as string,
                project: {
                    ...project,
                    sections: newSections
                }
            }));
    };

    const handleShareClick = () => {
        setShareDialogOpen(true);
    };

    const handleShareDialogClose = () => {
        setShareDialogOpen(false);
    };

    return (
        <Box className="video-embed" display='flex' justifyContent={'center'} pr={{ lg: 0, xl: 18 }}>
            {useMediaQuery(theme.breakpoints.up('md')) &&
                <Box className="section-list align-top" display='inline-block' minWidth={250} maxHeight={500} mr={{ md: 2 }}>
                    <Button
                        sx={{
                            width: '100%',
                            marginBottom: '1rem',
                            borderRadius: '0',
                        }}
                        onClick={handleNewSectionClick}
                        color={recording ? 'error' : 'secondary'}
                        variant='outlined'>
                        {
                            !recording
                                ? <FiberManualRecord />
                                : <Pause />
                        }
                    </Button>
                    <Box overflow={'scroll'} maxHeight={425} sx={{ overflowX: 'visible' }} className='hide-scrollbar'>
                        <Stack spacing={2}>
                            {playerRef &&
                                project.sections?.map((section: Section, index: number) => {
                                    return (
                                        <SectionCard
                                            key={index}
                                            start={section.start as number}
                                            end={section.end as number}
                                            playerRef={playerRef}
                                            active={section.active as boolean}
                                            playbackRate={playbackRate}
                                            index={index}
                                            defaultEdit={section.defaultEdit}
                                            isLocal={section.isLocal}
                                            name={section.name}
                                            handleSaveSection={handleSaveSection}
                                            handleRemoveSection={handleRemoveSection}
                                            deactivateSections={deactivateSections}
                                            activateSection={activateSection} />
                                    );
                                })
                            }
                        </Stack>
                    </Box>
                </Box>
            }
            <Box className="video-container" display='inline-block'>
                <Box display='inline-block' justifyContent='space-between'>
                    {project.videoId &&
                        <YouTube
                            opts={options}
                            videoId={project.videoId as string}
                            iframeClassName='mx-auto'
                            className='inline-block'
                            onReady={onPlayerReady}
                            onPause={deactivateSections}
                            onEnd={deactivateSections} />
                    }
                </Box>
                <Box className='action-buttons align-top' display='inline-block' justifyContent='space-between' flexDirection='column'>
                    <Stack>
                        <IconButton 
                            sx={{ marginBottom: 2, alignSelf: 'center' }}
                            color='secondary'
                            onClick={handleShareClick}>
                            <ShareOutlined />
                        </IconButton>
                        <Button onClick={increasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mb: 1 }}>+</Button>
                        <Typography variant='h6' component='span'>{playbackRate}</Typography>
                        <Button onClick={decreasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mt: 1 }}>-</Button>
                    </Stack>
                </Box>
                <ShareDialog
                    open={shareDialogOpen}
                    project={project}
                    handleShareDialogClose={handleShareDialogClose} />
            </Box>
        </Box>);
};

export default VideoEmbed;
