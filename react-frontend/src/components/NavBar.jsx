import { Link } from "react-router-dom";
import "./Navbar.css";
import profileUser from '../images/profile-user.png';
import logo from "../images/logo.png";


const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
  <div className="navbar-left">
      <img src={logo} alt="Logo" className="logo-image" />
  </div>
      <div className="navbar-center">
        <ul>
          <li><Link to="/sobre">Sobre</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/feed">Feed</Link></li>
              <li><Link to="/foruns">Fóruns</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
              <li><Link to="/ajuda">Ajuda</Link></li>
              <li><Link to="/biblioteca">Biblioteca</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/ajuda">Ajuda</Link></li>
              <li><Link to="/auth">Login</Link></li>
            </>
          )}
        </ul>
      </div>
      {isLoggedIn && (
         <div className="navbar-right">
         <Link to="/perfil">
           <img src={profileUser} alt="Perfil" className="profile-image" />
         </Link>
       </div>
      )}
    </nav>
  );
};

export default Navbar;
