import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../component/Login';
import Dashboard from "../component/Test"
import Chart from "../component/Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Chart" element={<Chart />} />
      </Routes>
    </Router>
  );
}

export default App;
