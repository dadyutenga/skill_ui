import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';
const AUTH0_DOMAIN = 'dev-no8x6gb2gblh1mz7.us.auth0.com';
const CLIENT_ID = '8Cgj0dXMl0VwCUQV9i3IhbzJKJD2RXd7';

// Configure axios defaults
axios.defaults.withCredentials = true;

const authService = {
  async login() {
    try {
      const response = await axios.get(`${API_URL}login/`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      // Check if authUrl exists in the response
      if (!response.data.authUrl) {
        throw new Error('No auth URL received from server');
      }
      
      return response.data.authUrl;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      // First, call your backend logout endpoint
      await axios.post(`${API_URL}logout/`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();

      // Construct Auth0 logout URL with returnTo parameter
      const returnTo = encodeURIComponent('http://localhost:3000/login');
      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${CLIENT_ID}&returnTo=${returnTo}`;
      
      // Redirect to Auth0 logout URL
      window.location.href = logoutUrl;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getAuthStatus() {
    try {
      const response = await axios.get(`${API_URL}auth-status/`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Auth status error:', error);
      return { isAuthenticated: false, user: null };
    }
  }
};

export default authService;