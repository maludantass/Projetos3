import { useState } from 'react';
import { vote } from '../services/forumService';

const CommentVotes = ({ commentId, voteScore, initialUserVote }) => {
  const [score, setScore] = useState(voteScore);
  const [userVote, setUserVote] = useState(initialUserVote); // null, 'UPVOTE', 'DOWNVOTE'

  const handleVote = async (voteType) => {
    const isRemoving = userVote === voteType;
    try {
      const response = await vote({
        commentId,
        voteType: isRemoving ? null : voteType,
      });

      setScore(response.newVoteScore);
      setUserVote(response.newVoteStatus);
    } catch (error) {
      console.error('Erro ao votar no comentário:', error);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={() => handleVote('UPVOTE')}
        style={{ color: userVote === 'UPVOTE' ? 'green' : 'gray' }}
      >
        👍
      </button>
      <span>{score}</span>
      <button
        onClick={() => handleVote('DOWNVOTE')}
        style={{ color: userVote === 'DOWNVOTE' ? 'red' : 'gray' }}
      >
        👎
      </button>
    </div>
  );
};

export default CommentVotes;
