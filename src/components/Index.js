import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Index.css';
import communityImage from '../pictures/community.png';
import individualImage from '../pictures/individual.png';

const Index = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
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
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const { user, loading, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="user-profile">
          <div className="profile-image">
            <img src={user.picture} alt={user.name} />
          </div>
          <h3 className="user-name">{user.name}</h3>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-button" onClick={() => navigate('/profile')}>
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </button>
          <button className="nav-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="main-content">
        <h1 className="page-title">Choose Your Learning Path</h1>
        
        <div className="learning-options">
          <div className="learning-card community">
            <img 
              src={communityImage} 
              alt="Community Learning" 
              className="card-image"
            />
            <h2 className="text-black">Community Learning</h2>
            <p>
              Learn together with peers in a collaborative environment. Share knowledge,
              participate in group discussions.
            </p>
            <button 
              className="action-button" 
              onClick={() => navigate('/community')}
            >
              Start Community Learning
            </button>
          </div>

          <div className="learning-card individual">
            <img 
              src={individualImage} 
              alt="Individual Learning" 
              className="card-image"
            />
            <h2>Individual Learning</h2>
            <p>
              Learn at your own pace with personalized content and support. Set your own
              schedule and track your individual progress.
            </p>
           
<button 
  className="action-button"
  onClick={() => navigate('/individual')}
>
  Start Individual Learning
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;