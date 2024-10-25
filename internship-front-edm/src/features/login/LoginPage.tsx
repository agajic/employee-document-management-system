import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { loginRequested, selectIsLoginFailed, selectIsLoginOngoing } from './authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoginOngoing = useAppSelector(selectIsLoginOngoing);
  const isLoginFailed = useAppSelector(selectIsLoginFailed);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');



  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);



  const handleLogin = () => {
    dispatch(loginRequested({ email, password }));
  };

  

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <Card sx={{ padding: 4, width: 400, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Login</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2, width: '100%' }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2, width: '100%' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 2, width: '50%' }}
            disabled={isLoginOngoing}
          >
            {isLoginOngoing ? 'Logging in...' : 'Login'}
          </Button>
          {isLoginOngoing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {isLoginFailed && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              Incorrect email or password. Please try again.
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
