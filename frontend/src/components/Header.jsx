import React from 'react';
import logo from '../assets/logoGiveIt.jpg';
import { useAuthContext } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuthContext();
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center p-4">
            {/* Logo & Greeting */}
            <div className="flex flex-col items-center sm:items-start">
                <img src={logo} alt="GiveIt Logo" className="w-32 h-auto mb-1" />
                {user && (
                    <div className="text-2xl text-gray-700 font-semibold mt-2 ml-2">
                        Hello {user.user?.firstName || user.firstName || 'User'}! 👋
                    </div>
                )}
            </div>

            {/* Centered Title */}
            <h1 className="text-3xl font-bold text-center mt-4 sm:mt-0">
                nice to see you again:)
            </h1>
        </header>
    );
};

export default Header;