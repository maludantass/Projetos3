import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPostsByCommunity,
  getCommentsByPost,
  createComment,
  updatePost,
  deletePost
} from '../services/forumService';
import PostVotes from '../components/PostVotes';
import CommentVotes from '../components/CommentVotes';
import './CommunityPosts.css';

const CommunityPosts = () => {
  const { communityId } = useParams();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentsPage, setCommentsPage] = useState({});
  const [commentsTotalPages, setCommentsTotalPages] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostData, setEditPostData] = useState({ title: '', content: '', url: '' });

  useEffect(() => {
    if (!communityId) return;
    getPostsByCommunity(communityId)
      .then(setPosts)
      .catch(err => console.error('Erro ao carregar posts da comunidade:', err));
  }, [communityId]);

  const loadComments = async (postId, page = 0) => {
    try {
      const { content, totalPages } = await getCommentsByPost(postId, page, 5);
      setComments(prev => ({ ...prev, [postId]: content }));
      setCommentsPage(prev => ({ ...prev, [postId]: page }));
      setCommentsTotalPages(prev => ({ ...prev, [postId]: totalPages }));
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditPostData({ title: post.title, content: post.content, url: post.url || '' });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditPostData({ title: '', content: '', url: '' });
  };

  const savePost = async (postId) => {
    try {
      await updatePost(postId, editPostData);
      setPosts(posts.map(p => (p.id === postId ? { ...p, ...editPostData } : p)));
      cancelEdit();
    } catch (err) {
      console.error('Erro ao atualizar post:', err);
    }
  };

  const deletePostById = async (postId) => {
    const confirmed = window.confirm('Tem certeza que quer deletar este post?');
    if (!confirmed) return;

    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Erro ao deletar post:', err);
    }
  };

  const handleCommentInput = (postId, value) => {
    setNewComment(prev => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (e, postId) => {
    e.preventDefault();
    try {
      await createComment({ postId, text: newComment[postId] });
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      loadComments(postId, 0);
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
    }
  };

  const goToPreviousPage = (postId) => {
    const page = commentsPage[postId] || 0;
    if (page > 0) loadComments(postId, page - 1);
  };

  const goToNextPage = (postId) => {
    const page = commentsPage[postId] || 0;
    const total = commentsTotalPages[postId] || 1;
    if (page + 1 < total) loadComments(postId, page + 1);
  };

  const renderPost = (post) => {
    const isEditing = editingPostId === post.id;

    return (
      <div key={post.id} className="post-card">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editPostData.title}
              onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
              placeholder="Título"
            />
            <textarea
              value={editPostData.content}
              onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
              placeholder="Conteúdo"
            />
            <input
              type="text"
              value={editPostData.url}
              onChange={(e) => setEditPostData({ ...editPostData, url: e.target.value })}
              placeholder="URL (opcional)"
            />
            <div className="actions">
              <button onClick={() => savePost(post.id)}>Salvar</button>
              <button onClick={cancelEdit}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h3>
              <Link to={`/post/${post.id}`} className="post-title-link">
                {post.title}
              </Link>
            </h3>
            <p className="meta">
              Por <strong>{post.author?.username || 'Desconhecido'}</strong> em{' '}
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <p>{post.content}</p>
            <div className="actions">
              <button onClick={() => handleEdit(post)}>Editar</button>
              <button onClick={() => deletePostById(post.id)}>Excluir</button>
            </div>
            <PostVotes postId={post.id} score={post.voteScore} />
            <div className="comment-section">
              <button onClick={() => loadComments(post.id)}>Ver comentários</button>
              <ul>
                {(comments[post.id] || []).map((comment) => (
                  <li key={comment.id}>
                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                      <strong>{comment.author?.username || 'Desconhecido'}</strong> em{' '}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>{comment.text}</p>
                    <CommentVotes commentId={comment.id} voteScore={comment.voteScore || 0} />
                  </li>
                ))}
              </ul>
              <div className="pagination-controls">
                <button onClick={() => goToPreviousPage(post.id)} disabled={(commentsPage[post.id] || 0) === 0}>
                  Anterior
                </button>
                <button
                  onClick={() => goToNextPage(post.id)}
                  disabled={(commentsPage[post.id] || 0) + 1 >= (commentsTotalPages[post.id] || 1)}
                >
                  Próximo
                </button>
                <span>
                  Página {(commentsPage[post.id] || 0) + 1} de {(commentsTotalPages[post.id] || 1)}
                </span>
              </div>
              <form className="comment-form" onSubmit={(e) => submitComment(e, post.id)}>
                <input
                  type="text"
                  placeholder="Novo comentário"
                  value={newComment[post.id] || ''}
                  onChange={(e) => handleCommentInput(post.id, e.target.value)}
                  required
                />
                <button type="submit">Comentar</button>
              </form>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="community-posts-container">
      <div className="community-banner">
        Você está vendo a preview do fórum. <strong>Quer participar?</strong>
        <button className="join-btn">Entrar</button>
      </div>

      <div className="community-header">
        <div className="forum-avatar-large" />
        <div className="forum-info-text">
          <h1>Nome do Fórum</h1>
          <p>Descrição do fórum para contextualizar os usuários.</p>
        </div>
      </div>

      <h2>Posts da Comunidade</h2>
      {posts.map(renderPost)}

      <div className="community-input">
        <input type="text" placeholder="Converse com os membros" />
      </div>
    </div>
  );
};

export default CommunityPosts;