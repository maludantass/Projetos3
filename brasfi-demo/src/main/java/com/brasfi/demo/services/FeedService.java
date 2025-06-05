package com.brasfi.demo.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brasfi.demo.dto.PostResponseDTO;
import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikesRepository likesRepository;

    // Retorna todos os posts públicos (ou gerais)
    public List<Post> getGeneralFeed() {
    return postRepository.findAllWithDetails();
    }


    // Retorna os posts curtidos por um usuário específico
    public List<Post> getPostsLikedByUser(User user) {
        List<Likes> likes = likesRepository.findByUser(user);
        return likes.stream()
                    .map(Likes::getPost)
                    .collect(Collectors.toList());
    }

    // Retorna posts com informações extras de curtidas/comentários (se você estiver usando isso)
    public List<Post> getPostsWithLikesAndComments(User user) {
        List<Post> posts = postRepository.findAll();

        // (Opcional: aqui você pode aplicar alguma lógica específica se desejar)
        return posts;
    }

    // Pesquisa por palavra-chave no conteúdo do post
    public List<PostResponseDTO> searchPostsByKeyword(String keyword) {
    if (keyword == null || keyword.isBlank()) {
        return Collections.emptyList();
    }

    return postRepository.findAll().stream()
        .filter(post -> post.getContent() != null && post.getContent().toLowerCase().contains(keyword.toLowerCase()))
        .map(PostResponseDTO::new) // ✅ transforma para DTO
        .collect(Collectors.toList());
}


    // Pesquisa personalizada por tipo (opcional)
    public Object performSearch(String type, String query) {
        switch (type.toLowerCase()) {
            case "posts":
                return searchPostsByKeyword(query);
            // Você pode adicionar cases para "users", "media", etc.
            default:
                return new ArrayList<>();
        }
    }
}
