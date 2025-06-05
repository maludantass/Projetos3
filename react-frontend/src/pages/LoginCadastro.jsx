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
      console.log("Enviando login para o backend com:", formData);

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Resposta do login:", response.data); // ⬅️ Veja se tem o ID aqui

      // ✅ Salva tudo, inclusive o ID
      localStorage.setItem("user", JSON.stringify(response.data));

      setIsLoggedIn(true);
      navigate("/feed");
    } else {
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);

      console.log("Resposta do cadastro:", response.data);

      // ✅ Aqui também salva tudo
      localStorage.setItem("user", JSON.stringify(response.data));

      alert("Usuário cadastrado com sucesso!");
      setIsLoggedIn(true);
      navigate("/feed");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    if (error.response?.data?.message) {
      alert(`Erro: ${error.response.data.message}`);
    } else {
      alert("Ocorreu um erro. Tente novamente.");
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
