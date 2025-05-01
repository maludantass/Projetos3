import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginCadastro.css";

function LoginCadastro({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        console.log("Login feito:", formData);
        setIsLoggedIn(true);
        navigate("/feed");
      } else {
        await axios.post("http://localhost:8080/api/auth/register", formData);
        alert("Usuário cadastrado com sucesso!");
        setIsLogin(true);
      }
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || "email já registrado."));
    }
  };

  return (
    <div className="login-cadastro-container">
      <div className="login-cadastro-box">
        <h2>{isLogin ? "Login" : "Cadastro"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Usuário"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
        </form>
        <p>
          {isLogin ? "Não é membro?" : "Já tem conta?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginCadastro;
