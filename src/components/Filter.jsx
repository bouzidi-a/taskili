import React from 'react';
import "../styles/filter.css"; // تأكدي بلي هاد الملف كاين فـ styles

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
        <label>Price</label>
        <input type="text" name="price" value={filters.price || ''} onChange={handleChange} placeholder="e.g. 3000" />
      </div>

      <div className="filter-group">
        <label>City</label>
        <input type="text" name="city" value={filters.city || ''} onChange={handleChange} placeholder="e.g. Alger" />
      </div>

      <div className="filter-group">
        <label>Commune</label>
        <input type="text" name="commune" value={filters.commune || ''} onChange={handleChange} placeholder="e.g. Hydra" />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category || ''} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="Education">Education</option>
          <option value="Health Care">Health Care</option>
          <option value="House">House</option>
          <option value="Tech">Tech</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Date</label>
        <input type="date" name="date" value={filters.date || ''} onChange={handleChange} />
      </div>
    </div>
  );
};

export default Filter;