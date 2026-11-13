package com.nexforever.platform.service;

import com.nexforever.platform.config.AppProperties;
import com.nexforever.platform.dto.MediaAssetDto;
import com.nexforever.platform.entity.MediaAsset;
import com.nexforever.platform.exception.BadRequestException;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.MediaAssetRepository;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MediaStorageService {

    private static final Logger log = LoggerFactory.getLogger(MediaStorageService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String HEX = "0123456789abcdef";

    private static final Map<String, String> ALLOWED_MIME_TYPES = Map.of(
            "image/png", ".png",
            "image/jpeg", ".jpg",
            "image/webp", ".webp",
            "image/svg+xml", ".svg",
            "image/gif", ".gif",
            "video/mp4", ".mp4",
            "video/webm", ".webm"
    );

    private final MediaAssetRepository repository;
    private final AppProperties appProperties;
    private Path rootStorageLocation;

    public MediaStorageService(MediaAssetRepository repository, AppProperties appProperties) {
        this.repository = repository;
        this.appProperties = appProperties;
    }

    @PostConstruct
    public void init() {
        String configured = appProperties.getMedia().getUploadDir();
        Path cwd = Paths.get("").toAbsolutePath().normalize();
        boolean insideBackendDir = cwd.getFileName() != null
                && "backend".equalsIgnoreCase(cwd.getFileName().toString());

        if (configured == null || configured.isBlank()) {
            this.rootStorageLocation = insideBackendDir
                    ? cwd.resolve("uploads").normalize()
                    : cwd.resolve("backend").resolve("uploads").normalize();
        } else {
            String clean = configured.trim().replace('\\', '/');
            if (insideBackendDir && (clean.equals("./backend/uploads") || clean.equals("backend/uploads"))) {
                this.rootStorageLocation = cwd.resolve("uploads").normalize();
            } else {
                this.rootStorageLocation = Paths.get(configured.trim()).toAbsolutePath().normalize();
            }
        }
        try {
            Files.createDirectories(this.rootStorageLocation);
            log.info("Initialized local media upload directory: {}", this.rootStorageLocation);
        } catch (IOException ex) {
            log.error("Could not create local upload directory at {}", this.rootStorageLocation, ex);
        }
    }

    @Transactional
    public MediaAssetDto store(MultipartFile file, String altText, Long adminId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }

        String rawContentType = file.getContentType();
        String contentType = rawContentType != null ? rawContentType.trim().toLowerCase(Locale.ROOT) : "";
        if (!ALLOWED_MIME_TYPES.containsKey(contentType)) {
            throw new BadRequestException("Unsupported media type: " + contentType + ". Allowed: PNG, JPG, WEBP, SVG, GIF, MP4, WEBM.");
        }

        String extension = ALLOWED_MIME_TYPES.get(contentType);
        String storageKey = generateStorageKey() + extension;
        Path destination = this.rootStorageLocation.resolve(storageKey).normalize();

        if (!destination.startsWith(this.rootStorageLocation)) {
            throw new BadRequestException("Invalid file destination path.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            log.error("Failed to store uploaded file {}", file.getOriginalFilename(), ex);
            throw new BadRequestException("Could not store file on server.");
        }

        String publicUrl = "/api/media/files/" + storageKey;
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : ("media" + extension);

        MediaAsset asset = new MediaAsset();
        asset.setStorageKey(storageKey);
        asset.setOriginalFilename(originalFilename);
        asset.setContentType(contentType);
        asset.setFileSize(file.getSize());
        asset.setPublicUrl(publicUrl);
        asset.setAltText(altText != null ? altText.trim() : null);
        asset.setUploadedByAdminId(adminId);

        MediaAsset saved = repository.save(asset);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MediaAssetDto> listAdminMedia() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Resource loadAsResource(String storageKey) {
        if (storageKey == null || storageKey.contains("..") || storageKey.contains("/") || storageKey.contains("\\")) {
            throw new ResourceNotFoundException("Invalid media key.");
        }
        try {
            Path file = this.rootStorageLocation.resolve(storageKey).normalize();
            if (!file.startsWith(this.rootStorageLocation) || !Files.exists(file) || !Files.isReadable(file)) {
                throw new ResourceNotFoundException("Media file not found: " + storageKey);
            }
            return new UrlResource(file.toUri());
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Media file not accessible: " + storageKey);
        }
    }

    @Transactional(readOnly = true)
    public String getContentType(String storageKey) {
        return repository.findByStorageKey(storageKey)
                .map(MediaAsset::getContentType)
                .orElse("application/octet-stream");
    }

    @Transactional
    public void delete(Long id) {
        MediaAsset asset = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found with id: " + id));

        try {
            Path file = this.rootStorageLocation.resolve(asset.getStorageKey()).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            log.warn("Could not delete physical media file: {}", asset.getStorageKey(), ex);
        }

        repository.delete(asset);
    }

    private MediaAssetDto toDto(MediaAsset a) {
        return new MediaAssetDto(
                a.getId(),
                a.getStorageKey(),
                a.getOriginalFilename(),
                a.getContentType(),
                a.getFileSize(),
                a.getPublicUrl(),
                a.getAltText(),
                a.getCreatedAt()
        );
    }

    private String generateStorageKey() {
        StringBuilder sb = new StringBuilder(24);
        for (int i = 0; i < 24; i++) {
            sb.append(HEX.charAt(RANDOM.nextInt(HEX.length())));
        }
        return sb.toString();
    }
}

