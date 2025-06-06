package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumVoteRequestDTO;
import com.brasfi.demo.dto.ForumVoteResponseDTO;
import com.brasfi.demo.services.ForumVoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forum/votes") // Caminho base para votos
@RequiredArgsConstructor
@Slf4j
public class ForumVoteController {

    private final ForumVoteService forumVoteService;

    // Endpoint para processar um voto (criar, atualizar ou remover)
    @PostMapping
    public ResponseEntity<ForumVoteResponseDTO> processVote(@Valid @RequestBody ForumVoteRequestDTO voteRequestDTO) {
        log.info("API request para processar voto: {}", voteRequestDTO);
        // O DTO de requisição contém o voteType e o postId ou commentId.
        // O usuário é obtido pelo serviço a partir do contexto de segurança.
        ForumVoteResponseDTO voteResponse = forumVoteService.processVote(voteRequestDTO);
        // A resposta contém o novo placar de votos do item e o status do voto do usuário.
        return ResponseEntity.ok(voteResponse);
    }
}