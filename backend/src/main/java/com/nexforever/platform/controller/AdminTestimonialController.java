package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.TestimonialDto;
import com.nexforever.platform.service.TestimonialService;
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
@RequestMapping("/api/admin/testimonials")
public class AdminTestimonialController {

    private final TestimonialService service;

    public AdminTestimonialController(TestimonialService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<TestimonialDto>> listTestimonials() {
        return ApiResponse.ok(service.listAdminTestimonials());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestimonialDto>> createTestimonial(
            @Valid @RequestBody TestimonialDto.SaveRequest request
    ) {
        TestimonialDto created = service.createTestimonial(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Testimonial saved.", created));
    }

    @PutMapping("/{id}")
    public ApiResponse<TestimonialDto> updateTestimonial(
            @PathVariable Long id,
            @Valid @RequestBody TestimonialDto.SaveRequest request
    ) {
        return ApiResponse.ok("Testimonial updated.", service.updateTestimonial(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTestimonial(@PathVariable Long id) {
        service.deleteTestimonial(id);
        return ApiResponse.ok("Testimonial deleted cleanly.", null);
    }
}

