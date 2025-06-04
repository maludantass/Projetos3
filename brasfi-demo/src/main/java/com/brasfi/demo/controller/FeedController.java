package com.brasfi.demo.controller;

import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.UserRepository;
import com.brasfi.demo.services.FeedService;
import com.brasfi.demo.services.PostService;
import com.brasfi.demo.dto.PostResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    // Endpoint para obter todos os posts com seus likes e comentários de um usuário
    @GetMapping("/{userId}")
    public List<Post> getFeed(@PathVariable Long userId) {
        User user = getUserById(userId);
        return feedService.getPostsWithLikesAndComments(user);
    }

    // Endpoint para obter todos os posts curtidos por um usuário
    @GetMapping("/liked/{userId}")
    public List<Post> getLikedPosts(@PathVariable Long userId) {
        User user = getUserById(userId);
        return feedService.getPostsLikedByUser(user);
    }

    // Endpoint para os vídeos salvos do usuário
    @GetMapping("/saved/{userId}")
    public List<Post> getSavedPosts(@PathVariable Long userId) {
        User user = getUserById(userId);
        return user.getSavedPosts();
    }

    // Endpoint para obter o feed geral (posts que ainda não expiraram) 
    @GetMapping("/general")
    public List<PostResponseDTO> getGeneralFeed() {
        return feedService.getGeneralFeed()
            .stream()
            .map(PostResponseDTO::new)
            .toList();
    }

    // Endpoint para criar um novo post
    @PostMapping("/post")
    public Post createPost(@RequestParam Long userId, @RequestBody Post post) {
        // Busca o usuário no banco
        User user = getUserById(userId);
        post.setUser(user);

        // Validação do tipo de post
        if (post.getPostType() == null || (!post.getPostType().equals("text") && !post.getPostType().equals("photo"))) {
            throw new IllegalArgumentException("Post type must be either 'text' or 'photo'");
        }

        // Validação do conteúdo
        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be empty");
        }

        // Criação do post
        Post savedPost = postService.createPost(post);
        savedPost.setUser(user); // força garantir que o user esteja no JSON retornado
        return savedPost;
    }

    private User getUserById(Long userId) {

        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}
