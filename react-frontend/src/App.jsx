import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Feed from "./pages/Feed";
import Foruns from "./pages/Foruns";
import Eventos from "./pages/Eventos";
import Biblioteca from "./pages/Biblioteca";
import Ajuda from "./pages/Ajuda";
import LoginCadastro from "./pages/LoginCadastro";
import Perfil from "./pages/Perfil";
import Faq from "./pages/Faq";
import Home from "./pages/Home"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
    }
    setLoading(false); 
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Carregando...</div>;
    }
    return isLoggedIn ? children : <Navigate to="/auth" />;
  };

  return (
    <Router>
      {/* Navbar com estado de login */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="page-content">
        {/* Definição das rotas */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Página inicial */}
          <Route path="/sobre" element={<Home />} /> {/* Página Sobre */}
          <Route path="/auth" element={<LoginCadastro setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="/faq" element={<Faq />} />

          {/* Rotas protegidas */}
          <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="/foruns" element={<PrivateRoute><Foruns /></PrivateRoute>} />
          <Route path="/eventos" element={<PrivateRoute><Eventos /></PrivateRoute>} />
          <Route path="/biblioteca" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />

          {isLoggedIn && (
            <Route
              path="/perfil"
              element={<PrivateRoute><Perfil setIsLoggedIn={setIsLoggedIn} /></PrivateRoute>}
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;