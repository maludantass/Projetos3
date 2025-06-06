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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant; // Import para createdAt e updatedAt

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumCommunityServiceImpl implements ForumCommunityService {

    private final ForumCommunityRepository forumCommunityRepository;
    private final UserRepository userRepository;
    private final ForumPostRepository forumPostRepository;

    @Override
    @Transactional
    public ForumCommunityResponseDTO createCommunity(Long authorId, ForumCommunityRequestDTO requestDTO) {
        log.info("Requisição para criar ForumCommunity com título: '{}' pelo autor ID: {}", requestDTO.getTitle(), authorId);

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário autor não encontrado com ID: " + authorId));

        ForumCommunity community = new ForumCommunity();
        community.setTitle(requestDTO.getTitle());
        community.setDescription(requestDTO.getDescription());
        community.setAuthor(author);
        // community.setCreatedAt(Instant.now()); // O @PrePersist deve cuidar disso na entidade

        ForumCommunity savedCommunity = forumCommunityRepository.save(community);
        log.info("ForumCommunity criada com ID {} pelo usuário {}", savedCommunity.getId(), author.getUsername());
        return mapToResponseDTO(savedCommunity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> getAllCommunities(Pageable pageable) {
        log.debug("Buscando todas as ForumCommunities com paginação: {}", pageable);
        // Corrigindo o problema de N+1 e LazyInitialization para listagem
        return forumCommunityRepository.findAllAsDTO(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ForumCommunityResponseDTO getCommunityById(Long communityId) {
        log.debug("Buscando ForumCommunity por ID: {}", communityId);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comunidade não encontrada com ID: " + communityId));
        return mapToResponseDTO(community);
    }

    @Override
    @Transactional(readOnly = true)
    public ForumCommunityResponseDTO getCommunityByTitle(String title) {
        log.debug("Buscando ForumCommunity por título: {}", title);
        ForumCommunity community = forumCommunityRepository.findByTitle(title)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comunidade não encontrada com título: " + title));
        return mapToResponseDTO(community);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> searchCommunitiesByTitle(String titleQuery, Pageable pageable) {
        log.debug("Pesquisando ForumCommunities por título contendo: '{}', paginação: {}", titleQuery, pageable);
        // Para otimizar esta busca, também poderíamos criar uma query DTO no repositório
        Page<ForumCommunity> communitiesPage = forumCommunityRepository.findByTitleContainingIgnoreCase(titleQuery, pageable);
        return communitiesPage.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommunityResponseDTO> getCommunitiesByAuthorUsername(String username, Pageable pageable) {
        log.debug("Buscando ForumCommunities pelo autor username: '{}', paginação: {}", username, pageable);
        User author = userRepository.findByUsername(username) // Certifique-se que este método existe no UserRepository
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com username: " + username));
        // Para otimizar esta busca, também poderíamos criar uma query DTO no repositório
        Page<ForumCommunity> communitiesPage = forumCommunityRepository.findByAuthor(author, pageable);
        return communitiesPage.map(this::mapToResponseDTO);
    }

    @Override
    @Transactional
    public ForumCommunityResponseDTO updateCommunity(Long communityId, ForumCommunityRequestDTO requestDTO) {
        log.info("Requisição para atualizar ForumCommunity ID: {}", communityId);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comunidade não encontrada com ID: " + communityId));

        // A lógica de permissão (quem pode atualizar) seria adicionada aqui se necessário.
        // Para a abordagem simplificada, permitimos a atualização.
        // O DTO não tem mais o authorEmail, então não podemos usá-lo para verificar o editor.

        community.setTitle(requestDTO.getTitle());
        community.setDescription(requestDTO.getDescription());
        // community.setUpdatedAt(Instant.now()); // O @PreUpdate deve cuidar disso

        ForumCommunity updatedCommunity = forumCommunityRepository.save(community);
        log.info("ForumCommunity ID {} atualizada.", updatedCommunity.getId());
        return mapToResponseDTO(updatedCommunity);
    }

    @Override
    @Transactional
    public void deleteCommunity(Long communityId) {
        log.info("Requisição para deletar ForumCommunity ID: {}", communityId);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comunidade não encontrada com ID: " + communityId));
        
        // A lógica de permissão (quem pode deletar) seria adicionada aqui se necessário.
        // Por simplicidade, permitimos a deleção.

        forumCommunityRepository.delete(community);
        log.info("ForumCommunity ID {} deletada.", communityId);
    }

    private ForumCommunityResponseDTO mapToResponseDTO(ForumCommunity community) {
        UserSummaryDTO authorDto = null;
        if (community.getAuthor() != null) {
            // Garanta que UserSummaryDTO tenha um construtor que aceita um User
            authorDto = new UserSummaryDTO(community.getAuthor());
        }

        int postCount = 0;
        if (community.getId() != null) {
            // Esta contagem pode ser custosa se chamada muitas vezes (ex: em uma lista).
            // Para getById, é geralmente aceitável.
            postCount = (int) forumPostRepository.countByForumCommunity(community);
        }
        
        // Este construtor deve existir no ForumCommunityResponseDTO
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