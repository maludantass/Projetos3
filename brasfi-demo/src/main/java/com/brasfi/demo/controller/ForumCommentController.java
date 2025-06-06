package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumCommentRequestDTO;
import com.brasfi.demo.dto.ForumCommentResponseDTO;
import com.brasfi.demo.dto.ForumCommentUpdateRequestDTO;
import com.brasfi.demo.services.ForumCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumCommentController {

    private final ForumCommentService forumCommentService;

    @PostMapping("/comments")
    public ResponseEntity<ForumCommentResponseDTO> createComment(@Valid @RequestBody ForumCommentRequestDTO requestDTO) {
        ForumCommentResponseDTO createdComment = forumCommentService.createComment(requestDTO);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<ForumCommentResponseDTO>> getCommentsByPost(
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "createdAt,asc") Pageable pageable) {
        Page<ForumCommentResponseDTO> comments = forumCommentService.getCommentsByPost(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments/{parentCommentId}/replies")
    public ResponseEntity<Page<ForumCommentResponseDTO>> getRepliesForComment(
            @PathVariable Long parentCommentId,
            @PageableDefault(size = 5, sort = "createdAt,asc") Pageable pageable) {
        Page<ForumCommentResponseDTO> replies = forumCommentService.getRepliesForComment(parentCommentId, pageable);
        return ResponseEntity.ok(replies);
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> getCommentById(@PathVariable Long commentId) {
        ForumCommentResponseDTO comment = forumCommentService.getCommentDtoById(commentId);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody ForumCommentUpdateRequestDTO updateRequestDTO) {
        ForumCommentResponseDTO updatedComment = forumCommentService.updateComment(commentId, updateRequestDTO.getText());
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        forumCommentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}