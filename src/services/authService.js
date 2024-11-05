import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

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
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Authentication failed');
    }
  },

  async logout() {
    try {
      const response = await axios.post(`${API_URL}logout/`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      window.location.href = response.data.logoutUrl;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
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