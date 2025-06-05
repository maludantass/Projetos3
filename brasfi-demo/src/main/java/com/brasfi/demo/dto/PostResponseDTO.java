package com.brasfi.demo.dto;

import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.Comment;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PostResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String email;
    private int likesCount;
    private int commentsCount;
    private List<CommentResponseDTO> commentsList;

    // ✅ Construtor corrigido, seguro contra valores nulos
    public PostResponseDTO(Post post) {
    this.id = post.getId();
    this.content = post.getContent();

    if (post.getUser() != null) {
        this.username = post.getUser().getUsername();
        this.email = post.getUser().getEmail();
    } else {
        this.username = "Desconhecido";
        this.email = "";
    }

    this.likesCount = post.getLikes() != null ? post.getLikes().size() : 0;
    this.commentsCount = post.getComments() != null ? post.getComments().size() : 0;

    if (post.getComments() != null) {
        this.commentsList = post.getComments().stream()
            .map(CommentResponseDTO::new)
            .collect(Collectors.toList());
    } else {
        this.commentsList = new ArrayList<>();
    }
}


    // Getters
    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public List<CommentResponseDTO> getCommentsList() {
        return commentsList;
    }
}
