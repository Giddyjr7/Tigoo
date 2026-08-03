package com.tigo.controller;

import com.tigo.config.CurrentUser;
import com.tigo.dto.UserDto;
import com.tigo.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.tigo.dto.UserProfileDto;
import com.tigo.entity.PostStatus;
import com.tigo.exception.ResourceNotFoundException;
import com.tigo.repository.PostRepository;
import com.tigo.repository.UserRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @GetMapping("/me")
    public UserDto getCurrentUser(@CurrentUser User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @GetMapping("/{userId}")
    public UserProfileDto getUserProfile(@PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        int postCount = postRepository.countByAuthorIdAndStatus(userId, PostStatus.PUBLISHED);

        return UserProfileDto.builder()
                .id(user.getId())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .joinedPostCount(postCount)
                .build();
    }
}
