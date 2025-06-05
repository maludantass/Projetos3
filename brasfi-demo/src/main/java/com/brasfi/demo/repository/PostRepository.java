package com.brasfi.demo.repository;

import com.brasfi.demo.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 🔍 Busca todos os posts já com os relacionamentos carregados
    @Query("SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.likes " +
           "LEFT JOIN FETCH p.comments")
    List<Post> findAllWithDetails();
}
