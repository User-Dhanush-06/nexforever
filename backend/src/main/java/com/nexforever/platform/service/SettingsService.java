package com.nexforever.platform.service;

import com.nexforever.platform.dto.SettingsDto;
import com.nexforever.platform.entity.SiteSetting;
import com.nexforever.platform.exception.BadRequestException;
import com.nexforever.platform.repository.SiteSettingRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private static final Set<String> ALLOWED_KEYS = Set.of(
            "brand.name",
            "brand.tagline",
            "brand.availability",
            "contact.email",
            "contact.whatsapp",
            "contact.instagram",
            "contact.location",
            "contact.location_map_url",
            "social.instagram",
            "social.linkedin",
            "social.twitter",
            "social.youtube",
            "social.behance"
    );

    private static final java.util.regex.Pattern EMAIL_PATTERN =
            java.util.regex.Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final SiteSettingRepository repository;

    public SettingsService(SiteSettingRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public SettingsDto.PublicSettingsResponse getPublicSettings() {
        Map<String, String> values = loadMap();

        SettingsDto.BrandSettings brand = new SettingsDto.BrandSettings(
                values.getOrDefault("brand.name", "NexForever"),
                values.getOrDefault("brand.tagline", "Built for What's Next. Made to Last."),
                values.getOrDefault("brand.availability", "Available for New Projects")
        );

        SettingsDto.ContactSettings contact = new SettingsDto.ContactSettings(
                values.getOrDefault("contact.email", ""),
                values.getOrDefault("contact.whatsapp", ""),
                values.getOrDefault("contact.instagram", ""),
                values.getOrDefault("contact.location", "India / Remote Worldwide"),
                values.getOrDefault("contact.location_map_url", "")
        );

        Map<String, String> social = new LinkedHashMap<>();
        social.put("instagram", values.getOrDefault("social.instagram", ""));
        social.put("linkedin", values.getOrDefault("social.linkedin", ""));
        social.put("twitter", values.getOrDefault("social.twitter", ""));
        social.put("youtube", values.getOrDefault("social.youtube", ""));
        social.put("behance", values.getOrDefault("social.behance", ""));

        return new SettingsDto.PublicSettingsResponse(brand, contact, social);
    }

    @Transactional(readOnly = true)
    public List<SettingsDto.SettingItem> getAllSettings() {
        return repository.findAllByOrderBySettingKeyAsc().stream()
                .map(s -> new SettingsDto.SettingItem(s.getSettingKey(), s.getSettingValue(), s.getUpdatedAt()))
                .toList();
    }

    @Transactional
    public List<SettingsDto.SettingItem> updateSettings(SettingsDto.UpdateRequest request) {
        if (request.settings() == null || request.settings().isEmpty()) {
            throw new BadRequestException("At least one setting entry must be provided.");
        }

        for (Map.Entry<String, String> entry : request.settings().entrySet()) {
            String key = entry.getKey() != null ? entry.getKey().trim() : "";
            if (!ALLOWED_KEYS.contains(key)) {
                throw new BadRequestException("Unsupported setting key: " + key);
            }
            String value = entry.getValue() != null ? entry.getValue().trim() : "";

            validateSettingValue(key, value);

            SiteSetting setting = repository.findBySettingKey(key).orElseGet(() -> {
                SiteSetting s = new SiteSetting();
                s.setSettingKey(key);
                return s;
            });
            setting.setSettingValue(value);
            repository.save(setting);
        }

        return getAllSettings();
    }

    private void validateSettingValue(String key, String value) {
        if (value.isEmpty()) {
            return;
        }

        if ("brand.name".equals(key) && value.isBlank()) {
            throw new BadRequestException("Brand name cannot be blank.");
        }

        if ("contact.email".equals(key)) {
            if (!EMAIL_PATTERN.matcher(value).matches()) {
                throw new BadRequestException("Invalid contact email format: " + value);
            }
        }

        if (key.startsWith("social.") || "contact.location_map_url".equals(key)) {
            if (!value.startsWith("http://") && !value.startsWith("https://")) {
                throw new BadRequestException("URL setting for " + key + " must begin with http:// or https://");
            }
        }

        if ("contact.instagram".equals(key)) {
            if (!value.startsWith("http://") && !value.startsWith("https://") && !value.startsWith("@")) {
                throw new BadRequestException("Instagram setting must be a valid handle starting with @ or a full https:// profile URL.");
            }
        }
    }

    private Map<String, String> loadMap() {
        Map<String, String> map = new LinkedHashMap<>();
        for (SiteSetting s : repository.findAllByOrderBySettingKeyAsc()) {
            map.put(s.getSettingKey(), s.getSettingValue() != null ? s.getSettingValue() : "");
        }
        return map;
    }
}

