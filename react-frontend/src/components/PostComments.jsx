import { useEffect, useState } from 'react';
import { getCommentsByPost, createComment } from '../services/forumService';

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');

  const carregarComentarios = () => {
    getCommentsByPost(postId)
      .then(setComments)
      .catch((err) => console.error(`Erro ao buscar comentários do post ${postId}:`, err));
  };

  useEffect(() => {
    carregarComentarios();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novo = {
      postId: postId,
      text: novoComentario,
    };

    try {
      await createComment(novo);
      setNovoComentario('');
      carregarComentarios(); // Atualiza comentários
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
    }
  };

  return (
    <div style={{ marginLeft: '1rem' }}>
      <h4>Comentários:</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          required
        />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
};

export default PostComments;
