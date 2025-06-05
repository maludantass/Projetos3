package com.brasfi.demo.dto;

import com.brasfi.demo.model.Comment;
import java.time.LocalDateTime;

public class CommentResponseDTO {
    private Long id;
    private String commentText;
    private String username; // Nome do autor do comentário
    private LocalDateTime createdAt;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId();
        this.commentText = comment.getCommentText();
        if (comment.getUser() != null) {
            this.username = comment.getUser().getUsername();
        }
        this.createdAt = comment.getCreatedAt();
    }

    // Getters
    public Long getId() { return id; }
    public String getCommentText() { return commentText; }
    public String getUsername() { return username; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
