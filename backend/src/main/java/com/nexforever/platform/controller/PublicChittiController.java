package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.ChittiDto;
import com.nexforever.platform.service.ChittiChatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chitti")
public class PublicChittiController {

    private final ChittiChatService chatService;

    public PublicChittiController(ChittiChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ApiResponse<ChittiDto.ChatResponse> chat(@Valid @RequestBody ChittiDto.ChatRequest request) {
        return ApiResponse.ok(chatService.chat(request));
    }
}

