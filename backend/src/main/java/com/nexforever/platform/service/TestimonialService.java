package com.nexforever.platform.service;

import com.nexforever.platform.dto.TestimonialDto;
import com.nexforever.platform.entity.Testimonial;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.TestimonialRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestimonialService {

    private final TestimonialRepository repository;

    public TestimonialService(TestimonialRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> listPublicTestimonials() {
        return repository.findAllByApprovedTrueAndPublishedTrueOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> listAdminTestimonials() {
        return repository.findAllByOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TestimonialDto createTestimonial(TestimonialDto.SaveRequest request) {
        Testimonial t = new Testimonial();
        copy(t, request);
        return toDto(repository.save(t));
    }

    @Transactional
    public TestimonialDto updateTestimonial(Long id, TestimonialDto.SaveRequest request) {
        Testimonial t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));
        copy(t, request);
        return toDto(repository.save(t));
    }

    @Transactional
    public void deleteTestimonial(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void copy(Testimonial t, TestimonialDto.SaveRequest request) {
        t.setAuthorName(request.authorName().trim());
        t.setAuthorRole(request.authorRole() != null ? request.authorRole().trim() : null);
        t.setCompanyOrChannel(request.companyOrChannel() != null ? request.companyOrChannel().trim() : null);
        t.setQuote(request.quote().trim());
        t.setCategory(request.category() != null ? request.category().trim() : null);
        t.setApproved(request.approved());
        t.setPublished(request.published());
        t.setDisplayOrder(request.displayOrder());
    }

    private TestimonialDto toDto(Testimonial t) {
        return new TestimonialDto(
                t.getId(),
                t.getAuthorName(),
                t.getAuthorRole(),
                t.getCompanyOrChannel(),
                t.getQuote(),
                t.getCategory(),
                t.isApproved(),
                t.isPublished(),
                t.getDisplayOrder(),
                t.getUpdatedAt()
        );
    }
}

