package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumCommunity;
import com.brasfi.demo.model.ForumPost;
import com.brasfi.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    Page<ForumPost> findByForumCommunityOrderByCreatedAtDesc(ForumCommunity forumCommunity, Pageable pageable);

    Page<ForumPost> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

    Page<ForumPost> findByTitleContainingIgnoreCase(String titleQuery, Pageable pageable);

    Page<ForumPost> findByForumCommunityAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
            ForumCommunity forumCommunity, String titleQuery, Pageable pageable);

    // Métodos de lista (se você ainda os utiliza)
    List<ForumPost> findByForumCommunity(ForumCommunity forumCommunity);
    List<ForumPost> findByAuthor(User author); // Se o campo em ForumPost for 'author'

    /**
     * Conta o número de posts em uma determinada comunidade.
     * @param forumCommunity A comunidade para a qual contar os posts.
     * @return A contagem de posts.
     */
    long countByForumCommunity(ForumCommunity forumCommunity); // MÉTODO ADICIONADO
}