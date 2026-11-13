package com.nexforever.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record TestimonialDto(
        Long id,
        String authorName,
        String authorRole,
        String companyOrChannel,
        String quote,
        String category,
        boolean approved,
        boolean published,
        int displayOrder,
        Instant updatedAt
) {
    public record SaveRequest(
            @NotBlank(message = "Author name is required.")
            @Size(max = 150)
            String authorName,

            @Size(max = 180)
            String authorRole,

            @Size(max = 180)
            String companyOrChannel,

            @NotBlank(message = "Quote is required.")
            @Size(min = 10, max = 2000)
            String quote,

            @Size(max = 80)
            String category,

            boolean approved,
            boolean published,

            @Min(0)
            int displayOrder
    ) {}
}

