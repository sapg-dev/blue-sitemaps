import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


const FilterComponent = ({ subFilters = [], onFilterSelect, subFilterLogic, setSubFilterLogic }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const subFilterIcons = {
      'Power BI': '/icons/pb.svg',
      'Snowflake': '/icons/sw.png',
      'Dynamics 365': '/icons/d365.png',
      'Dashboard': '/icons/d.png',
      'DAX': '/icons/dax.svg',
      'Power Query': '/icons/pq.png',
      'Python': '/icons/python.svg',
      'Pandas': '/icons/panda.svg',

      'Jupyter': '/icons/jupyter.svg',
      'Polars': '/icons/polars.png',
      'Azure Fabric': '/icons/fabric.svg',
      'BigQuery': '/icons/bg.svg',


      'Synapse': '/icons/synapse.svg',
      'AWS': '/icons/aws.svg',
      'Data Factory': '/icons/data.svg',
      'Scikit-Learn': '/icons/sick.svg',
      'R': '/icons/r.svg',

      'AutoML': '/icons/auto.svg',
      'Colab': '/icons/colab.svg',
      'TensorFlow': '/icons/tensorf.svg',
      'Keras': '/icons/keras.svg',

        // Add other subfsvlters and their corresponding icon paths here
    };

    const handleToggle = (filterName) => () => {
        const currentIndex = selectedFilters.indexOf(filterName);
        const newChecked = [...selectedFilters];

        if (currentIndex === -1) {
            newChecked.push(filterName);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedFilters(newChecked);
        onFilterSelect(newChecked);
    };

    const handleLogicToggle = (event) => {
        setSubFilterLogic(event.target.checked ? 'AND' : 'OR');
    };

    return (
        <List component="nav" aria-label="filter list">
            <ListItem>
                <FormControlLabel
                    control={
                        <Switch
                            checked={subFilterLogic === 'AND'}
                            onChange={handleLogicToggle}
                            name="logicToggle"
                            color="primary"
                        />
                    }
                    label={subFilterLogic === 'AND' ? 'AND Logic' : 'OR Logic'}
                />
            </ListItem>
            <ListItem
                dense
                button
                onClick={() => {
                    setSelectedFilters([]);
                    onFilterSelect([]);
                }}
            >
                <ListItemIcon>
                    <span role="img" aria-label="All">🌐</span>
                </ListItemIcon>
                <ListItemText primary="All" />
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={selectedFilters.length === 0}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-label': 'Select All' }}
                        onClick={handleToggle('All')}
                    />
                </ListItemIcon>
            </ListItem>
            {subFilters.map(filter => {
                const labelId = `checkbox-list-label-${filter}`;
                const iconSrc = subFilterIcons[filter] ? subFilterIcons[filter] : '/icons/default-icon.png'; // Default icon if not specified

                return (
                    <ListItem
                        key={filter}
                        dense
                        button
                        onClick={handleToggle(filter)}
                    >
                        <ListItemIcon>
                            <img src={iconSrc} alt={filter} width="24" height="24" /> {/* Display the icon */}
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={filter} />
                        <ListItemIcon>
                            <Checkbox
                                edge="end"
                                checked={selectedFilters.includes(filter)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default FilterComponent;