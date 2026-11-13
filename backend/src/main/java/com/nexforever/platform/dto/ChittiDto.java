package com.nexforever.platform.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public final class ChittiDto {

    private ChittiDto() {}

    public record ChatRequest(
            @Size(max = 500, message = "Question must be 500 characters or fewer.")
            String message,

            @Size(max = 60)
            String questionId,

            @Size(max = 60)
            String activeSection
    ) {}

    public record ActionLink(
            String label,
            String target
    ) {}

    public record SuggestionItem(
            String id,
            String question
    ) {}

    public record ChatResponse(
            String reply,
            ActionLink action,
            String matchedTopic,
            String mode,
            boolean aiConfigured,
            String providerName,
            List<SuggestionItem> suggestions
    ) {}
}

