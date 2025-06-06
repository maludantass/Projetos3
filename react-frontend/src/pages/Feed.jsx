import './Feed.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart as solidHeart, faBookmark as solidBookmark, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faComment, faPaperPlane, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  getGeneralFeed,
  getLikedPosts,
  toggleLikeAPI,
  getFavoritedPosts,
  toggleFavoriteAPI,
  createPost,
  addComment
} from '../services/feedService';

const Feed = () => {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [favoritedPosts, setFavoritedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [newPostText, setNewPostText] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleCommentForms, setVisibleCommentForms] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return alert("Usuário não autenticado. Faça login novamente.");
    setUserId(user.id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    loadPostsAndReactions();
  }, [userId]);

  const loadPostsAndReactions = async () => {
    try {
      const posts = await getGeneralFeed();
      setPosts(posts);

      const [likedRes, favoritedRes] = await Promise.all([
        getLikedPosts(userId),
        getFavoritedPosts(userId),
      ]);

      setLikedPosts(buildReactionMap(likedRes.data));
      setFavoritedPosts(buildReactionMap(favoritedRes.data));
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    }
  };

  const buildReactionMap = (postList) =>
    postList.reduce((acc, post) => ({ ...acc, [post.id]: true }), {});

  const handleToggleLike = (postId) => {
    if (!userId) return;
    toggleLikeAPI(userId, postId)
      .then(() => setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] })))
      .catch(err => console.error("Erro ao curtir post:", err));
  };

  const handleToggleFavorite = (postId) => {
    if (!userId) return;
    toggleFavoriteAPI(userId, postId)
      .then(() => setFavoritedPosts(prev => ({ ...prev, [postId]: !prev[postId] })))
      .catch(err => console.error("Erro ao favoritar post:", err));
  };

  const toggleExpandComments = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleCommentInput = (postId) => {
    setVisibleCommentForms(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCreatePost = () => {
    if (!newPostText.trim() || !userId) return;

    createPost(userId, { content: newPostText, postType: 'text' })
      .then(() => {
        setNewPostText('');
        setShowPostForm(false);
        return loadPostsAndReactions();
      })
      .catch(err => {
        console.error('Erro ao criar post:', err);
        alert('Erro ao criar post.');
      });
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment || !userId) return;

    try {
      await addComment(postId, userId, comment);

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...(post.comments || []),
                  {
                    username: 'Você',
                    commentText: comment,
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : post
        )
      );

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setVisibleCommentForms(prev => ({ ...prev, [postId]: false }));
      setExpandedPosts(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      alert("Erro ao adicionar comentário.");
    }
  };

  const showLikedPosts = () => {
    if (!userId) return;

    getLikedPosts(userId)
      .then(res => setPosts(res.data))
      .catch(err => {
        console.error("Erro ao buscar posts curtidos:", err);
        alert("Erro ao buscar posts curtidos.");
      });
  };

  const showFavoritedPosts = async () => {
    if (!userId) return;

    try {
      const favoritedRes = await getFavoritedPosts(userId);
      const posts = favoritedRes.data;
      setPosts(posts);
      setFavoritedPosts(buildReactionMap(posts));

      const likedRes = await getLikedPosts(userId);
      setLikedPosts(buildReactionMap(likedRes.data));
    } catch (err) {
      console.error("Erro ao buscar posts salvos:", err);
      alert("Erro ao buscar posts salvos.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/feed/filter?type=${searchType}&query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao buscar');

      const results = await response.json();
      setPosts(results);

      const [likedRes, favoritedRes] = await Promise.all([
        getLikedPosts(userId),
        getFavoritedPosts(userId)
      ]);

      setLikedPosts(buildReactionMap(likedRes.data));
      setFavoritedPosts(buildReactionMap(favoritedRes.data));
    } catch (err) {
      console.error("Erro na busca:", err);
      alert("Erro ao realizar busca.");
    }
  };

  return (
    <div className={darkMode ? 'feed dark-mode' : 'feed light-mode'}>
      <button className="toggle-theme" onClick={() => setDarkMode(!darkMode)}>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>

      <div className="top-search-bar">
        <div className="icon-group">
          <button className="add-post-btn" onClick={() => setShowPostForm(true)}>+</button>
          <button className="icon-btn heart-btn" onClick={showLikedPosts}>
            <FontAwesomeIcon icon={regularHeart} style={{ fontSize: '22px' }} />
          </button>
          <button className="icon-btn1" onClick={showFavoritedPosts}>
            <FontAwesomeIcon icon={regularBookmark} />
          </button>
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Pesquise"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <select className="search-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="posts">Posts</option>
            <option value="users">Usuários</option>
          </select>
          <button className="search-btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {showPostForm && (
        <div className="form-novo-post">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Escreva seu post aqui..."
          />
          <button onClick={handleCreatePost}>Publicar</button>
          <button onClick={() => setShowPostForm(false)}>Cancelar</button>
        </div>
      )}

      <div className="feed-container">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="user-info">
              <span className="user-name">
                <strong>{post.username || 'Usuário'}</strong> | <span>{post.email || ''}</span>
              </span>
            </div>

            <div className="post-text">{post.content}</div>

            <div className="actions">
              <div className="actions-left">
                <FontAwesomeIcon
                  icon={likedPosts[post.id] ? solidHeart : regularHeart}
                  className={`action-icon ${likedPosts[post.id] ? 'icon-liked' : ''}`}
                  onClick={() => handleToggleLike(post.id)}
                />
                <FontAwesomeIcon icon={faComment} className="action-icon" onClick={() => toggleCommentInput(post.id)} />
                <FontAwesomeIcon icon={faPaperPlane} className="action-icon" />
              </div>
              <div className="actions-right">
                <FontAwesomeIcon
                  icon={favoritedPosts[post.id] ? solidBookmark : regularBookmark}
                  className={`action-icon ${favoritedPosts[post.id] ? 'icon-favorited' : ''}`}
                  onClick={() => handleToggleFavorite(post.id)}
                />
              </div>
            </div>

            <div className="comment-section">
              {(expandedPosts[post.id] ? post.comments : post.comments?.slice(0, 1) || []).map((c, i) => (
                <p key={i}>
                  <strong>{c.username}</strong> {c.commentText}
                  <br />
                  <span className="comment-date">
                    {new Date(c.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: false
                    })}
                  </span>
                </p>
              ))}
              {(post.comments?.length || 0) > 1 && (
                <span className="ver-mais" onClick={() => toggleExpandComments(post.id)}>
                  {expandedPosts[post.id] ? '▲ Ver Menos comentários' : '▼ Ver Mais comentários'}
                </span>
              )}
            </div>

            {visibleCommentForms[post.id] && (
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Adicionar um comentário..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                />
                <button onClick={() => handleCommentSubmit(post.id)}>Comentar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;