package com.brasfi.demo.dto;

import com.brasfi.demo.model.ForumCommunity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor 
public class ForumCommunityResponseDTO {

    private Long id;
    private String title;
    private String description;
    private UserSummaryDTO author;
    private Instant createdAt;
    private Instant updatedAt;
    private int postCount;

    public ForumCommunityResponseDTO(Long id, String title, String description, UserSummaryDTO author, Instant createdAt, Instant updatedAt, int postCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.postCount = postCount;
    }

    public ForumCommunityResponseDTO(Long id, String title, String description, String authorUsername, Instant createdAt, long postCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        if (authorUsername != null) {
            this.author = new UserSummaryDTO(null, authorUsername);
        }
        this.createdAt = createdAt;
        this.updatedAt = null; // A query otimizada não busca este campo
        this.postCount = (int) postCount;
    }
}