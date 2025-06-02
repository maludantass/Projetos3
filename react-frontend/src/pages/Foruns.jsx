import { useEffect, useState } from 'react';
import { getCommunities, createCommunity } from '../services/forumService';
import { Link } from 'react-router-dom';

const Foruns = () => {
  const [communities, setCommunities] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarComunidades();
  }, []);

  const carregarComunidades = () => {
    getCommunities()
      .then(setCommunities)
      .catch((err) => console.error('Erro ao carregar comunidades:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunity({ title: titulo, description: descricao });
      setTitulo('');
      setDescricao('');
      carregarComunidades(); // Atualiza lista
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
    }
  };

  return (
    <div>
      <h1>Comunidades do Fórum</h1>

      <form onSubmit={handleSubmit}>
        <h3>Criar nova comunidade</h3>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <br />
        <button type="submit">Criar Comunidade</button>
      </form>

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
