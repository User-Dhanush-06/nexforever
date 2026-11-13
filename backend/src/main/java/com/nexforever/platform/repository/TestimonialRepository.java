package com.nexforever.platform.repository;

import com.nexforever.platform.entity.Testimonial;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findAllByApprovedTrueAndPublishedTrueOrderByDisplayOrderAscIdAsc();
    List<Testimonial> findAllByOrderByDisplayOrderAscIdAsc();
    long countByApprovedTrueAndPublishedTrue();
}

