import { useState } from 'react';
import { vote } from '../services/forumService';

const PostVotes = ({ post }) => {
  const [voteCount, setVoteCount] = useState(post.voteScore || 0);
  const [userVote, setUserVote] = useState(post.userVoteType || null); // 'UP', 'DOWN' ou null

  const votar = async (tipo) => {
    try {
      const res = await vote({ postId: post.id, voteType: tipo });
      setVoteCount(res.voteScore);
      setUserVote(res.userVoteType);
    } catch (err) {
      console.error('Erro ao votar:', err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button onClick={() => votar('UP')} disabled={userVote === 'UP'}>
        👍
      </button>
      <span>{voteCount}</span>
      <button onClick={() => votar('DOWN')} disabled={userVote === 'DOWN'}>
        👎
      </button>
    </div>
  );
};

export default PostVotes;
