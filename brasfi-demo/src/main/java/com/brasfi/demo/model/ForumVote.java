package com.brasfi.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
// Para a constraint @Check, se suportada diretamente ou como exemplo de intenção
// import org.hibernate.annotations.Check; // Dependendo da versão do Hibernate e se você quer usá-la

import java.io.Serializable;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_forum_vote", uniqueConstraints = {
        // Garante que um usuário só pode ter um voto para um post específico
        @UniqueConstraint(name = "uk_user_post_vote", columnNames = {"user_id", "post_id"}),
        // Garante que um usuário só pode ter um voto para um comentário específico
        @UniqueConstraint(name = "uk_user_comment_vote", columnNames = {"user_id", "comment_id"})
})
// Exemplo de como uma @Check constraint poderia ser escrita (a sintaxe exata pode variar ou precisar ser tratada na lógica de serviço):
// @Check(constraints = "(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)")
public class ForumVote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O tipo do voto não pode ser nulo.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteType voteType;

    @NotNull(message = "O usuário (autor do voto) não pode ser nulo.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id") // Anulável, pois o voto pode ser em um comentário
    private ForumPost forumPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id") // Anulável, pois o voto pode ser em um post
    private ForumComment forumComment;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    // Construtor para voto em Post
    public ForumVote(VoteType voteType, User user, ForumPost forumPost) {
        this.voteType = voteType;
        this.user = user;
        this.forumPost = forumPost;
        this.forumComment = null; // Garante exclusividade
    }

    // Construtor para voto em Comment
    public ForumVote(VoteType voteType, User user, ForumComment forumComment) {
        this.voteType = voteType;
        this.user = user;
        this.forumComment = forumComment;
        this.forumPost = null; // Garante exclusividade
    }

    @PrePersist
    @PreUpdate
    private void ensureValidVoteTarget() {
        if (forumPost != null && forumComment != null) {
            throw new IllegalStateException("O voto não pode ser para um Post e um Comentário simultaneamente.");
        }
        if (forumPost == null && forumComment == null) {
            throw new IllegalStateException("O voto deve ser para um Post ou para um Comentário.");
        }
    }
}