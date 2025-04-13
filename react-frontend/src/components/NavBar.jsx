import { Link } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/sobre">Sobre</Link></li>
        <li><Link to="/feed">Feed</Link></li>
        <li><Link to="/foruns">Fóruns</Link></li>
        <li><Link to="/eventos">Eventos</Link></li>
        <li><Link to="/ajuda">Ajuda</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
