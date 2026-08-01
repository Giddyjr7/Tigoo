package com.tigo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AuthorDto {
    private UUID id;
    private String displayName;
    private String avatarUrl;
}
