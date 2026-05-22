import React from 'react';
import "../styles/filter.css";

const Filter = ({ filters = {}, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (setFilters) {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="filter-container">
      <h3>Filter by</h3>

      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category || ''} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="web_development">Web Development</option>
          <option value="mobile_development">Mobile Development</option>
          <option value="design">Design</option>
          <option value="writing">Writing</option>
          <option value="marketing">Marketing</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="data">Data</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Budget Min ($)</label>
        <input type="number" name="budgetMin" value={filters.budgetMin || ''} onChange={handleChange} placeholder="e.g. 100" min="0" />
      </div>

      <div className="filter-group">
        <label>Budget Max ($)</label>
        <input type="number" name="budgetMax" value={filters.budgetMax || ''} onChange={handleChange} placeholder="e.g. 1000" min="0" />
      </div>

      <div className="filter-group">
        <label>Sort</label>
        <select name="sort" value={filters.sort || 'newest'} onChange={handleChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;