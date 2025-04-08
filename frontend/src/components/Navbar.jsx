import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Borrow</h1>
      <ul>
        <li><Link to="/">בית</Link></li>
        <li><Link to="/properties">נכסים</Link></li>
        <li><Link to="/rentals">השכרות</Link></li>
        <li><Link to="/services">שירותים</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;