package com.nexforever.platform.controller;

import com.nexforever.platform.service.MediaStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media/files")
public class MediaFileController {

    private final MediaStorageService mediaStorageService;

    public MediaFileController(MediaStorageService mediaStorageService) {
        this.mediaStorageService = mediaStorageService;
    }

    @GetMapping("/{storageKey}")
    public ResponseEntity<Resource> serveMediaFile(@PathVariable String storageKey) {
        Resource file = mediaStorageService.loadAsResource(storageKey);
        String contentType = mediaStorageService.getContentType(storageKey);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header("X-Content-Type-Options", "nosniff")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800, immutable")
                .body(file);
    }
}

