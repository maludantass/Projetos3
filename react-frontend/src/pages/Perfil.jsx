import React from "react";
import { useNavigate } from "react-router-dom";

function Perfil({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <div className="perfil-page">
      <h1>Perfil</h1>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Perfil;