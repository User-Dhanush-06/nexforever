package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.SettingsDto;
import com.nexforever.platform.service.SettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class PublicSettingsController {

    private final SettingsService settingsService;

    public PublicSettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ApiResponse<SettingsDto.PublicSettingsResponse> getPublicSettings() {
        return ApiResponse.ok(settingsService.getPublicSettings());
    }
}

