package com.nexforever.platform.repository;

import com.nexforever.platform.entity.SiteSetting;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, Long> {
    Optional<SiteSetting> findBySettingKey(String settingKey);
    List<SiteSetting> findAllByOrderBySettingKeyAsc();
}

