package com.brasfi.demo.services;

import org.springframework.stereotype.Service;
import com.brasfi.demo.model.Comment;
import com.brasfi.demo.repository.CommentRepository;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // Comentar em um post
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    // Buscar comentários por post
    public List<Comment> findCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    // Excluir um comentário
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
