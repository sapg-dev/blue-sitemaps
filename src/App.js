import React, { useEffect, useState, useCallback  } from 'react';
import LinkCard from './LinkCard';
import Header from './header';
import FilterComponent from './FilterComponent';
import Pagination from '@mui/material/Pagination';
import ResponsiveAppBar from './menu';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [uniqueWebsites, setUniqueWebsites] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSubFilters, setCurrentSubFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('BI');

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



  

const keywordVariationsMap = {};
Object.entries(categorySubFilters).forEach(([category, subFilters]) => {
  subFilters.forEach(subFilterArray => {
    keywordVariationsMap[subFilterArray[0]] = subFilterArray;
  });
});

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/articles');
      const data = await response.json();
      setArticles(data);
      setUniqueWebsites([...new Set(data.map(article => article.website))].filter(Boolean));
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const onCategoryChange = async (category) => {
    setCurrentCategory(category);
    setSelectedFilters([]);
    setSelectedWebsites([]);

    const websitesResponse = await fetch(`http://localhost:5000/websites?field=${encodeURIComponent(category)}`);
    const websitesData = await websitesResponse.json();
    setUniqueWebsites(websitesData);

    const newSubFilters = categorySubFilters[category] || [];
    setCurrentSubFilters(newSubFilters);

    fetchArticlesConsideringAllFilters(category);
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
  
const fetchArticlesConsideringAllFilters = async (category, subFilters = selectedFilters, websites = selectedWebsites) => {
  const queryParameters = new URLSearchParams();
  
  if (category || currentCategory) {
    queryParameters.append('field', category || currentCategory);
  }

  // Flatten the subfilter array and add each keyword as a separate query parameter
  subFilters.flatMap(sf => sf).forEach(keyword => {
    queryParameters.append('curedKeyword', keyword);
  });
  
  if (websites && websites.length > 0) {
    queryParameters.append('website', websites.join(','));
  }

  if (searchQuery) {
    queryParameters.append('curedName', searchQuery);
  }
  
  try {
    const response = await fetch(`http://localhost:5000/articles?${queryParameters.toString()}`);
    const data = await response.json();
    setArticles(data);
    setCurrentPage(1);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

  

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
      const response = await fetch(`http://localhost:5000/articles?${queryParameters.toString()}`);
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
  
  const containerStyle = {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  };
  const primaryKeywords = currentSubFilters.map(subFilterGroup => subFilterGroup[0]);


  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <>
      <ResponsiveAppBar onCategoryChange={onCategoryChange} />
      <Header onSearch={handleSearch} websites={uniqueWebsites} onWebsiteSelect={handleWebsiteSelect} />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', minWidth: '200px' }}>
          <FilterComponent subFilters={primaryKeywords} onFilterSelect={handleFilterSelection} />
        </div>
        <div style={containerStyle}>
          {displayedArticles.map((article, index) => (
            <LinkCard
              key={index}
              title={article.cured_name || 'No Title'}
              content={article.lastmod ? new Date(article.lastmod).toLocaleDateString() : 'No Date'}
              link={article.loc}
              website={article.website}
              date={new Date(article.lastmod)}
            />
          ))}
        </div>
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
