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
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_forum_post")
public class ForumPost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Anteriormente 'postId'

    @NotBlank(message = "O título do post não pode estar em branco.")
    @Column(nullable = false, length = 300) // Título do post, similar ao Reddit
    private String title; // Anteriormente 'postName'

    @Lob // Para conteúdo potencialmente longo
    @Column(columnDefinition = "TEXT") // Conteúdo textual do post
    private String content; // Anteriormente 'description'. Pode ser nulo se for um post de link.

    @Column(length = 2048) // URL para posts do tipo link (opcional por enquanto)
    private String url;

    // voteCount será calculado dinamicamente a partir da lista 'votes' ou no serviço/DTO.
    // private Integer voteCount = 0; // Removido para evitar inconsistência de dados

    @NotNull(message = "O autor do post não pode ser nulo.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // Anteriormente 'user'

    @NotNull(message = "A comunidade do post não pode ser nula.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_community_id", nullable = false)
    private ForumCommunity forumCommunity; // A qual comunidade/tópico este post pertence

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt; // Anteriormente 'createdDate'

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    // Relacionamento com ForumComment (comentários para este post)
    @OneToMany(
            mappedBy = "forumPost",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @OrderBy("createdAt ASC") // Ordena os comentários diretos por data de criação
    private List<ForumComment> comments = new ArrayList<>();

    // Relacionamento com ForumVote (votos para este post)
    @OneToMany(
            mappedBy = "forumPost", // Assumindo que ForumVote terá um campo 'forumPost'
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ForumVote> votes = new ArrayList<>();

    // Construtores de conveniência
    public ForumPost(String title, String content, String url, User author, ForumCommunity forumCommunity) {
        this.title = title;
        this.content = content;
        this.url = url;
        this.author = author;
        this.forumCommunity = forumCommunity;
    }

    // Métodos auxiliares para gerenciar relacionamentos bidirecionais (se necessário)
    public void addComment(ForumComment comment) {
        comments.add(comment);
        comment.setForumPost(this);
    }

    public void removeComment(ForumComment comment) {
        comments.remove(comment);
        comment.setForumPost(null);
    }

    public void addVote(ForumVote vote) {
        votes.add(vote);
        vote.setForumPost(this); // Certifique-se que ForumVote tem setForumPost()
    }

    public void removeVote(ForumVote vote) {
        votes.remove(vote);
        vote.setForumPost(null); // Certifique-se que ForumVote tem setForumPost()
    }
}