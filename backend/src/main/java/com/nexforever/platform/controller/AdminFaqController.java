package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.FaqDto;
import com.nexforever.platform.service.FaqService;
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
@RequestMapping("/api/admin/faqs")
public class AdminFaqController {

    private final FaqService service;

    public AdminFaqController(FaqService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<FaqDto>> listFaqs() {
        return ApiResponse.ok(service.listAdminFaqs());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FaqDto>> createFaq(@Valid @RequestBody FaqDto.SaveRequest request) {
        FaqDto created = service.createFaq(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("FAQ created successfully.", created));
    }

    @PutMapping("/{id}")
    public ApiResponse<FaqDto> updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody FaqDto.SaveRequest request
    ) {
        return ApiResponse.ok("FAQ updated successfully.", service.updateFaq(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFaq(@PathVariable Long id) {
        service.deleteFaq(id);
        return ApiResponse.ok("FAQ deleted cleanly.", null);
    }
}

