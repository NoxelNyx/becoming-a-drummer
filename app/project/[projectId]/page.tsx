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

    const handleCtrlRightKey = React.useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'ArrowRight') {
            e.preventDefault();
            e.stopPropagation();

            setCurrentSlide('r');
        }
    }, []);

    const handleCtrlLeftKey = React.useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();

            setCurrentSlide('l');
        }
    }, []);

    React.useEffect(() => {
        if (user === null)
            router.push('/');

        window.addEventListener('keydown', handleCtrlRightKey);
        window.addEventListener('keydown', handleCtrlLeftKey);

        return () => { 
            window.removeEventListener('keydown', handleCtrlRightKey);
            window.removeEventListener('keydown', handleCtrlLeftKey);
        }
    }, [user, router, project, handleCtrlRightKey, handleCtrlLeftKey]);

    const handleToggle = () => {
        const newSlide = currentSlide === 'l' ? 'r' : 'l';

        setTransitionDone(false);
        setCurrentSlide(newSlide);
    };

    const handleTransitionDone = () => {
        setTransitionDone(true);
    };

    return (
        <Div sx={styles.root}>
            {currentSlide === 'r' && transitionDone &&
                <ToggleButton value="l" aria-label="left" onClick={handleToggle} sx={styles.toggleButton}>
                    <SwitchLeft />
                </ToggleButton>
            }
            <Slide in={currentSlide=='l'} direction="right" addEndListener={handleTransitionDone}>
                <Box
                    position={'absolute'}>
                    {project?.type === 'youtube' &&
                        <VideoEmbed project={project} />
                    }
                </Box>
            </Slide>
            <Slide in={currentSlide=='r'} direction="left" addEndListener={handleTransitionDone}>
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
