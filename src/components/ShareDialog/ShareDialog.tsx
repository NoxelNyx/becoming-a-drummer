import React, { FC, useState } from 'react';
import Project from '@/src/interfaces/Project';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Popper, Switch, TextField, Typography } from '@mui/material';
import { Close, ShareOutlined, Link, CopyAllOutlined } from '@mui/icons-material';
import SharedListItem from './components/SharedListItem';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { searchUsersAsync, selectShareDialogState, addShareLinkAsync } from './slice';
import { setProjectAsync } from '@/src/components/ProjectNav/slice';
import { useAuthContext } from '@/src/firebase/provider';
import { LoadingButton } from '@mui/lab';

type ShareDialogProps = {
    open: boolean,
    project: Project,
    handleShareDialogClose: () => void
};

const ShareDialog: FC<ShareDialogProps> = ({ open, project, handleShareDialogClose }) => {
    const [email, setEmail] = useState('');
    const [generatingLink, setGeneratingLink] = useState(false);
    const [hideCopyLinkButton, setHideCopyLinkButton] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAuthContext();

    const handleClose = () => {
        handleShareDialogClose();
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleEmailSubmit = async () => {
        if (!user || email == '')
            return;
        
        const res = await dispatch(searchUsersAsync(email)) as any;
        
        if (res.payload.length > 0) {
            const sharedWith = res.payload[0];

            await dispatch(setProjectAsync({
                uid: user.uid,
                project: {
                    ...project,
                    sharedWith: [
                        ...project.sharedWith || [],
                        sharedWith
                    ],
                    sharedWithIds: [
                        ...project.sharedWithIds || [],
                        sharedWith.id
                    ]
                }
            }));
        } else
            console.log('User not found');

        setEmail('');
    };

    const handleUnshareClick = async (id: string) => {
        if (!user)
            return;

        await dispatch(setProjectAsync({
            uid: user?.uid,
            project: {
                ...project,
                sharedWith: project.sharedWith?.filter(user => user.id != id),
                sharedWithIds: project.sharedWithIds?.filter(userId => userId != id)
            }
        }));
    };

    const handleGenerateLinkClick = async () => {
        if (!user)
            return;

        setGeneratingLink(true);

        const res = await dispatch(addShareLinkAsync({ projectId: project.id, userId: user.uid })) as any;
        await dispatch(setProjectAsync({
            uid: user.uid,
            project: {
                ...project,
                shareLink: window.location.origin + '/share/' + res.payload
            }
        }));

        setGeneratingLink(false);
    };

    const handleCopyLinkClick = () => {
        setHideCopyLinkButton(true);

        navigator.clipboard.writeText(project.shareLink || '');

        setTimeout(() => {
            setHideCopyLinkButton(false);
        }, 300);
    };

    return (
        <React.Fragment>
            {project &&
                <Dialog
                    fullWidth
                    maxWidth='xs'
                    open={open}
                    sx={{ height: '60%' }}>
                    <IconButton
                        onClick={handleClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}
                        color='secondary'>
                        <Close />
                    </IconButton>
                    <ShareOutlined
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            margin: '8px'
                        }}
                        color='secondary' />
                    <DialogTitle paddingX={'45px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant='h6' justifySelf={'center'}>{project.title}</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {
                            false &&
                            <React.Fragment>
                                <TextField
                                    label="Share with (email)"
                                    fullWidth
                                    margin="normal"
                                    variant="standard"
                                    color='secondary'
                                    size="small"
                                    // value={email}
                                    onChange={handleEmailChange}
                                    // error={emailError}
                                    // helperText={emailError ? 'Invalid email' : ''}
                                    sx={{ marginBottom: '1rem' }}
                                    value={email}
                                    InputProps={{
                                        endAdornment: (
                                            <React.Fragment>
                                                {email !== '' ?
                                                    <Button
                                                        onClick={handleEmailSubmit}
                                                        color='secondary'
                                                        variant='contained'
                                                        size='small'
                                                        hidden={true}
                                                        sx={{
                                                            paddingX: '5px',
                                                            height: '15px',
                                                            width: '15px',
                                                            minWidth: '30px',
                                                            minHeight: '20px'
                                                        }}>
                                                        <b>OK</b>
                                                    </Button> :
                                                    null
                                                }
                                            </React.Fragment>)
                                    }} />
                                {
                                    project.sharedWith?.map((sharedWith, index) => (
                                        <SharedListItem
                                            key={index}
                                            sharedWith={sharedWith}
                                            handleUnshareClick={handleUnshareClick} />
                                    ))
                                }
                                <Divider sx={{ my: 2 }} />
                                <Typography
                                    variant='caption'
                                    sx={{ marginBottom: '1rem' }}
                                    color='secondary'>
                                        *Sharing a project does not give other users the ability to modify it.
                                </Typography>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Typography variant='h6'>Public Content Library:</Typography>
                                    <Switch color='secondary' />
                                </Box>
                                <Typography
                                    variant='caption'
                                    sx={{ marginBottom: '1rem' }}
                                    color='secondary'>
                                        When on, this project is made available within the public content library.
                                        Other users will be able to copy the project to their account.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                            </React.Fragment>
                        }
                    {project.shareLink ?
                        <React.Fragment>
                            <TextField
                                label='Public Link'
                                autoFocus
                                fullWidth
                                disabled
                                value={project.shareLink}
                                variant='standard'
                                color='secondary' />
                            <Typography
                                variant='caption'
                                sx={{ marginBottom: '1rem' }}
                                color='secondary'>
                                    Anyone with this link can copy the project to their account.
                            </Typography>
                            {hideCopyLinkButton ?
                                <Typography
                                    variant='caption'
                                    sx={{
                                        position: 'absolute',
                                        right: '25px',
                                        bottom: '55px',
                                        cursor: 'default'
                                    }}>copied</Typography>
                                : <IconButton
                                    onClick={handleCopyLinkClick}
                                    sx={{
                                        position: 'absolute',
                                        right: '25px',
                                        bottom: '45px'
                                    }}>
                                    <CopyAllOutlined />
                                </IconButton>
                            }
                            
                        </React.Fragment> :
                        <React.Fragment>
                            <LoadingButton
                                variant='outlined'
                                color='secondary'
                                endIcon={<Link />}
                                loading={generatingLink}
                                onClick={handleGenerateLinkClick}>Generate Public Link</LoadingButton>
                            <Typography
                                variant='caption'
                                sx={{ marginLeft: '1rem' }}
                                color='secondary'>
                                    Cannot be undone.
                            </Typography>
                        </React.Fragment>
                    }
                    </DialogContent>
                </Dialog>
            }
        </React.Fragment>
    );
};

export default ShareDialog;
