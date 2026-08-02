package com.tigo.controller;

import com.tigo.config.CurrentUser;
import com.tigo.dto.CommentCreateRequest;
import com.tigo.dto.CommentResponse;
import com.tigo.entity.User;
import com.tigo.exception.UnauthorizedAccessException;
import com.tigo.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CommentCreateRequest request,
            @CurrentUser User requester) {
        if (requester == null) throw new UnauthorizedAccessException("User is not authenticated");
        return commentService.createComment(postId, request, requester);
    }

    @GetMapping
    public List<CommentResponse> getCommentsForPost(@PathVariable UUID postId) {
        return commentService.getCommentsForPost(postId);
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(
            @PathVariable UUID postId,
            @PathVariable UUID commentId,
            @CurrentUser User requester) {
        if (requester == null) throw new UnauthorizedAccessException("User is not authenticated");
        commentService.deleteComment(commentId, requester);
    }
}
