package com.brasfi.demo.service;

import com.brasfi.demo.dto.ForumCommunityDto;
import com.brasfi.demo.exceptions.ForumException;
import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.repository.ForumCommunityRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ForumCommunityService {

    private final ForumCommunityRepository communityRepository;
    private final AuthService authService; // Assumindo que você tem um serviço para informações de autenticação

    @Transactional
    public ForumCommunityDto save(ForumCommunityDto communityDto) {
        ForumCommunity community = ForumCommunity.builder()
                .name(communityDto.getName())
                .description(communityDto.getDescription())
                .createdDate(Instant.now())
                .user(authService.getCurrentUser()) // Obtém o usuário logado
                .build();
        ForumCommunity savedCommunity = communityRepository.save(community);
        communityDto.setId(savedCommunity.getId());
        return communityDto;
    }

    @Transactional(readOnly = true)
    public List<ForumCommunityDto> getAll() {
        return communityRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ForumCommunityDto getCommunity(Long id) {
        ForumCommunity community = communityRepository.findById(id)
                .orElseThrow(() -> new ForumException("No Community found with ID - " + id));
        return mapToDto(community);
    }

    private ForumCommunityDto mapToDto(ForumCommunity community) {
        return ForumCommunityDto.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .numberOfPosts(community.getPosts() != null ? community.getPosts().size() : 0)
                .build();
    }
}