import { useState } from 'react';
import { vote } from '../services/forumService';

const PostVotes = ({ postId, initialScore }) => {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(null); // UPVOTE, DOWNVOTE ou null

  const handleVote = async (voteType) => {
    const isRemoving = userVote === voteType;

    try {
      const res = await vote({
        postId,
        voteType: isRemoving ? null : voteType, // Remove o voto se clicar de novo
      });

      setScore(res.newVoteScore);
      setUserVote(res.newVoteStatus); // UPVOTE, DOWNVOTE ou null
    } catch (err) {
      console.error('Erro ao votar no post:', err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={() => handleVote('UPVOTE')}
        style={{ color: userVote === 'UPVOTE' ? 'green' : 'black' }}
      >
        👍
      </button>
      <span>{score}</span>
      <button
        onClick={() => handleVote('DOWNVOTE')}
        style={{ color: userVote === 'DOWNVOTE' ? 'red' : 'black' }}
      >
        👎
      </button>
    </div>
  );
};

export default PostVotes;
