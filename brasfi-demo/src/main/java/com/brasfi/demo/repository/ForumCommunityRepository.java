package com.brasfi.demo.repository;

import com.brasfi.demo.model.ForumCommunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumCommunityRepository extends JpaRepository<ForumCommunity, Long> {

    Optional<ForumCommunity> findByName(String name);

}