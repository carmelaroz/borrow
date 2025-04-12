import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useAuthContext } from '../context/AuthContext';

function Dashboard() {
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();
    const handleOffer = () => navigate('/upload');
    const { dispatch } = useAuthContext();

    const handleLogout = () => {
        // Remove the token or user data
        localStorage.removeItem('token');
        //update the auth context
        dispatch({ type: "LOGOUT" });
        // Navigate to login
        navigate('/account');
    };

    return (
        <div className="dashboard-container">
        <button className="offer-button" onClick={handleOffer}>Offer item to rent</button>
        <button className="offer-button">Offer service</button>
        <button >My items</button>
        <button >My services</button>
        <button >Edit profile</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;