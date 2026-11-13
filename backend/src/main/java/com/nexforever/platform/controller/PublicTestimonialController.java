package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.TestimonialDto;
import com.nexforever.platform.service.TestimonialService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testimonials")
public class PublicTestimonialController {

    private final TestimonialService testimonialService;

    public PublicTestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public ApiResponse<List<TestimonialDto>> listTestimonials() {
        return ApiResponse.ok(testimonialService.listPublicTestimonials());
    }
}

