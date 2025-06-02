import { useState } from 'react';
import { vote } from '../services/forumService';

const PostVotes = ({ postId, score }) => {
  const [voteScore, setVoteScore] = useState(score);
  const [userVote, setUserVote] = useState(null); // 'UPVOTE', 'DOWNVOTE' ou null

  const handleVote = async (tipo) => {
    try {
      const res = await vote({
        postId: postId,
        voteType: tipo,
      });

      setVoteScore(res.newVoteScore);
      setUserVote(res.newVoteStatus); // 'UPVOTE', 'DOWNVOTE', ou null
    } catch (err) {
      console.error('Erro ao votar:', err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={() => handleVote('UPVOTE')}
        style={{
          color: userVote === 'UPVOTE' ? 'green' : 'black',
        }}
      >
        👍
      </button>

      <span>{voteScore}</span>

      <button
        onClick={() => handleVote('DOWNVOTE')}
        style={{
          color: userVote === 'DOWNVOTE' ? 'red' : 'black',
        }}
      >
        👎
      </button>
    </div>
  );
};

export default PostVotes;
