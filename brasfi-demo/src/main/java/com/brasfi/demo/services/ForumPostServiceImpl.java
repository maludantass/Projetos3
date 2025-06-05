package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumPostRequestDTO;
import com.brasfi.demo.dto.ForumPostResponseDTO;
import com.brasfi.demo.dto.UserSummaryDTO;
import com.brasfi.demo.model.*;
import com.brasfi.demo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; 

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumPostServiceImpl implements ForumPostService {

    private final ForumPostRepository forumPostRepository;
    private final UserRepository userRepository;
    private final ForumCommunityRepository forumCommunityRepository;
    private final ForumVoteRepository forumVoteRepository;        
    private final ForumCommentRepository forumCommentRepository; 

    @Override
    @Transactional
    public ForumPostResponseDTO createPost(ForumPostRequestDTO requestDTO) {
        log.info("Requisição para criar ForumPost com título: '{}' na comunidade ID: {}",
                requestDTO.getTitle(), requestDTO.getForumCommunityId());

        User author = userRepository.findByEmail(requestDTO.getAuthorEmail())
                .orElseThrow(() -> new RuntimeException("Usuário autor não encontrado com o email: " + requestDTO.getAuthorEmail()));

        ForumCommunity community = forumCommunityRepository.findById(requestDTO.getForumCommunityId())
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + requestDTO.getForumCommunityId()));

        if (!StringUtils.hasText(requestDTO.getContent()) && !StringUtils.hasText(requestDTO.getUrl())) {
            throw new RuntimeException("O post deve ter conteúdo ou uma URL.");
        }
        if (StringUtils.hasText(requestDTO.getContent()) && StringUtils.hasText(requestDTO.getUrl())) {
            throw new RuntimeException("O post não pode ter conteúdo e URL simultaneamente.");
        }

        ForumPost post = new ForumPost();
        post.setTitle(requestDTO.getTitle());
        post.setContent(requestDTO.getContent());
        post.setUrl(requestDTO.getUrl());
        post.setAuthor(author);
        post.setForumCommunity(community);

        ForumPost savedPost = forumPostRepository.save(post);
        log.info("ForumPost ID {} criado por {} na comunidade {}",
                savedPost.getId(), author.getUsername(), community.getTitle());

        return mapToResponseDTO(savedPost, 0, 0);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumPostResponseDTO> getPostsByCommunity(Long communityId, Pageable pageable) {
        log.debug("Buscando posts para comunidade ID: {}, paginação: {}", communityId, pageable);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + communityId)); // Use ResourceNotFoundException

        Page<ForumPost> postsPage = forumPostRepository.findByForumCommunityOrderByCreatedAtDesc(community, pageable);
        return postsPage.map(post -> mapToResponseDTO(post, calculateVoteScore(post), countComments(post)));
    }

    @Override
    @Transactional(readOnly = true)
    public ForumPostResponseDTO getPostById(Long postId) {
        log.debug("Buscando ForumPost por ID: {}", postId);
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId)); // Use ResourceNotFoundException
        return mapToResponseDTO(post, calculateVoteScore(post), countComments(post));
    }

    @Override
    @Transactional
    public ForumPostResponseDTO updatePost(Long postId, ForumPostRequestDTO requestDTO) {
        log.info("Requisição para atualizar ForumPost ID: {}", postId);
        User currentUser = getCurrentAuthenticatedUser();
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId)); // Use ResourceNotFoundException

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou atualizar post {} sem permissão.", currentUser.getUsername(), postId);
            throw new RuntimeException("Você não tem permissão para atualizar este post."); // Use OperationNotPermittedException
        }

        // Validação: content OU url deve estar presente (similar à criação)
        if (!StringUtils.hasText(requestDTO.getContent()) && !StringUtils.hasText(requestDTO.getUrl())) {
            throw new RuntimeException("O post deve ter conteúdo ou uma URL."); // Use InvalidRequestException
        }
        if (StringUtils.hasText(requestDTO.getContent()) && StringUtils.hasText(requestDTO.getUrl())) {
            throw new RuntimeException("O post não pode ter conteúdo e URL simultaneamente."); // Use InvalidRequestException
        }

        post.setTitle(requestDTO.getTitle());
        post.setContent(requestDTO.getContent());
        post.setUrl(requestDTO.getUrl());
        // updatedAt será atualizado pelo @UpdateTimestamp

        ForumPost updatedPost = forumPostRepository.save(post);
        log.info("ForumPost ID {} atualizado por {}", updatedPost.getId(), currentUser.getUsername());
        return mapToResponseDTO(updatedPost, calculateVoteScore(updatedPost), countComments(updatedPost));
    }

    @Override
    @Transactional
    public void deletePost(Long postId) {
        log.info("Requisição para deletar ForumPost ID: {}", postId);
        User currentUser = getCurrentAuthenticatedUser();
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId)); // Use ResourceNotFoundException

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou deletar post {} sem permissão.", currentUser.getUsername(), postId);
            throw new RuntimeException("Você não tem permissão para deletar este post."); // Use OperationNotPermittedException
        }

        forumPostRepository.delete(post); // CascadeType.ALL cuidará de comentários e votos do post
        log.info("ForumPost ID {} deletado por {}", postId, currentUser.getUsername());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumPostResponseDTO> searchPostsByTitleInCommunity(Long communityId, String titleQuery, Pageable pageable) {
        log.debug("Pesquisando posts na comunidade ID {} com título contendo '{}', paginação: {}", communityId, titleQuery, pageable);
        ForumCommunity community = forumCommunityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Comunidade não encontrada com ID: " + communityId)); // Use ResourceNotFoundException

        Page<ForumPost> postsPage = forumPostRepository.findByForumCommunityAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                community, titleQuery, pageable);
        return postsPage.map(post -> mapToResponseDTO(post, calculateVoteScore(post), countComments(post)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumPostResponseDTO> getPostsByAuthorUsername(String username, Pageable pageable) {
        log.debug("Buscando posts pelo autor username: '{}', paginação: {}", username, pageable);
        User author = userRepository.findByUsername(username) // Ou findByEmail
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com username: " + username)); // Use ResourceNotFoundException
        Page<ForumPost> postsPage = forumPostRepository.findByAuthorOrderByCreatedAtDesc(author, pageable);
        return postsPage.map(post -> mapToResponseDTO(post, calculateVoteScore(post), countComments(post)));
    }

    // --- Métodos Auxiliares ---

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado."); // Use sua exceção de autenticação
        }
        String principalName = authentication.getName();
        // Adapte para findByEmail se principalName for o email
        return userRepository.findByUsername(principalName)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado '" + principalName + "' não encontrado."));
    }

    private int calculateVoteScore(ForumPost post) {
        long upvotes = forumVoteRepository.countByForumPostAndVoteType(post, VoteType.UPVOTE);
        long downvotes = forumVoteRepository.countByForumPostAndVoteType(post, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }

    private int countComments(ForumPost post) {
        // Usa o método que você adicionará ao ForumCommentRepository
        return (int) forumCommentRepository.countByForumPost(post);
    }

    private ForumPostResponseDTO mapToResponseDTO(ForumPost post, int voteScore, int commentCount) {
        UserSummaryDTO authorDto = null;
        if (post.getAuthor() != null) {
            authorDto = new UserSummaryDTO(post.getAuthor()); // Usa user.getUsername()
        }

        Long communityId = null;
        String communityTitle = null;
        if (post.getForumCommunity() != null) {
            communityId = post.getForumCommunity().getId();
            communityTitle = post.getForumCommunity().getTitle();
        }

        return new ForumPostResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUrl(),
                authorDto,
                communityId,
                communityTitle,
                post.getCreatedAt(),
                post.getUpdatedAt(),
                voteScore,
                commentCount
        );
    }
}