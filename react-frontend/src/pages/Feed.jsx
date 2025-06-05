import './Feed.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as regularHeart,
  faComment,
  faPaperPlane,
  faBookmark as regularBookmark,
} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as solidHeart,
  faBookmark as solidBookmark,
  faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import {
  getGeneralFeed,
  createPost,
  getLikedPosts,
  toggleLikeAPI,
} from '../services/feedService';

const Feed = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [favoritedPosts, setFavoritedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [novoPost, setNovoPost] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleCriarPost = () => {
    if (novoPost.trim() === '') return;

    const post = {
      content: novoPost,
      postType: 'text',
    };

    createPost(userId, post)
      .then((res) => {
        console.log('Post criado com sucesso:', res.data);
        setNovoPost('');
        setMostrarFormulario(false);
        return getGeneralFeed();
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error('Erro ao criar post:', err);
        alert('Erro ao criar post.');
      });
  };

  const handleMostrarCurtidos = () => {
    getLikedPosts(userId)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar posts curtidos:", err);
      });
  };

  useEffect(() => {
    getGeneralFeed()
      .then((response) => {
        setPosts(response.data);
        return getLikedPosts(userId);
      })
      .then((res) => {
        const likedMap = {};
        res.data.forEach(post => {
          likedMap[post.id] = true;
        });
        setLikedPosts(likedMap);
      })
      .catch((error) => {
        console.error('Erro ao carregar feed ou curtidas:', error);
      });
  }, [userId]);

  const toggleLike = (postId) => {
    toggleLikeAPI(userId, postId)
      .then(() => {
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId]
        }));
      })
      .catch((err) => {
        console.error('Erro ao curtir/descurtir post:', err);
        alert('Erro ao curtir/descurtir post.');
      });
  };

  const toggleFavorite = (postId) => {
    setFavoritedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className={darkMode ? 'feed dark-mode' : 'feed light-mode'}>
      <button className="toggle-theme" onClick={() => setDarkMode(!darkMode)}>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>

      <div className="top-search-bar">
        <div className="icon-group">
          <button className="icon-btn" onClick={() => setMostrarFormulario(true)}>
            <img src="/static/images/postar.png" alt="Postar" className="icon-image" />
          </button>
          <button className="icon-btn heart-btn" onClick={handleMostrarCurtidos}>
            <FontAwesomeIcon icon={regularHeart} style={{ fontSize: '22px' }} />
          </button>
          <button className="icon-btn1">
            <FontAwesomeIcon icon={regularBookmark} className="action-icon" />
          </button>
        </div>
        <SearchBar />
      </div>

      {mostrarFormulario && (
        <div className="form-novo-post">
          <textarea
            value={novoPost}
            onChange={(e) => setNovoPost(e.target.value)}
            placeholder="Escreva seu post aqui..."
          />
          <button onClick={handleCriarPost}>Publicar</button>
          <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </div>
      )}

      <div className="feed-container">
        {(posts || []).map((post) => (
          <div className="post-card" key={post.id}>
            <div className="user-info">
              <span className="user-name">
                <strong>{post.user?.username || 'Usuário'}</strong> | <span>{post.user?.email || ''}</span>
              </span>
            </div>

            <div className="post-text">{post.content}</div>

            <div className="actions">
              <div className="actions-left">
                <FontAwesomeIcon
                  icon={likedPosts[post.id] ? solidHeart : regularHeart}
                  className="action-icon"
                  style={{ color: likedPosts[post.id] ? 'red' : 'black', cursor: 'pointer' }}
                  onClick={() => toggleLike(post.id)}
                />
                <FontAwesomeIcon icon={faComment} className="action-icon" style={{ cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faPaperPlane} className="action-icon" style={{ cursor: 'pointer' }} />
              </div>
              <div className="actions-right">
                <FontAwesomeIcon
                  icon={favoritedPosts[post.id] ? solidBookmark : regularBookmark}
                  className="action-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleFavorite(post.id)}
                />
              </div>
            </div>

            <div className="comment-section">
              {(expandedPosts[post.id] ? (post.comments || []) : (post.comments || []).slice(0, 1)).map((c, i) => (
                <p key={i}>
                  <strong>{c.user}</strong> {c.text}
                </p>
              ))}
              {(post.comments || []).length > 1 && (
                <span className="ver-mais" onClick={() => toggleComments(post.id)}>
                  {expandedPosts[post.id] ? '▲ Ver Menos comentários' : '▼ Ver Mais comentários'}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="refresh">
          <img src="/static/images/carregamento.png" alt="Carregando..." className="loading-icon" />
        </div>
      </div>
    </div>
  );
};

export default Feed;
