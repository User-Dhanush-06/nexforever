package com.nexforever.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public record ServiceDto(
        Long id,
        String serviceNumber,
        String slug,
        String title,
        String tag,
        String description,
        String details,
        List<String> items,
        String icon,
        boolean published,
        int displayOrder,
        Instant updatedAt
) {
    public record SaveRequest(
            @NotBlank(message = "Service number is required.")
            @Size(max = 10)
            String serviceNumber,

            @Size(max = 150)
            String slug,

            @NotBlank(message = "Service title is required.")
            @Size(max = 180)
            String title,

            @Size(max = 150)
            String tag,

            @NotBlank(message = "Service description is required.")
            @Size(max = 2000)
            String description,

            @Size(max = 3000)
            String details,

            @NotEmpty(message = "At least one deliverable item is required.")
            List<@NotBlank @Size(max = 150) String> items,

            @Size(max = 50)
            String icon,

            boolean published,

            @Min(0)
            int displayOrder
    ) {}
}

