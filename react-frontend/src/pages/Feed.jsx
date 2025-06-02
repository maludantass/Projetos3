import './Feed.css';
import { useState } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';

const posts = [
  {
    id: 'post1',
    user: 'João Pedro Pessoa',
    handle: 'jpp@brasfi',
    text: `A Trilha COP30 BRASFI é um projeto composto por diversas iniciativas lideradas pelo Hub de Networking da BRASFI...`,
    comments: [
      { user: 'jpp@brasfi', text: 'Espero vocês conosco na Trilha COP 30!!' },
      { user: 'mfds@brasfi', text: 'Mal posso esperar pelo evento!! 🌟' },
      { user: 'jdn@brasfi', text: '👏👏👏' },
    ],
  },
  {
    id: 'post2',
    user: 'Fernando Marques de Noronha',
    handle: 'fmn@brasfi',
    text: `Tenho aprendido na prática que cuidar do dinheiro é um hábito, não uma fase... #FinançasPessoais #VidaFinanceira`,
    comments: [
      { user: 'pnjb@brasfi', text: '👏👏👏👏👏' },
      { user: 'lrjds@brasfi', text: 'Nem sempre é só sobre ter dinheiro! Disse tudo amigo!' },
    ],
  },
  {
    id: 'post3',
    user: 'Marcelo Vasconcelos',
    handle: 'mvmb@brasfi',
    isRepost: true,
    original: {
      user: 'Ronaldo Queiroz',
      handle: 'rqm@brasfi',
      text: `Organizar as finanças não é sobre ganhar mais, é sobre gastar melhor. Cada real conta. #FinançasPessoais #EducaçãoFinanceira`,
    },
    text: `Comecei a me preocupar mais com minhas finanças... #FinançasPessoais`,
    comments: [
      { user: 'faol@brasfi', text: 'Falou tudo!' },
    ],
  },
];

const Feed = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const [favoritedPosts, setFavoritedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleFavorite = (postId) => {
    setFavoritedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
<div className="top-search-bar">
  <div className="icon-group">
    <button className="icon-btn">
      <img src="/static/images/postar.png" alt="Postar" className="icon-image" />
    </button>
  </div>

  <SearchBar />
</div>

      <div className="feed-container">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="user-info">
              <span className="user-name">
                <strong>{post.user}</strong> | <span>{post.handle}</span>
              </span>
              {post.isRepost && <span className="repost-label">respostou</span>}
            </div>

            {post.isRepost && post.original && (
              <div className="repost-block">
                <strong>{post.original.user}</strong> | {post.original.handle}
                <p>{post.original.text}</p>
              </div>
            )}

            <div className="post-text">{post.text}</div>

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
              {(expandedPosts[post.id] ? post.comments : post.comments.slice(0, 1)).map((c, i) => (
                <p key={i}>
                  <strong>{c.user}</strong> {c.text}
                </p>
              ))}
              {post.comments.length > 1 && (
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
