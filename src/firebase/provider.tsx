import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
    User
} from 'firebase/auth';
import firebase_app from './config';

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
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
