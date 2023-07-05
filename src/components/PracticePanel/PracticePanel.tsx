import React, { use, useEffect } from 'react';
import { Drawer, Tab, AppBar, IconButton, Typography, Box, Stack, Grid } from '@mui/material';
import { People, Bookmark, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
import { selectPracticePanelState, getBookmarksAsync, getCommunityContentAsync, resetCommunityContent, selectFilteredCommunityContent } from './slice';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';
import { AppState } from '@/src/redux/store';
import Bookmarks from './components/Bookmark';
import CommunityContent from './components/CommunityContent';
import FilterBar from '@/src/components/FilterBar';

export default function PracticePanel() {
    const [value, setValue] = React.useState('1');
    const [open, setOpen] = React.useState(false);
    const [selectedTypeFilters, setSelectedTypeFilters] = React.useState<string[]>([]);
    const [selectedDifficultyFilters, setSelectedDifficultyFilters] = React.useState<string[]>([]);
    const { bookmarks, communityContent } = useAppSelector(selectPracticePanelState);
    const [filteredCommunityContent, setFilteredCommunityContent] = React.useState<AppState['practicePanel']['communityContent']>(communityContent);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    useEffect(() => {
        dispatch(getBookmarksAsync(user?.uid as string));
    }, [dispatch, user?.uid]);

    useEffect(() => {
        setFilteredCommunityContent(communityContent);
    }, [communityContent]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleToggleDrawer = () => {
        setOpen(!open);
    };

    const handleTypeFilterSelect = React.useCallback((label: string, selected: boolean) => {
        let newSelectedFilters = [];

        if (selected)
            newSelectedFilters = [...selectedTypeFilters, label];
        else
            newSelectedFilters = selectedTypeFilters.filter(filter => filter !== label);

        setSelectedTypeFilters(newSelectedFilters);

        if (newSelectedFilters.length > 0)
            dispatch(getCommunityContentAsync(newSelectedFilters));
        else {
            dispatch(resetCommunityContent());
            setSelectedDifficultyFilters([]);
        }

    }, [dispatch, selectedTypeFilters]);

    const handleDifficultyFilterSelect = React.useCallback((label: string, selected: boolean) => {
        let newSelectedFilters = [];

        if (selected)
            newSelectedFilters = [...selectedDifficultyFilters, label];
        else
            newSelectedFilters = selectedDifficultyFilters.filter(filter => filter !== label);

        setSelectedDifficultyFilters(newSelectedFilters);

        if (newSelectedFilters.length > 0)
            setFilteredCommunityContent(selectFilteredCommunityContent(communityContent, newSelectedFilters));
        else
            setFilteredCommunityContent(communityContent);
    }, [communityContent, selectedDifficultyFilters]);

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
                                <Tab icon={<People />} value="2" />
                            </TabList>
                        </AppBar>
                        <TabPanel value={value} index={1} sx={panelStyles.Bookmarks}>
                            <Stack>
                                {bookmarks.length === 0
                                    ? <div>No bookmarks</div>
                                    : bookmarks.map((bookmark) => {
                                        return (
                                            <Box
                                                key={bookmark.videoId}
                                                sx={{ maxWidth: 320, maxHeight: 180, marginBottom: 2 }}>
                                                <Bookmarks
                                                    title={bookmark.title}
                                                    duration={bookmark.duration}
                                                    videoId={bookmark.videoId}
                                                    toggleDrawer={handleToggleDrawer} />
                                            </Box>
                                        );
                                    })}
                            </Stack>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FilterBar
                                        selectedTypeFilters={selectedTypeFilters}
                                        handleTypeFilterSelect={handleTypeFilterSelect}
                                        selectedDifficultyFilters={selectedDifficultyFilters}
                                        handleDifficultyFilterSelect={handleDifficultyFilterSelect} />
                                </Grid>
                                <Grid item xs={12} justifyContent={'left'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                                    {
                                        filteredCommunityContent.map((content, index) => {
                                            return (
                                                <Box key={index} marginTop={3} width={'100%'}>
                                                    <CommunityContent title={content.title} videoTitle={content.videoTitle} videoId={content.videoId as string} description={content.description} params={content.params} />
                                                </Box>);
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </TabContext>
                </Drawer>
            }
        </div>
    );
};
