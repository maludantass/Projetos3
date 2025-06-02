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
    <><div className='Titulo'>
      <h1>Seus Fóruns</h1>
    </div><div className="forum-page">
        <div className="forum-sidebar">
          <button className="forum-button">＋</button>
          <button className="forum-button">🧭</button>
          <p>Seus Fóruns</p>
        </div>

        <div className="forum-empty-content">
          <p>Parece que você não está num fórum...</p>
          <Link to="/descobrir" className="forum-link">Descubra aqui</Link>
        </div>
      </div></>
);

};

export default Foruns;

