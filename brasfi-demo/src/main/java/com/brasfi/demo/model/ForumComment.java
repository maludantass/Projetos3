package com.brasfi.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id") // Evita problemas com coleções e lazy loading
@Entity
@Table(name = "tb_forum_comment")
public class ForumComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O texto do comentário não pode estar em branco.")
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String text; // Conteúdo do comentário

    @NotNull(message = "O autor do comentário não pode ser nulo.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // Anteriormente 'user'

    @NotNull(message = "O post associado ao comentário não pode ser nulo.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_post_id", nullable = false)
    private ForumPost forumPost; // Post ao qual este comentário pertence diretamente

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id") // Coluna para o ID do comentário pai
    private ForumComment parentComment; // Comentário pai (nulo se for um comentário de nível superior no post)

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC") // Ordena as respostas por data de criação
    private List<ForumComment> replies = new ArrayList<>(); // Lista de respostas a este comentário

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt; // Anteriormente 'createdDate'

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    // voteCount será calculado dinamicamente.

    // Relacionamento com ForumVote (votos para este comentário)
    // Decidiremos sobre a melhor forma de implementar votos em comentários
    // quando chegarmos na entidade ForumVote.
    // Por enquanto, podemos preparar o campo:
    @OneToMany(
            mappedBy = "forumComment", // Assumirá que ForumVote terá um campo 'forumComment' (opcional)
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ForumVote> votes = new ArrayList<>();


    // Construtores de conveniência
    public ForumComment(String text, User author, ForumPost forumPost, ForumComment parentComment) {
        this.text = text;
        this.author = author;
        this.forumPost = forumPost;
        this.parentComment = parentComment;
    }

    public ForumComment(String text, User author, ForumPost forumPost) {
        this(text, author, forumPost, null); // Comentário direto no post
    }

    // Métodos auxiliares para gerenciar relacionamentos bidirecionais (se necessário)
    public void addReply(ForumComment reply) {
        replies.add(reply);
        reply.setParentComment(this);
        reply.setForumPost(this.forumPost); // Garante que a resposta também está ligada ao post principal
    }

    public void removeReply(ForumComment reply) {
        replies.remove(reply);
        reply.setParentComment(null);
    }

    public void addVote(ForumVote vote) {
        votes.add(vote);
        // Se ForumVote for ter um campo forumComment:
        // vote.setForumComment(this);
    }

    public void removeVote(ForumVote vote) {
        votes.remove(vote);
        // Se ForumVote for ter um campo forumComment:
        // vote.setForumComment(null);
    }
}