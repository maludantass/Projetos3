package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumCommunityRequestDTO;
import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import com.brasfi.demo.services.ForumCommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class ForumCommunityController {

    private final ForumCommunityService forumCommunityService;

    // Endpoint para CRIAR uma nova comunidade
    @PostMapping("/{authorId}")
    public ResponseEntity<ForumCommunityResponseDTO> createCommunity(
            @PathVariable Long authorId,
            @Valid @RequestBody ForumCommunityRequestDTO requestDTO) {
        log.info("API request para criar nova ForumCommunity pelo autor ID: {}", authorId);
        ForumCommunityResponseDTO createdCommunity = forumCommunityService.createCommunity(authorId, requestDTO);
        return new ResponseEntity<>(createdCommunity, HttpStatus.CREATED);
    }

    // Endpoint para LISTAR todas as comunidades (com paginação)
    @GetMapping
    public ResponseEntity<Page<ForumCommunityResponseDTO>> getAllCommunities(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API request para listar todas as ForumCommunities paginadas: {}", pageable);
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.getAllCommunities(pageable);
        return ResponseEntity.ok(communities);
    }

    // Endpoint para BUSCAR uma comunidade por ID
    @GetMapping("/{communityId}")
    public ResponseEntity<ForumCommunityResponseDTO> getCommunityById(@PathVariable Long communityId) {
        log.info("API request para buscar ForumCommunity por ID: {}", communityId);
        ForumCommunityResponseDTO community = forumCommunityService.getCommunityById(communityId);
        return ResponseEntity.ok(community);
    }

    // Endpoint para PESQUISAR comunidades por título (com paginação)
    @GetMapping("/search")
    public ResponseEntity<Page<ForumCommunityResponseDTO>> searchCommunitiesByTitle(
            @RequestParam String titleQuery,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API request para pesquisar ForumCommunities com título: {}, paginação: {}", titleQuery, pageable);
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.searchCommunitiesByTitle(titleQuery, pageable);
        return ResponseEntity.ok(communities);
    }

    // Endpoint para LISTAR comunidades por autor (username) (com paginação)
    @GetMapping("/author/{username}")
    public ResponseEntity<Page<ForumCommunityResponseDTO>> getCommunitiesByAuthorUsername(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API request para listar ForumCommunities pelo autor: {}, paginação: {}", username, pageable);
        Page<ForumCommunityResponseDTO> communities = forumCommunityService.getCommunitiesByAuthorUsername(username, pageable);
        return ResponseEntity.ok(communities);
    }

    // Endpoint para ATUALIZAR uma comunidade existente
    @PutMapping("/{communityId}")
    public ResponseEntity<ForumCommunityResponseDTO> updateCommunity(
            @PathVariable Long communityId,
            @Valid @RequestBody ForumCommunityRequestDTO requestDTO) {
        log.info("API request para atualizar ForumCommunity ID: {}", communityId);
        ForumCommunityResponseDTO updatedCommunity = forumCommunityService.updateCommunity(communityId, requestDTO);
        return ResponseEntity.ok(updatedCommunity);
    }

    // Endpoint para DELETAR uma comunidade
    @DeleteMapping("/{communityId}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long communityId) {
        log.info("API request para deletar ForumCommunity ID: {}", communityId);
        forumCommunityService.deleteCommunity(communityId);
        return ResponseEntity.noContent().build();
    }
}