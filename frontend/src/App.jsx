import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Rentals from './pages/Rentals';
import Services from './pages/Services';
import Property from './pages/Property';
import ErrorBoundary from './ErrorBoundary.jsx';
import './styles.css';
import React from 'react';

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAJFC3lneX3m6lWIhsGanx1SCSTbOi4luA">
      <Router>
        <div className="app">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Search />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/services" element={<Services />} />
            <Route path="/property/:id" element={<Property />} />
          </Routes>
        </div>
      </Router>
    </LoadScript>
  );
}

export default App;