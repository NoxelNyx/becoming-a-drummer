import React from 'react';
import { Delete, People } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, Typography, Menu, Box, ListItemIcon, MenuItem, Popover, TextField, Button } from '@mui/material';

interface GsBookmarkProps {
    title: string,
    active: boolean,
    index: number,
    activateGsBookmark: (index: number) => void,
    deactivateGsBookmarks: () => void,
    handleDeleteBookmark: (index: number) => void,
};

export default function GsBookmarkCard({ title, active, index, deactivateGsBookmarks, activateGsBookmark, handleDeleteBookmark }: GsBookmarkProps) {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleRightClick = (event: any) => {
        event.preventDefault();

        setMenuAnchorEl(event.currentTarget);
    };

    const handleContextClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOnClick = () => {
        if (active) {
            deactivateGsBookmarks();
        } else {
            activateGsBookmark(index);
        }
    };

    const handleDeleteGsBookmark = () => {
        handleDeleteBookmark(index);
        handleContextClose();
    };

    return (
        <React.Fragment>
            <Card
                sx={{ height: 50, mr: 2 }}
                onClick={handleOnClick}
                onContextMenu={handleRightClick}
                variant={active ? 'outlined' : 'elevation'}>
                <CardActionArea>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{title}</Typography>
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
                <MenuItem onClick={handleDeleteGsBookmark}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}