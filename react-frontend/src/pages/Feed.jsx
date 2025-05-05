import '../../feed.css';
import SearchBar from './SearchBar';
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
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const Feed = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const [favoritedPosts, setFavoritedPosts] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleFavorite = (postId) => {
    setFavoritedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <br />
      <SearchBar />

      <div className="feed-container">
        {['post1', 'post2'].map((postId, index) => (
          <div className="post-card" key={postId}>
            <div className="user-info">
              <img
                className="user-avatar"
                src="static/images/amanda2.jpg"
                alt="Imagem da postagem"
              />
              <span>amandamontarroios</span>
            </div>
            <img
              className="post-image"
              src={
                index === 0
                  ? 'static/images/amanda.jpg'
                  : 'static/images/tanque.jpg'
              }
              alt="Imagem da postagem"
            />
            <div className="actions">
              <div className="actions-left">
                <FontAwesomeIcon
                  icon={likedPosts[postId] ? solidHeart : regularHeart}
                  className="action-icon"
                  style={{ color: likedPosts[postId] ? 'red' : 'black', cursor: 'pointer' }}
                  onClick={() => toggleLike(postId)}
                />
                <FontAwesomeIcon
                  icon={faComment}
                  className="action-icon"
                  style={{ cursor: 'pointer' }}
                />
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="action-icon"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="actions-right">
                <FontAwesomeIcon
                  icon={favoritedPosts[postId] ? solidBookmark : regularBookmark}
                  className="action-icon"
                  style={{ color: favoritedPosts[postId] ? 'black' : 'black', cursor: 'pointer' }}
                  onClick={() => toggleFavorite(postId)}
                />
              </div>
            </div>
            <div className="comment-block">
              <strong>
                {index === 0 ? 'amandamontarroios' : 'username'}
              </strong>{' '}
              AFF que vibe boa galeraaa<br />
              <br />
              <span>majudantas:</span> eca feia
            </div>
          </div>
        ))}

        <div className="refresh">
          <FontAwesomeIcon icon={faSpinner} spin className="action-icon" />
        </div>
      </div>
    </div>
  );
};

export default Feed;
