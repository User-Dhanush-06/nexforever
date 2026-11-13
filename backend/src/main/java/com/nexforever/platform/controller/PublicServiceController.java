package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.ServiceDto;
import com.nexforever.platform.service.StudioServiceService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class PublicServiceController {

    private final StudioServiceService service;

    public PublicServiceController(StudioServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<ServiceDto>> listServices() {
        return ApiResponse.ok(service.listPublicServices());
    }
}

