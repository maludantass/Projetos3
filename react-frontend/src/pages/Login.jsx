import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aqui seria o axios.post pro login real (backend precisa do endpoint de login)
      // Vamos simular que o login deu certo por enquanto:
      console.log("Login feito:", formData);
      setIsLoggedIn(true); // marca como logado
      navigate("/feed"); // manda para o feed
    } catch (error) {
      alert("Erro no login!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={formData.username}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
