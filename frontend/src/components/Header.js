import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../stores/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-title">
        {admin ? 'Admin Dashboard' : 'Books Management System'}
      </div>
      
      <div className="header-actions">
        {admin ? (
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        ) : (
          <a href="/admin/login" className="btn btn-primary">
            <i className="fas fa-lock me-2"></i>
            Admin Login
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
