import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

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
          A BRASFI surgiu quando nossa fundadora, Viviane Torinelli, percebeu a ausência de brasileiros 
          nas discussões sobre finanças e investimentos sustentáveis em conferências internacionais.
        </p>
      </section>

      {/* Feedback */}
      <section className="feedback">
        <div className="large-thumb"></div>

        <div className="depoimento linha-esquerda">
          <div className="depo-thumb1"></div>
          <p className="texto-esquerda">
            “Os membros da BRASFI vêm de diversas áreas, incluindo os setores público e privado, pesquisadores, 
            estudantes de diferentes níveis acadêmicos e profissionais do mercado corporativo, formando uma comunidade multidisciplinar.”
          </p>
        </div>

        <div className="depoimento linha-direita">
          <p className="texto-direita">
            “Transformamos o futuro com inovação sustentável, excelência em cada ação, colaboração contínua e um compromisso ético sólido.”
          </p>
          <div className="depo-thumb2"></div>
        </div>

        <div className="depoimento linha-esquerda">
          <div className="depo-thumb3"></div>
          <p className="texto-esquerda">
            “Com a nova estruturação de 2023, a BRASFI tem como visão se tornar uma referência no 
            desenvolvimento de líderes e soluções em finanças e investimentos sustentáveis até 2026. 
            Além disso, nossa missão é inspirar uma geração de profissionais capazes de impulsionar a transformação positiva, 
            contribuindo para o avanço sustentável do país.”
          </p>
        </div>
      </section>

      {/* Parceiros */}
      <section className="partners">
  <div className="partner-card">
    <div className="partner-logo1"></div>
    <a className="partner-label">Co-Fundadora</a>
  </div>
          <div className="partner-card">
    <div className="partner-logo2"></div>
    <a className="partner-label">Apresentadora</a>
  </div>
                  <div className="partner-card">
    <div className="partner-logo3"></div>
    <a className="partner-label">Diretor</a>
  </div>
                  <div className="partner-card">
    <div className="partner-logo4"></div>
    <a className="partner-label">Voluntário no Hub de Projetos</a>
  </div>
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
          <a href="https://www.instagram.com/brasfi_/" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faInstagram} />
    </a>
          <a href="https://www.linkedin.com/company/brasfi/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faLinkedin} />
    </a>
          <a href="https://www.youtube.com/@brasfi1976/featured" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faYoutube} />
    </a>
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
