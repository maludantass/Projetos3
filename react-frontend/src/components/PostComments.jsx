import { useEffect, useState } from 'react';
import { getCommentsByPost } from '../services/forumService';

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getCommentsByPost(postId)
      .then(setComments)
      .catch((err) => console.error(`Erro ao buscar comentários do post ${postId}:`, err));
  }, [postId]);

  return (
    <div style={{ marginLeft: '1rem' }}>
      <h4>Comentários:</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostComments;
