import React, { useState } from 'react';
import NavbarTask from "../components/NavbarTask";
import Hero from "../components/hero";
import Filter from "../components/Filter";
import Menu from "../components/menu";
import "../App.css";

const FindTask = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category:  '',
    budgetMin: '',
    budgetMax: '',
    sort:      'newest',
  });

  return (
    <div className="tasks-page">
      <NavbarTask />
      <Hero onSearch={setSearchQuery} />
      <div className="main-content-wrapper">
        <div className="container">
          <Filter filters={filters} setFilters={setFilters} />
          <div className="menu-section">
            <Menu searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTask;