
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import About from "./pages/About";
import Feed from "./pages/Feed";
import Foruns from "./pages/Foruns";
import Cadastro from "./pages/Cadastro";
import Eventos from "./pages/Eventos"; 
import Ajuda from "./pages/Ajuda"; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/sobre" element={<About />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/foruns" element={<Foruns />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ajuda" element={<Ajuda />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

