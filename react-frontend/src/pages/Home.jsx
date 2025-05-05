import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faFacebook, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
 import React, { useState } from "react";
 import "./Home.css";
 
 const Home = () => {
   const [videoIndex, setVideoIndex] = useState(0);
 
   const videos = [
     "https://www.youtube.com/embed/w385WQd8nRo?si=_Srr6T4lf-0vwNCX",
     "https://www.youtube.com/embed/ZHBOpC06A_0?si=n0mh520mTzhB_YS6",
     "https://www.youtube.com/embed/vyI--5rVn2c?si=NcZPLHJED3Hpyqwi"
   ];
 
   const prevVideo = () => {
     setVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
   };
 
   const nextVideo = () => {
     setVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
   };
 
   return (
     <div>
       {/* Top Bar */}
       <header className="top-bar">
         ALIANÇA BRASILEIRA DE FINANÇAS E INVESTIMENTOS SUSTENTÁVEIS
       </header>
 
       {/* Navbar */}
       <nav className="navbar">
         <div className="navbar-left">
           <div className="logo">BRASFI</div>
         </div>
 
         <div className="navbar-center">
           <ul className="nav-links">
             <li><a href="#">Sobre</a></li>
             <li><a href="#">Feed</a></li>
             <li><a href="#">Fóruns</a></li>
             <li><a href="#">Eventos & Biblioteca</a></li>
             <li><a href="#">Ajuda & FAQ's</a></li>
           </ul>
         </div>
 
         <div className="navbar-right">
   <button className="btn-signin">Login</button>
   <button className="btn-signup">Cadastre-se</button>
 </div>
 
       </nav>
 
       {/* Carrossel de Vídeos */}
       <section className="carousel-section">
         <span className="arrow" onClick={prevVideo}>❮</span>
         <div className="video-box">
           <iframe
             src={videos[videoIndex]}
             title={`Vídeo ${videoIndex + 1}`}
             frameBorder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowFullScreen
             referrerPolicy="strict-origin-when-cross-origin"
           ></iframe>
         </div>
         <span className="arrow" onClick={nextVideo}>❯</span>
       </section>
 
       {/* Bolinhas de navegação */}
       <div className="carousel-dots">
         {videos.map((_, index) => (
           <span
             key={index}
             className={`dot ${index === videoIndex ? "active" : ""}`}
             onClick={() => setVideoIndex(index)}
           ></span>
         ))}
       </div>
 
       {/* Destaque */}
       <section className="highlight">
         <div className="thumb"></div>
         <p className="text">
           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
         </p>
       </section>
 
       {/* Feedback */}
       <section className="feedback">
         <div className="large-thumb"></div>
 
         <div className="depoimento linha-esquerda">
           <div className="depo-thumb"></div>
           <p className="texto-esquerda">
             “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
             exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”
           </p>
         </div>
 
         <div className="depoimento linha-direita">
           <p className="texto-direita">
             “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
             exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”
           </p>
           <div className="depo-thumb"></div>
         </div>
 
         <div className="depoimento linha-esquerda">
           <div className="depo-thumb"></div>
           <p className="texto-esquerda">
             “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
             exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”
           </p>
         </div>
       </section>
 
       {/* Parceiros */}
       <section className="partners">
         <div className="partner-logo">Parceiro 1</div>
         <div className="partner-logo">Parceiro 2</div>
         <div className="partner-logo">Parceiro 3</div>
         <div className="partner-logo">Parceiro 4</div>
       </section>
 
       {/* Call to Action */}
       <section className="call-to-action">
         <p>QUER FAZER PARTE?</p>
         <button>CLIQUE AQUI</button>
       </section>
 
       {/* Rodapé */}
       <footer className="footer">
         <div className="footer-left">
           <p>Contato</p>
           <p>Email</p>
         </div>
         <div className="footer-right">
           <p>Nos conheça!</p>
           <div className="social-icons">
           <FontAwesomeIcon icon={faFacebook} />
           <FontAwesomeIcon icon={faInstagram} />
           <FontAwesomeIcon icon={faLinkedin} />
           <FontAwesomeIcon icon={faYoutube} />
 
           </div>
         </div>
       </footer>
       <div className="bottom-bar">
         ALIANÇA BRASILEIRA DE FINANÇAS E INVESTIMENTOS SUSTENTÁVEIS
     </div>
 
     </div>
   );
 };
 
 export default Home;