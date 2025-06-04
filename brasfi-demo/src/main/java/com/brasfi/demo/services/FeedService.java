package com.brasfi.demo.services;

import com.brasfi.demo.dto.PostResponseDTO;
import com.brasfi.demo.model.Comment;
import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.CommentRepository;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;
import com.brasfi.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brasfi.demo.dto.UserSummaryDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    // Método para buscar posts de um usuário com seus likes e comentários
    public List<Post> getPostsWithLikesAndComments(User user) {
        List<Post> posts = postRepository.findByUser(user);

        // Carregar likes e comentários para cada post
        for (Post post : posts) {
            List<Likes> likes = likesRepository.findByPost(post);
            List<Comment> comments = commentRepository.findByPost(post);

            post.setLikes(likes);
            post.setComments(comments);
        }

        return posts;
    }

    // Método para buscar posts com base no usuário que curtiu
    public List<Post> getPostsLikedByUser(User user) {
        List<Likes> likes = likesRepository.findByUser(user);
        List<Post> posts = likes.stream()
                .map(Likes::getPost)
                .toList();
        return posts;
    }

    public List<Post> getGeneralFeed() {
        LocalDateTime now = LocalDateTime.now();
        return postRepository.findByExpiresAtAfter(now);  // Filtra os posts que ainda não expiraram
    }

    public List<PostResponseDTO> searchPostsByKeyword(String keyword) {
        List<Post> posts = postRepository.findByContentContainingIgnoreCase(keyword);
        // Garante que likes e comments sejam carregados para o DTO
        for (Post post : posts) {
            // O Hibernate já deve carregar Lazy collections quando acessadas dentro de uma transação.
            // Para garantir, especialmente se você tiver N+1 issues no futuro, pode considerar JOIN FETCH
            // na query do repositório ou garantir que as collections são acessadas antes de fechar a sessão.
            // Para a simplicidade atual, o acesso em PostResponseDTO::new já deve acionar o carregamento.
            post.getLikes().size(); // Força o carregamento da coleção de likes
            post.getComments().size(); // Força o carregamento da coleção de comentários
        }
        return posts.stream()
            .map(PostResponseDTO::new)
            .toList();
    }

    public List<UserSummaryDTO> searchUsersByUsername(String usernameQuery) {
        return userRepository.findByUsernameContainingIgnoreCase(usernameQuery).stream()
                .map(UserSummaryDTO::new) // Mapeia para o DTO de resumo do usuário
                .toList();
    }

    public List<PostResponseDTO> getPostsByType(String postType) {
        return postRepository.findByPostType(postType).stream()
                .map(PostResponseDTO::new)
                .toList();
    }

    // Método unificado de pesquisa. Ele decidirá o que buscar com base nos parâmetros.
    public Object performSearch(String type, String query) {
        if ("posts".equalsIgnoreCase(type)) {
            // Reutiliza o método de busca por keyword para posts
            return searchPostsByKeyword(query);
        } else if ("users".equalsIgnoreCase(type)) {
            return searchUsersByUsername(query);
        } else if ("media".equalsIgnoreCase(type)) {
            // Assume que "mídia" se refere a posts do tipo "photo"
            return getPostsByType("photo");
        } else {
            // Retorna uma lista vazia ou lança uma exceção para tipo inválido
            return List.of();
        }
    }
}
