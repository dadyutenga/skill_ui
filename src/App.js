import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Index from './components/Index';
import Profile from './components/profile';
import CommunityIndex from './components/community/index';
import PersonalTraining from './components/Individual/p1';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<CommunityIndex />} />
        <Route path="/individual" element={<PersonalTraining />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
