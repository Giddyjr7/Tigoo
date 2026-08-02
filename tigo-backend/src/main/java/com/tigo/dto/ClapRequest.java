package com.tigo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClapRequest {
    @NotNull(message = "Count is required")
    @Min(value = 1, message = "Clap count must be at least 1")
    @Max(value = 50, message = "Clap count cannot exceed 50")
    private Integer count;
}
