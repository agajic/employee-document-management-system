import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { ActionStatus, setPasswordRequested } from './authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const SetPasswordPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const setPasswordStatus = useSelector((state: RootState) => state.auth.setPasswordStatus);
    const setPasswordSuccess = useSelector((state: RootState) => state.auth.setPasswordSuccess);

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);



    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setEmail(params.get('email') || '');
        setToken(params.get('token') || '');
    }, [location]);

    useEffect(() => {
        if (setPasswordSuccess) {
          alert("Password set successfully, you now login into your account!")
          navigate('/login');
        }
      }, [setPasswordSuccess]);

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
            return;
        }
        setPasswordMatchError(null);
        dispatch(setPasswordRequested({ email, token, password }));
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Typography variant="h4" mb={2}>Set Your Password</Typography>
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                fullWidth
                margin="normal"
                disabled
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            {passwordMatchError && (
                <Typography color="error" mt={2}>{passwordMatchError}</Typography>
            )}
            {setPasswordStatus===ActionStatus.Pending ? <CircularProgress /> : (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Set Password
                </Button>
            )}
            {setPasswordStatus===ActionStatus.Failed && <Typography color="error" mt={2}>Couldn't set the password..</Typography>}
        </Box>
    );
};

export default SetPasswordPage;
