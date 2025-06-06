package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumCommunityRequestDTO;
import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import com.brasfi.demo.services.ForumCommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum/communities")
@RequiredArgsConstructor
public class ForumCommunityController {

    private final ForumCommunityService forumCommunityService;

    @PostMapping("/{authorId}")
    public ResponseEntity<ForumCommunityResponseDTO> createCommunity(
            @PathVariable Long authorId,
            @Valid @RequestBody ForumCommunityRequestDTO requestDTO) {
        ForumCommunityResponseDTO createdCommunity = forumCommunityService.createCommunity(authorId, requestDTO);
        return new ResponseEntity<>(createdCommunity, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ForumCommunityResponseDTO>> getAllCommunities(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.getAllCommunities(pageable);
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<ForumCommunityResponseDTO> getCommunityById(@PathVariable Long communityId) {
        ForumCommunityResponseDTO community = forumCommunityService.getCommunityById(communityId);
        return ResponseEntity.ok(community);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ForumCommunityResponseDTO>> searchCommunitiesByTitle(
            @RequestParam String titleQuery,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.searchCommunitiesByTitle(titleQuery, pageable);
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/author/{username}")
    public ResponseEntity<Page<ForumCommunityResponseDTO>> getCommunitiesByAuthorUsername(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.getCommunitiesByAuthorUsername(username, pageable);
        return ResponseEntity.ok(communities);
    }

    @PutMapping("/{communityId}")
    public ResponseEntity<ForumCommunityResponseDTO> updateCommunity(
            @PathVariable Long communityId,
            @Valid @RequestBody ForumCommunityRequestDTO requestDTO) {
        ForumCommunityResponseDTO updatedCommunity = forumCommunityService.updateCommunity(communityId, requestDTO);
        return ResponseEntity.ok(updatedCommunity);
    }

    @DeleteMapping("/{communityId}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long communityId) {
        forumCommunityService.deleteCommunity(communityId);
        return ResponseEntity.noContent().build();
    }
}