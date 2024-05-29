import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Avatar, IconButton, Typography, Menu, MenuItem, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';


const getFaviconUrl = (link) => {
  const url = new URL(link);
  return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=256`;
};

const LinkCard = ({ title, content, link, website, date, type, id, daysAgo, state }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [hovered, setHovered] = useState(false);
    const open = Boolean(anchorEl);
  
    const handleMenuClick = (e) => {
      setAnchorEl(e.currentTarget);
    };


  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleActionButtonClick = async (actionType, e, articleId) => {
      e.stopPropagation();
      handleMenuClose();

      
      try {
        const response = await axios.patch(`https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/updateArticles/${articleId}`, { newState: actionType });


        console.log(response.data);
      } catch (error) {
        console.error('Error updating article state:', error);
      }
    };
  
    const handleTitleMouseEnter = () => {
      setHovered(true);
    };
  
    const handleTitleMouseLeave = () => {
      setHovered(false);
    };
  
    const handleTitleClick = (e) => {
      e.stopPropagation();
      window.location.href = link;
    };
  
    const cardStyle = {
      maxWidth: 345,
      height: '250px', // Set height dynamically
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.3s ease-in-out',
      cursor: 'pointer',
      outline: '2px solid blue',
      overflow: 'hidden',
      '@media (max-width: 600px)': { maxWidth: '100%' },
      ':hover': {
        outline: '2px solid red', // Blue outline on hover
        transform: 'scale(1.05)'
      }
    };
    const titleStyle = {
      cursor: 'pointer',
      color: hovered ? 'blue' : 'black'
    };
    

  const faviconUrl = getFaviconUrl(link);

  return (
    <Card sx={cardStyle}>
      <CardHeader
        avatar={<Avatar aria-label={type} src={faviconUrl} alt="favicon" />}
        action={
          <IconButton aria-label="settings" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography 
            onMouseEnter={handleTitleMouseEnter} 
            onMouseLeave={handleTitleMouseLeave} 
            onClick={handleTitleClick}
            style={titleStyle}
          >
            {title}
          </Typography>
        }
        subheader={`Updated ${daysAgo} days ago`}
      />
      <CardContent>
        <Typography variant="body2">{content}</Typography>
        <Typography variant="body2" color="text.secondary">{website}</Typography>
        <Chip label={state} variant="outlined" color="primary" size="small" style={{ marginTop: '10px' }} />
      </CardContent>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={(e) => handleActionButtonClick('Urgent', e, id)}>Urgent</MenuItem>
        <MenuItem onClick={(e) => handleActionButtonClick('Reading List', e, id)}>Reading</MenuItem>
        <MenuItem onClick={(e) => handleActionButtonClick('Archive', e, id)}>Archive</MenuItem>
        <MenuItem onClick={(e) => handleActionButtonClick('Toolbox', e, id)}>Toolbox</MenuItem>
      </Menu>
    </Card>
  );
};

export default LinkCard;
