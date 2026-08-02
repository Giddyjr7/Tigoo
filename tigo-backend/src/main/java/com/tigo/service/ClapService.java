package com.tigo.service;

import com.tigo.dto.ClapRequest;
import com.tigo.dto.ClapResponse;
import com.tigo.entity.Clap;
import com.tigo.entity.Post;
import com.tigo.entity.User;
import com.tigo.exception.ResourceNotFoundException;
import com.tigo.repository.ClapRepository;
import com.tigo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClapService {

    private final ClapRepository clapRepository;
    private final PostRepository postRepository;

    @Transactional
    public ClapResponse addClaps(UUID postId, ClapRequest request, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Optional<Clap> existingClapOpt = clapRepository.findByPostIdAndUserId(postId, user.getId());
        
        int requestedAmount = request.getCount();
        int amountAdded = 0;
        int newUserClapCount = 0;

        if (existingClapOpt.isPresent()) {
            Clap existingClap = existingClapOpt.get();
            int currentClaps = existingClap.getCount();
            
            if (currentClaps < 50) {
                int spaceLeft = 50 - currentClaps;
                amountAdded = Math.min(requestedAmount, spaceLeft);
                existingClap.setCount(currentClaps + amountAdded);
                clapRepository.save(existingClap);
                newUserClapCount = existingClap.getCount();
            } else {
                // Already at 50, cap silently, add 0
                newUserClapCount = 50;
                amountAdded = 0;
            }
        } else {
            amountAdded = Math.min(requestedAmount, 50);
            Clap newClap = Clap.builder()
                    .post(post)
                    .user(user)
                    .count(amountAdded)
                    .build();
            clapRepository.save(newClap);
            newUserClapCount = amountAdded;
        }

        if (amountAdded > 0) {
            post.setClapCount(post.getClapCount() + amountAdded);
            postRepository.save(post);
        }

        return ClapResponse.builder()
                .postId(postId)
                .totalClapCount(post.getClapCount())
                .userClapCount(newUserClapCount)
                .build();
    }

    @Transactional(readOnly = true)
    public ClapResponse getClapStatus(UUID postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        int userClapCount = 0;
        if (user != null) {
            Optional<Clap> existingClapOpt = clapRepository.findByPostIdAndUserId(postId, user.getId());
            if (existingClapOpt.isPresent()) {
                userClapCount = existingClapOpt.get().getCount();
            }
        }

        return ClapResponse.builder()
                .postId(postId)
                .totalClapCount(post.getClapCount())
                .userClapCount(userClapCount)
                .build();
    }
}
