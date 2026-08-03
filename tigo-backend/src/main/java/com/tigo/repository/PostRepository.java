package com.tigo.repository;

import com.tigo.entity.Post;
import com.tigo.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Optional<Post> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:tagSlug IS NULL OR EXISTS (SELECT t FROM p.tags t WHERE t.slug = :tagSlug)) " +
           "AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:featured IS NULL OR p.featured = :featured) " +
           "ORDER BY p.publishedAt DESC")
    Page<Post> findFeed(@Param("status") PostStatus status, 
                        @Param("categoryId") Integer categoryId, 
                        @Param("tagSlug") String tagSlug, 
                        @Param("search") String search, 
                        @Param("featured") Boolean featured, 
                        Pageable pageable);
    
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(UUID authorId, Pageable pageable);
    
    Page<Post> findByAuthorIdAndStatusOrderByPublishedAtDesc(UUID authorId, PostStatus status, Pageable pageable);
    
    int countByAuthorIdAndStatus(UUID authorId, PostStatus status);
}
