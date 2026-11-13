package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.ProjectDto;
import com.nexforever.platform.service.ProjectService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<ProjectDto>> listProjects() {
        return ApiResponse.ok(projectService.listAdminProjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjectDto> getProject(@PathVariable Long id) {
        return ApiResponse.ok(projectService.getAdminProject(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectDto.SaveRequest request) {
        ProjectDto created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Project created successfully.", created));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProjectDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto.SaveRequest request
    ) {
        return ApiResponse.ok("Project updated successfully.", projectService.updateProject(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ProjectDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto.StatusPatchRequest request
    ) {
        return ApiResponse.ok("Project status updated.", projectService.updateProjectStatus(id, request.status()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ApiResponse.ok("Project deleted cleanly.", null);
    }
}

