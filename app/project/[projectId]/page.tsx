'use client'

import React from 'react';
import { styled } from '@mui/system';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/src/redux/hooks';
import { selectProject } from '@/src/components/ProjectNav/slice';
import VideoEmbed from '@/src/components/VideoEmbed';
import LessonPanel from '@/src/components/LessonPanel';

const styles = {
    root: {
        textAlign: 'center',
        marginTop: '3rem',
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
    const project = useAppSelector(selectProject(params.projectId));

    React.useEffect(() => {
        if (user === null)
            router.push('/');
    }, [user, router]);

    return (
        <Div sx={styles.root}>
            {project && 
                project?.type === 'youtube' &&
                    <VideoEmbed project={project} />
            }
            {project && 
                <LessonPanel project={project} />
            }
        </Div>
    );
}
