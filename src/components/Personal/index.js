import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import courseService from '../../services/courseService';
import '../../styles/Personal/index.css';

const PersonalTraining = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  });
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

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

  const loadCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      const response = await courseService.getTopCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadCourses();
  }, [loadUserData, loadCourses]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (state.loading || coursesLoading) {
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
            <button className="nav-item active">
              <i className="fas fa-th"></i>
              <span>Dashboard</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-book"></i>
              <span>Courses</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-comment"></i>
              <span>Messages</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </button>
            <button className="nav-item">
              <i className="fas fa-credit-card"></i>
              <span>Payments</span>
            </button>
            <div className="bottom-nav">
              <button className="nav-item">
                <i className="fas fa-question-circle"></i>
                <span>Support</span>
              </button>
              <button className="nav-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button>
              <button className="nav-item logout-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
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
          <div className="courses-section">
            <div className="section-header">
              <h2>Top courses you may like</h2>
              <button>View all</button>
            </div>
            
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-image">
                    <img src={course.image_url} alt={course.title} />
                    <button className="bookmark-btn">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                  
                  <div className="course-info">
                    <div className="course-level">{course.level}</div>
                    <h3 className="course-title">{course.title}</h3>
                    
                    <div className="course-stats">
                      <span className="students">
                        <i className="fas fa-user"></i> {course.student_count}
                      </span>
                      <span className="rating">
                        <i className="fas fa-star"></i> {course.rating}
                      </span>
                    </div>
                    
                    <div className="instructor">
                      <img src={course.instructor.image_url} alt={course.instructor.name} />
                      <span>{course.instructor.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalTraining;
