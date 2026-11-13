package com.nexforever.platform.service;

import com.nexforever.platform.config.AppProperties;
import com.nexforever.platform.dto.EnquiryDto;
import com.nexforever.platform.entity.Enquiry;
import com.nexforever.platform.entity.EnquiryStatus;
import com.nexforever.platform.exception.BadRequestException;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.EnquiryRepository;
import com.nexforever.platform.security.RateLimiterService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnquiryService {

    private static final Logger log = LoggerFactory.getLogger(EnquiryService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final EnquiryRepository repository;
    private final RateLimiterService rateLimiterService;
    private final AppProperties appProperties;

    public EnquiryService(
            EnquiryRepository repository,
            RateLimiterService rateLimiterService,
            AppProperties appProperties
    ) {
        this.repository = repository;
        this.rateLimiterService = rateLimiterService;
        this.appProperties = appProperties;
    }

    @Transactional
    public EnquiryDto.CreatedResponse createEnquiry(EnquiryDto.CreateRequest request, String clientIp) {
        // Honeypot check: bots often auto-fill hidden "website" field
        if (request.website() != null && !request.website().isBlank()) {
            log.warn("Rejected enquiry submission due to triggered honeypot field.");
            throw new BadRequestException("Submission could not be processed.");
        }

        String ipHash = hashIp(clientIp);
        rateLimiterService.checkLimit(
                "enquiry",
                ipHash,
                6,
                Duration.ofMinutes(10),
                "Too many enquiry submissions. Please wait a few minutes before submitting again."
        );

        Enquiry enquiry = new Enquiry();
        enquiry.setReferenceCode(generateReferenceCode());
        enquiry.setName(request.name().trim());
        enquiry.setEmail(request.email().trim().toLowerCase());
        enquiry.setAudienceProfile(request.audienceProfile().trim());
        enquiry.setPackageName(request.packageName().trim());
        enquiry.setServiceInterest(request.serviceInterest() != null ? request.serviceInterest().trim() : null);
        enquiry.setBudgetScope(request.budgetScope() != null ? request.budgetScope().trim() : null);
        enquiry.setPlanningPreference(request.planningPreference() != null ? request.planningPreference().trim() : null);
        enquiry.setMessage(request.message().trim());
        enquiry.setStatus(EnquiryStatus.NEW);
        enquiry.setSourceIpHash(ipHash);

        Enquiry saved = repository.save(enquiry);
        log.info("Stored new project enquiry id={} ref={}", saved.getId(), saved.getReferenceCode());

        return new EnquiryDto.CreatedResponse(
                saved.getId(),
                saved.getReferenceCode(),
                saved.getStatus(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<EnquiryDto> listAdminEnquiries(EnquiryStatus status) {
        List<Enquiry> list = (status != null)
                ? repository.findAllByStatusOrderByCreatedAtDesc(status)
                : repository.findAllByOrderByCreatedAtDesc();
        return list.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public EnquiryDto getAdminEnquiry(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
    }

    @Transactional
    public EnquiryDto updateAdminEnquiry(Long id, EnquiryDto.UpdateRequest request) {
        Enquiry enquiry = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        enquiry.setStatus(request.status());
        enquiry.setInternalNotes(request.internalNotes() != null ? request.internalNotes().trim() : null);
        Enquiry saved = repository.save(enquiry);
        return toDto(saved);
    }

    @Transactional
    public void deleteAdminEnquiry(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Enquiry not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public EnquiryDto toDto(Enquiry e) {
        return new EnquiryDto(
                e.getId(),
                e.getReferenceCode(),
                e.getName(),
                e.getEmail(),
                e.getAudienceProfile(),
                e.getPackageName(),
                e.getServiceInterest(),
                e.getBudgetScope(),
                e.getPlanningPreference(),
                e.getMessage(),
                e.getStatus(),
                e.getInternalNotes(),
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }

    private String generateReferenceCode() {
        String datePart = LocalDate.now(ZoneOffset.UTC).format(DateTimeFormatter.BASIC_ISO_DATE);
        StringBuilder suffix = new StringBuilder(5);
        for (int i = 0; i < 5; i++) {
            suffix.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return "NF-" + datePart + "-" + suffix;
    }

    private String hashIp(String ip) {
        String normalized = ip != null ? ip.trim() : "unknown";
        String salt = appProperties.getSecurity().getIpHashSalt();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest((salt + ":" + normalized).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException ex) {
            return "hash-unavailable";
        }
    }
}

