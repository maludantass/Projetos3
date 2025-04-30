import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import About from "./pages/About";
import Feed from "./pages/Feed";
import Foruns from "./pages/Foruns";
import Cadastro from "./pages/Cadastro";
import Eventos from "./pages/Eventos";
import Ajuda from "./pages/Ajuda";
import Login from "./pages/Login"; // vamos criar o Login.jsx também

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // controle de login

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="page-content">
        <Routes>
          <Route path="/sobre" element={<About />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/foruns" element={<Foruns />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


