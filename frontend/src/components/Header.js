import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Books Management System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Public View
              </Link>
            </li>
            {admin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/authors">
                    Authors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/books">
                    Books
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {admin ? (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/login">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;