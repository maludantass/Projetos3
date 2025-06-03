import { useEffect, useState } from 'react';
import {
  getPostsByCommunity,
  getCommentsByPost,
  createComment,
  updatePost,
  deletePost,
} from '../services/forumService';
import { useParams } from 'react-router-dom';
import PostVotes from '../components/PostVotes';
import CommentVotes from '../components/CommentVotes';
import './CommunityPosts.css';

const CommunityPosts = () => {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentsPage, setCommentsPage] = useState({});
  const [commentsTotalPages, setCommentsTotalPages] = useState({});
  const [novoComentario, setNovoComentario] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostData, setEditPostData] = useState({ title: '', content: '', url: '' });

  useEffect(() => {
    if (communityId) {
      getPostsByCommunity(communityId)
        .then((data) => {
          const postFake = {
            id: 9999,
            title: 'Post de Teste (Remover depois)',
            content: 'Este é um post fake só para testar o layout da página.',
            author: { username: 'UsuarioTeste' },
            createdAt: new Date().toISOString(),
            voteScore: 0,
          };
          setPosts([postFake, ...data]);
        })
        .catch((err) => console.error('Erro ao buscar posts:', err));
    }
  }, [communityId]);

  const carregarComentarios = async (postId, page = 0) => {
    try {
      const postComments = await getCommentsByPost(postId, page, 5);
      setComments((prev) => ({ ...prev, [postId]: postComments.content }));
      setCommentsPage((prev) => ({ ...prev, [postId]: page }));
      setCommentsTotalPages((prev) => ({ ...prev, [postId]: postComments.totalPages }));
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const goPreviousCommentsPage = (postId) => {
    if ((commentsPage[postId] || 0) > 0) {
      carregarComentarios(postId, commentsPage[postId] - 1);
    }
  };

  const goNextCommentsPage = (postId) => {
    if ((commentsPage[postId] || 0) + 1 < (commentsTotalPages[postId] || 1)) {
      carregarComentarios(postId, commentsPage[postId] + 1);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditPostData({ title: post.title, content: post.content, url: post.url || '' });
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditPostData({ title: '', content: '', url: '' });
  };

  const savePost = async (postId) => {
    try {
      await updatePost(postId, editPostData);
      setEditingPostId(null);
      const updatedPosts = posts.map((p) => (p.id === postId ? { ...p, ...editPostData } : p));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Tem certeza que quer deletar este post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((p) => p.id !== postId));
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };

  const handleCommentChange = (postId, text) => {
    setNovoComentario((prev) => ({ ...prev, [postId]: text }));
  };

  const handleSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      await createComment({ postId: postId, text: novoComentario[postId] });
      setNovoComentario((prev) => ({ ...prev, [postId]: '' }));
      carregarComentarios(postId, 0);
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  return (
    <div className="community-posts-container">
      <h2>Posts da Comunidade</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          {editingPostId === post.id ? (
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
                <button onClick={cancelEditing}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p className="meta">
                Por <strong>{post.author?.username || 'Desconhecido'}</strong> em{' '}
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>{post.content}</p>
              <div className="actions">
                <button onClick={() => startEditing(post)}>Editar</button>
                <button onClick={() => handleDelete(post.id)}>Excluir</button>
              </div>
              <PostVotes postId={post.id} score={post.voteScore} />
              <div className="comment-section">
                <button onClick={() => carregarComentarios(post.id, 0)}>Ver comentários</button>
                <ul>
                  {(comments[post.id] || []).map((c) => (
                    <li key={c.id}>
                      <p style={{ fontSize: '0.9rem', color: '#555' }}>
                        <strong>{c.author?.username || 'Desconhecido'}</strong> em{' '}
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                      <p>{c.text}</p>
                      <CommentVotes commentId={c.id} voteScore={c.voteScore || 0} initialUserVote={null} />
                    </li>
                  ))}
                </ul>
                <div className="pagination-controls">
                  <button onClick={() => goPreviousCommentsPage(post.id)} disabled={(commentsPage[post.id] || 0) === 0}>Anterior</button>
                  <button onClick={() => goNextCommentsPage(post.id)} disabled={(commentsPage[post.id] || 0) + 1 >= (commentsTotalPages[post.id] || 1)}>Próximo</button>
                  <span>
                    Página {(commentsPage[post.id] || 0) + 1} de {(commentsTotalPages[post.id] || 1)}
                  </span>
                </div>
                <form className="comment-form" onSubmit={(e) => handleSubmit(e, post.id)}>
                  <input
                    type="text"
                    placeholder="Novo comentário"
                    value={novoComentario[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    required
                  />
                  <button type="submit">Comentar</button>
                </form>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommunityPosts;
