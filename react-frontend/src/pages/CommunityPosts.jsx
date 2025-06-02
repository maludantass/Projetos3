import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostsByCommunity, createPost } from '../services/forumService';
import PostComments from '../components/PostComments';

const CommunityPosts = () => {
  const { id } = useParams(); // ID da comunidade
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');

  const carregarPosts = () => {
    getPostsByCommunity(id)
      .then(setPosts)
      .catch((err) => console.error('Erro ao carregar posts:', err));
  };

  useEffect(() => {
    carregarPosts();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novoPost = {
      title: titulo,
      content: conteudo,
      forumCommunityId: id,
    };
    await createPost(novoPost);
    setTitulo('');
    setConteudo('');
    carregarPosts(); // atualiza a lista
  };

  return (
    <div>
      <h2>Posts da Comunidade {id}</h2>

      <form onSubmit={handleSubmit}>
        <h3>Criar novo post</h3>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">Postar</button>
      </form>

      <ul>
  {posts.map((post) => (
    <li key={post.id}>
      <strong>{post.title}</strong> — {post.content}
      <PostComments postId={post.id} />
    </li>
  ))}
</ul>

    </div>
  );
};

export default CommunityPosts;
