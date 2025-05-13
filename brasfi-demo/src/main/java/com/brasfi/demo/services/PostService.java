package com.brasfi.demo.services;

import org.springframework.stereotype.Service;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.repository.PostRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    //o método que vai criar um novo post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    //Buscar posts por usuário
    public List<Post> findPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    //Buscar post por ID
    public Optional<Post> findPostById(Long postId) {
        return postRepository.findById(postId);
    }

    //Excluir um post
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
}
