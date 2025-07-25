import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Index from './components/Index';
import Profile from './components/profile';
import CommunityIndex from './components/community/index';
import PersonalTraining from './components/Personal/index';
import CourseView from './components/Personal/course';
import Welcome from './components/Personal/welcome';
import Platform from './components/Personal/platform';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<CommunityIndex />} />
        <Route path="/Personal" element={<PersonalTraining />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/courses" element={<CourseView />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/platform" element={<Platform />} />
      </Routes>
    </Router>
  );
}

export default App;
