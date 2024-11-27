import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ProfileService {
    async getProfile() {
        try {
            const response = await axios.get(`${API_URL}/auth/profile/`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateProfile(profileData) {
        try {
            const response = await axios.put(`${API_URL}/auth/profile/update/`, profileData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            return new Error(error.response.data.error || 'An error occurred');
        } else if (error.request) {
            return new Error('No response from server');
        } else {
            return new Error('Error setting up request');
        }
    }
}

export default new ProfileService();
