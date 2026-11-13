package com.nexforever.platform.dto;

import java.util.List;

public record AdminDashboardDto(
        long totalProjects,
        long publishedProjects,
        long draftProjects,
        long totalServices,
        long publishedServices,
        long totalEnquiries,
        long newEnquiries,
        long reviewingEnquiries,
        long contactedEnquiries,
        long archivedEnquiries,
        long totalTestimonials,
        long publishedTestimonials,
        long totalFaqs,
        long publishedFaqs,
        long totalMediaAssets,
        List<EnquiryDto> recentEnquiries
) {}

