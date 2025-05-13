package com.brasfi.demo.model;

import jakarta.persistence.*;
import lombok.*; 

import java.time.Instant;
import java.util.List;

@Getter 
@Setter 
@ToString(exclude = {"posts", "user"}) 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
@Entity
@Table(name = "forum_communities")
public class ForumCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Lob
    @Column(nullable = false)
    private String description;

    @Column(nullable = false, updatable = false)
    private Instant createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "forumCommunity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ForumPost> posts;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ForumCommunity that = (ForumCommunity) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : System.identityHashCode(this);
    }
}