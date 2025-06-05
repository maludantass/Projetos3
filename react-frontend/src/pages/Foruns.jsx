import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link, useNavigate } from 'react-router-dom';
import './Foruns.css';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // 👈 busca por título
  const navigate = useNavigate();

  useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  const estaInscrito = communities.length > 0;

  // 👇 comunidades filtradas pela busca
  const comunidadesFiltradas = communities.filter((comunidade) =>
    comunidade.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="forum-page">
      <header className="top-bar">
        ALIANÇA BRASILEIRA DE FINANÇAS E INVESTIMENTOS SUSTENTÁVEIS
      </header>

      <div className="forum-sidebar">
        <button className="forum-button" onClick={() => navigate('/foruns/novo')}>＋</button>
      </div>

      {estaInscrito ? (
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

              {/* 👉 Campo de busca */}
              <div className="search-area">
                <input
                  type="text"
                  placeholder="Pesquise"
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="filter-btn">⏷</button>
              </div>
            </div>
          </div>

          <div className="forum-section">
            <h2>Em Destaque</h2>
            <div className="forum-card-list">
              {comunidadesFiltradas.map((comunidade) => (
                <Link to={`/comunidade/${comunidade.id}`} key={comunidade.id} className="forum-card">
                  <div className="forum-avatar"></div>
                  <div className="forum-info">
                    <h3>{comunidade.title}</h3>
                    <p>{comunidade.description || "Sem descrição disponível."}</p>
                  </div>
                  <div className="forum-members">
                    Membros:<br />{comunidade.memberCount ?? comunidade.members?.length ?? 0}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="forum-empty-content">
          <h2>Parece que você não está em um fórum...</h2>
          <Link to="/foruns/todos" className="main-btn">Descubra aqui</Link>
        </div>
      )}
    </div>
  );
};

export default Foruns;
