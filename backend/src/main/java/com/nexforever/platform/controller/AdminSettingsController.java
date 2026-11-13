package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.SettingsDto;
import com.nexforever.platform.service.SettingsService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/settings")
public class AdminSettingsController {

    private final SettingsService settingsService;

    public AdminSettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ApiResponse<List<SettingsDto.SettingItem>> listSettings() {
        return ApiResponse.ok(settingsService.getAllSettings());
    }

    @PutMapping
    public ApiResponse<List<SettingsDto.SettingItem>> updateSettings(
            @Valid @RequestBody SettingsDto.UpdateRequest request
    ) {
        return ApiResponse.ok("Site settings updated.", settingsService.updateSettings(request));
    }
}

