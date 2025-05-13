package com.brasfi.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brasfi.demo.model.Likes;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;

public interface LikesRepository extends JpaRepository<Likes, Long> {
    List<Likes> findByUser(User user);
    List<Likes> findByPost(Post post);
    boolean existsByUserAndPost(User user, Post post);
    Optional<Likes> findByUserIdAndPostId(Long userId, Long postId);
}
