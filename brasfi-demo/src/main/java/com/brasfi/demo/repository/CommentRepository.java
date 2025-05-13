package com.brasfi.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brasfi.demo.model.Comment;
import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByUser(User user);
    List<Comment> findByPost(Post post);
    Optional<Comment> findByIdAndUser(Long commentId, User user);
    List<Comment> findByPostId(Long postId);
}
