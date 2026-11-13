package com.nexforever.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class AdminAuthDto {

    private AdminAuthDto() {}

    public record LoginRequest(
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            String email,

            @NotBlank(message = "Password is required.")
            @Size(min = 6, max = 128)
            String password
    ) {}

    public record AdminProfileResponse(
            Long id,
            String email,
            String fullName,
            String role,
            Instant lastLoginAt
    ) {}

    public record CsrfTokenResponse(
            String token,
            String headerName,
            String parameterName
    ) {}
}

