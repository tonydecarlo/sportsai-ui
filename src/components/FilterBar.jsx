import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, totalCount, filteredCount }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="confidence-filter">Min Confidence:</label>
        <select 
          id="confidence-filter"
          value={filters.confidence} 
          onChange={(e) => onFilterChange({ confidence: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Levels</option>
          <option value="80">80%+ (High)</option>
          <option value="60">60%+ (Medium)</option>
          <option value="40">40%+ (Low)</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="risk-filter">Risk Level:</label>
        <select 
          id="risk-filter"
          value={filters.risk} 
          onChange={(e) => onFilterChange({ risk: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
      </div>

      <div className="filter-group search-group">
        <label htmlFor="search-filter">Search:</label>
        <input 
          id="search-filter"
          type="text" 
          placeholder="Search teams or analysis..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="search-input"
        />
      </div>

      <div className="results-count">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> predictions
      </div>
    </div>
  );
};

export default FilterBar;


