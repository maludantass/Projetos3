package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumVoteRequestDTO;
import com.brasfi.demo.dto.ForumVoteResponseDTO;
import com.brasfi.demo.model.*; // User, ForumPost, ForumComment, ForumVote, VoteType
import com.brasfi.demo.repository.*; // ForumVoteRepository, UserRepository, ForumPostRepository, ForumCommentRepository
// Suas exceções customizadas
// import com.brasfi.demo.exception.ResourceNotFoundException;
// import com.brasfi.demo.exception.InvalidRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumVoteServiceImpl implements ForumVoteService {

    private final ForumVoteRepository forumVoteRepository;
    private final UserRepository userRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumCommentRepository forumCommentRepository;

    @Override
    @Transactional
    public ForumVoteResponseDTO processVote(ForumVoteRequestDTO requestDTO) {
        User currentUser = getCurrentAuthenticatedUser();
        VoteType requestedVoteType = requestDTO.getVoteType();

        // Validar que ou postId ou commentId está presente, mas não ambos
        if ((requestDTO.getPostId() == null && requestDTO.getCommentId() == null) ||
            (requestDTO.getPostId() != null && requestDTO.getCommentId() != null)) {
            throw new RuntimeException("Requisição de voto inválida: Forneça postId ou commentId, mas não ambos."); // Use InvalidRequestException
        }

        String itemType;
        Long itemId;
        int newVoteScore;
        VoteType finalVoteStatusForUser;

        if (requestDTO.getPostId() != null) {
            itemId = requestDTO.getPostId();
            itemType = "POST";
            ForumPost post = forumPostRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + itemId)); // Use ResourceNotFoundException

            Optional<ForumVote> existingVoteOpt = forumVoteRepository.findByUserAndForumPost(currentUser, post);

            if (existingVoteOpt.isPresent()) {
                ForumVote existingVote = existingVoteOpt.get();
                if (existingVote.getVoteType() == requestedVoteType) {
                    // Voto igual, remover (toggle off)
                    forumVoteRepository.delete(existingVote);
                    log.info("Voto removido para o post ID {} pelo usuário {}", itemId, currentUser.getUsername());
                    finalVoteStatusForUser = null; // Voto removido
                } else {
                    // Voto diferente, atualizar
                    existingVote.setVoteType(requestedVoteType);
                    forumVoteRepository.save(existingVote);
                    log.info("Voto atualizado para {} no post ID {} pelo usuário {}", requestedVoteType, itemId, currentUser.getUsername());
                    finalVoteStatusForUser = requestedVoteType;
                }
            } else {
                // Novo voto
                ForumVote newVote = new ForumVote(requestedVoteType, currentUser, post);
                // A validação @PrePersist em ForumVote garantirá que forumComment seja nulo.
                forumVoteRepository.save(newVote);
                log.info("Novo voto {} registrado para o post ID {} pelo usuário {}", requestedVoteType, itemId, currentUser.getUsername());
                finalVoteStatusForUser = requestedVoteType;
            }
            newVoteScore = calculatePostVoteScore(post);
        } else { // commentId não é nulo
            itemId = requestDTO.getCommentId();
            itemType = "COMMENT";
            ForumComment comment = forumCommentRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + itemId)); // Use ResourceNotFoundException

            Optional<ForumVote> existingVoteOpt = forumVoteRepository.findByUserAndForumComment(currentUser, comment);

            if (existingVoteOpt.isPresent()) {
                ForumVote existingVote = existingVoteOpt.get();
                if (existingVote.getVoteType() == requestedVoteType) {
                    forumVoteRepository.delete(existingVote);
                    log.info("Voto removido para o comentário ID {} pelo usuário {}", itemId, currentUser.getUsername());
                    finalVoteStatusForUser = null;
                } else {
                    existingVote.setVoteType(requestedVoteType);
                    forumVoteRepository.save(existingVote);
                    log.info("Voto atualizado para {} no comentário ID {} pelo usuário {}", requestedVoteType, itemId, currentUser.getUsername());
                    finalVoteStatusForUser = requestedVoteType;
                }
            } else {
                ForumVote newVote = new ForumVote(requestedVoteType, currentUser, comment);
                // A validação @PrePersist em ForumVote garantirá que forumPost seja nulo.
                forumVoteRepository.save(newVote);
                log.info("Novo voto {} registrado para o comentário ID {} pelo usuário {}", requestedVoteType, itemId, currentUser.getUsername());
                finalVoteStatusForUser = requestedVoteType;
            }
            newVoteScore = calculateCommentVoteScore(comment);
        }

        return new ForumVoteResponseDTO(
                "Operação de voto processada.",
                itemId,
                itemType,
                finalVoteStatusForUser,
                newVoteScore
        );
    }

    // --- Métodos Auxiliares ---

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado."); // Use sua exceção de autenticação
        }
        String principalName = authentication.getName();
        // Adapte para findByEmail se principalName for o email e esse for seu método no UserRepository
        return userRepository.findByUsername(principalName)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado '" + principalName + "' não encontrado."));
    }

    private int calculatePostVoteScore(ForumPost post) {
        long upvotes = forumVoteRepository.countByForumPostAndVoteType(post, VoteType.UPVOTE);
        long downvotes = forumVoteRepository.countByForumPostAndVoteType(post, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }

    private int calculateCommentVoteScore(ForumComment comment) {
        long upvotes = forumVoteRepository.countByForumCommentAndVoteType(comment, VoteType.UPVOTE);
        long downvotes = forumVoteRepository.countByForumCommentAndVoteType(comment, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }
}