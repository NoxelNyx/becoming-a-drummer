import { Delete, Edit, Check } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Divider, IconButton, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import React from 'react';
import { YouTubePlayer } from 'react-youtube';
import dayjs, { Dayjs } from 'dayjs';
import Section from '@/src/interfaces/Section';

interface SectionCardProps {
    start: number,
    end: number,
    active: boolean,
    playerRef: YouTubePlayer,
    playbackRate: number,
    index: number,
    defaultEdit?: boolean,
    isLocal: boolean,
    name?: string,
    handleSaveSection: (section: Section, index: number) => void,
    handleRemoveSection: (index: number, isLocal: boolean) => void,
    deactivateSections: () => void,
    activateSection: (index: number) => void
};

export default function SectionCard({ 
    start,
    end,
    playerRef,
    active,
    playbackRate,
    index,
    defaultEdit,
    isLocal,
    name,
    handleSaveSection,
    handleRemoveSection,
    deactivateSections,
    activateSection
}: SectionCardProps) {
    let timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    let activeRef = React.useRef<boolean>(active);
    const [editEnabled, setEditEnabled] = React.useState(defaultEdit || false);
    const [newStart, setNewStart] = React.useState<Dayjs | null>(dayjs(start));
    const [newEnd, setNewEnd] = React.useState<Dayjs | null>(dayjs(end));
    const [newName, setNewName] = React.useState<string | undefined>(name);

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        setEditEnabled(!editEnabled);
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setEditEnabled(false);

        if (newStart?.valueOf() !== start || newEnd?.valueOf() !== end || isLocal || newName !== name)
            handleSaveSection({
                isLocal: false,
                start: newStart?.valueOf() as number,
                end: newEnd?.valueOf() as number,
                active,
                name: newName
            }, index);
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        
        handleRemoveSection(index, isLocal);
    };

    const handleSpaceKey = React.useCallback((e: KeyboardEvent) => {
        if (e.key === 'Space') {
            e.preventDefault();
            e.stopPropagation();

            if (active)
                deactivateSections();
            else
                activateSection(index);
        }
    }, [active, activateSection, deactivateSections, index]);

    const handleStateChange = React.useCallback((e: any) => {
        if (e.data === 2 || e.data === 0)
            clearTimeout(timeoutRef.current);
    }, []);

    const setRepeat: any = React.useCallback(() => {
        timeoutRef.current = setTimeout(async () => {
            if (await playerRef.getPlayerState() === 1 && activeRef.current) {
                playerRef.seekTo(start / 1000, true);
                setRepeat();
            }
        }, (end - start + 1) / playbackRate);
    }, [end, playbackRate, playerRef, start, activeRef]);

    const handleClick = React.useCallback(() => {
        if (editEnabled) return;
        if (playerRef === null) {
            activateSection(index);
            deactivateSections();
        }

        window.removeEventListener('keydown', handleSpaceKey);
        window.addEventListener('keydown', handleSpaceKey);

        if (active) {
            deactivateSections();
            activeRef.current = false;

            clearTimeout(timeoutRef.current);
            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.pauseVideo();
        } else {
            activateSection(index);
            activeRef.current = true;

            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.seekTo(start / 1000, true);
            playerRef.playVideo();

            setRepeat();

            playerRef.addEventListener('onStateChange', handleStateChange);
        }
    }, [editEnabled, handleSpaceKey, playerRef, start, handleStateChange, active, setRepeat, deactivateSections, activateSection, index]);

    const handleNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    return (
        <Box>
            <Card
                onClick={handleClick}
                variant={active ? 'outlined' : 'elevation'}
                color={active ? 'secondary' : 'primary'}
                elevation={active ? 0 : 3}
                sx={{ cursor: 'pointer' }}>
                <CardActionArea>
                    <CardContent sx={{ p: 0, pl: 1.5 }}>
                        <Box sx={{ float: 'left', mt: '.4rem' }} display={'inline-block'}>
                            {editEnabled
                                ? <React.Fragment>
                                    <TextField
                                        value={newName}
                                        label="Name"
                                        size='small'
                                        color='secondary'
                                        variant='standard'
                                        fullWidth
                                        sx={{ width: '170px', maxWidth: '200px', mb: 1 }}
                                        onChange={handleNameOnChange} />
                                    <br />
                                    <TimePicker
                                        slotProps={{ 
                                            textField: { 
                                                size: 'small', 
                                                color: 'secondary',
                                                variant: 'standard',
                                                sx: { width: '80px', mr: 1 }
                                            }
                                        }}
                                        label="Start"
                                        format="m[m] ss[s]"
                                        value={newStart}
                                        onChange={(value) => setNewStart(value)}
                                        disableOpenPicker />
                                    <TimePicker
                                        slotProps={{ 
                                            textField: { 
                                                size: 'small', 
                                                color: 'secondary',
                                                variant: 'standard',
                                                sx: { width: '80px' }
                                            }
                                        }}
                                        label="End"
                                        format="m[m] ss[s]"
                                        value={newEnd}
                                        onChange={(value) => setNewEnd(value)}
                                        disableOpenPicker />
                                </React.Fragment>
                                : <React.Fragment>
                                    <div style={{display: 'block', textAlign: 'left' }}>{name}</div>
                                    <span>Start: {dayjs(start).format('m:ss')}</span>
                                    <span className='ml-3'>End: {dayjs(end).format('m:ss')}</span>
                                </React.Fragment>
                            }
                        </Box>
                        <Box sx={{ float: 'right' }}>
                            {editEnabled
                                ? <IconButton onClick={handleSave}>
                                    <Check color='secondary' fontSize='small' />
                                </IconButton>
                                : <IconButton onClick={handleEdit}>
                                    <Edit color='secondary' fontSize='small' />
                                </IconButton>
                            }
                            <IconButton onClick={handleDelete} >
                                <Delete color='secondary' fontSize='small' />
                            </IconButton>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    )
}
