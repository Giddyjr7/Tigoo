package com.tigo.dto;

import java.util.UUID;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private UUID id;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private int joinedPostCount;
}
