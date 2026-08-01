package com.tigo.service;

import com.tigo.entity.User;
import com.tigo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSyncService {

    private final UserRepository userRepository;

    @Transactional
    public User syncUser(Jwt jwt) {
        String googleSub = jwt.getSubject();
        String rawEmail = jwt.getClaimAsString("email");
        String rawName = jwt.getClaimAsString("name");
        String picture = jwt.getClaimAsString("picture");

        final String email = (rawEmail != null) ? rawEmail : "unknown_" + googleSub + "@example.com";
        final String name = (rawName != null) ? rawName : "User";

        return userRepository.findByGoogleSub(googleSub).orElseGet(() -> {
            User newUser = User.builder()
                .googleSub(googleSub)
                .email(email)
                .displayName(name)
                .avatarUrl(picture)
                .build();
            return userRepository.save(newUser);
        });
    }
}
