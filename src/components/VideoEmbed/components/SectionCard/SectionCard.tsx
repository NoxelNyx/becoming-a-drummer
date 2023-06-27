import { activateSection, deactivateSection, addSectionAsync, updateSectionAsync, deleteLocalSection, deleteSectionAsync } from '@/src/components/VideoEmbed/slice';
import { useAppDispatch } from '@/src/redux/hooks';
import { Delete, Edit, Check } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, IconButton, Input } from '@mui/material';
import React from 'react';
import { YouTubePlayer } from 'react-youtube';
import { useAuthContext } from '@/src/firebase/provider';

interface SectionCardProps {
    id: string,
    start: number,
    end: number,
    active: boolean,
    playerRef: YouTubePlayer,
    playbackRate: number,
    videoId: string,
    index: number
};

export default function SectionCard({ id, start, end, playerRef, active, playbackRate, videoId, index }: SectionCardProps) {
    let timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
    const [editEnabled, setEditEnabled] = React.useState(false);
    const [newStart, setNewStart] = React.useState(start);
    const [newEnd, setNewEnd] = React.useState(end);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    const handleStateChange = (e: any) => {
        if (e.data === 2 || e.data === 0)
            clearTimeout(timeoutRef.current);
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        setEditEnabled(!editEnabled);
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setEditEnabled(false);

        if (start === newStart && end === newEnd) return;

        if (id)
            dispatch(updateSectionAsync({ uid: user?.uid as string, section: { id, start: newStart, end: newEnd, videoId } }));
        else {
            dispatch(deleteLocalSection(index));
            dispatch(addSectionAsync({ uid: user?.uid as string, newSection: { start: newStart, end: newEnd, active: false, videoId } }));
        }
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (id)
            dispatch(deleteSectionAsync({ uid: user?.uid as string, sectionId: id }));
        else
            dispatch(deleteLocalSection(index));
    };

    const handleClick = async () => {
        if (editEnabled) return;

        if (active) {
            dispatch(deactivateSection(id));

            clearTimeout(timeoutRef.current);
            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.pauseVideo();
        } else {
            dispatch(activateSection(id));

            playerRef.removeEventListener('onStateChange', handleStateChange);
            playerRef.seekTo(start, true);
            playerRef.playVideo();

            timeoutRef.current = setTimeout(async () => {
                if (await playerRef.getPlayerState() === 1)
                    handleClick();
            }, ((end - start + 1) * 1000) / playbackRate);

            playerRef.addEventListener('onStateChange', handleStateChange);
        }
    };

    return (
        <Box>
            <Card
                onClick={handleClick}
                variant={active ? 'outlined' : 'elevation'}
                color={active ? 'secondary' : 'primary'}
                elevation={active ? 0 : 3}>
                <CardActionArea>
                    <CardContent sx={{ p: 0, pl: 1.5 }}>
                        <Box sx={{ float: 'left', mt: '.4rem' }} display={'inline-block'}>
                            {editEnabled
                                ? <Input
                                    sx={{ maxWidth: 80 }}
                                    size='small'
                                    placeholder='Start'
                                    color='secondary'
                                    value={newStart}
                                    type='number'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStart(parseInt(e.target.value))} />
                                : <span>Start: {start}</span>
                            }
                            {editEnabled
                                ? <Input
                                    sx={{ maxWidth: 80, ml: 1 }}
                                    size='small'
                                    placeholder='End'
                                    color='secondary'
                                    value={newEnd}
                                    type='number'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEnd(parseInt(e.target.value))} />
                                : <span className='ml-3'>End: {end}</span>
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
