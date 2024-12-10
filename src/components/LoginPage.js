import React from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import authService from '../services/authService';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: true,
      isAuthenticated: false,
      user: null,
      error: null
    };
  }

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = async () => {
    try {
      const { isAuthenticated, user } = await authService.getAuthStatus();
      this.setState({ isAuthenticated, user });
      
      if (isAuthenticated) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.setState({ error: 'Failed to check authentication status' });
    }
  };

  handleLogin = async (e) => {
    e.preventDefault();
    try {
      const authUrl = await authService.login();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error('No authentication URL received');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: 'Failed to initiate login' });
    }
  };

  handleLogout = async () => {
    try {
      await authService.logout();
      this.setState({
        isAuthenticated: false,
        user: null
      });
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  toggleSignInSignUp = () => {
    this.setState(prevState => ({
      isSignIn: !prevState.isSignIn
    }));
  };

  render() {
    const { isAuthenticated, error } = this.state;

    if (isAuthenticated) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <div className={`container ${this.state.isSignIn ? '' : 'sign-up-mode'}`}>
        {error && <div className="error-message">{error}</div>}
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form className="sign-in-form" onSubmit={this.handleLogin}>
              <h2>Sign in to Skills Realistic</h2>
              <button type="submit" className="btn">SIGN IN </button>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form" onSubmit={this.handleLogin}>
              <h2>Create Account</h2>
              <button type="submit" className="btn">SIGN UP</button>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Enter your personal details and start your journey with us</p>
              <button 
                className="btn transparent" 
                onClick={() => this.setState({ isSignIn: false })}
              >
                Sign Up
              </button>
            </div>
            <img src="/img/log.svg" className="image" alt="" />
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>To keep connected with us please login with your personal info</p>
              <button 
                className="btn transparent" 
                onClick={() => this.setState({ isSignIn: true })}
              >
                Sign In
              </button>
            </div>
            <img src="/img/register.svg" className="image" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
