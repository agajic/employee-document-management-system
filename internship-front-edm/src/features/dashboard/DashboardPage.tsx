import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import ViewEmployeesPage from '../employees/ViewEmployeesPage';
import HomePage from './HomePage';
import FileManagePage from '../document/FileManagePage';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import PagesIcon from '@mui/icons-material/Pages';
import FolderIcon from '@mui/icons-material/Folder';
import { logoutRequested } from '../login/authSlice';

// Text styles
const getTextStyles = (isTextVisible: boolean) => ({
  opacity: isTextVisible ? 1 : 0,
  visibility: isTextVisible ? 'visible' : 'hidden',
  transition: 'opacity 0.3s ease-in-out, visibility 0.3s',
});

// Button styles
const getButtonStyles = (isSidebarOpen: boolean) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'left',
  width: '100%',
  paddingLeft: isSidebarOpen ? '60px' : '20px',
  minWidth: '0px',
  height: '50px',
  position: 'relative',
});

// Fixed icon styles
const fixedIconStyles = {
  position: 'absolute',
  left: '10px', // Fix position to the left of the button
  top: '50%',
  transform: 'translateY(-50%)',
  minWidth: '40px',
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [currentPage, setCurrentPage] = useState<'home' | 'viewEmployees' | 'fileUpload'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);



  // Effect to manage text visibility only after nav has expanded
  useEffect(() => {
    if (isSidebarOpen) {
      const timer = setTimeout(() => {
        setIsTextVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setIsTextVisible(false);
    }
  }, [isSidebarOpen]);



  const handleNavigation = (page: 'home' | 'viewEmployees' | 'fileUpload') => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    dispatch(logoutRequested())
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: '#f4f4f4'}}>
          <Toolbar  sx={{ justifyContent: 'space-between'}}>
            
          <PagesIcon sx={{width: '40px', height: '40px', color: 'black', marginBottom: 1.5, marginTop: 2, marginLeft: 0.3}}/>
          <Typography variant="h6"  sx={{ color: 'black' }}> {user?.role} Dashboard</Typography>
          </Toolbar>
        </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>

        {/* Vertical Navigation Bar */}
        <Box
          sx={{
            width: isSidebarOpen ? '250px' : '62px',
            backgroundColor: '#f4f4f4',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',  // Space between items to push logout button to the bottom
            height: '100%',
            transition: 'width 0.3s ease-in-out',
            '&:hover': {
              width: '250px',
            },
          }}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)} 
          >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            

            <Button
              variant={currentPage === 'home' ? 'contained' : 'outlined'}
              startIcon={<HomeIcon sx={fixedIconStyles} />}
              onClick={() => handleNavigation('home')}
              sx={getButtonStyles(isSidebarOpen)}
            >
              {isSidebarOpen && (
                  <Box component="span" sx={getTextStyles(isTextVisible)}>
                    Home
                  </Box>
                )}
            </Button>
            <Button
              variant={currentPage === 'viewEmployees' ? 'contained' : 'outlined'}
              startIcon={<PeopleIcon sx={fixedIconStyles} />}
              onClick={() => handleNavigation('viewEmployees')}
              sx={getButtonStyles(isSidebarOpen)}
            >
              {isSidebarOpen && (
                  <Box component="span" sx={getTextStyles(isTextVisible)}>
                    View Employees
                  </Box>
                )}
            </Button>

            <Button
              variant={currentPage === 'fileUpload' ? 'contained' : 'outlined'}
              startIcon={<FolderIcon sx={fixedIconStyles} />}
              onClick={() => handleNavigation('fileUpload')}
              sx={getButtonStyles(isSidebarOpen)}
            >
              {isSidebarOpen && (
                  <Box component="span" sx={getTextStyles(isTextVisible)}>
                    Manage Files
                  </Box>
                )}
            </Button>
          </Box>

          {/* Logout at the Bottom */}
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon sx={fixedIconStyles} />}
            onClick={handleLogout}
            sx={getButtonStyles(isSidebarOpen)}
          >
            {isSidebarOpen && (
              <Box component="span" sx={getTextStyles(isTextVisible)}>
                Logout
              </Box>
            )}
          </Button>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, padding: 3 }}>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'viewEmployees' && <ViewEmployeesPage />}
          {currentPage === 'fileUpload' && <FileManagePage />}
        </Box>

      </Box>
    </Box>
  );
};

export default DashboardPage;
