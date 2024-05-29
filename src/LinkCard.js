import React, { useState } from 'react';

const StyledLinkCard = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '15px',
  margin: '10px auto',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  cursor: 'pointer',
  width: '300px',
  height: '200px',
  boxSizing: 'border-box',
  textAlign: 'left',
  transition: 'transform 0.3s ease-in-out',
};

const StyledTitle = {
  fontWeight: 'bold',
  fontSize: '1.1em',
  marginBottom: '5px',
};

const StyledContent = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: '5px',
};

const StyledWebsite = {
  color: '#007bff',
  fontSize: '0.9em',
  marginBottom: '10px',
};

const YouTubeBadge = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  width: '100px',
  height: '30px',
};



const InfoIconStyle = {
  position: 'relative',
  display: 'inline-block',
  marginLeft: '5px',
  fontSize: '16px', // Adjusted for better visibility
  color: 'black',
  cursor: 'pointer',
  backgroundColor: 'darkwhite',
  borderRadius: '50%',
  width: '24px', // Slightly larger for clarity
  height: '24px',
  textAlign: 'center',
  lineHeight: '24px', // Adjust for vertical centering
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  '::before': {
    content: '"i"',
    position: 'absolute',
    top: '4px',
    left: '0',
    right: '0',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: '11px',
    width: '2px',
    height: '2px',
    borderRadius: '50%',
    backgroundColor: 'black',
  }
};


const DescriptionBoxStyle = {
  position: 'absolute',
  top: '25px',
  left: '0',
  width: '200px',
  padding: '10px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '5px',
  zIndex: 10,
};

const getBorderColorByType = (type) => {
  switch (type) {
    case 'microsoft':
      return 'green';
    case 'youtube':
      return 'red';
    case 'blog':
      return 'blue';
    default:
      return '#d0d0d0';
  }
};

const getDaysAgo = (date) => {
  const today = new Date();
  const linkDate = new Date(date);
  const differenceInTime = today.getTime() - linkDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays === 0 ? 'today' :
         differenceInDays === 1 ? '1 day ago' :
         `${differenceInDays} days ago`;
};

const LinkCard = ({ title, content, link, website, date, type, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.location.href = link;
  };

  const daysAgo = getDaysAgo(date);

  const dynamicStyle = {
    ...StyledLinkCard,
    border: `1px solid ${getBorderColorByType(type)}`,
    outline: isHovered ? '2px solid blue' : 'none', // Blue outline when hovered
  };

  return (
    <div 
      style={dynamicStyle} 
      onClick={handleClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={StyledTitle}>{title}</div>
      <div style={StyledContent}>{content}</div>
      <div style={{...StyledWebsite, position: 'relative'}}>
        {website}
        <div 
          style={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span style={InfoIconStyle}>i</span>
          {isHovered && (
            <div style={DescriptionBoxStyle}>
              {description}
            </div>
          )}
        </div>
      </div>
 
      <div style={{ fontSize: '0.8em', color: '#888888', marginTop: '5px' }}>
        {daysAgo}
      </div>
    </div>
  );
};

export default LinkCard;
