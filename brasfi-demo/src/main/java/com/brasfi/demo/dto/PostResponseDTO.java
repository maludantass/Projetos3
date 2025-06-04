package com.brasfi.demo.dto;

import com.brasfi.demo.model.Post;

public class PostResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String email;
    private int likesCount; //Novo campo para contagem de likes
    private int commentsCount; //Novo campo pra contagem de comentários

    public PostResponseDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.username = post.getUser().getUsername();
        this.email = post.getUser().getEmail();
        this.likesCount = post.getLikes() != null ? post.getLikes().size() : 0; //Nova inicialização
        this.commentsCount = post.getComments() != null ? post.getComments().size() : 0;
    }

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

    public int getLikesCount() { //Novo método getter!
        return likesCount;
    }

    public int getCommentsCount() {
    return commentsCount;
}
}