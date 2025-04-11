import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';


function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-item" onClick={() => handleNavigation('/')}>
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Home</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/services')}>
        <span className="nav-icon">🔧</span>
        <span className="nav-text">Services</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/messages')}>
        <span className="nav-icon">💬</span>
        <span className="nav-text">Messages</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/my-items')}>
        <span className="nav-icon">📋</span>
        <span className="nav-text">My Items</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/account')}>
        <span className="nav-icon">👤</span>
        <span className="nav-text">Account</span>
      </div>
    </nav>
  );
}

export default Navbar;