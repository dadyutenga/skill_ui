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
      error: null,
      signInForm: {
        email: '',
        password: ''
      },
      signUpForm: {
        name: '',
        email: '',
        password: ''
      }
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
        user: null,
        signInForm: { email: '', password: '' },
        signUpForm: { name: '', email: '', password: '' }
      });
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  handleSignInChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      signInForm: {
        ...prevState.signInForm,
        [name]: value
      }
    }));
  };

  handleSignUpChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      signUpForm: {
        ...prevState.signUpForm,
        [name]: value
      }
    }));
  };

  toggleSignInSignUp = () => {
    this.setState(prevState => ({
      isSignIn: !prevState.isSignIn,
      signInForm: { email: '', password: '' },
      signUpForm: { name: '', email: '', password: '' }
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
              <div className="social-icons">
                <button type="button" className="social-btn" onClick={this.handleLogin}>
                  <img src="/icons/google.svg" alt="Google" />
                </button>
              </div>
              <p className="divider">or use your email account:</p>
              <div className="input-field">
                <img src="/icons/email.svg" alt="" className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.signInForm.email}
                  onChange={this.handleSignInChange}
                />
              </div>
              <div className="input-field">
                <img src="/icons/lock.svg" alt="" className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.signInForm.password}
                  onChange={this.handleSignInChange}
                />
              </div>
              <a href="#" className="forgot-password">Forgot your password?</a>
              <button type="submit" className="btn">SIGN IN</button>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form" onSubmit={this.handleLogin}>
              <h2>Create Account</h2>
              <div className="social-icons">
                <button type="button" className="social-btn" onClick={this.handleLogin}>
                  <img src="/icons/google.svg" alt="Google" />
                </button>
              </div>
              <p className="divider">or use your email for registration:</p>
              <div className="input-field">
                <img src="/icons/user.svg" alt="" className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.signUpForm.name}
                  onChange={this.handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src="/icons/email.svg" alt="" className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.signUpForm.email}
                  onChange={this.handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src="/icons/lock.svg" alt="" className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.signUpForm.password}
                  onChange={this.handleSignUpChange}
                />
              </div>
              <button type="submit" className="btn">SIGN UP</button>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Sign up and discover more with us!</p>
              <button className="btn transparent" onClick={this.toggleSignInSignUp}>SIGN UP</button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>If you already have an account, sign in here.</p>
              <button className="btn transparent" onClick={this.toggleSignInSignUp}>SIGN IN</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
