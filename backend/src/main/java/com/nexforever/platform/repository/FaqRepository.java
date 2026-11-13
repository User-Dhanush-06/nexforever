package com.nexforever.platform.repository;

import com.nexforever.platform.entity.Faq;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findAllByPublishedTrueOrderByDisplayOrderAscIdAsc();
    List<Faq> findAllByOrderByDisplayOrderAscIdAsc();
    long countByPublishedTrue();
}

