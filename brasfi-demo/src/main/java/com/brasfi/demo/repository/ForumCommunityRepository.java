package com.brasfi.demo.repository;

import com.brasfi.demo.dto.ForumCommunityResponseDTO;
import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumCommunityRepository extends JpaRepository<ForumCommunity, Long> {

    Optional<ForumCommunity> findByTitle(String title);
    Page<ForumCommunity> findByTitleContainingIgnoreCase(String titleQuery, Pageable pageable);
    Page<ForumCommunity> findByAuthor(User author, Pageable pageable);
    Page<ForumCommunity> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);
    Page<ForumCommunity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT new com.brasfi.demo.dto.ForumCommunityResponseDTO(" +
           "   fc.id, " +
           "   fc.title, " +
           "   fc.description, " +
           "   fc.author.username, " +
           "   fc.createdAt, " +
           "   SIZE(fc.posts)" +
           ") " +
           "FROM ForumCommunity fc")
    Page<ForumCommunityResponseDTO> findAllAsDTO(Pageable pageable);
}