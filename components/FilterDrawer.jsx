import React from 'react';

const FilterDrawer = ({ filters, selectedFilters, setSelectedFilters }) => {
  if (!filters || Object.keys(filters).length === 0) {
    return (
      <>
        <div className="filter-header">
          <h2>Filters</h2>
        </div>
        <div className="filter-content">
          <p>Loading filters...</p>
        </div>
      </>
    );
  }
  const handleFilterChange = (category, option, checked) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [category]: checked
        ? [...prevFilters[category], option]
        : prevFilters[category].filter(item => item !== option),
    }));
  };

  const handleSelectAll = (category, options, checked) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [category]: checked ? options : [],
    }));
  };

  return (
    <>
      <div className="filter-header">
        <h2>Filters</h2>
      </div>

      <div className="filter-content">
        {Object.entries(filters).map(([category, options]) => (
          <div key={category} className="filter-section">
            <h3 className="filter-category-title">{category}</h3>

            <label className="filter-option select-all">
              <input
                type="checkbox"
                checked={selectedFilters[category]?.length === options.length}
                onChange={e => handleSelectAll(category, options, e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="option-text">Select All</span>
            </label>

            {options.map(option => (
              <label key={option} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters[category]?.includes(option)}
                  onChange={e => handleFilterChange(category, option, e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default FilterDrawer;
