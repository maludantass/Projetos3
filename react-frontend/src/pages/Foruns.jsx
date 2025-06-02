import { useEffect, useState } from 'react';
import { getCommunities } from '../services/forumService';
import { Link } from 'react-router-dom';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    getCommunities()
      .then((data) => {
        // ⚠️ Adicionando uma comunidade fake manualmente para testar o layout visual
        const comunidadeFake = {
          id: 123456, // ID fake apenas para testes
          title: 'Comunidade de Teste (Remover depois)',
        };

        // Coloca a comunidade fake no início da lista real
        setCommunities([comunidadeFake, ...data]);
      })
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);

  
  //TESTE
  /*useEffect(() => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  }, []);*/

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

