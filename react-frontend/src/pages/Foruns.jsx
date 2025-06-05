import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link, useNavigate } from 'react-router-dom';
import './Foruns.css';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err))
      .finally(() => setLoading(false));
  }, []);

  const meusForuns = JSON.parse(localStorage.getItem('meusForuns')) || [];

  const comunidadesInscritas = communities.filter((c) =>
    meusForuns.includes(c.id)
  );

  const comunidadesFiltradas = comunidadesInscritas.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="forum-page">
      <header className="top-bar">
        ALIANÇA BRASILEIRA DE FINANÇAS E INVESTIMENTOS SUSTENTÁVEIS
      </header>

      <div className="forum-sidebar">
        <button className="forum-button" onClick={() => navigate('/foruns/novo')}>＋</button>
      </div>

      {comunidadesInscritas.length === 0 ? (
        <div className="forum-empty-content">
          <h2>Parece que você não está em um fórum...</h2>
          <Link to="/foruns/todos" className="main-btn">Descubra aqui</Link>
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
              {comunidadesFiltradas.map((c) => (
                <Link to={`/comunidade/${c.id}`} key={c.id} className="forum-card">
                  <div className="forum-avatar"></div>
                  <div className="forum-info">
                    <h3>{c.title}</h3>
                    <p>{c.description || "Sem descrição disponível."}</p>
                  </div>
                  <div className="forum-members">
                    Membros:<br />{c.memberCount ?? c.members?.length ?? 0}
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
