package com.nexforever.platform.dto;

import com.nexforever.platform.entity.MediaType;
import com.nexforever.platform.entity.ProjectStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public record ProjectDto(
        Long id,
        String slug,
        String title,
        String category,
        String clientName,
        String shortDescription,
        String overview,
        String challenges,
        String solutions,
        List<String> results,
        List<String> technologies,
        String coverImage,
        List<String> images,
        List<MediaItemDto> media,
        String liveUrl,
        String sourceUrl,
        ProjectStatus status,
        boolean featured,
        int displayOrder,
        Instant publishedAt,
        Instant updatedAt
) {
    public record MediaItemDto(
            Long id,
            MediaType mediaType,
            String url,
            String storageKey,
            String altText,
            String caption,
            int displayOrder
    ) {}

    public record MediaInput(
            @NotNull(message = "Media type is required.")
            MediaType mediaType,

            @NotBlank(message = "Media URL is required.")
            @Size(max = 500)
            String url,

            @Size(max = 255)
            String storageKey,

            @Size(max = 255)
            String altText,

            @Size(max = 300)
            String caption,

            @Min(0)
            int displayOrder
    ) {}

    public record SaveRequest(
            @Size(max = 180)
            String slug,

            @NotBlank(message = "Project title is required.")
            @Size(max = 200)
            String title,

            @NotBlank(message = "Project category is required.")
            @Size(max = 80)
            String category,

            @Size(max = 160)
            String clientName,

            @NotBlank(message = "Short description is required.")
            @Size(max = 400)
            String shortDescription,

            @Size(max = 5000)
            String overview,

            @Size(max = 5000)
            String challenges,

            @Size(max = 5000)
            String solutions,

            List<@NotBlank @Size(max = 300) String> results,

            List<@NotBlank @Size(max = 80) String> technologies,

            @Size(max = 500)
            String coverImage,

            @Size(max = 500)
            String liveUrl,

            @Size(max = 500)
            String sourceUrl,

            @NotNull(message = "Project status is required.")
            ProjectStatus status,

            boolean featured,

            @Min(0)
            int displayOrder,

            @Valid
            List<MediaInput> media
    ) {}

    public record StatusPatchRequest(
            @NotNull(message = "Project status is required.")
            ProjectStatus status
    ) {}
}

