import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/Personal/index.css';

const CourseView = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 8
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadUserData = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchCourses = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${state.user?.id}/enrolled-courses?page=${page}&limit=${pagination.itemsPerPage}`);
      const data = await response.json();
      
      setCourses(data.courses);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(data.total / pagination.itemsPerPage)
      }));
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.itemsPerPage, state.user?.id]);

  useEffect(() => {
    fetchCourses(pagination.currentPage);
  }, [fetchCourses, pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <nav className="sidebar-nav">
          <div className="logo-container">
            <div className="skillk-logo">
              <img src="/logo1.jpg" alt="Company Logo" className="logo-image" />
              <span>Skill Realistic</span>
            </div>
          </div>
          <div className="nav-items">
            <button className="nav-item" onClick={() => navigate('/personal')}>
              <i className="fas fa-th"></i>
              <span>Dashboard</span>
            </button>
            <button className="nav-item logout-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <header className="content-header">
          <div className="header-date">
            <h2>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h2>
            <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
          </button>
          <div className="user-profile">
            <img 
              src={state.user?.profileImage || '/default-profile.jpg'} 
              alt={state.user?.name || 'Profile'} 
              className="profile-image" 
            />
            <span className="user-name">{state.user?.name}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <h1>My Enrolled Courses</h1>
          
          {isLoading ? (
            <div className="loading-spinner">Loading your courses...</div>
          ) : (
            <>
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course.id} className="course-card">
                    <div className="course-image">
                      <img src={course.imageUrl} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <div className="course-level">{course.level}</div>
                      <h3 className="course-title">{course.title}</h3>
                      <div className="course-stats">
                        <span><i className="fas fa-clock"></i> {course.progress || '0'}% Complete</span>
                        <button 
                          className="continue-btn"
                          onClick={() => navigate(`/course/${course.id}/learn`)}
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="pagination-btn"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`pagination-btn ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="pagination-btn"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
