package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.ServiceDto;
import com.nexforever.platform.service.StudioServiceService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/services")
public class AdminServiceController {

    private final StudioServiceService service;

    public AdminServiceController(StudioServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<ServiceDto>> listServices() {
        return ApiResponse.ok(service.listAdminServices());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceDto>> createService(@Valid @RequestBody ServiceDto.SaveRequest request) {
        ServiceDto created = service.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Service created successfully.", created));
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceDto> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceDto.SaveRequest request
    ) {
        return ApiResponse.ok("Service updated successfully.", service.updateService(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteService(@PathVariable Long id) {
        service.deleteService(id);
        return ApiResponse.ok("Service deleted cleanly.", null);
    }
}

