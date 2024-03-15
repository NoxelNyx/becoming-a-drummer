import React, { FC, ReactElement } from 'react';
import { Box, Grid, Dialog, Typography, Card, CardActionArea, CardContent, IconButton, TextField, Button } from '@mui/material';
import { Close, YouTube } from '@mui/icons-material';
import Image from 'next/image';
import SoundCloud from '@/public/soundcloud-svgrepo-com.svg';
import Project from '@/src/interfaces/Project';
import ProjectCard from './components/ProjectCard';
import SearchBar from '../../../SearchBar';
import Thumbnail from '@/src/components/Thumbnail';

type ProjectLauncherProps = {
    projects: Project[],
    open: boolean,
    handleProjectOpen: (project: Project) => void,
    handleProjectLauncherClose: () => void,
    handleProjectCreate: (sourceId: string, title: string, projectType: string) => void
};

const ProjectTab: FC<ProjectLauncherProps> = ({ projects, open, handleProjectOpen, handleProjectLauncherClose, handleProjectCreate }): ReactElement => {
    const [selectedProjectType, setSelectedProjectType] = React.useState<string>('');
    const [projectTitle, setProjectTitle] = React.useState<string>('');
    const [sourceId, setSourceId] = React.useState<string>('');
    const [thumbnailUrl, setThumbnailUrl] = React.useState<string>('');
    const [selectedResult, setSelectedResult] = React.useState<any>(null);
    const projectTitleRef = React.useRef<HTMLInputElement | null>(null);

    const handleNewProjectTypeClick = (type: string) => {
        setSelectedProjectType(type);
    };

    const handleClose = () => {
        handleProjectLauncherClose();
        setSelectedProjectType('');
        setProjectTitle('');
        setSourceId('');
        setThumbnailUrl('');
        setSelectedResult(null);
    };

    const handleOnResultSelect = (id: string, title: string, thumbnailUrl: string) => {
        setThumbnailUrl(thumbnailUrl);
        setProjectTitle(title);
        setSourceId(id);

        setSelectedResult({ id, title, thumbnailUrl });

        setTimeout(() => {
            projectTitleRef.current?.focus();
        }, 100);
    };

    const handleProjectTitleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectTitle(e.target.value);
    };

    const handleCreateOnClick = () => {
        handleClose();
        handleProjectCreate(sourceId, projectTitle, selectedProjectType);
    };

    return (
        <Dialog
            fullWidth
            keepMounted
            maxWidth="md"
            open={open}
            sx={{ height: '75%' }}>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                }}
                color='secondary'>
                <Close />
            </IconButton>
            <Grid container spacing={2} sx={{ p: 2, maxHeight: 400, overflow: 'hidden' }}>
                <Grid item xs={4}>
                    <Typography variant="h6" component="h2" sx={{ pb: 1 }}>
                        Open Project
                    </Typography>
                    <Box sx={{ overflow: 'auto', maxHeight: 400, mr: 1 }} className='custom-scrollbar'>
                        {projects.map((project) => {
                            return (
                                <Box sx={{ mb: 2, mr: 1 }} key={project.id}>
                                    <ProjectCard key={project.id} project={project} handleProjectOpen={handleProjectOpen} />
                                </Box>
                            );
                        })}
                    </Box>
                </Grid>
                <Grid item xs={8} sx={{ borderLeft: '1px solid #777', height: 400 }} textAlign={'center'}>
                    <Typography variant="h6" component="h2" sx={{ pb: 1 }}>
                        New Project { selectedProjectType === 'youtube' && <YouTube sx={{ fontSize: '25px', marginTop: '-3px' }} /> }
                    </Typography>
                    {
                        selectedProjectType === '' &&
                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="center"
                                marginTop="50px">
                                <Card sx={{ height: '200px', width: '200px', mx: 2 }} onClick={() => handleNewProjectTypeClick('youtube')}>
                                    <CardActionArea sx={{ height: '100%' }}>
                                        <CardContent>
                                            <YouTube sx={{ fontSize: '75px' }} />
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                {/* <Card sx={{ height: '200px', width: '200px' }} onClick={() => handleNewProjectTypeClick('soundcloud')}>
                                    <CardActionArea sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Image src={SoundCloud} alt="SoundCloud" height={75} width={75} style={{ 
                                                filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(171deg) brightness(107%) contrast(102%)',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }} />
                                        </CardContent>
                                    </CardActionArea>
                                </Card> */}
                            </Box>
                    }
                    {
                        selectedProjectType === 'youtube' &&
                            <Box>
                                <SearchBar handleOnResultSelect={handleOnResultSelect} />
                                {
                                    selectedResult &&
                                    <React.Fragment>
                                        <Box display={'flex'} justifyContent={'center'} marginTop={'1rem'}>
                                            <Thumbnail url={thumbnailUrl} description='video thumbnail' duration={0} width={200} />
                                        </Box>
                                        <TextField 
                                            variant='standard'
                                            color='secondary'
                                            label='Project Title'
                                            value={projectTitle}
                                            inputRef={projectTitleRef}
                                            sx={{ width: '405px', float: 'left', marginLeft: '20px', marginTop: '50px'}}
                                            onChange={handleProjectTitleOnChange} />
                                        <Button variant='outlined' color='secondary' sx={{ marginTop: '60px' }} onClick={handleCreateOnClick}>Create</Button>
                                    </React.Fragment>
                                }
                            </Box>
                    }
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default ProjectTab;
