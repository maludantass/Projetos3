import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/sobre">Sobre</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/feed">Feed</Link></li>
            <li><Link to="/foruns">Fóruns</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/ajuda">Ajuda</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/ajuda">Ajuda</Link></li>
            <li><Link to="/auth">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

