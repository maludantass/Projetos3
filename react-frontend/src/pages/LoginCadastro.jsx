import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        console.log("Login com:", formData);

        const response = await axios.post("http://localhost:8080/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { username, email } = response.data;  

        localStorage.setItem("user", JSON.stringify({ username, email }));

        setIsLoggedIn(true);
        navigate("/feed");
      } else {
        const response = await axios.post("http://localhost:8080/api/auth/register", formData);

        localStorage.setItem("user", JSON.stringify({
          email: response.data.email,
          username: response.data.username,
        }));

        alert("Usuário cadastrado com sucesso!");
        setIsLoggedIn(true);
        navigate("/feed");
      }
      //ajeitar o tratamento de erro, ta errado
    } catch (error) {
      if (isLogin) {
        if (error.response?.status === 400 && error.response?.data?.message === "Senha incorreta") {
          alert("Erro: Senha incorreta.");
        } else {
          alert("Erro no login: " + (error.response?.data?.message || "Senha incorreta."));
        }
      }
      //esse tambem ta errado
      if (!isLogin) {
        if (error.response?.status === 400 && error.response?.data?.message === "Email já registrado") {
          alert("Erro: Este email já está registrado.");
        } else {
          alert("Erro no cadastro: " + (error.response?.data?.message || "Email já registrado."));
        }
      }
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
