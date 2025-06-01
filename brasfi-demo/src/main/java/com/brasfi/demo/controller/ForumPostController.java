package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumPostRequestDTO;
import com.brasfi.demo.dto.ForumPostResponseDTO;
import com.brasfi.demo.services.ForumPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum/posts") // Caminho base para posts
@RequiredArgsConstructor
@Slf4j
public class ForumPostController {

    private final ForumPostService forumPostService;

    // Endpoint para CRIAR um novo post
    // O ForumPostRequestDTO contém o forumCommunityId
    @PostMapping
    public ResponseEntity<ForumPostResponseDTO> createPost(@Valid @RequestBody ForumPostRequestDTO requestDTO) {
        log.info("API request para criar novo ForumPost com título: {} na comunidade ID: {}",
                requestDTO.getTitle(), requestDTO.getForumCommunityId());
        ForumPostResponseDTO createdPost = forumPostService.createPost(requestDTO);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // Endpoint para LISTAR posts de uma comunidade específica (paginado)
    // Exemplo de URL: /api/forum/posts/community/1?page=0&size=10&sort=createdAt,desc
    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<ForumPostResponseDTO>> getPostsByCommunity(
            @PathVariable Long communityId,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        log.info("API request para listar posts da comunidade ID: {}, paginação: {}", communityId, pageable);
        Page<ForumPostResponseDTO> posts = forumPostService.getPostsByCommunity(communityId, pageable);
        return ResponseEntity.ok(posts);
    }

    // Endpoint para BUSCAR um post específico por ID
    @GetMapping("/{postId}")
    public ResponseEntity<ForumPostResponseDTO> getPostById(@PathVariable Long postId) {
        log.info("API request para buscar ForumPost por ID: {}", postId);
        ForumPostResponseDTO post = forumPostService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // Endpoint para ATUALIZAR um post existente
    @PutMapping("/{postId}")
    public ResponseEntity<ForumPostResponseDTO> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody ForumPostRequestDTO requestDTO) {
        log.info("API request para atualizar ForumPost ID: {}", postId);
        // A validação de forumCommunityId no requestDTO para update pode ser opcional
        // ou verificada no serviço se o post pode mudar de comunidade (geralmente não).
        // Por enquanto, o DTO de request é o mesmo da criação.
        ForumPostResponseDTO updatedPost = forumPostService.updatePost(postId, requestDTO);
        return ResponseEntity.ok(updatedPost);
    }

    // Endpoint para DELETAR um post
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        log.info("API request para deletar ForumPost ID: {}", postId);
        forumPostService.deletePost(postId);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }

    // Endpoint para PESQUISAR posts por título dentro de uma comunidade (paginado)
    // Exemplo de URL: /api/forum/posts/community/1/search?titleQuery=Dicas&page=0&size=5
    @GetMapping("/community/{communityId}/search")
    public ResponseEntity<Page<ForumPostResponseDTO>> searchPostsByTitleInCommunity(
            @PathVariable Long communityId,
            @RequestParam String titleQuery,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        log.info("API request para pesquisar posts na comunidade ID {} com título: {}, paginação: {}",
                communityId, titleQuery, pageable);
        Page<ForumPostResponseDTO> posts = forumPostService.searchPostsByTitleInCommunity(communityId, titleQuery, pageable);
        return ResponseEntity.ok(posts);
    }

    // Endpoint para LISTAR posts por autor (username) (paginado)
    // Exemplo de URL: /api/forum/posts/author/nomeDoUsuario?page=0&size=5
    @GetMapping("/author/{username}")
    public ResponseEntity<Page<ForumPostResponseDTO>> getPostsByAuthorUsername(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "createdAt,desc") Pageable pageable) {
        log.info("API request para listar posts pelo autor: {}, paginação: {}", username, pageable);
        Page<ForumPostResponseDTO> posts = forumPostService.getPostsByAuthorUsername(username, pageable);
        return ResponseEntity.ok(posts);
    }
}