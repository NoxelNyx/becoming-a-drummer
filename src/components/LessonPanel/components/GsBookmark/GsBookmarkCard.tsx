import { Delete } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, Typography, Menu, MenuList, ListItemIcon, MenuItem } from '@mui/material';
import { deleteGsBookmarkAsync, setActive } from '../../slice';
import { useAuthContext } from '@/src/firebase/provider';
import { useAppDispatch } from '@/src/redux/hooks';
import React from 'react';

interface GsBookmarkProps {
    id: string,
    params: string,
    title: string,
    handleGsParamsChange: (params: string) => void,
    active: boolean
};

export default function GsBookmarkCard({ id, params, title, active, handleGsParamsChange }: GsBookmarkProps) {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const user = useAuthContext();
    const dispatch = useAppDispatch();
    const open = Boolean(menuAnchorEl);

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

    return (
        <React.Fragment>
            <Card
                sx={{ height: 50, mr: 2 }}
                onClick={handleOnClick}
                onContextMenu={handleRightClick}
                variant={active ? 'outlined' : 'elevation'}>
                <CardActionArea>
                    <CardContent>
                        <Typography>{title}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Menu
                anchorEl={menuAnchorEl}
                open={open}
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