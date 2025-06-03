import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link, useNavigate } from 'react-router-dom'; // 👈 IMPORTANTE
import './Foruns.css';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate(); // 👈 NAVEGAÇÃO

  useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);

  return (
    <div className="forum-page">
      {/* Top Bar */}
      <header className="top-bar">
        ALIANÇA BRASILEIRA DE FINANÇAS E INVESTIMENTOS SUSTENTÁVEIS
      </header>

      {/* Sidebar fixa */}
      <div className="forum-sidebar">
        <button className="forum-button" onClick={() => navigate('/foruns/todos')}>
          ＋
        </button>
      </div>

      {/* Conteúdo principal */}
      {communities.length === 0 ? (
        <div className="forum-empty-content">
          <p>Parece que você não está num fórum...</p>
          <Link to="/foruns/todos" className="forum-link">Descubra aqui</Link>
        </div>
      ) : (
        <div className="forum-main">
          <div className="forum-header">
            <h1>Seus Fóruns</h1>
            <div className="forum-topics">
              <button className="topic active">Todos</button>
              <button className="topic">Tópico 1</button>
              <button className="topic">Tópico 2</button>
              <button className="topic">Tópico 3</button>
              <button className="topic">Tópico 4</button>
              <button className="topic">Tópico 5</button>
              <div className="search-area">
                <input type="text" placeholder="Pesquise" className="search-input" />
                <button className="filter-btn">⏷</button>
              </div>
            </div>
          </div>

          <div className="forum-section">
            <h2>Em Destaque</h2>
            <div className="forum-card-list">
              {communities.map((comunidade) => (
                <Link to={`/comunidade/${comunidade.id}`} key={comunidade.id} className="forum-card">
                  <div className="forum-avatar"></div>
                  <div className="forum-info">
                    <h3>{comunidade.title}</h3>
                    <p>{comunidade.description || "Sem descrição disponível."}</p>
                  </div>
                  <div className="forum-members">
                    Membros:<br />XX
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foruns;
