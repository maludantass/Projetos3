package com.brasfi.demo.services;

import org.springframework.stereotype.Service;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
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
}
