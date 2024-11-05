import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

class Dashboard extends React.Component {
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
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <Navigate to="/login" />;

    return (
      <div className="dashboard">
        <nav className="dashboard-nav">
          <h1>Welcome, {user.name}</h1>
          <button onClick={this.handleLogout}>Logout</button>
        </nav>
        <div className="dashboard-content">
          <div className="user-profile">
            <img src={user.picture} alt={user.name} className="profile-picture" />
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
          {/* Add more dashboard content here */}
        </div>
      </div>
    );
  }
}

export default Dashboard; 