package com.nexforever.platform.repository;

import com.nexforever.platform.entity.MediaAsset;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findAllByOrderByCreatedAtDesc();
    Optional<MediaAsset> findByStorageKey(String storageKey);
}

