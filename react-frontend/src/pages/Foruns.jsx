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


  
  //TESTE
  /*useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);*/

  return (
  <div className="forum-page">
    <div className="forum-sidebar">
      <button className="forum-button">＋</button>
      <button className="forum-button">✎</button>
      <p>Seus Fóruns</p>
    </div>

    <div className="forum-content">
      <h1>Comunidades do Fórum</h1>
      <ul className="forum-list">
        {communities.map((comunidade) => (
          <li key={comunidade.id}>
            <Link to={`/comunidade/${comunidade.id}`}>{comunidade.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};
//Ajeitando o css
  /*return (
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

export default Foruns;*/

