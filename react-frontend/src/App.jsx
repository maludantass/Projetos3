import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import About from "./pages/About";
import Feed from "./pages/Feed";
import Foruns from "./pages/Foruns";
import Eventos from "./pages/Eventos";
import Ajuda from "./pages/Ajuda";
import LoginCadastro from "./pages/LoginCadastro";
import Perfil from "./pages/Perfil";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="page-content">
        <Routes>
          <Route path="/sobre" element={<About />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/foruns" element={<Foruns />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route
            path="/auth"
            element={<LoginCadastro setIsLoggedIn={setIsLoggedIn} />}
          />
          {isLoggedIn && <Route path="/perfil" element={<Perfil setIsLoggedIn={setIsLoggedIn} />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
