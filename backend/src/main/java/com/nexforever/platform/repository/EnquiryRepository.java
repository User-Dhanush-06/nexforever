package com.nexforever.platform.repository;

import com.nexforever.platform.entity.Enquiry;
import com.nexforever.platform.entity.EnquiryStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findAllByOrderByCreatedAtDesc();
    List<Enquiry> findAllByStatusOrderByCreatedAtDesc(EnquiryStatus status);
    List<Enquiry> findTop5ByOrderByCreatedAtDesc();
    long countByStatus(EnquiryStatus status);
}

