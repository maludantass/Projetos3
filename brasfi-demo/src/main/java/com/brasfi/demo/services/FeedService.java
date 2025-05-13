package com.brasfi.demo.services;

import com.brasfi.demo.model.Comment;
import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;
import com.brasfi.demo.repository.CommentRepository;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
