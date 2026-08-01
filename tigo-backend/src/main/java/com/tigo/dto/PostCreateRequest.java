package com.tigo.dto;

import com.tigo.entity.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String excerpt;
    private String coverImageUrl;
    private Integer categoryId;
    private List<String> tagNames;

    @NotNull(message = "Status is required (DRAFT or PUBLISHED)")
    private PostStatus status;
}
