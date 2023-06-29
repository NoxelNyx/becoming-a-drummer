'use client'

import React from 'react';
import {
    Card,
    CardContent,
    TextField,
    Typography,
    Divider,
    Button,
    Grid,
    Link,
    IconButton,
    Box,
    Alert
} from '@mui/material';
import { Google } from '@mui/icons-material';
import firebase_app from '@/src/firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth';
import Logo from '../Logo';

export default function LoginCard() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [modifyingPass, setModifyingPass] = React.useState(false);
    const [error, setError] = React.useState('');
    const auth = getAuth(firebase_app);
    const googleAuthProvider = new GoogleAuthProvider();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') signIn();
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleAuthProvider)
            .catch((error: AuthError) => {
                console.error(error);
            });
    };

    const handleForgotPassword = () => {
        setModifyingPass(!modifyingPass);
    };

    const signIn = async () => {
        let result = null;

        try {
            result = await signInWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
            parseError(e);
        }
    };

    const signUp = async () => {
        let result = null;

        try {
            result = await createUserWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
            parseError(e);
        }
    };

    const forgotPassword = async () => {
        let result = null;

        setModifyingPass(false);
        
        try {
            result = await sendPasswordResetEmail(auth, email);
        }
        catch (e: any) {
        }
    };

    const parseError = (error: any) => {
        if (error.code === 'auth/wrong-password') {
            setError('Password is incorrect');
        } else if (error.code === 'auth/user-not-found') {
            setError('User not found');
        } else if (error.code === 'auth/invalid-email') {
            setError('Email is invalid');
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container className="mt-3 mb-6">
                    <Grid item xs={12} sm>
                        <Logo height={40} />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginTop={{ xs: 3, sm: 0 }}>
                            <Typography variant="h5" alignSelf="center">Becoming a Drummer</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Alert severity="error" sx={{ display: error ? 'flex' : 'none' }}>{error}</Alert>
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
                {!modifyingPass &&
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
                }
                {modifyingPass
                    ? <Button variant="outlined" sx={{ mt: 2 }} color="secondary" fullWidth onClick={forgotPassword}>Send Password Reset</Button>
                    : <React.Fragment>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <Link fontSize={14} sx={{ mt: 1 }} color='secondary' component='button' onClick={handleForgotPassword}>Forgot Password?</Link>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} sx={{ mt: 5 }}>
                            <Button variant="outlined" sx={{ mr: 4 }} color="secondary" fullWidth onClick={signIn}>Sign In</Button>
                            <Button variant="outlined" color="secondary" fullWidth onClick={signUp}>Register</Button>
                        </Box>
                    </React.Fragment>
                }
                <Divider sx={{ mt: 2 }}>OR</Divider>
                <Box justifyContent={'center'} alignItems={'center'} display={'flex'} sx={{ mt: 2 }}>
                    <IconButton color="secondary" onClick={handleGoogleSignIn} size='large' sx={{ outline: 'solid 1px' }}><Google /></IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}
