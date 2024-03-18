import React, { FC } from 'react';
import User from '@/src/interfaces/User';
import { ListItem, Divider, Box, IconButton } from '@mui/material';
import { useAuthContext } from '@/src/firebase/provider';
import { Close } from '@mui/icons-material';

type SharedListItemProps = {
    sharedWith: User,
    handleUnshareClick: (id: string) => void
};

const SharedListItem: FC<SharedListItemProps> = ({ sharedWith, handleUnshareClick }) => {
    const user = useAuthContext();
    const isUser = sharedWith.id == user?.uid;

    const handleUnshareOnClick = () => {
        handleUnshareClick(sharedWith.id);
    };

    return (
        <ListItem
            sx={{ paddingLeft: '0', justifyContent: 'space-between' }}>
                <Box>
                    {sharedWith.email}{isUser && ' (You)'} 
                </Box>
                <Box>
                    {!isUser &&
                        <IconButton
                            onClick={handleUnshareOnClick}
                            color='secondary'>
                            <Close
                                sx={{
                                    fontSize: '15px'
                                }} />
                        </IconButton>
                    }
                </Box>
        </ListItem>
    );
};

export default SharedListItem;
