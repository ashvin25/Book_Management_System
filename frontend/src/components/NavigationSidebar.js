import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoImg from '../assets/logo-img.png';

const NavigationSidebar = () => {
  const location = useLocation();
  const { admin } = useSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn d-lg-none"
        onClick={toggleMobileMenu}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <i className={`fas ${isMobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img 
            src={logoImg} 
            alt="Books ERP Logo" 
            className="sidebar-logo"
          />
          {/* <h2 className="sidebar-title">Books ERP</h2> */}
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
            to="/"
            onClick={() => setIsMobileOpen(false)}
          >
            <i className="fas fa-book sidebar-icon"></i>
            Public View
          </Link>
          
          {admin && (
            <>
              <Link 
                className={`sidebar-link ${isActive('/admin/authors') ? 'active' : ''}`}
                to="/admin/authors"
                onClick={() => setIsMobileOpen(false)}
              >
                <i className="fas fa-user-pen sidebar-icon"></i>
                Authors
              </Link>
              <Link 
                className={`sidebar-link ${isActive('/admin/books') ? 'active' : ''}`}
                to="/admin/books"
                onClick={() => setIsMobileOpen(false)}
              >
                <i className="fas fa-book-open sidebar-icon"></i>
                Books
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'block'
          }}
        />
      )}
    </>
  );
};

export default NavigationSidebar;
