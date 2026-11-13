package com.nexforever.platform.dto;

import com.nexforever.platform.entity.EnquiryStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record EnquiryDto(
        Long id,
        String referenceCode,
        String name,
        String email,
        String audienceProfile,
        String packageName,
        String serviceInterest,
        String budgetScope,
        String planningPreference,
        String message,
        EnquiryStatus status,
        String internalNotes,
        Instant createdAt,
        Instant updatedAt
) {
    public record CreateRequest(
            @NotBlank(message = "Please enter your name.")
            @Size(min = 2, max = 150, message = "Name must be between 2 and 150 characters.")
            String name,

            @NotBlank(message = "Please enter your email address.")
            @Email(message = "Please enter a valid email address.")
            @Size(max = 190)
            String email,

            @NotBlank(message = "Audience profile is required.")
            @Size(max = 100)
            String audienceProfile,

            @NotBlank(message = "Package framework selection is required.")
            @Size(max = 100)
            String packageName,

            @Size(max = 180)
            String serviceInterest,

            @Size(max = 120)
            String budgetScope,

            @Size(max = 120)
            String planningPreference,

            @NotBlank(message = "Please describe your project or idea.")
            @Size(min = 10, max = 4000, message = "Project description must be between 10 and 4000 characters.")
            String message,

            // Honeypot anti-spam trap (legitimate users leave this empty)
            @Size(max = 120)
            String website
    ) {}

    public record CreatedResponse(
            Long id,
            String referenceCode,
            EnquiryStatus status,
            Instant createdAt
    ) {}

    public record UpdateRequest(
            @NotNull(message = "Status is required.")
            EnquiryStatus status,

            @Size(max = 4000)
            String internalNotes
    ) {}
}

