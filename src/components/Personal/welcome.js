import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/Personal/welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const loadUserData = useCallback(async () => {
    try {
      const { isAuthenticated, user } = await authService.getAuthStatus();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: 'Failed to load user data' });
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <nav className="sidebar-nav">
          <div className="logo-container">
            <div className="skillk-logo">
              <img src="/logo1.jpg" alt="Company Logo" className="logo-image" />
              <span>Skill Realistic</span>
            </div>
          </div>
          <div className="nav-items">
            <button className="nav-item active">
              <i className="fas fa-th"></i>
              <span>Dashboard</span>
            </button>
            <button className="nav-item" onClick={() => navigate('/courses')}>
              <i className="fas fa-book"></i>
              <span>Courses</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-comment"></i>
              <span>Messages</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-credit-card"></i>
              <span>Payments</span>
            </button>
            <div className="bottom-nav">
              <button className="nav-item">
                <i className="fas fa-question-circle"></i>
                <span>Support</span>
              </button>
              <button className="nav-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button>
              <button className="nav-item logout-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <header className="content-header">
          <div className="header-date">
            <h2>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h2>
            <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
          </button>
          <div className="user-profile">
            <img 
              src={state.user?.profileImage || '/default-profile.jpg'} 
              alt={state.user?.name || 'Profile'} 
              className="profile-image" 
            />
            <span className="user-name">{state.user?.name}</span>
          </div>
        </header>

        <div className="welcome-content">
          <div className="welcome-header">
            <h1>Welcome, {state.user?.name}! 👋</h1>
            <p>Let's start your learning journey</p>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <i className="fas fa-book-open"></i>
              <div className="stat-info">
                <h3>0</h3>
                <p>Courses in Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-certificate"></i>
              <div className="stat-info">
                <h3>0</h3>
                <p>Certificates Earned</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-clock"></i>
              <div className="stat-info">
                <h3>0h</h3>
                <p>Learning Hours</p>
              </div>
            </div>
          </div>

          <div className="getting-started">
            <h2>Getting Started</h2>
            <div className="action-cards">
              <div className="action-card" onClick={() => navigate('/courses')}>
                <i className="fas fa-compass"></i>
                <h3>Explore Courses</h3>
                <p>Browse our collection of courses</p>
              </div>
              <div className="action-card">
                <i className="fas fa-user-edit"></i>
                <h3>Complete Profile</h3>
                <p>Add your interests and goals</p>
              </div>
              <div className="action-card">
                <i className="fas fa-users"></i>
                <h3>Join Community</h3>
                <p>Connect with fellow learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
