package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.MediaAssetDto;
import com.nexforever.platform.security.AdminUserPrincipal;
import com.nexforever.platform.service.MediaStorageService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/media")
public class AdminMediaController {

    private final MediaStorageService mediaStorageService;

    public AdminMediaController(MediaStorageService mediaStorageService) {
        this.mediaStorageService = mediaStorageService;
    }

    @GetMapping
    public ApiResponse<List<MediaAssetDto>> listMedia() {
        return ApiResponse.ok(mediaStorageService.listAdminMedia());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MediaAssetDto>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @AuthenticationPrincipal AdminUserPrincipal principal
    ) {
        Long adminId = principal != null ? principal.getAdmin().getId() : null;
        MediaAssetDto saved = mediaStorageService.store(file, altText, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Media uploaded successfully.", saved));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMedia(@PathVariable Long id) {
        mediaStorageService.delete(id);
        return ApiResponse.ok("Media asset deleted cleanly.", null);
    }
}

