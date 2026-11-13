package com.nexforever.platform.service.ai;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Default offline-safe implementation of AiProviderAdapter.
 * Accurately communicates that no external AI provider key is configured,
 * directing conversations to deterministic studio knowledge.
 */
@Component
public class NoneAiProviderAdapter implements AiProviderAdapter {

    @Override
    public String getProviderName() {
        return "none";
    }

    @Override
    public boolean isAvailable() {
        return false;
    }

    @Override
    public Optional<String> generateReply(String userMessage, String studioContext) {
        return Optional.empty();
    }
}

