package com.nexforever.platform.service;

import com.nexforever.platform.dto.AdminDashboardDto;
import com.nexforever.platform.entity.EnquiryStatus;
import com.nexforever.platform.entity.ProjectStatus;
import com.nexforever.platform.repository.EnquiryRepository;
import com.nexforever.platform.repository.FaqRepository;
import com.nexforever.platform.repository.MediaAssetRepository;
import com.nexforever.platform.repository.ProjectRepository;
import com.nexforever.platform.repository.StudioServiceRepository;
import com.nexforever.platform.repository.TestimonialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

    private final ProjectRepository projectRepository;
    private final StudioServiceRepository serviceRepository;
    private final EnquiryRepository enquiryRepository;
    private final TestimonialRepository testimonialRepository;
    private final FaqRepository faqRepository;
    private final MediaAssetRepository mediaAssetRepository;
    private final EnquiryService enquiryService;

    public AdminDashboardService(
            ProjectRepository projectRepository,
            StudioServiceRepository serviceRepository,
            EnquiryRepository enquiryRepository,
            TestimonialRepository testimonialRepository,
            FaqRepository faqRepository,
            MediaAssetRepository mediaAssetRepository,
            EnquiryService enquiryService
    ) {
        this.projectRepository = projectRepository;
        this.serviceRepository = serviceRepository;
        this.enquiryRepository = enquiryRepository;
        this.testimonialRepository = testimonialRepository;
        this.faqRepository = faqRepository;
        this.mediaAssetRepository = mediaAssetRepository;
        this.enquiryService = enquiryService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        long totalProjects = projectRepository.count();
        long publishedProjects = projectRepository.countByStatus(ProjectStatus.PUBLISHED);
        long draftProjects = projectRepository.countByStatus(ProjectStatus.DRAFT);

        long totalServices = serviceRepository.count();
        long publishedServices = serviceRepository.countByPublishedTrue();

        long totalEnquiries = enquiryRepository.count();
        long newEnquiries = enquiryRepository.countByStatus(EnquiryStatus.NEW);
        long reviewingEnquiries = enquiryRepository.countByStatus(EnquiryStatus.REVIEWING);
        long contactedEnquiries = enquiryRepository.countByStatus(EnquiryStatus.CONTACTED);
        long archivedEnquiries = enquiryRepository.countByStatus(EnquiryStatus.ARCHIVED);

        long totalTestimonials = testimonialRepository.count();
        long publishedTestimonials = testimonialRepository.countByApprovedTrueAndPublishedTrue();

        long totalFaqs = faqRepository.count();
        long publishedFaqs = faqRepository.countByPublishedTrue();

        long totalMediaAssets = mediaAssetRepository.count();

        var recent = enquiryRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(enquiryService::toDto)
                .toList();

        return new AdminDashboardDto(
                totalProjects,
                publishedProjects,
                draftProjects,
                totalServices,
                publishedServices,
                totalEnquiries,
                newEnquiries,
                reviewingEnquiries,
                contactedEnquiries,
                archivedEnquiries,
                totalTestimonials,
                publishedTestimonials,
                totalFaqs,
                publishedFaqs,
                totalMediaAssets,
                recent
        );
    }
}

