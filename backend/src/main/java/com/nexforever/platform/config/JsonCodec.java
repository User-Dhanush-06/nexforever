package com.nexforever.platform.config;

import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Component
public class JsonCodec {

    private static final TypeReference<List<String>> STRING_LIST_TYPE = new TypeReference<>() {};
    private final ObjectMapper objectMapper;

    public JsonCodec(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String toJson(List<String> values) {
        if (values == null || values.isEmpty()) {
            return "[]";
        }
        return objectMapper.writeValueAsString(values);
    }

    public List<String> readStringList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            List<String> parsed = objectMapper.readValue(json, STRING_LIST_TYPE);
            return parsed != null ? parsed : Collections.emptyList();
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }
}

