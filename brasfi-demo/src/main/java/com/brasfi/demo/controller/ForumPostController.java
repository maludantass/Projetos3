package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumPostRequestDTO;
import com.brasfi.demo.dto.ForumPostResponseDTO;
import com.brasfi.demo.services.ForumPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum/posts")
@RequiredArgsConstructor
public class ForumPostController {

    private final ForumPostService forumPostService;

    @PostMapping
    public ResponseEntity<ForumPostResponseDTO> createPost(@Valid @RequestBody ForumPostRequestDTO requestDTO) {
        ForumPostResponseDTO createdPost = forumPostService.createPost(requestDTO);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<ForumPostResponseDTO>> getPostsByCommunity(
            @PathVariable Long communityId,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        Page<ForumPostResponseDTO> posts = forumPostService.getPostsByCommunity(communityId, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ForumPostResponseDTO> getPostById(@PathVariable Long postId) {
        ForumPostResponseDTO post = forumPostService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<ForumPostResponseDTO> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody ForumPostRequestDTO requestDTO) {
        ForumPostResponseDTO updatedPost = forumPostService.updatePost(postId, requestDTO);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        forumPostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/community/{communityId}/search")
    public ResponseEntity<Page<ForumPostResponseDTO>> searchPostsByTitleInCommunity(
            @PathVariable Long communityId,
            @RequestParam String titleQuery,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        Page<ForumPostResponseDTO> posts = forumPostService.searchPostsByTitleInCommunity(communityId, titleQuery, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/author/{username}")
    public ResponseEntity<Page<ForumPostResponseDTO>> getPostsByAuthorUsername(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        Page<ForumPostResponseDTO> posts = forumPostService.getPostsByAuthorUsername(username, pageable);
        return ResponseEntity.ok(posts);
    }
}