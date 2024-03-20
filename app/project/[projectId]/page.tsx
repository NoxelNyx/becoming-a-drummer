'use client'

import React from 'react';
import { styled } from '@mui/system';
import { Box, Slide, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SwitchLeft, SwitchRight } from '@mui/icons-material';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/src/redux/hooks';
import { selectProject } from '@/src/components/ProjectNav/slice';
import VideoEmbed from '@/src/components/VideoEmbed';
import LessonPanel from '@/src/components/LessonPanel';
import Project from '@/src/interfaces/Project';

const styles = {
    root: {
        textAlign: 'center',
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'center',
    },
    toggleButton: {
        maxHeight: '35px'
    }
};

const Div = styled('div')(styles);

export default function ProjectPage({
    params 
}: {
    params: { 
        projectId: string
    }
}) {
    const user = useAuthContext();
    const router = useRouter();
    const project = useAppSelector(selectProject(params.projectId)) as Project;
    const [currentSlide, setCurrentSlide] = React.useState<string>('l');
    const [transitionDone, setTransitionDone] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (user === null)
            router.push('/');
    }, [user, router, project]);

    const handleToggle = () => {
        const newSlide = currentSlide === 'l' ? 'r' : 'l';
        const body = document.querySelector('body') as HTMLBodyElement;

        setTransitionDone(false);
        setCurrentSlide(newSlide);

        setTimeout(() => {
            setTransitionDone(true);
        }, 100);
    }

    return (
        <Div sx={styles.root}>
            {currentSlide === 'r' && transitionDone &&
                <ToggleButton value="l" aria-label="left" onClick={handleToggle} sx={styles.toggleButton}>
                    <SwitchLeft />
                </ToggleButton>
            }
            <Slide in={currentSlide=='l'} direction="right">
                <Box
                    position={'absolute'}>
                    {project?.type === 'youtube' &&
                        <VideoEmbed project={project} />
                    }
                </Box>
            </Slide>
            <Slide in={currentSlide=='r'} direction="left">
                <Box
                    width={'100%'}>
                    <LessonPanel project={project || {} as Project} />
                </Box>
            </Slide>
            {currentSlide === 'l' && transitionDone &&
                <ToggleButton value="r" aria-label="right" onClick={handleToggle} sx={styles.toggleButton}>
                    <SwitchRight />
                </ToggleButton>
            }
        </Div>
    );
}
