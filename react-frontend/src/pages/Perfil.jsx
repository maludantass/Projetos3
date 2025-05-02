import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

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
      <div className="perfil-card">
        <h1>Perfil</h1>
          <p><strong>Usuário:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default Perfil;
