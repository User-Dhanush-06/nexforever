package com.nexforever.platform.dto;

import java.time.Instant;

public record MediaAssetDto(
        Long id,
        String storageKey,
        String originalFilename,
        String contentType,
        long fileSize,
        String publicUrl,
        String altText,
        Instant createdAt
) {}

