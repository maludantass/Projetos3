package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumCommunityDto;
import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.ForumCommunityRepository;
import com.brasfi.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor 
public class ForumCommunityService {

    private final ForumCommunityRepository forumCommunityRepository; 
    private final UserRepository userRepository; 

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("Nenhum usuário autenticado encontrado. A criação de comunidade requer autenticação.");
        }
        String usernameOrEmail = authentication.getName();
        return userRepository.findByEmail(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + usernameOrEmail));
    }

    @Transactional
    public ForumCommunityDto createCommunity(ForumCommunityDto forumCommunityDto) {
        User currentUser = getCurrentUser();

        if (forumCommunityRepository.findByName(forumCommunityDto.getName()).isPresent()) {
            throw new IllegalArgumentException("Uma comunidade com o nome '" + forumCommunityDto.getName() + "' já existe.");
        }

        // Usando o Builder da entidade ForumCommunity
        ForumCommunity community = ForumCommunity.builder()
                .name(forumCommunityDto.getName())
                .description(forumCommunityDto.getDescription())
                .user(currentUser)
                .createdDate(Instant.now())
                .build();

        ForumCommunity savedCommunity = forumCommunityRepository.save(community);
        return mapEntityToDto(savedCommunity);
    }

    @Transactional(readOnly = true)
    public List<ForumCommunityDto> getAllCommunities() {
        return forumCommunityRepository.findAll()
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ForumCommunityDto getCommunityById(Long id) {
        ForumCommunity community = forumCommunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com o ID: " + id));
        return mapEntityToDto(community);
    }

    @Transactional(readOnly = true)
    public ForumCommunityDto getCommunityByName(String name) {
        ForumCommunity community = forumCommunityRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com o nome: " + name));
        return mapEntityToDto(community);
    }

    private ForumCommunityDto mapEntityToDto(ForumCommunity community) {
        return ForumCommunityDto.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .createdDate(community.getCreatedDate())
                .createdByUsername(community.getUser() != null ? community.getUser().getUsername() : null)
                .numberOfPosts(community.getPosts() != null ? community.getPosts().size() : 0)
                .build();
    }
}