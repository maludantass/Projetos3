package com.brasfi.demo.dto;

import com.brasfi.demo.model.Post;

public class PostResponseDTO {
    private Long id;
    private String content;
    private String username;
    private String email;

    public PostResponseDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.username = post.getUser().getUsername();
        this.email = post.getUser().getEmail();
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
}