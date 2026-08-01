package com.tigo.dto;

import com.tigo.entity.PostStatus;
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
public class PostResponse {
    private UUID id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String coverImageUrl;
    private Integer readTimeMin;
    private PostStatus status;
    private Integer clapCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    private AuthorDto author;
    private CategoryDto category;
    private List<TagDto> tags;
}
