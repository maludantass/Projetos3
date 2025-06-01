package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumCommentRequestDTO;
import com.brasfi.demo.dto.ForumCommentResponseDTO;
import com.brasfi.demo.dto.ForumCommentUpdateRequestDTO; // DTO específico para atualização
import com.brasfi.demo.services.ForumCommentService;
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
@RequestMapping("/api/forum") // Um caminho base comum para o fórum
@RequiredArgsConstructor
@Slf4j
public class ForumCommentController {

    private final ForumCommentService forumCommentService;

    // Endpoint para CRIAR um novo comentário
    // O ForumCommentRequestDTO contém postId e, opcionalmente, parentCommentId
    @PostMapping("/comments")
    public ResponseEntity<ForumCommentResponseDTO> createComment(@Valid @RequestBody ForumCommentRequestDTO requestDTO) {
        log.info("API request para criar novo ForumComment para post ID: {} (pai ID: {})",
                requestDTO.getPostId(), requestDTO.getParentCommentId());
        ForumCommentResponseDTO createdComment = forumCommentService.createComment(requestDTO);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // Endpoint para LISTAR comentários de nível superior de um post (paginado)
    // Exemplo de URL: /api/forum/posts/1/comments?page=0&size=10&sort=createdAt,asc
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<ForumCommentResponseDTO>> getCommentsByPost(
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "createdAt,asc") Pageable pageable) {
        log.info("API request para listar comentários do post ID: {}, paginação: {}", postId, pageable);
        Page<ForumCommentResponseDTO> comments = forumCommentService.getCommentsByPost(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    // Endpoint para LISTAR respostas diretas a um comentário pai (paginado)
    // Exemplo de URL: /api/forum/comments/5/replies?page=0&size=5&sort=createdAt,asc
    @GetMapping("/comments/{parentCommentId}/replies")
    public ResponseEntity<Page<ForumCommentResponseDTO>> getRepliesForComment(
            @PathVariable Long parentCommentId,
            @PageableDefault(size = 5, sort = "createdAt,asc") Pageable pageable) {
        log.info("API request para listar respostas do comentário ID: {}, paginação: {}", parentCommentId, pageable);
        Page<ForumCommentResponseDTO> replies = forumCommentService.getRepliesForComment(parentCommentId, pageable);
        return ResponseEntity.ok(replies);
    }

    // Endpoint para BUSCAR um comentário específico por ID
    // (Pode ser menos comum de usar diretamente, mas útil para buscar um comentário específico se o ID for conhecido)
    @GetMapping("/comments/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> getCommentById(@PathVariable Long commentId) {
        log.info("API request para buscar ForumComment por ID: {}", commentId);
        ForumCommentResponseDTO comment = forumCommentService.getCommentDtoById(commentId); // Usando o método específico do serviço
        return ResponseEntity.ok(comment);
    }


    // Endpoint para ATUALIZAR o texto de um comentário existente
    // Para atualização, geralmente só permitimos mudar o texto.
    // Vamos criar um DTO específico para isso.
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody ForumCommentUpdateRequestDTO updateRequestDTO) {
        log.info("API request para atualizar ForumComment ID: {}", commentId);
        ForumCommentResponseDTO updatedComment = forumCommentService.updateComment(commentId, updateRequestDTO.getText());
        return ResponseEntity.ok(updatedComment);
    }

    // Endpoint para DELETAR um comentário
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        log.info("API request para deletar ForumComment ID: {}", commentId);
        forumCommentService.deleteComment(commentId);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}