import React from 'react';
import '../styles/Hero.css';

const Hero = ({ onSearch }) => {
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="hero-section">
      <h1>Find a Task</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="What are you looking for ?" 
          onChange={handleSearchChange} 
        />
      </div>
    </div>
  );
};
export default Hero;