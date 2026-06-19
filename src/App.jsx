import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Calculator from './pages/Calculator';
import AdminLeads from './pages/AdminLeads';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
      </Routes>
    </Router>
  );
}

export default App;
