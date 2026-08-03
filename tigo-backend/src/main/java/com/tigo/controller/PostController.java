package com.tigo.controller;

import com.tigo.config.CurrentUser;
import com.tigo.dto.PostCreateRequest;
import com.tigo.dto.PostResponse;
import com.tigo.dto.PostSummaryResponse;
import com.tigo.dto.PostUpdateRequest;
import com.tigo.entity.User;
import com.tigo.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(@Valid @RequestBody PostCreateRequest request, @CurrentUser User requester) {
        if (requester == null) throw new com.tigo.exception.UnauthorizedAccessException("User is not authenticated");
        return postService.createPost(request, requester);
    }

    @GetMapping
    public Page<PostSummaryResponse> getFeed(
            Pageable pageable,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String tagSlug,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured) {
        return postService.getFeed(pageable, Optional.ofNullable(categoryId), Optional.ofNullable(tagSlug), Optional.ofNullable(search), Optional.ofNullable(featured));
    }

    @GetMapping("/{slug}")
    public PostResponse getPostBySlug(@PathVariable String slug, @CurrentUser User requester) {
        return postService.getPostBySlug(slug, requester);
    }

    @PatchMapping("/{id}")
    public PostResponse updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody PostUpdateRequest request,
            @CurrentUser User requester) {
        if (requester == null) throw new com.tigo.exception.UnauthorizedAccessException("User is not authenticated");
        return postService.updatePost(id, request, requester);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable UUID id, @CurrentUser User requester) {
        if (requester == null) throw new com.tigo.exception.UnauthorizedAccessException("User is not authenticated");
        postService.deletePost(id, requester);
    }

    @GetMapping("/user/{userId}")
    public Page<PostSummaryResponse> getUserPosts(
            @PathVariable UUID userId,
            Pageable pageable,
            @CurrentUser User requester) {
        return postService.getUserPosts(userId, pageable, requester);
    }
}
