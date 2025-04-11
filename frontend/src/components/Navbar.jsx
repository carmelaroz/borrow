import { useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';
import { GoHome } from "react-icons/go";
import { GoTools } from "react-icons/go";
import { BsViewList } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineMessage } from "react-icons/ai";


function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-item" onClick={() => handleNavigation('/')}>
        <GoHome className="nav-icon"/>
        <span className="nav-text">Home</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/services')}>
        <GoTools className="nav-icon"/>
        <span className="nav-text">Services</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/messages')}>
      <AiOutlineMessage className="nav-icon"/>
        <span className="nav-text">Messages</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/my-items')}>
        <BsViewList className="nav-icon"/>
        <span className="nav-text">My Items</span>
      </div>
      <div className="nav-item" onClick={() => handleNavigation('/account')}>
        <VscAccount className="nav-icon"/>
        <span className="nav-text">Account</span>
      </div>
    </nav>
  );
}

export default Navbar;