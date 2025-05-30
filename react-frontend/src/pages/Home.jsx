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
      <br></br><br></br>
<div className = "Brasfiverde">
</div>
      {/* Destaque */}
      <section className="highlight">
        <div className="thumb"></div>
        <p className="text">
          A BRASFI é uma aliança brasileira que <br></br>conecta profissionais e acadêmicos <br></br>para impulsionar finanças <br></br>e investimentos sustentáveis.
        </p>
      </section>
    

{/* Feedback */}
<section className="feedback">
  <p className="text2">Nossa Equipe</p>

  <div className="depoimento linha-esquerda">
    <div className="depo-thumb1"></div>
    <div className="info-depo">
      <p className="nome">
        Ricardo Viana <span className="cargo">CEO</span>
      </p><br />
      <p className="texto-esquerda">
        “Queremos ser referência global em finanças que regeneram,<br />
        conectam e transformam realidades.”
      </p>
    </div>
  </div>

  <div className="depoimento linha-direita">
    <div className="info-depo">
      <p className="nome">
        Marina Leal <span className="cargo">Diretora de Inovação</span>
      </p><br />
      <p className="texto-direita">
        “Cada decisão financeira carrega o poder de moldar o futuro. Estamos aqui para garantir que esse futuro seja verde, justo e próspero.”
      </p>
    </div>
    <div className="depo-thumb2"></div>
  </div>

  <div className="depoimento linha-esquerda">
    <div className="depo-thumb3"></div>
    <div className="info-depo">
      <p className="nome">
        André Nascimento<span className="cargo">Diretor de Comunicação</span>
      </p><br />
      <p className="texto-esquerda">
        “Valorizamos pessoas que acreditam que o mundo pode ser melhor, e que trabalham para isso todos os dias.”
      </p>
    </div>
  </div>
</section>

<div className="partners-container">
  <img src="/static/images/lab.png" alt="lab" />
  <img src="/static/images/climate.png" alt="climate" />
  <img src="/static/images/weesg.png" alt="weesg" />
  <img src="/static/images/universidade.png" alt="universidade" />
</div>

      {/* Call to Action */}
      <section className="call-to-action">
        <p>QUER FAZER PARTE?</p>
        <button>CLIQUE AQUI</button>
      </section>

      {/* Rodapé */}
      <footer className="footer">
        <div className="footer-left">
          <p>Contato</p>
          <p>Política de Privacidade</p>
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
    <a href="https://www.facebook.com/p/Brasfi-100075647395106/" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faFacebook} />
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
