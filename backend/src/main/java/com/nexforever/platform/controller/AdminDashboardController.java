package com.nexforever.platform.controller;

import com.nexforever.platform.dto.AdminDashboardDto;
import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    public AdminDashboardController(AdminDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ApiResponse<AdminDashboardDto> getDashboard() {
        return ApiResponse.ok(dashboardService.getDashboardStats());
    }
}

