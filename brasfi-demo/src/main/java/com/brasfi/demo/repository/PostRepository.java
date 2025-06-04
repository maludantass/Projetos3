package com.brasfi.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brasfi.demo.model.Post;
import com.brasfi.demo.model.User;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findByUserId(Long userId);
    List<Post> findByExpiresAtAfter(LocalDateTime dateTime);
    List<Post> findByContentContainingIgnoreCase(String contentQuery); //Novo pra barra de pesquisa do feed!
    List<Post> findByPostType(String postType); //Mesmo motivo q o de cima
}
