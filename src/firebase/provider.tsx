import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
    User
} from 'firebase/auth';
import firebase_app from './config';
import Logo from '@/src/components/Logo';
import { LinearProgress } from '@mui/material';

export const auth = getAuth(firebase_app);
export const AuthContext = React.createContext<User | null>(null);
export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
})  => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            setUser(user);

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {loading 
                ? <React.Fragment>
                    <div style={{ backgroundColor: '#121212', height: '100vh' }}>
                        <LinearProgress color='secondary' />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Logo sizes="100vh" height={500} className='mx-auto' />
                        </div>
                    </div>
                </React.Fragment>
                : children}
        </AuthContext.Provider>
    );
};
