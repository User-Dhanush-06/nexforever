package com.nexforever.platform.repository;

import com.nexforever.platform.entity.Project;
import com.nexforever.platform.entity.ProjectStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = "media")
    List<Project> findAllByStatusOrderByDisplayOrderAscIdAsc(ProjectStatus status);

    @EntityGraph(attributePaths = "media")
    List<Project> findAllByStatusAndCategoryIgnoreCaseOrderByDisplayOrderAscIdAsc(
            ProjectStatus status, String category);

    @EntityGraph(attributePaths = "media")
    Optional<Project> findByIdAndStatus(Long id, ProjectStatus status);

    @EntityGraph(attributePaths = "media")
    Optional<Project> findBySlugIgnoreCaseAndStatus(String slug, ProjectStatus status);

    @EntityGraph(attributePaths = "media")
    List<Project> findAllByOrderByDisplayOrderAscIdAsc();

    @EntityGraph(attributePaths = "media")
    List<Project> findAllByStatusOrderByUpdatedAtDesc(ProjectStatus status);

    @Override
    @EntityGraph(attributePaths = "media")
    Optional<Project> findById(Long id);

    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
    long countByStatus(ProjectStatus status);
}

