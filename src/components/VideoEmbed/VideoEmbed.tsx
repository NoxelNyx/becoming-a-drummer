import React, { FC, useState } from 'react';
import { Button, Typography, IconButton, Box, Stack, useTheme, useMediaQuery, TextField, Tooltip, Popover, Icon } from '@mui/material';
import { Bookmark, BookmarkBorder, FiberManualRecord, Pause, Share, ShareOutlined, Edit, Add, Remove, Check } from '@mui/icons-material';
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
    const [playbackTempo, setPlaybackTempo] = useState<number>(0);
    const [recording, setRecording] = useState<boolean>(false);
    const [newSectionStartTime, setNewSectionStartTime] = useState<number>(0);
    const [playerRef, setPlayerRef] = useState<any>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
    const [changeTempoPopover, setChangeTempoPopover] = React.useState<HTMLButtonElement | null>(null);
    const trackTempo = project.tempo || 0;
    const [newTrackTempo, setNewTrackTempo] = useState<number>(trackTempo);

    const options = {
        height: videoSizes[currentBreakpoint].height,
        width: videoSizes[currentBreakpoint].width,
    };

    const changeTempo = (tempo: number) => {
        let newRate = Math.round((tempo / trackTempo) * 100) / 100;

        if (newRate > 1.5) {
            newRate = 1.5;
            tempo = Math.round((trackTempo * 1.5));
        }

        playerRef.setPlaybackRate(newRate);
        setPlaybackTempo(tempo);
    }

    const increasePlaybackRate = () => {
        const newTempo = playbackTempo + (trackTempo * .05);

        changeTempo(newTempo);
    };

    const decreasePlaybackRate = () => {
        const newTempo = playbackTempo - (trackTempo * .05);

        changeTempo(newTempo);
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

    const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newTempo = parseInt(e.target.value);

        if (isNaN(newTempo))
            newTempo = 0;

        setNewTrackTempo(newTempo);
    };

    const handleShareClick = () => {
        setShareDialogOpen(true);
    };

    const handleShareDialogClose = () => {
        setShareDialogOpen(false);
    };

    const handleChangeTempoPopoverOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setChangeTempoPopover(event.currentTarget);
    };

    const handleSaveTrackTempo = async () => {
        await dispatch(setProjectAsync({
            uid: user?.uid as string,
            project: {
                ...project,
                tempo: newTrackTempo,
            }
        }));

        changeTempo(newTrackTempo);
        setChangeTempoPopover(null);
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter')
            handleSaveTrackTempo();
    };

    const changeTempoPopoverOpen = Boolean(changeTempoPopover);

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
                                            playbackRate={playerRef.getPlaybackRate()}
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
                            sx={{ marginBottom: 4, marginLeft: 1, alignSelf: 'center' }}
                            color='secondary'
                            onClick={handleShareClick}>
                            <ShareOutlined />
                        </IconButton>
                        <IconButton 
                            sx={{ marginBottom: 1, marginLeft: 1, alignSelf: 'center' }}
                            color='secondary'
                            onClick={increasePlaybackRate}>
                            <Add />
                        </IconButton>
                        <Stack sx={{ alignItems: 'center', marginLeft: '10px' }}>
                            <TextField
                                variant="standard"
                                sx={{ width: '30px' }}
                                value={playbackTempo}
                                onChange={handleTempoChange}
                                inputProps={{
                                    sx: { textAlign: 'center' }
                                }}
                                disabled />
                            <Tooltip title="Change Track Tempo">
                                <Button
                                    sx={{
                                        color: '#fff',
                                        minWidth: '30px',
                                        paddingY: .5,
                                    }}
                                    onClick={handleChangeTempoPopoverOpen}>{trackTempo}</Button>
                            </Tooltip>
                            <Popover
                                open={changeTempoPopoverOpen}
                                anchorEl={changeTempoPopover}
                                onClose={() => setChangeTempoPopover(null)}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                <Box sx={{ p: 1, maxWidth: '100px' }}>
                                    <TextField
                                        sx={{ display: 'inline-block', maxWidth: '50px' }}
                                        label="Tempo"
                                        variant="standard"
                                        value={newTrackTempo}
                                        onKeyDown={handleEnter}
                                        onChange={handleTempoChange} />
                                    <IconButton
                                        sx={{ display: 'inline-block', verticalAlign: 'bottom' }}
                                        onClick={handleSaveTrackTempo}
                                        size='small'>
                                        <Check />
                                    </IconButton>
                                </Box>
                            </Popover>
                        </Stack>
                        <IconButton 
                            sx={{ marginBottom: 2, marginLeft: 1, marginTop: 1, alignSelf: 'center' }}
                            color='secondary'
                            onClick={decreasePlaybackRate}>
                            <Remove />
                        </IconButton>
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
