package com.nexforever.platform.service;

import com.nexforever.platform.config.JsonCodec;
import com.nexforever.platform.dto.ProjectDto;
import com.nexforever.platform.entity.Project;
import com.nexforever.platform.entity.ProjectMedia;
import com.nexforever.platform.entity.ProjectStatus;
import com.nexforever.platform.exception.ConflictException;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.ProjectRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository repository;
    private final JsonCodec jsonCodec;

    public ProjectService(ProjectRepository repository, JsonCodec jsonCodec) {
        this.repository = repository;
        this.jsonCodec = jsonCodec;
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> listPublicProjects(String category, String search) {
        List<Project> projects;
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category.trim())) {
            projects = repository.findAllByStatusAndCategoryIgnoreCaseOrderByDisplayOrderAscIdAsc(
                    ProjectStatus.PUBLISHED, category.trim());
        } else {
            projects = repository.findAllByStatusOrderByDisplayOrderAscIdAsc(ProjectStatus.PUBLISHED);
        }

        if (search != null && !search.isBlank()) {
            String query = search.trim().toLowerCase(Locale.ROOT);
            projects = projects.stream()
                    .filter(p -> p.getTitle().toLowerCase(Locale.ROOT).contains(query)
                            || p.getShortDescription().toLowerCase(Locale.ROOT).contains(query)
                            || (p.getOverview() != null && p.getOverview().toLowerCase(Locale.ROOT).contains(query)))
                    .toList();
        }

        return projects.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto getPublicProject(String idOrSlug) {
        Optional<Project> opt;
        if (idOrSlug.matches("^\\d+$")) {
            opt = repository.findByIdAndStatus(Long.parseLong(idOrSlug), ProjectStatus.PUBLISHED);
        } else {
            opt = repository.findBySlugIgnoreCaseAndStatus(idOrSlug.trim(), ProjectStatus.PUBLISHED);
        }
        return opt.map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + idOrSlug));
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> listAdminProjects() {
        return repository.findAllByOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto getAdminProject(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Transactional
    public ProjectDto createProject(ProjectDto.SaveRequest request) {
        String slug = generateSlug(request.slug(), request.title());
        if (repository.existsBySlugIgnoreCase(slug)) {
            throw new ConflictException("A project with slug '" + slug + "' already exists.");
        }

        Project project = new Project();
        copyProperties(project, request, slug);
        Project saved = repository.save(project);
        return toDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto.SaveRequest request) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        String slug = generateSlug(request.slug(), request.title());
        if (repository.existsBySlugIgnoreCaseAndIdNot(slug, id)) {
            throw new ConflictException("A project with slug '" + slug + "' already exists.");
        }

        copyProperties(project, request, slug);
        Project saved = repository.save(project);
        return toDto(saved);
    }

    @Transactional
    public ProjectDto updateProjectStatus(Long id, ProjectStatus newStatus) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setStatus(newStatus);
        if (newStatus == ProjectStatus.PUBLISHED && project.getPublishedAt() == null) {
            project.setPublishedAt(Instant.now());
        }
        Project saved = repository.save(project);
        return toDto(saved);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void copyProperties(Project project, ProjectDto.SaveRequest request, String slug) {
        project.setSlug(slug);
        project.setTitle(request.title().trim());
        project.setCategory(request.category().trim());
        project.setClientName(request.clientName() != null ? request.clientName().trim() : null);
        project.setShortDescription(request.shortDescription().trim());
        project.setOverview(request.overview() != null ? request.overview().trim() : null);
        project.setChallenges(request.challenges() != null ? request.challenges().trim() : null);
        project.setSolutions(request.solutions() != null ? request.solutions().trim() : null);
        project.setResultsJson(jsonCodec.toJson(request.results()));
        project.setTechnologiesJson(jsonCodec.toJson(request.technologies()));
        project.setCoverImageUrl(request.coverImage() != null ? request.coverImage().trim() : null);
        project.setLiveUrl(request.liveUrl() != null ? request.liveUrl().trim() : null);
        project.setSourceUrl(request.sourceUrl() != null ? request.sourceUrl().trim() : null);

        ProjectStatus oldStatus = project.getStatus();
        project.setStatus(request.status());
        if (request.status() == ProjectStatus.PUBLISHED && (oldStatus != ProjectStatus.PUBLISHED || project.getPublishedAt() == null)) {
            project.setPublishedAt(Instant.now());
        }

        project.setFeatured(request.featured());
        project.setDisplayOrder(request.displayOrder());

        // Sync media items
        project.getMedia().clear();
        if (request.media() != null) {
            for (ProjectDto.MediaInput input : request.media()) {
                ProjectMedia pm = new ProjectMedia();
                pm.setProject(project);
                pm.setMediaType(input.mediaType());
                pm.setUrl(input.url().trim());
                pm.setStorageKey(input.storageKey() != null ? input.storageKey().trim() : null);
                pm.setAltText(input.altText() != null ? input.altText().trim() : null);
                pm.setCaption(input.caption() != null ? input.caption().trim() : null);
                pm.setDisplayOrder(input.displayOrder());
                project.getMedia().add(pm);
            }
        }
    }

    private ProjectDto toDto(Project p) {
        List<ProjectDto.MediaItemDto> mediaDtos = p.getMedia().stream()
                .map(m -> new ProjectDto.MediaItemDto(
                        m.getId(),
                        m.getMediaType(),
                        m.getUrl(),
                        m.getStorageKey(),
                        m.getAltText(),
                        m.getCaption(),
                        m.getDisplayOrder()
                ))
                .toList();

        List<String> images = new ArrayList<>();
        if (p.getCoverImageUrl() != null && !p.getCoverImageUrl().isBlank()) {
            images.add(p.getCoverImageUrl());
        }
        for (ProjectDto.MediaItemDto m : mediaDtos) {
            if (!images.contains(m.url())) {
                images.add(m.url());
            }
        }

        return new ProjectDto(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getCategory(),
                p.getClientName(),
                p.getShortDescription(),
                p.getOverview(),
                p.getChallenges(),
                p.getSolutions(),
                jsonCodec.readStringList(p.getResultsJson()),
                jsonCodec.readStringList(p.getTechnologiesJson()),
                p.getCoverImageUrl(),
                images,
                mediaDtos,
                p.getLiveUrl(),
                p.getSourceUrl(),
                p.getStatus(),
                p.isFeatured(),
                p.getDisplayOrder(),
                p.getPublishedAt(),
                p.getUpdatedAt()
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
        return slug.isBlank() ? "project" : slug;
    }
}

