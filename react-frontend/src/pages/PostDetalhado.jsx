import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPostById,
  getCommentsByPost,
  createComment,
  vote,
  joinForum,
} from '../services/forumService';
import CommentThread from '../components/CommentThread';
import PostVotes from '../components/PostVotes';
import './PostDetalhado.css';

const PostDetalhado = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPostById(postId);
        const commentData = await getCommentsByPost(postId, 0, 50);
        setPost(postData);
        setComments(commentData.content);
        setIsParticipant(postData.participa || false); // campo vindo do backend
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      }
    };

    fetchData();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await createComment({ postId, text: commentText });
      const updated = await getCommentsByPost(postId, 0, 50);
      setComments(updated.content);
      setCommentText('');
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  const handleJoinForum = async () => {
    try {
      await joinForum(post.forumCommunity.id);
      setIsParticipant(true);
    } catch (err) {
      console.error('Erro ao entrar no fórum:', err);
    }
  };

  if (loading || !post) return <div>Carregando...</div>;

  return (
    <div className="post-detalhado">
      {!isParticipant && (
        <div className="preview-banner">
          Você está vendo a prévia do fórum. <strong>Quer participar?</strong>{' '}
          <button className="entrar-btn" onClick={handleJoinForum}>Entrar</button>
        </div>
      )}

      <div className="post-principal">
        <h2>{post.title}</h2>
        <p className="post-autor">Por <strong>{post.author?.username}</strong> em {new Date(post.createdAt).toLocaleString()}</p>
        <p>{post.content}</p>
        {post.url && <a href={post.url} target="_blank" rel="noreferrer">Link</a>}
        <PostVotes postId={post.id} score={post.voteScore || 0} />
      </div>

      <div className="comentarios">
        <h3>Comentários</h3>
        {comments.map((comment) => (
          <CommentThread key={comment.id} comment={comment} />
        ))}

        {isParticipant && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Converse com os membros"
              required
            />
            <button type="submit">Enviar</button>
          </form>
        )}

        {!isParticipant && (
          <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
            Entre no fórum para comentar.
          </p>
        )}
      </div>

      <div className="voltar-area">
        <Link to="/foruns">← Voltar</Link>
      </div>
    </div>
  );
};

export default PostDetalhado;
