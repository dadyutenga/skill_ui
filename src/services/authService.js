import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

const authService = {
  async login() {
    try {
      const response = await axios.get(`${API_URL}login/`, { withCredentials: true });
      window.location.href = response.data.authUrl;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  },

  async logout() {
    try {
      const response = await axios.post(`${API_URL}logout/`, {}, { withCredentials: true });
      window.location.href = response.data.logoutUrl;
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  async getAuthStatus() {
    try {
      const response = await axios.get(`${API_URL}auth-status/`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }
};

export default authService;