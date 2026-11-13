package com.nexforever.platform.service;

import com.nexforever.platform.config.JsonCodec;
import com.nexforever.platform.dto.ServiceDto;
import com.nexforever.platform.entity.StudioService;
import com.nexforever.platform.exception.ConflictException;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.StudioServiceRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudioServiceService {

    private final StudioServiceRepository repository;
    private final JsonCodec jsonCodec;

    public StudioServiceService(StudioServiceRepository repository, JsonCodec jsonCodec) {
        this.repository = repository;
        this.jsonCodec = jsonCodec;
    }

    @Transactional(readOnly = true)
    public List<ServiceDto> listPublicServices() {
        return repository.findAllByPublishedTrueOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceDto> listAdminServices() {
        return repository.findAllByOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ServiceDto createService(ServiceDto.SaveRequest request) {
        String slug = generateSlug(request.slug(), request.title());
        if (repository.existsBySlugIgnoreCase(slug)) {
            throw new ConflictException("A service with slug '" + slug + "' already exists.");
        }

        StudioService svc = new StudioService();
        copyProperties(svc, request, slug);
        StudioService saved = repository.save(svc);
        return toDto(saved);
    }

    @Transactional
    public ServiceDto updateService(Long id, ServiceDto.SaveRequest request) {
        StudioService svc = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        String slug = generateSlug(request.slug(), request.title());
        if (repository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new ConflictException("A service with slug '" + slug + "' already exists.");
        }

        copyProperties(svc, request, slug);
        StudioService saved = repository.save(svc);
        return toDto(saved);
    }

    @Transactional
    public void deleteService(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void copyProperties(StudioService svc, ServiceDto.SaveRequest request, String slug) {
        svc.setServiceNumber(request.serviceNumber().trim());
        svc.setSlug(slug);
        svc.setTitle(request.title().trim());
        svc.setTag(request.tag() != null ? request.tag().trim() : null);
        svc.setDescription(request.description().trim());
        svc.setDetails(request.details() != null ? request.details().trim() : null);
        svc.setItemsJson(jsonCodec.toJson(request.items()));
        svc.setIconKey(request.icon() != null && !request.icon().isBlank() ? request.icon().trim() : "Code2");
        svc.setPublished(request.published());
        svc.setDisplayOrder(request.displayOrder());
    }

    private ServiceDto toDto(StudioService svc) {
        return new ServiceDto(
                svc.getId(),
                svc.getServiceNumber(),
                svc.getSlug(),
                svc.getTitle(),
                svc.getTag(),
                svc.getDescription(),
                svc.getDetails(),
                jsonCodec.readStringList(svc.getItemsJson()),
                svc.getIconKey(),
                svc.isPublished(),
                svc.getDisplayOrder(),
                svc.getUpdatedAt()
        );
    }

    private String generateSlug(String customSlug, String title) {
        String base = (customSlug != null && !customSlug.isBlank()) ? customSlug : title;
        String slug = base.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
        if (slug.startsWith("-")) slug = slug.substring(1);
        if (slug.endsWith("-")) slug = slug.substring(0, slug.length() - 1);
        return slug.isBlank() ? "service" : slug;
    }
}

