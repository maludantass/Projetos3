import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";
import defaultAvatar from "../images/user.png";

function Perfil({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <div className="perfil-page">
      <div className="profile-wrapper">
        <div className="profile-header-background"></div> 
        
        <div className="profile-content">
          <div className="profile-avatar-section">
            <img
              src={defaultAvatar}
              alt="Avatar Padrão do Usuário"
              className="profile-avatar"
            />
          </div>

          <div className="profile-info-section">
            <p className="profile-username">@{user.username}</p>
            <p className="profile-greeting">
              Olá, {user.username}!
            </p>
            <p className="profile-email">
              Email: {user.email}
            </p>
          </div>

          <div className="profile-actions">
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;