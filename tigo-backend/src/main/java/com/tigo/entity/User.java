package com.tigo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String googleSub;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 100, nullable = false)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    @ManyToMany
    @JoinTable(
        name = "saved_posts",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> savedPosts;

    @ManyToMany
    @JoinTable(
        name = "hidden_posts",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> hiddenPosts;
}
