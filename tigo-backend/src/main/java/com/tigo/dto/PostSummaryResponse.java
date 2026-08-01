package com.tigo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSummaryResponse {
    private UUID id;
    private String title;
    private String slug;
    private String excerpt;
    private String coverImageUrl;
    private Integer readTimeMin;
    private Integer clapCount;
    private LocalDateTime publishedAt;
    
    private AuthorDto author;
    private CategoryDto category;
    private List<TagDto> tags;
}
