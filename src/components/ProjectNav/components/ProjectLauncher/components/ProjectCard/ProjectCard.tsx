import React, { FC, ReactElement } from 'react';
import { Card, CardActionArea, CardHeader, CardMedia } from '@mui/material';
import Project from '@/src/interfaces/Project';
import { YouTube } from '@mui/icons-material';

type ProjectCardProps = {
    project: Project,
    handleProjectOpen: (project: Project) => void
};

const ProjectCard: FC<ProjectCardProps> = ({ project, handleProjectOpen }): ReactElement => {
    const handleOnClick = () => {
        handleProjectOpen(project);
    };

    return (
        <Card key={project.id} sx={{ display: 'flex' }}>
            <CardActionArea onClick={handleOnClick}>
                <CardHeader
                    title={project.title}
                    avatar={
                        <React.Fragment>
                            <CardMedia
                                component="img"
                                sx={{ width: 100, height: 57, display: 'inline-flex' }}
                                image={`https://i.ytimg.com/vi/${project.videoId}/mqdefault.jpg`}
                                alt={project.title} />
                            {
                                project.type === 'youtube' &&
                                <YouTube sx={{ position: 'absolute', bottom: '20px', left: '20px' }} />
                            }
                        </React.Fragment>
                    } />
            </CardActionArea>
        </Card>
    //     <CardActionArea onClick={handleClick}>
    //     <CardHeader
    //         title={videoTitle}
    //         avatar={
    //             <CardMedia
    //                 component="img"
    //                 sx={{ width: 100, height: '100%', display: 'inline-flex' }}
    //                 image={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
    //                 alt={title} />
    //         } />
    //     <Divider />
    //     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //         <CardContent>
    //             <Typography component="div">
    //                 {title}
    //             </Typography>
    //             <Typography variant="subtitle1" color="text.secondary" component="div">
    //                 {description}
    //             </Typography>
    //             <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 1 }}>
    //                 {
    //                     keywords.map((keyword, index) => {
    //                         const isTypeFilter = filters.type.includes(keyword);

    //                         return <Chip key={index} label={keyword} sx={{ mr: 1, mt: 1 }} size='small' color={isTypeFilter ? 'secondary' : 'default'} />
    //                     })
    //                 }
    //             </Box>
    //         </CardContent>
    //     </Box>
    // </CardActionArea>
    );
};

export default ProjectCard;
