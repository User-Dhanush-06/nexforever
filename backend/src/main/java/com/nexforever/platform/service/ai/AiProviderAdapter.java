package com.nexforever.platform.service.ai;

import java.util.Optional;

public interface AiProviderAdapter {

    String getProviderName();

    boolean isAvailable();

    Optional<String> generateReply(String userMessage, String studioContext);
}

