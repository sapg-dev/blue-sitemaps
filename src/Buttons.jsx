import * as React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';

export default function CategoryButtons({ onCategorySelect }) {
  return (
    <ButtonGroup disableElevation variant="contained" aria-label="Category button group">
      <Button onClick={() => onCategorySelect('BI')} startIcon={<BarChartIcon />}>BI</Button>
      <Button onClick={() => onCategorySelect('Analytics')} startIcon={<AutoGraphIcon />}>Analytics</Button>
      <Button onClick={() => onCategorySelect('Cloud')} startIcon={<CloudIcon />}>Cloud</Button>
      <Button onClick={() => onCategorySelect('Machine Learning')} startIcon={<StorageIcon />}>Machine Learning</Button>
      <Button onClick={() => onCategorySelect('All Articles')} startIcon={<StorageIcon />}>All Articles</Button>
    </ButtonGroup>
  );
}
