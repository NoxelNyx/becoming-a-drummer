'use client'

import React from 'react';
import { 
    Card,
    CardContent,
    TextField,
    Typography,
    Divider,
    Button,
    Grid
} from '@mui/material';
import firebase_app from '@/src/firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import Logo from '../Logo';

export default function LoginCard() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const auth = getAuth(firebase_app);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') signIn();
    };

    const signIn = async () => {
        let result = null,
            error = null;

        try {
            result = await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            error = e;
        }
    };

    const signUp = async () => {
        let result = null,
            error = null;

        try {
            result = await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
            error = e;
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container className="mt-3 mb-6">
                    <Grid item>
                        <Logo height={40} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" alignSelf="center">Becoming a Drummer</Typography>
                    </Grid>
                </Grid>
                <TextField
                    id="outlined-password-input"
                    label="Email"
                    type="email"
                    autoComplete="current-password"
                    variant="filled"
                    sx={{ mt: 2 }}
                    color="secondary"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange} />
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-email"
                    variant="filled"
                    sx={{ mt: 2 }}
                    color="secondary"
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyPress} />
                <Button variant="outlined" sx={{ mt: 4 }} color="secondary" fullWidth onClick={signIn}>Sign In</Button>
                <Divider sx={{ mt: 2 }}>OR</Divider>
                <Button variant="outlined" sx={{ mt: 2 }} color="secondary" fullWidth onClick={signUp}>Register</Button>
            </CardContent>
        </Card>
    );
}
