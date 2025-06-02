import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="search-bar">
      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder="Pesquise" />
      </div>
      <button className="filter-btn" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faFilter} />
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <a href="#">Posts</a>
          <a href="#">Usuários</a>
          <a href="#">Mídia</a>
        </div>
      )}
    </section>
  );
};

export default SearchBar;