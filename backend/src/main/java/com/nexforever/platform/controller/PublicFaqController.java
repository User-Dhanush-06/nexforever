package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.FaqDto;
import com.nexforever.platform.service.FaqService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/faqs")
public class PublicFaqController {

    private final FaqService faqService;

    public PublicFaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    @GetMapping
    public ApiResponse<List<FaqDto>> listFaqs() {
        return ApiResponse.ok(faqService.listPublicFaqs());
    }
}

