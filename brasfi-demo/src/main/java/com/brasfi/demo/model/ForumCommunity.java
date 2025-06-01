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

@Data // Adiciona getters, setters, toString, etc.
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id") // Considera apenas o ID para equals e hashCode
@Entity
@Table(name = "tb_forum_community") // Você pode manter este nome ou renomear para tb_forum_topic se preferir
public class ForumCommunity implements Serializable {

    private static final long serialVersionUID = 1L; // Boa prática para Serializable

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título não pode estar em branco.")
    @Column(nullable = false, length = 255) // Definindo um tamanho máximo para o título
    private String title; // Anteriormente 'name'

    @NotBlank(message = "A descrição não pode estar em branco.")
    @Lob // Especifica que deve ser tratado como um Large Object (TEXT no PostgreSQL)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description; // Conteúdo inicial/principal do tópico

    @NotNull(message = "O autor não pode ser nulo.")
    @ManyToOne(fetch = FetchType.LAZY) // LAZY para otimizar o carregamento
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // Anteriormente 'user'

    @Column(nullable = false, updatable = false)
    @CreationTimestamp // Gerenciado automaticamente pelo Hibernate
    private Instant createdAt; // Anteriormente 'createdDate'

    @Column(nullable = false)
    @UpdateTimestamp // Gerenciado automaticamente pelo Hibernate
    private Instant updatedAt;

    // Relacionamento com ForumPost (as respostas/posts dentro desta comunidade/tópico)
    @OneToMany(
            mappedBy = "forumCommunity", // Nome do campo na entidade ForumPost que mapeia de volta
            cascade = CascadeType.ALL,   // Operações em cascata (ex: deletar comunidade, deleta posts)
            orphanRemoval = true,        // Remove posts órfãos (se um post for desassociado, ele é deletado)
            fetch = FetchType.LAZY       // LAZY para não carregar todos os posts sempre
    )
    @OrderBy("createdAt ASC") // Opcional: para ordenar os posts por data de criação
    private List<ForumPost> posts = new ArrayList<>();

    // Se você tinha um campo como 'numberOfPosts', ele pode ser derivado (calculado)
    // ou mantido através da lógica nos seus serviços para evitar inconsistências.
    // Por enquanto, vamos derivá-lo quando necessário.

    // Construtor de conveniência (opcional, Lombok @AllArgsConstructor já cria um)
    public ForumCommunity(String title, String description, User author) {
        this.title = title;
        this.description = description;
        this.author = author;
    }

    // Métodos de ajuda para gerenciar o relacionamento bidirecional com ForumPost (opcional, mas bom)
    public void addPost(ForumPost post) {
        posts.add(post);
        post.setForumCommunity(this);
    }

    public void removePost(ForumPost post) {
        posts.remove(post);
        post.setForumCommunity(null);
    }
}