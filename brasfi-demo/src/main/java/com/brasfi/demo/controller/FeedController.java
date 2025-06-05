package com.brasfi.demo.controller;

import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.model.Comment;
import com.brasfi.demo.repository.UserRepository;
import com.brasfi.demo.services.CommentService;
import com.brasfi.demo.services.FeedService;
import com.brasfi.demo.services.PostService;
import com.brasfi.demo.dto.PostResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentService commentService;

    @GetMapping("/{userId}")
    public List<Post> getFeed(@PathVariable Long userId) {
        User user = getUserById(userId);
        return feedService.getPostsWithLikesAndComments(user);
    }

    @GetMapping("/liked/{userId}")
    public List<Post> getLikedPosts(@PathVariable Long userId) {
        User user = getUserById(userId);
        return feedService.getPostsLikedByUser(user);
    }

    @PostMapping("/like")
    public ResponseEntity<Void> likeOrUnlikePost(@RequestParam Long userId, @RequestParam Long postId) {
        System.out.println("🟢 Chegou no endpoint /feed/like: userId=" + userId + ", postId=" + postId);
        postService.toggleLike(userId, postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/saved/{userId}")
    public List<Post> getSavedPosts(@PathVariable Long userId) {
        User user = getUserById(userId);
        return user.getSavedPosts();
    }

    @GetMapping("/general")
public List<PostResponseDTO> getGeneralFeed() {
    List<Post> posts = feedService.getGeneralFeed();
    System.out.println("📦 Total de posts carregados: " + posts.size());

    return posts.stream()
        .map(post -> {
            System.out.println("🔄 Convertendo postId=" + post.getId());
            System.out.println("👤 Autor: " + (post.getUser() != null ? post.getUser().getUsername() : "null"));
            return new PostResponseDTO(post);
        })
        .toList();
}


    // ✅ CORRIGIDO: agora delega corretamente para PostService com o userId
    @PostMapping("/post")
    public Post createPost(@RequestParam Long userId, @RequestBody Post post) {
        return postService.createPost(userId, post);
    }

    @PostMapping("/comment")
    public Comment createCommentForPost(@RequestParam Long userId, @RequestParam Long postId, @RequestBody String commentText) {
        User user = getUserById(userId);
        Post post = postService.findPostById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId));

        Comment comment = new Comment(user, post, commentText);
        return commentService.createComment(comment);
    }

    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.findCommentsByPostId(postId);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> toggleSavedPost(@RequestParam Long userId, @RequestParam Long postId) {
        postService.toggleSavedPost(userId, postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/repost")
    public ResponseEntity<PostResponseDTO> repostPost(@RequestParam Long originalPostId, @RequestParam Long newAuthorId) {
        Post newPost = postService.repost(originalPostId, newAuthorId);
        PostResponseDTO responseDTO = new PostResponseDTO(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/search")
    public List<PostResponseDTO> searchPosts(@RequestParam String keyword) {
        return feedService.searchPostsByKeyword(keyword);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterContent(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String query) {

        if (type == null || type.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Parâmetro 'type' é obrigatório (posts, users, media).");
        }

        Object result = feedService.performSearch(type, query);
        return ResponseEntity.ok(result);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}
