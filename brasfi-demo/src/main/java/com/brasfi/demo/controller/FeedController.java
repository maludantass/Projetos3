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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;


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



    
    // Endpoint para obter todos os posts com seus likes e comentários de um usuário
    @GetMapping("/{userId}")
    public List<Post> getFeed(@PathVariable Long userId) {
        User user = getUserById(userId);
        return feedService.getPostsWithLikesAndComments(user);
    }

    // Endpoint para obter todos os posts curtidos por um usuário
    @GetMapping("/liked/{userId}")
public List<PostResponseDTO> getLikedPosts(@PathVariable Long userId) {
    User user = getUserById(userId);
    List<Post> likedPosts = feedService.getPostsLikedByUser(user);

    System.out.println("🔎 Posts curtidos por " + user.getUsername() + ": " + likedPosts.size());
    likedPosts.forEach(p -> System.out.println(" - ID: " + p.getId() + ", Conteúdo: " + p.getContent()));

    return likedPosts.stream()
        .map(PostResponseDTO::new)
        .collect(Collectors.toList());
}
@PostMapping("/save")
public ResponseEntity<String> toggleSavePost(@RequestParam Long userId, @RequestParam Long postId) {
    User user = getUserById(userId);
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



    // Endpoint para os vídeos salvos do usuário
    @GetMapping("/saved/{userId}")
public List<PostResponseDTO> getSavedPosts(@PathVariable Long userId) {
    User user = getUserById(userId);
    return user.getSavedPosts().stream()
        .map(PostResponseDTO::new)
        .collect(Collectors.toList());
}

@PostMapping("/like")
public ResponseEntity<String> toggleLikePost(@RequestParam Long userId, @RequestParam Long postId) {
    User user = getUserById(userId);
    Post post = postService.getPostById(postId);
    feedService.toggleLike(user, post);
    return ResponseEntity.ok("Like atualizado com sucesso.");
}



    // Endpoint para obter o feed geral (posts que ainda não expiraram) 
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
Post savedPost = postService.createPost(userId, post);
        savedPost.setUser(user); // força garantir que o user esteja no JSON retornado
        return savedPost;
    }

    //End point pra commentar num post!!!!!!!!!!!!!
    @PostMapping("/comment")
    public Comment createCommentForPost(@RequestParam Long userId, @RequestParam Long postId, @RequestBody String commentText) {
        User user = getUserById(userId); //
        Post post = postService.findPostById(postId) //
                .orElseThrow(() -> new RuntimeException("Post não encontrado com ID: " + postId)); //

        Comment comment = new Comment(user, post, commentText); //
        return commentService.createComment(comment); //
    }

    //End point sugerido pra listar comentarios em um post (Não é 100% necessário, pode apagar se quiser)
    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.findCommentsByPostId(postId); //
    }



    //Novo end point pra repostar posts!
    @PostMapping("/repost")
    public ResponseEntity<PostResponseDTO> repostPost(@RequestParam Long originalPostId, @RequestParam Long newAuthorId) {
        Post newPost = postService.repost(originalPostId, newAuthorId);
        // Mapeia o novo post para um DTO de resposta para incluir informações completas
        PostResponseDTO responseDTO = new PostResponseDTO(newPost); // O construtor já calcula likes e comments
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO); // Retorna 201 Created
    }

    //Novo end point para busca de posts no feed com aquela barra de pesquisa la!
    @GetMapping("/search")
public List<PostResponseDTO> searchPosts(@RequestParam String keyword) {
    List<Post> posts = feedService.searchPostsByKeyword(keyword);
    return posts.stream()
        .map(PostResponseDTO::new)
        .collect(Collectors.toList());
}


    @GetMapping("/filter")
    public ResponseEntity<?> filterContent(
            @RequestParam(required = false) String type, // Pode ser "posts", "users", "media"
            @RequestParam(required = false) String query) { // A palavra-chave para pesquisa

        // Se nenhum tipo for especificado, pode retornar um erro ou o feed geral
        if (type == null || type.trim().isEmpty()) {
            // Para a simplicidade, vamos retornar o feed geral se nenhum filtro for especificado
            // ou lançar um erro, dependendo da sua preferência.
            // Por enquanto, vamos pedir um tipo.
            return ResponseEntity.badRequest().body("Parâmetro 'type' é obrigatório (posts, users, media).");
        }

        Object result = feedService.performSearch(type, query);
        return ResponseEntity.ok(result);
    }

    private User getUserById(Long userId) {

        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}