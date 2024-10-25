import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const HomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Home
        </Typography>
        <Card>
            <CardContent sx={{paddingLeft:4, paddingRight:4}}>
                <h2>Welcome {user?.email}</h2>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Use the navigation bar on the left to explore the {user?.role} Dashboard.
                </Typography>
            </CardContent>
        </Card>
    </Box>
  );
};

export default HomePage;
