package com.nexforever.platform.repository;

import com.nexforever.platform.entity.StudioService;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioServiceRepository extends JpaRepository<StudioService, Long> {
    List<StudioService> findAllByPublishedTrueOrderByDisplayOrderAscIdAsc();
    List<StudioService> findAllByOrderByDisplayOrderAscIdAsc();
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
    long countByPublishedTrue();
}

