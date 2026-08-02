package com.tigo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClapResponse {
    private UUID postId;
    private Integer totalClapCount;
    private Integer userClapCount;
}
