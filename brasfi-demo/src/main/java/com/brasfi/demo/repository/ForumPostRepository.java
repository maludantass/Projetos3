//package com.brasfi.demo.repository;
//
//import com.brasfi.demo.model.ForumCommunity;
//import com.brasfi.demo.model.ForumPost;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
//
//    List<ForumPost> findAllByCommunity(ForumCommunity community);
//
//    Page<ForumPost> findAllByCommunity(ForumCommunity community, Pageable pageable);
//
//    List<ForumPost> findAllByUser_Id(Long userId);
//
//    Page<ForumPost> findAllByUser_Id(Long userId, Pageable pageable);
//}