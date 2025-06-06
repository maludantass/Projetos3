import './Feed.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
  const [novoPost, setNovoPost] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('posts');
  const [newComments, setNewComments] = useState({});
  const [commentFormsVisible, setCommentFormsVisible] = useState({});

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
      .then((posts) => {
        setPosts(posts);
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
        console.error('Erro ao carregar feed:', error);
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

  const toggleCommentForm = (postId) => {
    setCommentFormsVisible(prev => ({
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
      .then(() => {
        setNovoPost('');
        setMostrarFormulario(false);
        return getGeneralFeed();
      })
      .then((res) => {
        setPosts(res.data);
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

const handleAddComment = async (postId) => {
  const text = newComments[postId];
  if (!text || !userId) return;

  try {
    await addComment(postId, userId, text);

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), { username: 'Você', commentText: text }],
            }
          : post
      )
    );

    setNewComments((prev) => ({ ...prev, [postId]: '' }));
    setCommentFormsVisible((prev) => ({ ...prev, [postId]: false })); // fecha campo após comentar
    setExpandedPosts((prev) => ({ ...prev, [postId]: true })); // expande para mostrar todos
  } catch (err) {
    console.error("Erro ao adicionar comentário:", err);
    alert("Erro ao adicionar comentário.");
  }
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

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/feed/filter?type=${type}&query=${query}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar');

      const data = await res.json();
      setPosts(data);

      const [likedRes, favoritedRes] = await Promise.all([
        getLikedPosts(userId),
        getFavoritedPosts(userId),
      ]);

      const likedMap = {};
      likedRes.data.forEach(post => {
        likedMap[post.id] = true;
      });
      setLikedPosts(likedMap);

      const favoritedMap = {};
      favoritedRes.data.forEach(post => {
        favoritedMap[post.id] = true;
      });
      setFavoritedPosts(favoritedMap);

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

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Pesquise"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <select className="search-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="posts">Posts</option>
            <option value="users">Usuários</option>
          </select>
          <button className="search-btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
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
                <FontAwesomeIcon
                  icon={faComment}
                  className="action-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleCommentForm(post.id)}
                />
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
    <strong>{c.username}</strong> {c.commentText}
  </p>
))}

              {(post.comments || []).length > 1 && (
                <span className="ver-mais" onClick={() => toggleComments(post.id)}>
                  {expandedPosts[post.id] ? '▲ Ver Menos comentários' : '▼ Ver Mais comentários'}
                </span>
              )}
            </div>

            {commentFormsVisible[post.id] && (
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Adicionar um comentário..."
                  value={newComments[post.id] || ''}
                  onChange={(e) =>
                    setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                />
                <button onClick={() => handleAddComment(post.id)}>Comentar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
