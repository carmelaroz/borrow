import React from 'react';
import logo from '../assets/logoGiveIt.jpg';

const Header = () => {
    return (
    <header className="header">
        <img src={logo} alt="GiveIt Logo" className="header-logo" />
        <h1>RENT ANYTHING</h1>
    </header>
    );
};

export default Header;