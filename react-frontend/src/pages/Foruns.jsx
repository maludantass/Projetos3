import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link } from 'react-router-dom';
import './Foruns.css';


const Foruns = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
  // ⚠️ Ignora o backend e adiciona uma comunidade fake para testar visualmente
  const comunidadeFake = {
    id: 123456,
    title: 'Comunidade de Teste (Remover depois)',
  };

  setCommunities([comunidadeFake]);
}, []);


  
  //TESTE DPS VOLTA PRA ELE
  /*useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);*/

//
  /*return (
    <div>
      <h1>Seus Fóruns</h1>
      <ul>
        {communities.map((comunidade) => (
          <li key={comunidade.id}>
            <Link to={`/comunidade/${comunidade.id}`}>{comunidade.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );*/

  return (
  <div className="forum-page">
    <div className="forum-sidebar">
      <button className="forum-button">＋</button>
      <button className="forum-button">🧭</button>
    </div>

    {communities.length === 0 ? (
      // ⚠️ Página 1 – Nenhum fórum
      <div className="forum-empty-content">
        <p>Parece que você não está num fórum...</p>
        <Link to="/descobrir" className="forum-link">Descubra aqui</Link>
      </div>
    ) : (
      // ✅ Página 2 – Lista de fóruns
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
              <div key={comunidade.id} className="forum-card">
                <div className="forum-avatar"></div>
                <div className="forum-info">
                  <h3>{comunidade.title}</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="forum-members">
                  Membros:<br />XX
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

      };

export default Foruns;
