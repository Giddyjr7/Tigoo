package com.tigo.service;

import com.tigo.dto.AuthorDto;
import com.tigo.dto.CommentCreateRequest;
import com.tigo.dto.CommentResponse;
import com.tigo.entity.Comment;
import com.tigo.entity.Post;
import com.tigo.entity.PostStatus;
import com.tigo.entity.User;
import com.tigo.exception.ResourceNotFoundException;
import com.tigo.exception.UnauthorizedAccessException;
import com.tigo.repository.CommentRepository;
import com.tigo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentResponse createComment(UUID postId, CommentCreateRequest request, User author) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new IllegalArgumentException("Cannot comment on an unpublished post");
        }

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            
            if (!parentComment.getPost().getId().equals(postId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this post");
            }
        }

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .parentComment(parentComment)
                .content(request.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return mapToResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForPost(UUID postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        List<Comment> allComments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        
        Map<UUID, CommentResponse> responseMap = new LinkedHashMap<>();
        List<CommentResponse> topLevelComments = new ArrayList<>();

        for (Comment comment : allComments) {
            CommentResponse response = mapToResponse(comment);
            responseMap.put(response.getId(), response);
        }

        for (Comment comment : allComments) {
            CommentResponse response = responseMap.get(comment.getId());
            if (comment.getParentComment() == null) {
                topLevelComments.add(response);
            } else {
                CommentResponse parentResponse = responseMap.get(comment.getParentComment().getId());
                if (parentResponse != null) {
                    if (parentResponse.getReplies() == null) {
                        parentResponse.setReplies(new ArrayList<>());
                    }
                    parentResponse.getReplies().add(response);
                }
            }
        }

        return topLevelComments;
    }

    @Transactional
    public void deleteComment(UUID commentId, User requester) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getAuthor().getId().equals(requester.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(AuthorDto.builder()
                        .id(comment.getAuthor().getId())
                        .displayName(comment.getAuthor().getDisplayName())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .build())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(new ArrayList<>())
                .build();
    }
}
