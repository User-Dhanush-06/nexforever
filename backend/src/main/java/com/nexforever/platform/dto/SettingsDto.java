package com.nexforever.platform.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Map;

public final class SettingsDto {

    private SettingsDto() {}

    public record PublicSettingsResponse(
            BrandSettings brand,
            ContactSettings contact,
            Map<String, String> social
    ) {}

    public record BrandSettings(
            String name,
            String tagline,
            String availability
    ) {}

    public record ContactSettings(
            String email,
            String whatsapp,
            String instagram,
            String location,
            String locationMapUrl
    ) {}

    public record SettingItem(
            String key,
            String value,
            Instant updatedAt
    ) {}

    public record UpdateRequest(
            @NotNull(message = "Settings map is required.")
            Map<@Size(max = 120) String, @Size(max = 1000) String> settings
    ) {}
}

