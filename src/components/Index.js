import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Index.css';
import communityImage from '../pictures/community.png';
import individualImage from '../pictures/individual.png';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const { isAuthenticated, user } = await authService.getAuthStatus();
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ error: 'Failed to load user data', loading: false });
    }
  }

  handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <Navigate to="/login" />;

    return (
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="user-profile">
            <div className="profile-image">
              <img src={user.picture} alt={user.name} />
            </div>
            <h3 className="user-name">{user.name}</h3>
          </div>
          
          <nav className="sidebar-nav">
            <button className="nav-button">
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </button>
            <button className="nav-button" onClick={this.handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
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
              <button className="action-button">Start Community Learning</button>
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
              <button className="action-button">Start Individual Learning</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;