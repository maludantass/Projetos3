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
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


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
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return feedService.getPostsWithLikesAndComments(user);
    }

    @GetMapping("/liked/{userId}")
    public List<PostResponseDTO> getLikedPosts(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Post> likedPosts = feedService.getPostsLikedByUser(user);
        return likedPosts.stream().map(PostResponseDTO::new).collect(Collectors.toList());
    }

    @PostMapping("/save")
    public ResponseEntity<String> toggleSavePost(@RequestParam Long userId, @RequestParam Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post post = postService.getPostById(postId);

        List<Post> saved = new ArrayList<>(user.getSavedPosts());
        if (saved.stream().anyMatch(p -> p.getId().equals(post.getId()))) {
            saved.removeIf(p -> p.getId().equals(post.getId()));
        } else {
            saved.add(post);
        }
        user.setSavedPosts(saved);
        userRepository.save(user);

        return ResponseEntity.ok("Post salvo/desfavoritado com sucesso.");
    }

    @GetMapping("/saved/{userId}")
    public List<PostResponseDTO> getSavedPosts(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return user.getSavedPosts().stream()
            .map(PostResponseDTO::new)
            .collect(Collectors.toList());
    }

    @PostMapping("/like")
    public ResponseEntity<String> toggleLikePost(@RequestParam Long userId, @RequestParam Long postId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Post post = postService.getPostById(postId);
        feedService.toggleLike(user, post);
        return ResponseEntity.ok("Like atualizado com sucesso.");
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
            .collect(Collectors.toList());
    }

    @PostMapping("/post")
    public Post createPost(@RequestParam Long userId, @RequestBody Post post) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        post.setUser(user);

        if (post.getPostType() == null || (!post.getPostType().equals("text") && !post.getPostType().equals("photo"))) {
            throw new IllegalArgumentException("Post type must be either 'text' or 'photo'");
        }

        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be empty");
        }

        Post savedPost = postService.createPost(userId, post);
        savedPost.setUser(user);
        return savedPost;
    }

@PostMapping("/comment")
public ResponseEntity<?> createCommentForPost(@RequestBody Map<String, String> payload) {
    Long userId = Long.parseLong(payload.get("userId"));
    Long postId = Long.parseLong(payload.get("postId"));
    String commentText = payload.get("text");

    if (commentText == null || commentText.trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Texto do comentário não pode ser vazio.");
    }

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    Post post = postService.findPostById(postId)
        .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId));

    Comment comment = new Comment(user, post, commentText);
    commentService.createComment(comment);

    return ResponseEntity.ok().build();
}

    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.findCommentsByPostId(postId);
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
            return ResponseEntity.badRequest().body("Parâmetro 'type' é obrigatório (posts, users).");
        }

        Object result = feedService.performSearch(type, query);
        return ResponseEntity.ok(result);
    }
}
