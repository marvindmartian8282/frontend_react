import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'; 
import logo from '../images/CLogo8.png'; 

const Header = ({ userName, role, onLogout }) => {
  const [navOpen, setNavOpen] = useState(false); // State to handle the navigation menu toggle

  const toggleNav = () => {
    setNavOpen(!navOpen); // Toggle the navigation menu open/close
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Bow Course</h1>
        <img src={logo} alt="Logo" className="logo-image" /> {/* Display logo */}
      </div>
      <div className="menu-icon" onClick={toggleNav}> {/* Menu icon for mobile view */}
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
      </div>
      <nav className={`nav ${navOpen ? 'open' : ''}`}> {/* Toggle the navigation menu based on state */}
        <ul className="nav-links">
          {!userName ? ( // If no user is logged in, show Home and Login links
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : ( // If user is logged in, show Dashboard and role-based links
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              {role === 'student' && ( // Student-specific links
                <li>
                  Student Portal <span className="arrow">▼</span>
                  <ul className="sub-menu">
                    <Link to="/my-profile">Profile</Link>
                    <Link to="/contact-form">Contact Form</Link>
                    <Link to="/register-course">Register Courses</Link>
                    <Link to="/my-courses">My Courses</Link>
                  </ul>
                </li>
              )}
              {role === 'admin' && ( // Admin-specific links
                <li>
                  Admin Portal <span className="arrow">▼</span>
                  <ul className="sub-menu">
                    <Link to="/admin-courses">Courses</Link>
                    <Link to="/student-list">Student List</Link>
                    <Link to="/submitted-forms">Submitted Forms</Link>
                  </ul>
                </li>
              )}
              <li><Link to="/" onClick={onLogout}>Logout</Link></li> {/* Logout link */}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
