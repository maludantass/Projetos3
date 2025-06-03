import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link } from 'react-router-dom';
import './TodosForuns.css';

const TodosForuns = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);

  return (
    <div className="todos-foruns-page">
      <header className="top-bar">
        Descubra Fóruns Públicos da Aliança
      </header>

      <div className="forum-main">
        <div className="forum-voltar">
          <Link to="/foruns" className="voltar-btn">← Voltar para seus fóruns</Link>
        </div>

        <h1>Todos os Fóruns Disponíveis</h1>
        <div className="forum-card-list">
          {communities.map((comunidade) => (
            <Link to={`/comunidade/${comunidade.id}`} key={comunidade.id} className="forum-card">
              <div className="forum-avatar"></div>
              <div className="forum-info">
                <h3>{comunidade.title}</h3>
                <p>{comunidade.description || "Sem descrição disponível."}</p>
              </div>
              <div className="forum-members">Membros: XX</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodosForuns;
