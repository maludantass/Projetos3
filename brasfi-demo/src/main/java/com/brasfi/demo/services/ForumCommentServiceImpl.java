package com.brasfi.demo.services;

import com.brasfi.demo.dto.ForumCommentRequestDTO;
import com.brasfi.demo.dto.ForumCommentResponseDTO;
import com.brasfi.demo.dto.UserSummaryDTO;
import com.brasfi.demo.model.*; // User, ForumComment, ForumPost, VoteType
import com.brasfi.demo.repository.*; // ForumCommentRepository, UserRepository, ForumPostRepository, ForumVoteRepository
// Suas exceções customizadas
// import com.brasfi.demo.exception.ResourceNotFoundException;
// import com.brasfi.demo.exception.OperationNotPermittedException;
// import com.brasfi.demo.exception.InvalidRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
// import java.util.Collections;
import java.util.List;
// import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumCommentServiceImpl implements ForumCommentService {

    private final ForumCommentRepository forumCommentRepository;
    private final UserRepository userRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumVoteRepository forumVoteRepository;

    @Override
    @Transactional
    public ForumCommentResponseDTO createComment(ForumCommentRequestDTO requestDTO) {
        User author = getCurrentAuthenticatedUser();
        ForumPost forumPost = forumPostRepository.findById(requestDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + requestDTO.getPostId())); // Use ResourceNotFoundException

        ForumComment parentComment = null;
        if (requestDTO.getParentCommentId() != null) {
            parentComment = forumCommentRepository.findById(requestDTO.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Comentário pai não encontrado com ID: " + requestDTO.getParentCommentId())); // Use ResourceNotFoundException
            // Validação opcional: garantir que o parentComment pertence ao mesmo post
            if (!parentComment.getForumPost().getId().equals(forumPost.getId())) {
                throw new RuntimeException("Comentário pai não pertence ao post especificado."); // Use InvalidRequestException
            }
        }

        ForumComment comment = new ForumComment();
        comment.setText(requestDTO.getText());
        comment.setAuthor(author);
        comment.setForumPost(forumPost);
        comment.setParentComment(parentComment);

        ForumComment savedComment = forumCommentRepository.save(comment);
        log.info("Comentário ID {} criado por {} no post ID {} (pai ID: {})",
                savedComment.getId(), author.getUsername(), forumPost.getId(),
                parentComment != null ? parentComment.getId() : "N/A");

        // Para um novo comentário, voteScore e replyCount são 0.
        // A lista de replies também estará vazia.
        return mapToResponseDTO(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommentResponseDTO> getCommentsByPost(Long postId, Pageable pageable) {
        ForumPost forumPost = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId)); // Use ResourceNotFoundException
        log.debug("Buscando comentários de nível superior para o post ID: {}", postId);

        Page<ForumComment> commentsPage = forumCommentRepository.findByForumPostAndParentCommentIsNullOrderByCreatedAtAsc(forumPost, pageable);
        return commentsPage.map(this::mapToResponseDTOWithReplies); // Pode carregar alguns níveis de respostas
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ForumCommentResponseDTO> getRepliesForComment(Long parentCommentId, Pageable pageable) {
        ForumComment parentComment = forumCommentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Comentário pai não encontrado com ID: " + parentCommentId)); // Use ResourceNotFoundException
        log.debug("Buscando respostas para o comentário ID: {}", parentCommentId);

        Page<ForumComment> repliesPage = forumCommentRepository.findByParentCommentOrderByCreatedAtAsc(parentComment, pageable);
        return repliesPage.map(this::mapToResponseDTOWithReplies); // Pode carregar mais níveis se necessário
    }
    
    @Override
    @Transactional(readOnly = true)
    public ForumCommentResponseDTO getCommentDtoById(Long commentId) {
        ForumComment comment = forumCommentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + commentId)); // Use ResourceNotFoundException
        return mapToResponseDTOWithReplies(comment); // Ou mapToResponseDTO se não quiser carregar replies aqui
    }

    @Override
    @Transactional
    public ForumCommentResponseDTO updateComment(Long commentId, String text) {
        User currentUser = getCurrentAuthenticatedUser();
        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + commentId)); // Use ResourceNotFoundException

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou atualizar comentário {} sem permissão.", currentUser.getUsername(), commentId);
            throw new RuntimeException("Você não tem permissão para atualizar este comentário."); // Use OperationNotPermittedException
        }

        comment.setText(text);
        ForumComment updatedComment = forumCommentRepository.save(comment);
        log.info("Comentário ID {} atualizado por {}", updatedComment.getId(), currentUser.getUsername());
        return mapToResponseDTO(updatedComment); // Normalmente não recarrega replies na atualização de texto
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        User currentUser = getCurrentAuthenticatedUser();
        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + commentId)); // Use ResourceNotFoundException

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            log.warn("Usuário {} tentou deletar comentário {} sem permissão.", currentUser.getUsername(), commentId);
            throw new RuntimeException("Você não tem permissão para deletar este comentário."); // Use OperationNotPermittedException
        }

        // CascadeType.ALL em ForumComment.replies e ForumComment.votes deve cuidar da deleção em cascata.
        forumCommentRepository.delete(comment);
        log.info("Comentário ID {} e suas respostas deletados por {}", commentId, currentUser.getUsername());
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

    private int calculateVoteScore(ForumComment comment) {
        long upvotes = forumVoteRepository.countByForumCommentAndVoteType(comment, VoteType.UPVOTE);
        long downvotes = forumVoteRepository.countByForumCommentAndVoteType(comment, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }

    private int countDirectReplies(ForumComment comment) {
        // Usa o método que você adicionou ao ForumCommentRepository
        return (int) forumCommentRepository.countByParentComment(comment);
    }
    
    // Mapeador base que não carrega replies recursivamente por padrão
    private ForumCommentResponseDTO mapToResponseDTO(ForumComment comment) {
        return mapToResponseDTO(comment, 0); // Profundidade 0 para não carregar replies
    }

    // Mapeador que pode carregar replies até uma certa profundidade
    private ForumCommentResponseDTO mapToResponseDTOWithReplies(ForumComment comment) {
        // Para este exemplo, carregaremos apenas 1 nível de replies.
        // Para mais níveis, este método precisaria ser recursivo ou iterativo
        // e tomar cuidado com a performance e a profundidade máxima.
        return mapToResponseDTO(comment, 1); // Carrega 1 nível de profundidade de replies
    }
    
    private ForumCommentResponseDTO mapToResponseDTO(ForumComment comment, int depth) {
        if (comment == null) return null;

        UserSummaryDTO authorDto = null;
        if (comment.getAuthor() != null) {
            authorDto = new UserSummaryDTO(comment.getAuthor()); // Usa user.getUsername()
        }

        Long parentId = null;
        if (comment.getParentComment() != null) {
            parentId = comment.getParentComment().getId();
        }
        
        List<ForumCommentResponseDTO> repliesDTO = new ArrayList<>();
        if (depth > 0 && comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            // CUIDADO: Acessar comment.getReplies() pode causar N+1 se não otimizado.
            // Uma estratégia melhor seria buscar as replies com paginação se necessário,
            // ou garantir que a query que busca o comentário já traga as replies (JOIN FETCH).
            // Por simplicidade aqui, estamos mapeando as replies carregadas.
            for (ForumComment reply : comment.getReplies()) {
                repliesDTO.add(mapToResponseDTO(reply, depth - 1)); // Chamada recursiva com profundidade reduzida
            }
        }


        return new ForumCommentResponseDTO(
                comment.getId(),
                comment.getText(),
                authorDto,
                comment.getForumPost().getId(), // Assume que getForumPost() nunca será nulo para um comentário válido
                parentId,
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                calculateVoteScore(comment),
                countDirectReplies(comment), // Contagem de respostas diretas
                repliesDTO // Lista de DTOs de respostas
        );
    }
}