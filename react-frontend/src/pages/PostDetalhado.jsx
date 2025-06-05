import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPostById,
  getCommentsByPost,
  createComment
} from '../services/forumService';
import CommentThread from '../components/CommentThread';
import './PostDetalhado.css';

const PostDetalhado = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const membro = localStorage.getItem('isForumMember') === 'true';
    setIsMember(membro);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      // Verificar se postId existe
      if (!postId) {
        setError('ID do post não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Carregando post ID:', postId); // Debug
        
        // Carregar post e comentários em paralelo
        const [postData, commentsData] = await Promise.all([
          getPostById(postId),
          getCommentsByPost(postId)
        ]);
        
        console.log('Post carregado:', postData); // Debug
        console.log('Comentários carregados:', commentsData); // Debug
        
        setPost(postData);
        setComments(commentsData.content || []);
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(`Erro ao carregar o post: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await createComment({ postId, text: newComment.trim() });
      setNewComment('');
      
      // Recarregar comentários
      const updated = await getCommentsByPost(postId);
      setComments(updated.content || []);
      
    } catch (err) {
      console.error('Erro ao criar comentário:', err);
      alert('Erro ao criar comentário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="post-detalhado-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Carregando post...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detalhado-container">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detalhado-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Post não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="post-detalhado-container">
      {!isMember ? (
        <div className="preview-banner">
          Você está vendo a preview do fórum. <strong>Quer participar?</strong>
          <button
            className="entrar-btn"
            onClick={() => {
              localStorage.setItem('isForumMember', 'true');
              setIsMember(true);
            }}
          >
            Entrar
          </button>
        </div>
      ) : (
        <div className="entrada-confirmada">
          Você entrou no fórum!
          <button
            className="sair-btn"
            onClick={() => {
              localStorage.removeItem('isForumMember');
              setIsMember(false);
            }}
          >
            Sair
          </button>
        </div>
      )}

      <div className="post-detalhado">
        <div className="post-header">
          <div className="avatar"></div>
          <div>
            <p className="autor">{post.author?.username || 'Desconhecido'}</p>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.url && (
              <a href={post.url} target="_blank" rel="noopener noreferrer">
                {post.url}
              </a>
            )}
          </div>
        </div>
      </div>

      {isMember && (
        <>
          <div className="thread-area">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} />
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            )}
          </div>

          <form className="mensagem-fixa" onSubmit={handleSubmit}>
            <span className="icone-esquerda">✏️</span>
            <input
              type="text"
              placeholder="Converse com os membros"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              required
            />
            <button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PostDetalhado;
