import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
