import React from 'react';
import { Box, Tabs, Tab, Typography, AppBar, Fab, Popover, Input, Button } from '@mui/material';
import GrooveScribe from './components/GrooveScribe';
import { Add, Check } from '@mui/icons-material';
import GsBookmarkCard from './components/GsBookmark';
import { selectLessonPanelState, getGsBookmarksAsync, addGsBookmarkAsync } from './slice';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}
            className='h-full w-full' >
            <Box className='h-full'>{children}</Box>
        </Typography>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function LessonPanel({ className, videoId }: { className?: string, videoId?: string }) {
    const [value, setValue] = React.useState(0);
    const [gsUrl, setGsUrl] = React.useState('https://montulli.github.io/GrooveScribe/');
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [gsBookmarkTitle, setGsBookmarkTitle] = React.useState<string | null>(null);
    const [gsBookmarkUrl, setGsBookmarkUrl] = React.useState<string | null>(null);
    const { gsBookmarks } = useAppSelector(selectLessonPanelState);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleGsUrlChange = (url: string) => {
        setGsUrl(url);
    };

    const handleNewGsBookmarkTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGsBookmarkTitle(event.target.value);
    };

    const handleNewGsBookmarkUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGsBookmarkUrl(event.target.value);
    };

    const handleSaveGsBookmark = () => {
        handlePopoverClose();

        if (gsBookmarkTitle && gsBookmarkUrl) {
            dispatch(addGsBookmarkAsync({ uid: user?.uid as string, newGsBookmark: { videoId: videoId, title: gsBookmarkTitle, url: gsBookmarkUrl } }));
            setGsBookmarkTitle(null);
            setGsBookmarkUrl(null);
        }
    };

    React.useEffect(() => {
        dispatch(getGsBookmarksAsync({ uid: user?.uid as string, videoId: videoId as string }));
    }, [dispatch, videoId, user?.uid]);

    const open = Boolean(popoverAnchorEl);

    return (
        <Box sx={{ width: '100%', height: 580, bgcolor: 'background.paper' }} className={className}>
                <Box display='flex' marginY={2} marginBottom={2} alignItems={'left'}>
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
                                <Input
                                    size='small'
                                    placeholder='Title'
                                    color='secondary'
                                    value={gsBookmarkTitle}
                                    onChange={handleNewGsBookmarkTitleChange} />
                                <Input
                                    sx={{ mt: 2 }}
                                    size='small'
                                    placeholder='Url'
                                    color='secondary'
                                    value={gsBookmarkUrl}
                                    onChange={handleNewGsBookmarkUrlChange} />
                            </Box>
                            <Button sx={{ mt: 2 }} fullWidth color='secondary' variant='outlined' onClick={handleSaveGsBookmark}>Save</Button>
                        </Box>
                    </Popover>
                    {
                        gsBookmarks.map((bookmark, index) => {
                            return (
                                <GsBookmarkCard
                                    key={index}
                                    id={bookmark.id as string}
                                    url={bookmark.url as string}
                                    title={bookmark.title as string}
                                    active={bookmark.active as boolean}
                                    handleGsParamsChange={handleGsUrlChange} />
                            );
                        })
                    }
                </Box>
                <GrooveScribe className='w-full h-full' url={gsUrl} />
        </Box>);
};
