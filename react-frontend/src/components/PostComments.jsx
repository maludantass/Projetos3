import { useEffect, useState } from 'react';
import { getCommentsByPost, createComment, updateComment, deleteComment } from '../services/forumService';
import CommentThread from './CommentThread';

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const carregarComentarios = (pagina = 0) => {
    getCommentsByPost(postId, pagina, 10)
      .then((data) => {
        setComments(data.content);
        setPage(pagina);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(`Erro ao buscar comentários do post ${postId}:`, err));
  };

  useEffect(() => {
    carregarComentarios(0);
  }, [postId]);

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const saveComment = async (commentId) => {
    try {
      await updateComment(commentId, { text: editCommentText });
      setEditingCommentId(null);
      carregarComentarios(page);
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
    }
  };

  const deleteCommentHandler = async (commentId) => {
    if (window.confirm('Tem certeza que quer deletar este comentário?')) {
      try {
        await deleteComment(commentId);
        const novaPagina = comments.length === 1 && page > 0 ? page - 1 : page;
        carregarComentarios(novaPagina);
      } catch (error) {
        console.error('Erro ao deletar comentário:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({
        postId: postId,
        text: novoComentario,
      });
      setNovoComentario('');
      carregarComentarios(0);
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
    }
  };

  const goPrevious = () => {
    if (page > 0) carregarComentarios(page - 1);
  };

  const goNext = () => {
    if (page + 1 < totalPages) carregarComentarios(page + 1);
  };

  return (
    <div style={{ marginLeft: '1rem' }}>
      <h4>Comentários:</h4>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: '1rem' }}>
          {editingCommentId === comment.id ? (
            <>
              <textarea
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                rows={3}
                style={{ width: '100%' }}
              />
              <button onClick={() => saveComment(comment.id)}>Salvar</button>
              <button onClick={cancelEditComment}>Cancelar</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>
                <strong>{comment.author?.username || 'Desconhecido'}</strong> em{' '}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p>{comment.text}</p>
              <button onClick={() => startEditComment(comment)}>Editar</button>
              <button onClick={() => deleteCommentHandler(comment.id)}>Excluir</button>
            </>
          )}
        </div>
      ))}

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={goPrevious} disabled={page === 0} style={{ marginRight: '10px' }}>
          Anterior
        </button>
        <button onClick={goNext} disabled={page + 1 >= totalPages}>
          Próximo
        </button>
        <span style={{ marginLeft: '15px' }}>
          Página {page + 1} de {totalPages}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Comentar
        </button>
      </form>
    </div>
  );
};

export default PostComments;
