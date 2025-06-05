package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumCommunityRequestDTO;
import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import com.brasfi.demo.dto.UserSummaryDTO;
import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.ForumCommunityRepository;
import com.brasfi.demo.repository.ForumPostRepository;
import com.brasfi.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumCommunityServiceImpl implements ForumCommunityService {

    private final ForumCommunityRepository forumCommunityRepository;
    private final UserRepository userRepository;
    private final ForumPostRepository forumPostRepository;

    @Override
    @Transactional
    public ForumCommunityResponseDTO createCommunity(ForumCommunityRequestDTO requestDTO) {
        log.info("Requisição para criar ForumCommunity com título: '{}'", requestDTO.getTitle());

        User author = userRepository.findByEmail(requestDTO.getAuthorEmail())
                .orElseThrow(() -> new RuntimeException("Usuário autor não encontrado com o email: " + requestDTO.getAuthorEmail()));
    
        ForumCommunity community = new ForumCommunity();
        community.setTitle(requestDTO.getTitle());
        community.setDescription(requestDTO.getDescription());
        community.setAuthor(author);
    
        ForumCommunity savedCommunity = forumCommunityRepository.save(community);
        log.info("ForumCommunity criada com ID {} pelo usuário {}", savedCommunity.getId(), author.getUsername());
        
        return mapToResponseDTO(savedCommunity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> getAllCommunities(Pageable pageable) {
        log.debug("Buscando todas as ForumCommunities com paginação: {}", pageable);
        Page<ForumCommunity> communitiesPage = forumCommunityRepository.findAll(pageable);
        return communitiesPage.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ForumCommunityResponseDTO getCommunityById(Long communityId) {
        log.debug("Buscando ForumCommunity por ID: {}", communityId);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + communityId)); // Use ResourceNotFoundException
        return mapToResponseDTO(community);
    }

    @Override
    @Transactional(readOnly = true)
    public ForumCommunityResponseDTO getCommunityByTitle(String title) {
        log.debug("Buscando ForumCommunity por título: {}", title);
        ForumCommunity community = forumCommunityRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com título: " + title)); // Use ResourceNotFoundException
        return mapToResponseDTO(community);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> searchCommunitiesByTitle(String titleQuery, Pageable pageable) {
        log.debug("Pesquisando ForumCommunities por título contendo: '{}', paginação: {}", titleQuery, pageable);
        Page<ForumCommunity> communitiesPage = forumCommunityRepository.findByTitleContainingIgnoreCase(titleQuery, pageable);
        return communitiesPage.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> getCommunitiesByAuthorUsername(String username, Pageable pageable) {
        log.debug("Buscando ForumCommunities pelo autor username: '{}', paginação: {}", username, pageable);
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com username: " + username)); // Use ResourceNotFoundException
        Page<ForumCommunity> communitiesPage = forumCommunityRepository.findByAuthor(author, pageable);
        return communitiesPage.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional
    public ForumCommunityResponseDTO updateCommunity(Long communityId, ForumCommunityRequestDTO requestDTO) {
        log.info("Requisição para atualizar ForumCommunity ID: {}", communityId);
        User currentUser = getCurrentAuthenticatedUser();
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + communityId)); // Use ResourceNotFoundException

        // Verificação de Permissão: Apenas o autor pode atualizar
        if (!community.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou atualizar comunidade {} sem permissão (não é o autor).", currentUser.getUsername(), communityId);
            // Lance uma exceção de permissão apropriada, ex: OperationNotPermittedException
            throw new RuntimeException("Você não tem permissão para atualizar esta comunidade.");
        }

        community.setTitle(requestDTO.getTitle());
        community.setDescription(requestDTO.getDescription());

        ForumCommunity updatedCommunity = forumCommunityRepository.save(community);
        log.info("ForumCommunity ID {} atualizada por {}", updatedCommunity.getId(), currentUser.getUsername());
        return mapToResponseDTO(updatedCommunity);
    }

    @Override
    @Transactional
    public void deleteCommunity(Long communityId) {
        log.info("Requisição para deletar ForumCommunity ID: {}", communityId);
        User currentUser = getCurrentAuthenticatedUser();
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + communityId)); // Use ResourceNotFoundException

        // Verificação de Permissão: Apenas o autor pode deletar
        if (!community.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou deletar comunidade {} sem permissão (não é o autor).", currentUser.getUsername(), communityId);
            // Lance uma exceção de permissão apropriada, ex: OperationNotPermittedException
            throw new RuntimeException("Você não tem permissão para deletar esta comunidade.");
        }

        forumCommunityRepository.delete(community); // CascadeType.ALL cuidará dos posts, etc.
        log.info("ForumCommunity ID {} deletada por {}", communityId, currentUser.getUsername());
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado."); // Use uma exceção de autenticação
        }
        String principalName = authentication.getName(); 

        return userRepository.findByUsername(principalName)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado '" + principalName + "' não encontrado."));
    }

    private ForumCommunityResponseDTO mapToResponseDTO(ForumCommunity community) {
        UserSummaryDTO authorDto = null;
        if (community.getAuthor() != null) {
            authorDto = new UserSummaryDTO(community.getAuthor()); 
        }

        int postCount = 0;
        if (community.getId() != null) {
            postCount = (int) forumPostRepository.countByForumCommunity(community);
        }

        return new ForumCommunityResponseDTO(
                community.getId(),
                community.getTitle(),
                community.getDescription(),
                authorDto,
                community.getCreatedAt(),
                community.getUpdatedAt(),
                postCount
        );
    }
}