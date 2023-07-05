import { Delete, People, Share } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, Typography, Menu, Box, ListItemIcon, MenuItem, Popover, TextField, Button } from '@mui/material';
import { deleteGsBookmarkAsync, setActive, updateGsBookmarkAsync } from '../../slice';
import { addCommunityContentAsync, CommunityContent } from '@/src/components/PracticePanel/slice';
import { useAuthContext } from '@/src/firebase/provider';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { selectSharedState } from '@/src/redux/slice';
import React from 'react';
import FilterBar from '@/src/components/FilterBar';

interface GsBookmarkProps {
    id: string,
    params: string,
    title: string,
    handleGsParamsChange: (params: string) => void,
    active: boolean,
    shared?: boolean,
    videoId?: string
};

export default function GsBookmarkCard({ id, params, title, active, handleGsParamsChange, shared, videoId }: GsBookmarkProps) {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [communityContentTitle, setCommunityContentTitle] = React.useState<string | null>(null);
    const [communityContentDescription, setCommunityContentDescription] = React.useState<string | null>(null);
    const [selectedTypeFilters, setSelectedTypeFilters] = React.useState<string[]>([]);
    const [selectedDifficultyFilters, setSelectedDifficultyFilters] = React.useState<string[]>([]);
    const { currentVideoTitle } = useAppSelector(selectSharedState);
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const descriptionInputRef = React.useRef<HTMLInputElement>(null);
    const menuOpen = Boolean(menuAnchorEl);
    const popoverOpen = Boolean(popoverAnchorEl);
    const user = useAuthContext();
    const dispatch = useAppDispatch();

    const handleRightClick = (event: any) => {
        event.preventDefault();

        setMenuAnchorEl(event.currentTarget);
    };

    const handleContextClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOnClick = () => {
        if (active) {
            dispatch(setActive({ id, active: false }));
            handleGsParamsChange('');
        } else {
            dispatch(setActive({ id, active: true }));
            handleGsParamsChange(params);
        }
    };

    const handleDeleteGsBookmark = () => {
        dispatch(deleteGsBookmarkAsync({ uid: user?.uid as string, gsBookmarkId: id as string }));
        handleGsParamsChange('');
        handleContextClose();
    };


    const handlePopoverOpen = (event: any) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        handleContextClose();
        setPopoverAnchorEl(null);
        setCommunityContentTitle(null);
        setCommunityContentDescription(null);
        setSelectedTypeFilters([]);
    };

    const handleTypeFilterSelect = React.useCallback((label: string, selected: boolean) => {
        let newSelectedFilters = [];

        if (selected)
            newSelectedFilters = [...selectedTypeFilters, label];
        else
            newSelectedFilters = selectedTypeFilters.filter(filter => filter !== label);

        setSelectedTypeFilters(newSelectedFilters);

    }, [selectedTypeFilters]);

    const handleDifficultyFilterSelect = React.useCallback((label: string, selected: boolean) => {
        let newSelectedFilters = [];

        if (selected)
            newSelectedFilters = [...selectedDifficultyFilters, label];
        else
            newSelectedFilters = selectedDifficultyFilters.filter(filter => filter !== label);

        setSelectedDifficultyFilters(newSelectedFilters);
    }, [selectedDifficultyFilters]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityContentTitle(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityContentDescription(event.target.value);
    };

    const handleSaveCommunityContent = () => {
        if (communityContentTitle && communityContentDescription && selectedTypeFilters.length > 0) {
            const newCommunityContent: CommunityContent = {
                title: communityContentTitle,
                videoTitle: currentVideoTitle as string,
                description: communityContentDescription,
                keywords: [...selectedTypeFilters, ...selectedDifficultyFilters],
                params,
                type: 'gsBookmark',
                videoId: videoId
            };

            dispatch(addCommunityContentAsync({ newCommunityContent: newCommunityContent }));
            dispatch(updateGsBookmarkAsync({ uid: user?.uid as string, gsBookmark: { id, shared: true } }));
            handlePopoverClose();
        }
    };

    return (
            <React.Fragment>
            <Card
                sx={{ height: 50, mr: 2 }}
                onClick={handleOnClick}
                onContextMenu={handleRightClick}
                variant={active ? 'outlined' : 'elevation'}
                color={shared ? 'secondary' : 'default'}>
                <CardActionArea>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{title}</Typography>
                            {shared &&
                                <People color="secondary" sx={{ ml: 2 }} />
                            }
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleContextClose}
                elevation={8}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                {!shared &&
                    <MenuItem onClick={handlePopoverOpen}>
                        <ListItemIcon>
                            <Share fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Share</Typography>
                    </MenuItem>
                }
                <MenuItem onClick={handleDeleteGsBookmark}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                </MenuItem>
            </Menu>
            <Popover
                open={popoverOpen}
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
                elevation={8}
                slotProps={{
                    paper: { sx: { width: 375 } }
                }}>
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        <TextField
                            size='small'
                            placeholder='Title'
                            color='secondary'
                            value={communityContentTitle}
                            ref={titleInputRef}
                            onChange={handleTitleChange}
                            variant='standard'
                            autoFocus={true} />
                        <TextField
                            size='small'
                            placeholder='Description'
                            color='secondary'
                            value={communityContentDescription}
                            ref={descriptionInputRef}
                            onChange={handleDescriptionChange}
                            rows={3}
                            variant='outlined'
                            multiline
                            sx={{ mt: 2 }} />
                        <FilterBar
                            handleTypeFilterSelect={handleTypeFilterSelect}
                            handleDifficultyFilterSelect={handleDifficultyFilterSelect}
                            selectedTypeFilters={selectedTypeFilters}
                            selectedDifficultyFilters={selectedDifficultyFilters} />
                    </Box>
                    <Button sx={{ mt: 2 }} fullWidth color='secondary' variant='outlined' onClick={handleSaveCommunityContent}>Share</Button>
                </Box>
            </Popover>
            </React.Fragment>
    );
}