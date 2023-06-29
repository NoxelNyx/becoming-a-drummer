import React, { useEffect, useCallback } from 'react';
import { Drawer, Tab, AppBar, IconButton, Typography, Box, Stack } from '@mui/material';
import { ViewList, History, Bookmark, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
import { selectPracticePanelState, newPracticeSession, getBookmarksAsync } from './slice';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { selectSharedState } from '@/src/redux/slice';
import { useAuthContext } from '@/src/firebase/provider';
import PracticeLog from './components/PracticeLog';
import Bookmarks from './components/Bookmark';

export default function PracticePanel() {
    const [value, setValue] = React.useState('1');
    const [index, setIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const { practiceSessions, bookmarks } = useAppSelector(selectPracticePanelState);
    const { currentVideoId } = useAppSelector(selectSharedState);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    useEffect(() => {
        dispatch(getBookmarksAsync(user?.uid as string));
    }, [dispatch, user?.uid]);

    const handleNewPracticeSessionOnClick = (e: React.SyntheticEvent) => {
        dispatch(newPracticeSession(currentVideoId as string));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        setIndex(parseInt(newValue) - 1);
    };

    const handleToggleDrawer = () => {
        setOpen(!open);
    };

    let panelStyles = {
        PracticeLog: {
            margin: '0',
            padding: '0'
        },
        Bookmarks: {
            mt: 2,
            padding: '0'
        },
        toggleBtn: {
            position: 'fixed',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 1,
        },
        toggleBtnShift: {
            position: 'fixed',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 'modal',
            right: "15%",
            backgroundColor: 'rgba(206, 147, 216, 0.08)'
        }
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: number;
        value: string;
        sx?: object;
    }
    
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
    
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={parseInt(value) !== index}
                {...other}>
                <Box justifyContent={'center'} alignItems={'center'} display={'flex'}>{children}</Box>
            </Typography>
        );
    }

    return (
        <div className="practice-panel">
            {user == null
                ? <React.Fragment />
                : open
                    ? <IconButton
                        aria-label="close practice panel"
                        sx={panelStyles.toggleBtnShift}
                        size="large"
                        onClick={handleToggleDrawer}
                        edge="end">
                        <ArrowForwardIos />
                    </IconButton>
                    : <IconButton
                        aria-label="open practice panel"
                        sx={panelStyles.toggleBtn}
                        size="large"
                        onClick={handleToggleDrawer}
                        edge="end">
                        <ArrowBackIosNew />
                    </IconButton>
            }
            {user != null &&
                <Drawer
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: '15%',
                            boxSizing: 'border-box',
                            padding: '1rem'
                        },
                    }}
                    anchor="right"
                    open={open}
                    variant="persistent">
                    <TabContext value={value}>
                        <AppBar position="static">
                            <TabList
                                indicatorColor="secondary"
                                textColor="inherit"
                                variant="fullWidth"
                                onChange={handleChange}>
                                <Tab icon={<Bookmark />} value="1" />
                            </TabList>
                        </AppBar>
                        <TabPanel value={value} index={1} sx={panelStyles.Bookmarks}>
                            <Stack>
                                { bookmarks.length === 0
                                    ? <div>No bookmarks</div>
                                    : bookmarks.map((bookmark) => {
                                        return (
                                            <Box 
                                                key={bookmark.videoId}
                                                sx={{ maxWidth: 320, maxHeight: 180, marginBottom: 2 }}>
                                                <Bookmarks
                                                    title={bookmark.title}
                                                    duration={bookmark.duration}
                                                    videoId={bookmark.videoId} />
                                            </Box>
                                        );
                                })}
                            </Stack>
                        </TabPanel>
                    </TabContext>
                </Drawer>
            }
        </div>
    );
};
