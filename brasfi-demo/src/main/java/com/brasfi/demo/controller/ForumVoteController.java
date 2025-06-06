package com.brasfi.demo.controller;

import com.brasfi.demo.dto.ForumVoteRequestDTO;
import com.brasfi.demo.dto.ForumVoteResponseDTO;
import com.brasfi.demo.services.ForumVoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forum/votes")
@RequiredArgsConstructor
public class ForumVoteController {

    private final ForumVoteService forumVoteService;

    @PostMapping
    public ResponseEntity<ForumVoteResponseDTO> processVote(@Valid @RequestBody ForumVoteRequestDTO voteRequestDTO) {
        ForumVoteResponseDTO voteResponse = forumVoteService.processVote(voteRequestDTO);
        return ResponseEntity.ok(voteResponse);
    }
}