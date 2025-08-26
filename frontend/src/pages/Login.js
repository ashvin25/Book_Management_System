import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../stores/slices/authSlice';
import Spinner from '../components/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Error alert will be shown automatically
    }

    if (isSuccess || admin) {
      navigate('/admin/authors');
    }
  }, [admin, isError, isSuccess, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const adminData = {
      email,
      password,
    };

    dispatch(login(adminData));
  };

  if (isLoading) {
    return (
      <div className="main-content d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="main-content d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card glass-effect fade-in">
              <div className="card-header text-center">
                <h2 className="mb-0" style={{ color: "#efe7e5ff" }}>
                  <i className="fas fa-lock me-2"></i>
                  Admin Portal
                </h2>
                <p className="mt-2">Sign in to manage your books</p>
              </div>
              
              <div className="card-body p-5">
                {isError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {message}
                  </div>
                )}
                
                {isSuccess && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    Login successful! Welcome back.
                  </div>
                )}
                
                <form onSubmit={onSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={email}
                      placeholder="Enter your email address"
                      onChange={onChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="mb-4 position-relative">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="fas fa-key me-2"></i>
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={onChange}
                      required
                      autoComplete="current-password"
                    />
                    <button 
                      type="button" 
                      className="btn btn-light position-absolute" 
                      style={{ right: '10px', top: '38px' }} 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg fw-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Secure access to your books management system
                  </small>
                </div>
              </div>
              
              <div className="card-footer text-center py-3">
                <small className="text-muted">
                  &copy; 2024 Books Management System. All rights reserved.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
