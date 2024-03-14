import React, { useEffect, useState, useCallback  } from 'react';
import LinkCard from './Card';
import Header from './header';
import FilterComponent from './FilterComponent';
import Pagination from '@mui/material/Pagination';
import ResponsiveAppBar from './menu';
import Grid from '@mui/material/Grid'; // Import Grid
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [uniqueWebsites, setUniqueWebsites] = useState([]);
  const [itemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSubFilters, setCurrentSubFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('BI');
  const [sortOrder, setSortOrder] = useState('Newsest'); // New state for sort order
  const [, setArticleStateFilter] = useState('');
  const [selectedState, setSelectedState] = useState('');


  const categorySubFilters = {
    Analytics: [
      ['Python'], 
      ['Pandas'], 
      ['Jupyter'], 
      ['Polars']
    ],
    BI: [
      ['Power BI', 'powerbi', 'POWERBI', 'PowerBI', 'power bi'], 
      ['Snowflake', 'snowflake'], 
      ['Dynamics 365', 'D365'], 
      ['Dashboard', 'dashboard'], 
      ['DAX', 'dax'], 
      ['Power Query', 'Power Query', 'PowerQuery', 'powerquery', 'power query']
    ],
    Cloud: [
      ['Azure Fabric', 'AzureFabric'], 
      ['BigQuery', 'Big Query'], 
      ['Synapse'], 
      ['AWS'], 
      ['Data Factory']
    ],
    'Machine Learning': [
      ['Scikit-Learn', 'Scikit Learn', 'ScikitLearn'], 
      ['R', 'R Language', 'R Programming'], 
      ['AutoML'], 
      ['Colab'], 
      ['TensorFlow'], 
      ['Keras']
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);

    setDisplayedArticles(prevDisplayedArticles => {
      const sortedArticles = [...prevDisplayedArticles];
      sortedArticles.sort((a, b) => {
        if (newOrder === 'newest') {
          return a.daysAgo - b.daysAgo;
        } else {
          return b.daysAgo - a.daysAgo;
        }
      });
      return sortedArticles;
    });
  };

  

const keywordVariationsMap = {};
Object.entries(categorySubFilters).forEach(([category, subFilters]) => {
  subFilters.forEach(subFilterArray => {
    keywordVariationsMap[subFilterArray[0]] = subFilterArray;
  });
});

  const fetchData = async () => {
    try {
      const response = await fetch('https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/articles');
      const data = await response.json();
      setArticles(data);
      setUniqueWebsites([...new Set(data.map(article => article.website))].filter(Boolean));
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleStateFilterChange = (state) => {
    setArticleStateFilter(state);
  
    if (currentCategory === 'All Articles') {
      fetchAllArticlesWithState(state);
    } else {
      fetchArticlesConsideringAllFilters(currentCategory, selectedFilters, selectedWebsites, state);
    }
  };

  const onCategoryChange = async (category) => {
    setCurrentCategory(category);
    setSelectedState(''); // Reset the selected state
  
    if (category === 'All Articles') {
      setCurrentSubFilters([]);
      setArticleStateFilter('');
      fetchAllArticles();
    } else {
      setSelectedFilters([]);
      setSelectedWebsites([]);
  
      const websitesResponse = await fetch(`https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/websites?field=${encodeURIComponent(category)}`);

      const websitesData = await websitesResponse.json();
      setUniqueWebsites(websitesData);
  
      const newSubFilters = categorySubFilters[category] || [];
      setCurrentSubFilters(newSubFilters);
  
      fetchArticlesConsideringAllFilters(category);
    }
  };
  
  
  
  const handleFilterSelection = (selectedPrimaryKeywords) => {
    // Map the primary keywords to all their variations
    const allVariations = selectedPrimaryKeywords.flatMap(keyword => keywordVariationsMap[keyword] || []);
    setSelectedFilters(allVariations);
    fetchArticlesConsideringAllFilters(currentCategory, allVariations);
  };
  const handleWebsiteSelect = (websites) => {
    setSelectedWebsites(websites);
    console.log('Selected Websites:', websites); // Log the selected websites
    fetchArticlesConsideringAllFilters(currentCategory, selectedFilters, websites);
};
const fetchAllArticlesWithState = async (state) => {
  try {
    const response = await fetch(`https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/articles?state=${encodeURIComponent(state)}`);
    const data = await response.json();
    setArticles(data);
    setCurrentPage(1);
  } catch (error) {
    console.error('Error fetching all articles with state:', error);
  }
};

const fetchAllArticles = async () => {
  try {
    const response = await fetch('https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/articles');

    const data = await response.json();
    setArticles(data);
    setCurrentPage(1);
  } catch (error) {
    console.error('Error fetching all articles:', error);
  }
};
const fetchArticlesConsideringAllFilters = async (category, subFilters = selectedFilters, websites = selectedWebsites, stateFilter = '') => {
  const queryParameters = new URLSearchParams();
  
  // Include category only if it's not 'All Articles'
  if (category && category !== 'All Articles') {
    queryParameters.append('field', category);
  }

  // Include keyword variations only if it's not 'All Articles'
  if (category !== 'All Articles') {
    subFilters.flatMap(sf => sf).forEach(keyword => {
      queryParameters.append('curedKeyword', keyword);
    });
  }
  
  if (websites && websites.length > 0) {
    queryParameters.append('website', websites.join(','));
  }

  if (searchQuery) {
    queryParameters.append('curedName', searchQuery);
  }

  // Add state filter to the query parameters if provided
  if (stateFilter) {
    queryParameters.append('state', stateFilter);
  }

  try {
    const response = await fetch(`https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/articles?${queryParameters.toString()}`);
    const data = await response.json();
    setArticles(data);
    setCurrentPage(1);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};




const sortedArticles = displayedArticles.sort((a, b) => {
  const dateA = new Date(a.lastmod);
  const dateB = new Date(b.lastmod);
  return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
});

  

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedArticles(articles.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, articles]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  const handleSearch = (query) => {
    setSearchQuery(query);
  };



  const fetchArticlesBySearchQuery = useCallback(async () => {
    if (!searchQuery) return; // Don't fetch if the search query is empty
  
    const queryParameters = new URLSearchParams({
      field: currentCategory,
      curedName: searchQuery
    });
  
    if (selectedFilters.length > 0) {
      queryParameters.append('subFilters', selectedFilters.join(','));
    }
  
    if (selectedWebsites.length > 0) {
      queryParameters.append('websites', selectedWebsites.join(','));
    }
  
    try {
      const response = await fetch(`https://dynamic-llama-c5f80f.netlify.app/.netlify/functions/articles?${queryParameters.toString()}`);

      const data = await response.json();
      setArticles(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }, [currentCategory, selectedFilters, selectedWebsites, searchQuery]); // Dependencies array added here
  

  // UseEffect hook to fetch articles whenever searchQuery changes
  useEffect(() => {
    fetchArticlesBySearchQuery();
  }, [fetchArticlesBySearchQuery]); // Include the function as a dependency

  const primaryKeywords = currentSubFilters.map(subFilterGroup => subFilterGroup[0]);


  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <>
      <ResponsiveAppBar onCategoryChange={onCategoryChange} />

      <Header
        onSearch={handleSearch}
        websites={uniqueWebsites}
        onWebsiteSelect={handleWebsiteSelect}
        onStateFilterChange={handleStateFilterChange}
        onCategoryChange={onCategoryChange}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        setArticleStateFilter={setArticleStateFilter}
      />
      <IconButton variant="contained" onClick={toggleSortOrder} aria-label="sort">
        <SortIcon />
        {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
      </IconButton>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', minWidth: '200px' }}>
          <FilterComponent subFilters={primaryKeywords} onFilterSelect={handleFilterSelection} />
        </div>
        <Grid container spacing={2} style={{ flex: 1, padding: 20 }}>
          {sortedArticles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <LinkCard
                title={article.cured_name || 'No Title'}
                content={article.lastmod ? new Date(article.lastmod).toLocaleDateString() : 'No Date'}
                link={article.loc}
                website={article.website}
                date={new Date(article.lastmod)}
                daysAgo={article.daysAgo}
                id={article._id}
                state={article.state}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div style={paginationContainerStyle}>
        <Pagination
          count={Math.ceil(articles.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
    </>
  );
};

export default App;
