import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const courseService = {
  getTopCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/top/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add other course-related API calls here
};

export default courseService;
