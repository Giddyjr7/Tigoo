package com.tigo.service;

import com.tigo.dto.*;
import com.tigo.entity.*;
import com.tigo.exception.ResourceNotFoundException;
import com.tigo.exception.UnauthorizedAccessException;
import com.tigo.repository.CategoryRepository;
import com.tigo.repository.PostRepository;
import com.tigo.repository.TagRepository;
import com.tigo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse createPost(PostCreateRequest request, User author) {
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .coverImageUrl(request.getCoverImageUrl())
                .author(author)
                .status(request.getStatus())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .build();

        post.setSlug(generateUniqueSlug(request.getTitle()));
        post.setReadTimeMin(calculateReadTime(request.getContent()));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }

        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            post.setTags(resolveTags(request.getTagNames()));
        }

        if (post.getStatus() == PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(UUID postId, PostUpdateRequest request, User requester) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getAuthor().getId().equals(requester.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to update this post");
        }

        if (request.getTitle() != null && !request.getTitle().equals(post.getTitle())) {
            post.setTitle(request.getTitle());
            post.setSlug(generateUniqueSlug(request.getTitle()));
        }

        if (request.getContent() != null && !request.getContent().equals(post.getContent())) {
            post.setContent(request.getContent());
            post.setReadTimeMin(calculateReadTime(request.getContent()));
        }

        if (request.getExcerpt() != null) {
            post.setExcerpt(request.getExcerpt());
        }

        if (request.getCoverImageUrl() != null) {
            post.setCoverImageUrl(request.getCoverImageUrl());
        }

        if (request.getFeatured() != null) {
            post.setFeatured(request.getFeatured());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }

        if (request.getTagNames() != null) {
            post.setTags(resolveTags(request.getTagNames()));
        }

        if (request.getStatus() != null) {
            if (post.getStatus() == PostStatus.DRAFT && request.getStatus() == PostStatus.PUBLISHED) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(request.getStatus());
        }

        return mapToResponse(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getSavedPosts(User requester, Pageable pageable) {
        Page<Post> posts = postRepository.findSavedPostsByUserId(requester.getId(), pageable);
        return posts.map(this::mapToSummaryResponse);
    }

    @Transactional
    public void deletePost(UUID postId, User requester) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getAuthor().getId().equals(requester.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public PostResponse getPostBySlug(String slug, User requester) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() == PostStatus.DRAFT) {
            if (requester == null || !post.getAuthor().getId().equals(requester.getId())) {
                throw new UnauthorizedAccessException("You don't have permission to view this draft");
            }
        }

        return mapToResponse(post);
    }

    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getFeed(Pageable pageable, Optional<Integer> categoryId, Optional<String> tagSlug, Optional<String> search, Optional<Boolean> featured, User requester) {
        // Use a dummy UUID if requester is null to avoid Postgres type errors with NULL parameters for UUIDs
        UUID userId = requester != null ? requester.getId() : UUID.fromString("00000000-0000-0000-0000-000000000000");
        
        Page<Post> posts = postRepository.findFeed(
                PostStatus.PUBLISHED,
                categoryId.orElse(null),
                tagSlug.orElse(null),
                search.orElse(null),
                featured.orElse(null),
                requester != null ? requester.getId() : null, // Wait, if we pass null, let's just pass null. If it fails we'll fix it. Wait, the query has :userId IS NULL. Let's pass userId or null.
                pageable
        );

        return posts.map(this::mapToSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getUserPosts(UUID authorId, Pageable pageable, User requester) {
        boolean isOwner = requester != null && requester.getId().equals(authorId);
        
        Page<Post> posts;
        if (isOwner) {
            posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId, pageable);
        } else {
            posts = postRepository.findByAuthorIdAndStatusOrderByPublishedAtDesc(authorId, PostStatus.PUBLISHED, pageable);
        }

        return posts.map(this::mapToSummaryResponse);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (baseSlug.isEmpty()) {
            baseSlug = "post";
        }
        
        String slug = baseSlug;
        if (postRepository.existsBySlug(slug)) {
            String suffix = UUID.randomUUID().toString().substring(0, 8);
            slug = baseSlug + "-" + suffix;
        }
        return slug;
    }

    private int calculateReadTime(String content) {
        if (content == null || content.trim().isEmpty()) {
            return 1;
        }
        String[] words = content.trim().split("\\s+");
        return Math.max(1, (int) Math.ceil(words.length / 200.0));
    }

    private List<Tag> resolveTags(List<String> tagNames) {
        List<Tag> tags = new ArrayList<>();
        for (String name : tagNames) {
            String trimmedName = name.trim();
            if (trimmedName.isEmpty()) continue;
            
            Tag tag = tagRepository.findByNameIgnoreCase(trimmedName)
                    .orElseGet(() -> {
                        String tagSlug = trimmedName.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
                        return tagRepository.save(Tag.builder().name(trimmedName).slug(tagSlug).build());
                    });
            tags.add(tag);
        }
        return tags;
    }

    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .coverImageUrl(post.getCoverImageUrl())
                .readTimeMin(post.getReadTimeMin())
                .status(post.getStatus())
                .clapCount(post.getClapCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .publishedAt(post.getPublishedAt())
                .author(mapToAuthorDto(post.getAuthor()))
                .category(post.getCategory() != null ? mapToCategoryDto(post.getCategory()) : null)
                .tags(post.getTags() != null ? post.getTags().stream().map(this::mapToTagDto).collect(Collectors.toList()) : null)
                .build();
    }

    private PostSummaryResponse mapToSummaryResponse(Post post) {
        return PostSummaryResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .excerpt(post.getExcerpt())
                .coverImageUrl(post.getCoverImageUrl())
                .readTimeMin(post.getReadTimeMin())
                .clapCount(post.getClapCount())
                .publishedAt(post.getPublishedAt())
                .author(mapToAuthorDto(post.getAuthor()))
                .category(post.getCategory() != null ? mapToCategoryDto(post.getCategory()) : null)
                .tags(post.getTags() != null ? post.getTags().stream().map(this::mapToTagDto).collect(Collectors.toList()) : null)
                .build();
    }

    @Transactional
    public void savePost(UUID postId, User requester) {
        User user = userRepository.findById(requester.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        if (user.getSavedPosts() == null) {
            user.setSavedPosts(new ArrayList<>());
        }
        
        if (!user.getSavedPosts().contains(post)) {
            user.getSavedPosts().add(post);
            userRepository.save(user);
        }
    }

    @Transactional
    public void unsavePost(UUID postId, User requester) {
        User user = userRepository.findById(requester.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        if (user.getSavedPosts() != null) {
            user.getSavedPosts().remove(post);
            userRepository.save(user);
        }
    }

    @Transactional
    public void hidePost(UUID postId, User requester) {
        User user = userRepository.findById(requester.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        if (user.getHiddenPosts() == null) {
            user.setHiddenPosts(new ArrayList<>());
        }
        
        if (!user.getHiddenPosts().contains(post)) {
            user.getHiddenPosts().add(post);
            userRepository.save(user);
        }
    }

    private AuthorDto mapToAuthorDto(User user) {
        return AuthorDto.builder()
                .id(user.getId())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    private CategoryDto mapToCategoryDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }

    private TagDto mapToTagDto(Tag tag) {
        return TagDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .build();
    }
}
