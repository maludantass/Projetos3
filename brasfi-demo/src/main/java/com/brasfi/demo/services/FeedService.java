package com.brasfi.demo.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brasfi.demo.dto.PostResponseDTO;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.PostRepository;

@Service
public class FeedService {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    // ✅ Retorna os posts curtidos por um usuário específico
    public List<Post> getPostsLikedByUser(User user) {
        return postService.getLikedPostsByUser(user.getId());
    }

    // ✅ Retorna todos os posts com likes e comentários (se quiser expandir)
    public List<Post> getPostsWithLikesAndComments(User user) {
        List<Post> posts = postRepository.findAll();
        // Aqui pode adicionar lógica extra se quiser mostrar, por exemplo, se o user curtiu
        return posts;
    }

    // ✅ Retorna todos os posts públicos (geral)
    public List<Post> getGeneralFeed() {
        return postRepository.findAllWithDetails();
    }

    // ✅ Pesquisa por palavra-chave no conteúdo do post
    public List<PostResponseDTO> searchPostsByKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return Collections.emptyList();
        }

        return postRepository.findAll().stream()
            .filter(post -> post.getContent() != null && post.getContent().toLowerCase().contains(keyword.toLowerCase()))
            .map(PostResponseDTO::new)
            .collect(Collectors.toList());
    }

    // ✅ Pesquisa personalizada por tipo (opcional)
    public Object performSearch(String type, String query) {
        switch (type.toLowerCase()) {
            case "posts":
                return searchPostsByKeyword(query);
            // Pode expandir para "users", "media", etc.
            default:
                return new ArrayList<>();
        }
    }
}
