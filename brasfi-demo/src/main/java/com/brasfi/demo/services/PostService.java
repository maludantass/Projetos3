package com.brasfi.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;
import com.brasfi.demo.repository.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikesRepository likesRepository;

    // Criar post com vínculo ao autor
    public Post createPost(Long userId, Post post) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    post.setUser(user);

    // ✅ Define a data de criação se não vier do frontend
    if (post.getCreatedAt() == null) {
        post.setCreatedAt(java.time.LocalDateTime.now());
    }

    // ✅ Define o expiresAt manualmente para 24h depois
    if (post.getExpiresAt() == null) {
        post.setExpiresAt(java.time.LocalDateTime.now().plusHours(24));
    }

    return postRepository.save(post);
}

public List<Post> getLikedPostsByUser(Long userId) {
return postRepository.findLikedPostsWithUserByUserId(userId);
}

    // Curtir ou descurtir um post
    public void toggleLike(Long userId, Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + userId));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado com id: " + postId));

        Optional<Likes> existingLike = likesRepository.findByUserIdAndPostId(userId, postId);

        if (existingLike.isPresent()) {
            likesRepository.delete(existingLike.get()); // descurtir
        } else {
            Likes like = new Likes(user, post);
            likesRepository.save(like); // curtir
        }
    }

    // Salvar ou remover um post dos salvos
    public void toggleSavedPost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado"));

        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post);
        } else {
            user.getSavedPosts().add(post);
        }

        userRepository.save(user);
    }

    // Repostar um post com novo autor
    public Post repost(Long originalPostId, Long newAuthorId) {
        Post original = postRepository.findById(originalPostId)
            .orElseThrow(() -> new RuntimeException("Post original não encontrado"));

        User newAuthor = userRepository.findById(newAuthorId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post repost = new Post();
        repost.setContent(original.getContent());
        repost.setPostType("repost");
        repost.setUser(newAuthor);

        return postRepository.save(repost);
    }

    // Buscar post por ID
    public Optional<Post> findPostById(Long postId) {
        return postRepository.findById(postId);
    }

    // Listar todos os posts (usado no feed talvez)
    public List<Post> findAllPosts() {
        return postRepository.findAll();
    }
}
