import { useEffect, useState } from 'react';
import {
  getPostsByCommunity,
  getCommentsByPost,
  createComment,
} from '../services/forumService';
import { useParams } from 'react-router-dom';
import PostVotes from '../components/PostVotes';

const CommunityPosts = () => {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [novoComentario, setNovoComentario] = useState({});

  useEffect(() => {
    if (communityId) {
      getPostsByCommunity(communityId)
        .then(setPosts)
        .catch((err) => console.error('Erro ao buscar posts:', err));
    }
  }, [communityId]);

  const carregarComentarios = async (postId) => {
    try {
      const postComments = await getCommentsByPost(postId);
      setComments((prev) => ({ ...prev, [postId]: postComments }));
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handleCommentChange = (postId, text) => {
    setNovoComentario((prev) => ({ ...prev, [postId]: text }));
  };

  const handleSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      await createComment({
        postId: postId,
        text: novoComentario[postId],
      });
      setNovoComentario((prev) => ({ ...prev, [postId]: '' }));
      carregarComentarios(postId);
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  return (
    <div>
      <h2>Posts da Comunidade</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>

          {/* 🔼 Votação */}
          <PostVotes postId={post.id} score={post.score} />

          {/* 💬 Comentários */}
          <button onClick={() => carregarComentarios(post.id)}>
            Ver comentários
          </button>
          <ul>
            {(comments[post.id] || []).map((c) => (
              <li key={c.id}>{c.text}</li>
            ))}
          </ul>

          <form onSubmit={(e) => handleSubmit(e, post.id)}>
            <input
              type="text"
              placeholder="Novo comentário"
              value={novoComentario[post.id] || ''}
              onChange={(e) =>
                handleCommentChange(post.id, e.target.value)
              }
              required
            />
            <button type="submit">Comentar</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default CommunityPosts;
