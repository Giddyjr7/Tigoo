package com.tigo.controller;

import com.tigo.config.CurrentUser;
import com.tigo.dto.ClapRequest;
import com.tigo.dto.ClapResponse;
import com.tigo.entity.User;
import com.tigo.exception.UnauthorizedAccessException;
import com.tigo.service.ClapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/posts/{postId}/claps")
@RequiredArgsConstructor
public class ClapController {

    private final ClapService clapService;

    @PostMapping
    public ClapResponse addClaps(
            @PathVariable UUID postId,
            @Valid @RequestBody ClapRequest request,
            @CurrentUser User requester) {
        if (requester == null) throw new UnauthorizedAccessException("User is not authenticated");
        return clapService.addClaps(postId, request, requester);
    }

    @GetMapping
    public ClapResponse getClapStatus(
            @PathVariable UUID postId,
            @CurrentUser User requester) {
        return clapService.getClapStatus(postId, requester);
    }
}
