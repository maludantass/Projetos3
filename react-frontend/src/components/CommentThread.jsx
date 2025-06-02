import { useState } from 'react';
import { getRepliesForComment, createComment } from '../services/forumService';
import CommentVotes from './CommentVotes';

const CommentThread = ({ comment, level = 0 }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');

  const carregarRespostas = async () => {
    try {
      const res = await getRepliesForComment(comment.id);
      setReplies(res.content);
      setShowReplies(true);
    } catch (err) {
      console.error('Erro ao carregar respostas:', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({
        postId: comment.postId,
        parentCommentId: comment.id,
        text: newReply,
      });
      setNewReply('');
      carregarRespostas();
    } catch (err) {
      console.error('Erro ao criar resposta:', err);
    }
  };

  return (
    <div
      style={{
        marginLeft: level * 20,
        borderLeft: level > 0 ? '1px solid #ccc' : 'none',
        paddingLeft: 10,
        marginTop: 10,
      }}
    >
      <p>{comment.text}</p>
      <CommentVotes
        commentId={comment.id}
        voteScore={comment.voteScore || 0}
        initialUserVote={null}
      />

      <button onClick={() => (showReplies ? setShowReplies(false) : carregarRespostas())}>
        {showReplies ? 'Esconder respostas' : 'Ver respostas'}
      </button>

      {showReplies &&
        replies.map((reply) => (
          <CommentThread key={reply.id} comment={reply} level={level + 1} />
        ))}

      <form onSubmit={handleReplySubmit} style={{ marginTop: '8px' }}>
        <input
          type="text"
          placeholder="Responder comentário..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          required
        />
        <button type="submit">Responder</button>
      </form>
    </div>
  );
};

export default CommentThread;
