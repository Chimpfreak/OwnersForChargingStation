import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContent'; // Adjust the path according to your project structure

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth(); // Use the useAuth hook to access isAuthenticated and logout

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
        {isAuthenticated && (
          <button className="btn btn-outline-danger my-2 my-sm-0" type="button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
