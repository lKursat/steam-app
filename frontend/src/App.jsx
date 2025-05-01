import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;

