package com.nexforever.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record FaqDto(
        Long id,
        String question,
        String answer,
        String category,
        boolean published,
        int displayOrder,
        Instant updatedAt
) {
    public record SaveRequest(
            @NotBlank(message = "FAQ question is required.")
            @Size(max = 320)
            String question,

            @NotBlank(message = "FAQ answer is required.")
            @Size(max = 3000)
            String answer,

            @Size(max = 80)
            String category,

            boolean published,

            @Min(0)
            int displayOrder
    ) {}
}

