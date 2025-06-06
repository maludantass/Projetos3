package com.brasfi.demo.services;

import com.brasfi.demo.dto.PostResponseDTO;
import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;
import com.brasfi.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Post> getGeneralFeed() {
        return postRepository.findAllWithDetails();
    }

    public List<Post> getPostsLikedByUser(User user) {
        return likesRepository.findLikedPostsByUserId(user.getId());
    }

    public void toggleLike(User user, Post post) {
        Optional<Likes> existing = likesRepository.findByUserIdAndPostId(user.getId(), post.getId());

        if (existing.isPresent()) {
            likesRepository.delete(existing.get());
        } else {
            Likes like = new Likes(user, post);
            likesRepository.save(like);
        }
    }

    public void toggleSave(User user, Post post) {
        List<Post> saved = new ArrayList<>(user.getSavedPosts());

        if (saved.stream().anyMatch(p -> p.getId().equals(post.getId()))) {
            saved.removeIf(p -> p.getId().equals(post.getId()));
        } else {
            saved.add(post);
        }

        user.setSavedPosts(saved);
        userRepository.save(user);
    }

    public List<PostResponseDTO> searchPostsByKeyword(String keyword) {
    return postRepository.findByContentContainingIgnoreCase(keyword)
        .stream()
        .map(PostResponseDTO::new)
        .collect(Collectors.toList());
}


public Object performSearch(String type, String query) {
    switch (type.toLowerCase()) {
        case "posts":
            return postRepository.findByContentContainingIgnoreCase(query)
                    .stream()
                    .map(PostResponseDTO::new)
                    .collect(Collectors.toList());

        case "users":
            // Busca todos os posts cujo autor tem username semelhante
            return postRepository.findAllWithDetails().stream()
                    .filter(p -> p.getUser() != null &&
                                 p.getUser().getUsername().toLowerCase().contains(query.toLowerCase()))
                    .map(PostResponseDTO::new)
                    .collect(Collectors.toList());

        default:
            return Collections.emptyList();
    }
}



    public Post repost(Post original, User newAuthor) {
        Post repost = new Post();
        repost.setContent(original.getContent());
        repost.setPostType(original.getPostType());
        repost.setUser(newAuthor);
        return postRepository.save(repost);
    }

    public List<Post> getPostsWithLikesAndComments(User user) {
    // Aqui retornamos todos os posts, com autor preenchido, incluindo likes e comentários
    List<Post> allPosts = postRepository.findAll();

    // Filtro opcional: pode retornar apenas os que ainda não expiraram
    return allPosts.stream()
            .filter(post -> post.getExpiresAt() == null || post.getExpiresAt().isAfter(LocalDateTime.now()))
            .collect(Collectors.toList());
}


}
