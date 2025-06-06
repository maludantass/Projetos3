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
  getLikedPosts,
  toggleLikeAPI,
  getFavoritedPosts,
  toggleFavoriteAPI,
  createPost
} from '../services/feedService';

const Feed = () => {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [favoritedPosts, setFavoritedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [novoPost, setNovoPost] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }
    setUserId(user.id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    getGeneralFeed()
      .then((response) => {
        setPosts(response.data);
        return getLikedPosts(userId);
      })
      .then((likedRes) => {
        const likedMap = {};
        likedRes.data.forEach(post => {
          likedMap[post.id] = true;
        });
        setLikedPosts(likedMap);

        return getFavoritedPosts(userId);
      })
      .then((favoritedRes) => {
        const favoritedMap = {};
        favoritedRes.data.forEach(post => {
          favoritedMap[post.id] = true;
        });
        setFavoritedPosts(favoritedMap);
      })
      .catch((error) => {
        console.error('Erro ao carregar feed, curtidas ou favoritos:', error);
      });
  }, [userId]);

  const toggleLike = (postId) => {
    if (!userId) return;
    toggleLikeAPI(userId, postId)
      .then(() => {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
      })
      .catch(err => console.error("Erro ao curtir post:", err));
  };

  const toggleFavorite = (postId) => {
    if (!userId) return;
    toggleFavoriteAPI(userId, postId)
      .then(() => {
        setFavoritedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
      })
      .catch(err => console.error("Erro ao favoritar post:", err));
  };

  const toggleComments = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCriarPost = () => {
    if (!novoPost.trim() || !userId) return;

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
        const novosPosts = res.data;
        setPosts(novosPosts);
        return getLikedPosts(userId);
      })
      .then((likedRes) => {
        const likedMap = {};
        likedRes.data.forEach(post => {
          likedMap[post.id] = true;
        });
        setLikedPosts(likedMap);
      })
      .catch((err) => {
        console.error('Erro ao criar post:', err);
        alert('Erro ao criar post.');
      });
  };

  const handleMostrarCurtidos = () => {
    if (!userId) return;

    getLikedPosts(userId)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar posts curtidos:", err);
        alert("Erro ao buscar posts curtidos.");
      });
  };

  const handleMostrarFavoritos = () => {
    if (!userId) return;

    getFavoritedPosts(userId)
      .then((favoritedRes) => {
        const savedPosts = favoritedRes.data;
        const favoritedMap = {};
        savedPosts.forEach(post => {
          favoritedMap[post.id] = true;
        });
        setPosts(savedPosts);
        setFavoritedPosts(favoritedMap);
        return getLikedPosts(userId);
      })
      .then((likedRes) => {
        const likedMap = {};
        likedRes.data.forEach(post => {
          likedMap[post.id] = true;
        });
        setLikedPosts(likedMap);
      })
      .catch((err) => {
        console.error("Erro ao buscar posts salvos:", err);
        alert("Erro ao buscar posts salvos.");
      });
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
          <button className="icon-btn1" onClick={handleMostrarFavoritos}>
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
                <strong>{post.username || 'Usuário'}</strong> | <span>{post.email || ''}</span>
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
      </div>
    </div>
  );
};

export default Feed;
