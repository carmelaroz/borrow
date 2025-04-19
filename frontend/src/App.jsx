import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Layout from './components/Layout';
import Account from './pages/account.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import './styles/global.css';
import UploadForm from './components/uploadForm.jsx';
import MyItems from './components/MyItems/MyItems.jsx';
import MessagesPage from './pages/Messages';
import ServiceForm from './components/ServiceForm';
import RentalsMapPage from './components/HomePage/RentalsMapPage.jsx';
import ServicesMapPage from './components/HomePage/ServicesMapPage.jsx';
import { useAuthContext } from './context/AuthContext';
import GoogleMapsLoader from './components/GoogleMapsLoader.jsx';

function App() {
  const { user } = useAuthContext();
  return (
    <GoogleMapsLoader>
      <Router>
        <ErrorBoundary>
        <div className="app-container">
          <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<RentalsMapPage />} />
                <Route path="/services" element={<ServicesMapPage />} />
                <Route path="/account" element={user ? <Navigate to="/dashboard" /> : <Account />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/upload" element={<UploadForm />} />
                <Route path="/my-items" element={<MyItems />} />
                {/* <Route path="/messages" element={<MessagesPage />} /> */}
                <Route path="/offer-service" element={<ServiceForm />} />
             </Route>
            </Routes>
          </div>
         </ErrorBoundary>
        </Router>
        </GoogleMapsLoader>
  );
}

export default App;