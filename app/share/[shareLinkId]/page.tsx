'use client'

import React from 'react';
import { styled } from '@mui/system';
import { useAppDispatch } from '@/src/redux/hooks';
import { useAuthContext } from '@/src/firebase/provider';
import { useRouter } from 'next/navigation';
import LoginCard from '@/src/components/LoginCard';
import Logo from '@/src/components/Logo';
import { Box, CircularProgress } from '@mui/material';
import { getShareLink } from '@/src/components/ShareDialog/api';
import { fetchProjectAsync, addProjectAsync } from '@/src/components/ProjectNav/slice';
import Project from '@/src/interfaces/Project';

const styles = {
    root: {
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginTop: '3rem',
    }
};

const Div = styled('div')(styles);

export default function SharePage({
    params 
}: {
    params: { 
        shareLinkId: string
    }
}) {
    const user = useAuthContext();
    const router = useRouter();
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (user !== null) {
            getShareLink(params.shareLinkId).then(async link => {
                const fetchRes = await dispatch(fetchProjectAsync({ uid: link.userId, id: link.projectId }));
                const sharedProject = fetchRes.payload as Project;

                if (!sharedProject) {
                    router.push('/404');
                    return;
                }

                const addRes = await dispatch(addProjectAsync({ 
                    uid: user.uid, 
                    project: {
                        ...sharedProject,
                        id: '',
                        shareLink: '',
                        sharedWith: [],
                        sharedWithIds: [],
                        shared: false,
                        open: true,
                        gsBookmarks: sharedProject.gsBookmarks.map(b => ({ ...b, active: false }))
                    } 
                }));

                const newProject = addRes.payload as Project;

                router.push('/project/' + newProject.id);
            });
        }
    }, [user, params.shareLinkId, router, dispatch]);

    return (
        <Div sx={styles.root}>
                {user === null
                    ? <Box maxWidth={'400px'}>
                        <LoginCard />
                    </Box>
                    : <Box marginTop={'25%'}>
                        <Logo sizes="100vh" height={500} className='mx-auto' />
                    </Box>
                }
        </Div>
    );
}
