import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Charging Stations</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-station">Add Station</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/stationslist">Station List</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
