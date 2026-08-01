package com.tigo.repository;

import com.tigo.entity.Post;
import com.tigo.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Optional<Post> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    Page<Post> findByStatusOrderByPublishedAtDesc(PostStatus status, Pageable pageable);
    
    Page<Post> findByStatusAndCategoryIdOrderByPublishedAtDesc(PostStatus status, Integer categoryId, Pageable pageable);
    
    Page<Post> findByStatusAndTags_SlugOrderByPublishedAtDesc(PostStatus status, String tagSlug, Pageable pageable);
    
    Page<Post> findByStatusAndCategoryIdAndTags_SlugOrderByPublishedAtDesc(PostStatus status, Integer categoryId, String tagSlug, Pageable pageable);
    
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(UUID authorId, Pageable pageable);
    
    Page<Post> findByAuthorIdAndStatusOrderByPublishedAtDesc(UUID authorId, PostStatus status, Pageable pageable);
}
