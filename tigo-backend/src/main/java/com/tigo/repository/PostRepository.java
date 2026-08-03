package com.tigo.repository;

import com.tigo.entity.Post;
import com.tigo.entity.PostStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Optional<Post> findBySlug(String slug);
    
    boolean existsBySlug(String slug);

    // Pessimistic write lock used when a post's denormalized counters (e.g. clapCount) are
    // read-modify-written, so concurrent requests serialize instead of racing and losing updates.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Post p WHERE p.id = :id")
    Optional<Post> findByIdForUpdate(@Param("id") UUID id);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:tagSlug IS NULL OR EXISTS (SELECT t FROM p.tags t WHERE t.slug = :tagSlug)) " +
           "AND (:search IS NULL OR LOWER(p.title) LIKE :search OR LOWER(p.content) LIKE :search) " +
           "AND (:featured IS NULL OR p.featured = :featured) " +
           "AND (:userId IS NULL OR p.id NOT IN (SELECT hp.id FROM User u JOIN u.hiddenPosts hp WHERE u.id = :userId)) " +
           "ORDER BY p.publishedAt DESC")
    Page<Post> findFeed(@Param("status") PostStatus status, 
                        @Param("categoryId") Integer categoryId, 
                        @Param("tagSlug") String tagSlug, 
                        @Param("search") String search, 
                        @Param("featured") Boolean featured, 
                        @Param("userId") UUID userId,
                        Pageable pageable);
    
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(UUID authorId, Pageable pageable);
    
    Page<Post> findByAuthorIdAndStatusOrderByPublishedAtDesc(UUID authorId, PostStatus status, Pageable pageable);
    
    int countByAuthorIdAndStatus(UUID authorId, PostStatus status);

    @Query("SELECT p FROM User u JOIN u.savedPosts p WHERE u.id = :userId ORDER BY p.publishedAt DESC")
    Page<Post> findSavedPostsByUserId(@Param("userId") UUID userId, Pageable pageable);
}
