package com.brasfi.demo.services;
import org.springframework.stereotype.Service;

import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Método que vai criar um novo post
    public Post createPost(Post post) {
        // Validando o tipo do post
        String postType = post.getPostType();
        String content = post.getContent();

        if (postType == null || content == null) {
            throw new IllegalArgumentException("Post type e content são obrigatórios.");
        }

        if (postType.equalsIgnoreCase("text")) {
            // Verifica se o conteúdo não é vazio para textos
            if (content.trim().isEmpty()) {
                throw new IllegalArgumentException("Post de texto não pode ser vazio.");
            }
        } else if (postType.equalsIgnoreCase("photo")) {
            // Verifica se é uma URL válida para fotos
            if (!content.startsWith("http://") && !content.startsWith("https://")) {
                throw new IllegalArgumentException("Post de foto deve ser uma URL válida.");
            }
        } else {
            throw new IllegalArgumentException("Tipo de post inválido. Use 'text' ou 'photo'.");
        }

        // Configura o expiresAt se não estiver definido
        if (post.getExpiresAt() == null) {
            post.setExpiresAt(LocalDateTime.now().plusHours(24));
        }

        // Salva o post no banco
        return postRepository.save(post);
    }

    // Buscar posts por usuário
    public List<Post> findPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    // Buscar post por ID
    public Optional<Post> findPostById(Long postId) {
        return postRepository.findById(postId);
    }

    // Excluir um post
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
    @Transactional
    public void toggleLike(Long userId, Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        boolean removed = post.getLikes().removeIf(like -> like.getUser().getId().equals(userId));

        if (!removed) {
            Likes newLike = new Likes();
            newLike.setUser(user);
            newLike.setPost(post);
            post.getLikes().add(newLike);
        }

        postRepository.save(post); // <-- IMPORTANTE!
    }

    @Transactional // Garante que a transação de banco de dados seja gerenciada corretamente
    public void toggleSavedPost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + userId));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId));

        // Verifica se o post já está na lista de salvos do usuário
        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post); // Se já está salvo, remove
            log.info("Post ID {} removido dos salvos do usuário ID {}", postId, userId);
        } else {
            user.getSavedPosts().add(post); // Se não está salvo, adiciona
            log.info("Post ID {} adicionado aos salvos do usuário ID {}", postId, userId);
        }

        userRepository.save(user); // Salva as alterações no usuário
    }

    //Novo método pra repostagem, da forma mais simples, que basicamente cria um novo post com o conteudo do post que está sendo repostado
    @Transactional
    public Post repost(Long originalPostId, Long newAuthorId) {
        // 1. Encontra o post original
        Post originalPost = postRepository.findById(originalPostId)
            .orElseThrow(() -> new RuntimeException("Post original não encontrado com ID: " + originalPostId));

        // 2. Encontra o novo autor (usuário que está repostando)
        User newAuthor = userRepository.findById(newAuthorId)
            .orElseThrow(() -> new RuntimeException("Usuário para o repost não encontrado com ID: " + newAuthorId));

        // 3. Cria um novo objeto Post com base nos dados do post original
        Post newPost = new Post();
        newPost.setUser(newAuthor); // O autor do novo post é o usuário que repostou
        newPost.setPostType(originalPost.getPostType());
        newPost.setContent(originalPost.getContent());
        // createdAt e expiresAt serão definidos automaticamente pelo @PrePersist no Post

        // 4. Salva o novo post (o repost)
        Post savedNewPost = postRepository.save(newPost);
        log.info("Post ID {} repostado por usuário ID {} como novo post ID {}", originalPostId, newAuthorId, savedNewPost.getId());
        return savedNewPost;
    }

}
