import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../feed.css';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="search-bar">
      <div className="search-box">
        <FontAwesomeIcon icon="search" className="search-icon" />
        <input type="text" placeholder="Pesquise" />
      </div>
      <div className="dropdown">
        <button className="dropdown-btn" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faCog} />{' '}
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <a href="#">Posts</a>
            <a href="#">Usuários</a>
            <a href="#">Mídia</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchBar;
