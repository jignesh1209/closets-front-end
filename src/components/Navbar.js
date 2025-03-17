import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function AppNavBar() {

    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/";
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#bda485' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'justify' }}>
            Closets By Design
          </Typography>
            <Button variant='contained' color='error' onClick={handleLogout}>
            Logout
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}