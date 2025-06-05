package com.brasfi.demo.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.PostRepository;
import com.brasfi.demo.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // ✅ Método para criar um novo post, agora associando o usuário corretamente
    public Post createPost(Long userId, Post postData) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String postType = postData.getPostType();
        String content = postData.getContent();

        if (postType == null || content == null) {
            throw new IllegalArgumentException("Post type e content são obrigatórios.");
        }

        if (postType.equalsIgnoreCase("text")) {
            if (content.trim().isEmpty()) {
                throw new IllegalArgumentException("Post de texto não pode ser vazio.");
            }
        } else if (postType.equalsIgnoreCase("photo")) {
            if (!content.startsWith("http://") && !content.startsWith("https://")) {
                throw new IllegalArgumentException("Post de foto deve ser uma URL válida.");
            }
        } else {
            throw new IllegalArgumentException("Tipo de post inválido. Use 'text' ou 'photo'.");
        }

        Post post = new Post();
        post.setUser(user); // 🔒 Associação segura do autor
        post.setPostType(postType);
        post.setContent(content);
        post.setExpiresAt(LocalDateTime.now().plusHours(24));

        return postRepository.save(post);
    }

    public List<Post> findPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Optional<Post> findPostById(Long postId) {
        return postRepository.findById(postId);
    }

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

        postRepository.save(post);
    }

    @Transactional
    public void toggleSavedPost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + userId));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId));

        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post);
            log.info("Post ID {} removido dos salvos do usuário ID {}", postId, userId);
        } else {
            user.getSavedPosts().add(post);
            log.info("Post ID {} adicionado aos salvos do usuário ID {}", postId, userId);
        }

        userRepository.save(user);
    }

    @Transactional
    public Post repost(Long originalPostId, Long newAuthorId) {
        Post originalPost = postRepository.findById(originalPostId)
            .orElseThrow(() -> new RuntimeException("Post original não encontrado com ID: " + originalPostId));

        User newAuthor = userRepository.findById(newAuthorId)
            .orElseThrow(() -> new RuntimeException("Usuário para o repost não encontrado com ID: " + newAuthorId));

        Post newPost = new Post();
        newPost.setUser(newAuthor);
        newPost.setPostType(originalPost.getPostType());
        newPost.setContent(originalPost.getContent());

        Post savedNewPost = postRepository.save(newPost);
        log.info("Post ID {} repostado por usuário ID {} como novo post ID {}", originalPostId, newAuthorId, savedNewPost.getId());
        return savedNewPost;
    }
}
