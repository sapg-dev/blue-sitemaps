import React, { useRef, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloudIcon from '@mui/icons-material/Cloud';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import Logo from './euk.svg';
const pages = [
  { title: 'BI', icon: <BarChartIcon /> },
  { title: 'Analytics', icon: <AutoGraphIcon /> },
  { title: 'Cloud', icon: <CloudIcon /> },
  { title: 'Machine Learning', icon: <StorageIcon /> }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({ onCategoryChange }) {
  const biButtonRef = useRef(null);
  useEffect(() => {
    // Programmatically click the 'BI' button on component mount
    if (biButtonRef.current) {
      biButtonRef.current.click();
    }
  }, []);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState('BI');
  const [anchorElUser, setAnchorElUser] = React.useState(null);







  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleCloseNavMenu();
    onCategoryChange(category);
  };

  
  return (
    <AppBar position="static" sx={{ backgroundColor: 'lightgrey' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={Logo} alt="Logo" style={{ display: { xs: 'none', md: 'flex' }, marginRight: '450px', width: '7%', marginLeft: '-235px' }}/> 
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ my: 1, color: 'black', display: 'block', mx: 5 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu} sx={{ color: 'black' }}>
                  <ListItemIcon>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText primary={page.title} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
         
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleCategorySelect(page.title)}
                ref={page.title === 'BI' ? biButtonRef : null} 
                sx={{
                  my: 1, 
                  color: selectedCategory === page.title ? 'primary.main' : 'black', 
                  display: 'block', 
                  mx: 5,
                  backgroundColor: selectedCategory === page.title ? '#d3d3d3' : 'inherit',
                }}
                startIcon={page.icon}
              >
                {page.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
