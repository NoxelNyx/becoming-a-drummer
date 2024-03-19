import React, { FC, ReactElement } from 'react';
import { useTheme, Tab, Menu, MenuItem, ListItemIcon, Typography, Dialog, Button, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch } from 'react-redux';
import Project from '@/src/interfaces/Project';
import { YouTube, Delete, Close, ShareOutlined } from '@mui/icons-material';

type ProjectTabProps = {
    project: Project,
    handleProjectDelete: (id: string) => void
    handleProjectClose: (project: Project) => void,
    handleProjectShare: (project: Project) => void
};

const ProjectTab: FC<ProjectTabProps> = ({ project, handleProjectDelete, handleProjectClose, handleProjectShare }): ReactElement => {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const { projectId: activeProjectId } = useParams();
    const active = project.id === activeProjectId;
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    const menuOpen = Boolean(contextMenu);

    const handleOnClick = () => {
        router.push('/project/' + project.id);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();

        setContextMenu(
            contextMenu === null
              ? {
                  mouseX: e.clientX + 2,
                  mouseY: e.clientY - 6,
                }
              : null,
          );
    }

    const handleContextClose = () => {
        setContextMenu(null);
    };

    const handleDeleteClick = () => {
        setConfirmationOpen(true);
        handleContextClose();
    };

    const handleCloseClick = () => {
        handleProjectClose(project);
        handleContextClose();
    };

    const handleConfirmationNo = () => {
        setConfirmationOpen(false);
    };

    const handleConfirmationYes = () => {
        handleProjectDelete(project.id);
        setConfirmationOpen(false);
    };

    const handleShareClick = () => {
        handleProjectShare(project);
        handleContextClose();
    };

    return (
        <React.Fragment>
            <Tab
                onContextMenu={handleRightClick}
                color={active ? 'secondary' : 'inherit'}
                sx={{
                    borderRadius: '0',
                    borderTop: active ? '2px solid ' + theme.palette.secondary.main : 'none',
                    marginLeft: '5px',
                    backgroundColor: active ? theme.palette.background.default : '#333',
                    textTransform: 'none',
                    height: '48px',
                    minHeight: '40px',
                }}
                label={project.title}
                wrapped={false}
                onClick={handleOnClick}
                icon={<YouTube />}
                iconPosition='start' />
            <Menu
                open={menuOpen}
                onClose={handleContextClose}
                elevation={8}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }>
                <MenuItem onClick={handleCloseClick}>
                    <ListItemIcon>
                        <Close fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Close</Typography>
                </MenuItem>
                <MenuItem onClick={handleShareClick}>
                    <ListItemIcon>
                        <ShareOutlined fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Share</Typography>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                </MenuItem>
            </Menu>
            <Dialog
                open={confirmationOpen}
                aria-labelledby="confirm-delete-project"
                aria-describedby="confirm-delete-project-description"
                sx={{ height: '60%' }}>
                <DialogTitle id="confirm-delete-project">
                    Are you sure you want to delete this project?
                </DialogTitle>
                <DialogContent>
                    <br />
                    <Typography variant="h4">
                        {project.title}
                    </Typography>
                    <br />
                    <DialogContentText id="confirm-delete-project-description">
                        Deleting this project will <b><u>permanently</u></b> delete all associated data, including your transcriptions. This action cannot be undone!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleConfirmationNo}
                        color='secondary'
                        autoFocus>
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmationYes}
                        color='secondary'>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ProjectTab;
