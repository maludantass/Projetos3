import { useEffect, useState } from 'react';
import { getCommentsByPost, createComment, updateComment, deleteComment } from '../services/forumService';
import CommentThread from './CommentThread';

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // carregarComentarios já implementado

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
      carregarComentarios(); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
    }
  };

  const deleteCommentHandler = async (commentId) => {
    if (window.confirm('Tem certeza que quer deletar este comentário?')) {
      try {
        await deleteComment(commentId);
        carregarComentarios();
      } catch (error) {
        console.error('Erro ao deletar comentário:', error);
      }
    }
  };

  return (
    <div style={{ marginLeft: '1rem' }}>
      <h4>Comentários:</h4>
      {comments.map((comment) => (
        <div key={comment.id}>
          {editingCommentId === comment.id ? (
            <>
              <textarea
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
              />
              <button onClick={() => saveComment(comment.id)}>Salvar</button>
              <button onClick={cancelEditComment}>Cancelar</button>
            </>
          ) : (
            <>
              <p>{comment.text}</p>
              <button onClick={() => startEditComment(comment)}>Editar</button>
              <button onClick={() => deleteCommentHandler(comment.id)}>Excluir</button>
            </>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        {/* input para novo comentário já existente */}
      </form>
    </div>
  );
};

export default PostComments;
