package com.tigo.dto;

import com.tigo.entity.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {
    private String title;
    private String content;
    private String excerpt;
    private String coverImageUrl;
    private Integer categoryId;
    private List<String> tagNames;
    private PostStatus status;
    private Boolean featured;
}
