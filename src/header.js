import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import image from './banner.png';

const headerStyle = {
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '100%',
  height: '400px',
  display: 'flex',
  padding: '20px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  color: 'black',
  fontSize: '2em',
  backgroundColor: 'black'
};

const searchContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-end',
  alignItems: 'flex-start',
  width: '100%',
  marginTop: 'auto',
};

const textFieldStyle = {
  backgroundColor: 'white',
  borderRadius: '4px',
};

const selectStyle = {
  backgroundColor: 'white',
  borderRadius: '4px',
};

const Header = ({ appName, onSearch, websites, onWebsiteSelect, articleTypes, onTypeSelect, currentSortOrder, onSortChange }) => {
  // Ensure that websites and articleTypes props are arrays
  const websiteOptions = Array.isArray(websites) ? websites.map(site => ({ value: site, label: site })) : [];
  const articleTypeOptions = Array.isArray(articleTypes) ? articleTypes.map(type => ({ value: type, label: type })) : [];

  const [selectedWebsites, setSelectedWebsites] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([]);

  const handleWebsiteChange = (event) => {
    const newSelectedWebsites = event.target.value; // This should be an array of selected values
    setSelectedWebsites(newSelectedWebsites);
    
    onWebsiteSelect(newSelectedWebsites); // Directly pass the array of selected values
  };
  
  const handleTypeChange = (event) => {
    const newSelectedTypes = event.target.value; // This should be an array of selected values
    setSelectedTypes(newSelectedTypes);
    onTypeSelect(newSelectedTypes); // Directly pass the array of selected values
  };

  // Simplify the renderValue for clarity
  const renderChips = (selected) => selected.map((value) => (
    <Chip key={value} label={value} />
  ));

  return (
    <header style={headerStyle}>
      {appName}
      <div style={searchContainerStyle}>
        <TextField 
          fullWidth
          label="Search articles..."
          variant="outlined"
          onChange={(e) => onSearch(e.target.value)}
          style={textFieldStyle}
          sx={{ mb: 4, maxWidth: 400 }}
        />
        <FormControl fullWidth style={selectStyle} sx={{ mb: 4, maxWidth: 400 }}>
          <InputLabel id="websites-label">Websites</InputLabel>
          <Select
            labelId="websites-label"
            multiple
            value={selectedWebsites}
            onChange={handleWebsiteChange}
            renderValue={renderChips}
          >
            {websiteOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={selectStyle} sx={{ mb: 4, maxWidth: 400 }}>
          <InputLabel id="types-label">Article Types</InputLabel>
          <Select
            labelId="types-label"
            multiple
            value={selectedTypes}
            onChange={handleTypeChange}
            renderValue={renderChips}
          >
            {articleTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

       
      </div>
    </header>
  );
};

export default Header;