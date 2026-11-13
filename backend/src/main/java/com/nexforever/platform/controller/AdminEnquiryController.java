package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.EnquiryDto;
import com.nexforever.platform.entity.EnquiryStatus;
import com.nexforever.platform.service.EnquiryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/enquiries")
public class AdminEnquiryController {

    private final EnquiryService enquiryService;

    public AdminEnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    public ApiResponse<List<EnquiryDto>> listEnquiries(@RequestParam(required = false) EnquiryStatus status) {
        return ApiResponse.ok(enquiryService.listAdminEnquiries(status));
    }

    @GetMapping("/{id}")
    public ApiResponse<EnquiryDto> getEnquiry(@PathVariable Long id) {
        return ApiResponse.ok(enquiryService.getAdminEnquiry(id));
    }

    @PatchMapping("/{id}")
    public ApiResponse<EnquiryDto> updateEnquiry(
            @PathVariable Long id,
            @Valid @RequestBody EnquiryDto.UpdateRequest request
    ) {
        return ApiResponse.ok("Enquiry updated successfully.", enquiryService.updateAdminEnquiry(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteEnquiry(@PathVariable Long id) {
        enquiryService.deleteAdminEnquiry(id);
        return ApiResponse.ok("Enquiry deleted cleanly.", null);
    }
}

