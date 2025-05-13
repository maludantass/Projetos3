package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumPost;
import com.brasfi.demo.model.ForumVote;
import com.brasfi.demo.model.ForumVoteId;
import com.brasfi.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumVoteRepository extends JpaRepository<ForumVote, ForumVoteId> {

    Optional<ForumVote> findByPostAndUser(ForumPost post, User user);

}