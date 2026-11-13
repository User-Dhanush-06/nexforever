package com.nexforever.platform.controller;

import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.dto.ProjectDto;
import com.nexforever.platform.service.ProjectService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<ProjectDto>> listProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        return ApiResponse.ok(projectService.listPublicProjects(category, search));
    }

    @GetMapping("/{idOrSlug}")
    public ApiResponse<ProjectDto> getProject(@PathVariable String idOrSlug) {
        return ApiResponse.ok(projectService.getPublicProject(idOrSlug));
    }
}

