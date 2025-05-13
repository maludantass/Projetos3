package com.brasfi.demo.services;

import org.springframework.stereotype.Service;
import com.brasfi.demo.model.Likes;
import com.brasfi.demo.repository.LikesRepository;
import com.brasfi.demo.repository.PostRepository;
import com.brasfi.demo.repository.UserRepository;

@Service
public class LikeService {

    private final LikesRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public LikeService(LikesRepository likeRepository, UserRepository userRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // Curtir um post
    public Likes likePost(Long userId, Long postId) {
        // Cria um novo like
        Likes like = new Likes();

        // Define o usuário e o post para o like
        like.setUser(userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        like.setPost(postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found")));

        // Salva o like no banco de dados
        return likeRepository.save(like);
    }

    // Descurtir um post
    public void unlikePost(Long userId, Long postId) {
        // Tenta encontrar o like pelo userId e postId
        Likes like = likeRepository.findByUserIdAndPostId(userId, postId)
            .orElseThrow(() -> new RuntimeException("Like not found"));

        // Remove o like do banco de dados
        likeRepository.delete(like);
    }
}

