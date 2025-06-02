import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link } from 'react-router-dom';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);

  return (
    <div>
      <h1>Comunidades do Fórum</h1>
      <ul>
        {communities.map((comunidade) => (
          <li key={comunidade.id}>
            <Link to={`/comunidade/${comunidade.id}`}>{comunidade.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Foruns;
