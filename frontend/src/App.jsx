import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import React from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Services from './pages/Services';
import Property from './pages/Property';
import Account from './pages/account.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import './styles/global.css';

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAJFC3lneX3m6lWIhsGanx1SCSTbOi4luA">
      <Router>
        <ErrorBoundary>
        <div className="app-container">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Search />} />
              <Route path="/services" element={<Services />} />
              <Route path="/property/:id" element={<Property />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
          </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </LoadScript>
  );
}

export default App;