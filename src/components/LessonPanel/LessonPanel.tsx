import React from 'react';
import { Box, Fab, Popover, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';
import { baseGsUrl } from './components/GrooveScribe';
import { setProjectAsync, setProjectLocal } from '../ProjectNav/slice';
import GsBookmarkCard from './components/GsBookmark';
import GrooveScribe from './components/GrooveScribe';
import Project from '@/src/interfaces/Project';
import GSBookmark from '@/src/interfaces/GSBookmark';

type LessonPanelProps = {
    project: Project
    className?: string
};

export default function LessonPanel({ className, project }: LessonPanelProps) {
    const [gsParams, setGsParams] = React.useState('');
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [gsBookmarkTitle, setGsBookmarkTitle] = React.useState<string | null>('');
    const [gsBookmarkParams, setGsBookmarkParams] = React.useState<string>('');
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    React.useEffect(() => {
        const activeGsBookmark = project.gsBookmarks?.find((bookmark: GSBookmark) => bookmark.active);

        if (activeGsBookmark)
            setGsParams(activeGsBookmark.params as string);
    }, [project.gsBookmarks]);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const callback = (event: MessageEvent) => {
            setGsBookmarkParams(event.data);
            window.removeEventListener('message', callback);
        };

        window.addEventListener('message', callback);

        const gsIframe = document.getElementById('gs-iframe') as HTMLIFrameElement;
        gsIframe.contentWindow?.postMessage('', baseGsUrl);

        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const handleGsParamsChange = (params: string) => {
        setGsParams(params);
    };

    const handleNewGsBookmarkTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGsBookmarkTitle(event.target.value);
    };

    const handleDeleteGsBookmark = (index: number) => {
        const updatedGsBookmarks = project.gsBookmarks?.filter((bookmark, i) => i !== index);

        dispatch(setProjectAsync({
            uid: user?.uid as string,
            project: {
                ...project,
                gsBookmarks: updatedGsBookmarks
            }
        }));
    }

    const handleSaveGsBookmark = () => {
        handlePopoverClose();

        if (gsBookmarkTitle) {
            const newGsBookmark = { title: gsBookmarkTitle, params: gsBookmarkParams };

            dispatch(setProjectAsync({
                uid: user?.uid as string,
                project: {
                    ...project,
                    gsBookmarks: [
                        ...project.gsBookmarks || [],
                        newGsBookmark
                    ]
                }
            }));

            setGsBookmarkTitle(null);
        }
    };

    const deactivateGsBookmarks = () => {
        const updatedGsBookmarks = project.gsBookmarks?.map((bookmark: GSBookmark) => {
            return { ...bookmark, active: false };
        });

        dispatch(setProjectLocal({
            ...project,
            gsBookmarks: updatedGsBookmarks
        }));

        handleGsParamsChange('');
    };

    const activateGsBookmark = (index: number) => {
        const bookmark = project.gsBookmarks?.[index];

        deactivateGsBookmarks();

        dispatch(setProjectLocal({
            ...project,
            gsBookmarks: project.gsBookmarks?.map((bookmark, i) => {
                return { ...bookmark, active: i === index };
            })
        }));

        handleGsParamsChange(bookmark.params || '');
    };

    const open = Boolean(popoverAnchorEl);

    return (
        <Box sx={{ width: '100%', height: '600px', bgcolor: 'background.paper' }} className={className}>
            <Box display='flex' marginBottom={2} marginLeft={2} alignItems={'left'}>
                <Fab color='secondary' size='small' aria-label='new' sx={{ mr: 2 }} onClick={handlePopoverOpen}>
                    <Add />
                </Fab>
                <Popover
                    open={open}
                    anchorEl={popoverAnchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    color='secondary'
                    elevation={8}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <TextField
                                size='small'
                                placeholder='Title'
                                color='secondary'
                                value={gsBookmarkTitle}
                                onChange={handleNewGsBookmarkTitleChange}
                                ref={titleInputRef}
                                variant='standard'
                                autoFocus={true} />
                        </Box>
                        <Button sx={{ mt: 2 }} fullWidth color='secondary' variant='outlined' onClick={handleSaveGsBookmark}>Save</Button>
                    </Box>
                </Popover>
                {
                    project.gsBookmarks?.map((bookmark, index) => {
                        return (
                            <GsBookmarkCard
                                key={index}
                                title={bookmark.title as string}
                                active={bookmark.active as boolean}
                                index={index}
                                deactivateGsBookmarks={deactivateGsBookmarks}
                                activateGsBookmark={activateGsBookmark}
                                handleDeleteBookmark={handleDeleteGsBookmark} />
                        );
                    })
                }
            </Box>
            <GrooveScribe className='w-full h-full' params={gsParams} />
        </Box>
    );
};
