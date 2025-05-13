//package com.brasfi.demo.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.Instant;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@Entity
//@Table(name = "posts")
//public class ForumPost {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String title;
//
//    @Lob
//    @Column(nullable = false)
//    private String content;
//
//    @CreationTimestamp
//    @Column(nullable = false, updatable = false)
//    private Instant createdDate;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "community_id", referencedColumnName = "id")
//    private ForumCommunity community;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", referencedColumnName = "id")
//    private User user;
//
//    private Integer voteCount = 0;
//}