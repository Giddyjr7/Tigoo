package com.tigo.controller;

import com.tigo.dto.UserDto;
import com.tigo.entity.User;
import com.tigo.service.UserSyncService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserSyncService userSyncService;

    @GetMapping("/me")
    public UserDto getCurrentUser(@AuthenticationPrincipal Jwt jwt, jakarta.servlet.http.HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                logger.info("Cookie: {} = {}", cookie.getName(), cookie.getValue());
            }
        }
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            logger.info("Header: {} = {}", headerName, request.getHeader(headerName));
        }

        logger.info("JWT subject (googleSub): {}", jwt.getSubject());
        logger.info("JWT claims: {}", jwt.getClaims());

        User user = userSyncService.syncUser(jwt);
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
