import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import UploadForm from './components/uploadForm.jsx';
import MyItems from './components/MyItems/MyItems.jsx';
import MessagesPage from './pages/Messages';
import ServiceForm from './components/ServiceForm';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { user } = useAuthContext();
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
                <Route path="/account" element={user ? <Navigate to="/dashboard" /> : <Account />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/upload" element={<UploadForm />} />
                <Route path="/my-items" element={<MyItems />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/offer-service" element={<ServiceForm />} />
             </Route>
            </Routes>
          </div>
         </ErrorBoundary>
        </Router>
      </LoadScript>
  );
}

export default App;