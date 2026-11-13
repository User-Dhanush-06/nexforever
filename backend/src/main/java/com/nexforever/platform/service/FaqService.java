package com.nexforever.platform.service;

import com.nexforever.platform.dto.FaqDto;
import com.nexforever.platform.entity.Faq;
import com.nexforever.platform.exception.ResourceNotFoundException;
import com.nexforever.platform.repository.FaqRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FaqService {

    private final FaqRepository repository;

    public FaqService(FaqRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<FaqDto> listPublicFaqs() {
        return repository.findAllByPublishedTrueOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FaqDto> listAdminFaqs() {
        return repository.findAllByOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public FaqDto createFaq(FaqDto.SaveRequest request) {
        Faq faq = new Faq();
        copy(faq, request);
        return toDto(repository.save(faq));
    }

    @Transactional
    public FaqDto updateFaq(Long id, FaqDto.SaveRequest request) {
        Faq faq = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found with id: " + id));
        copy(faq, request);
        return toDto(repository.save(faq));
    }

    @Transactional
    public void deleteFaq(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("FAQ not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void copy(Faq faq, FaqDto.SaveRequest request) {
        faq.setQuestion(request.question().trim());
        faq.setAnswer(request.answer().trim());
        faq.setCategory(request.category() != null && !request.category().isBlank() ? request.category().trim() : "General");
        faq.setPublished(request.published());
        faq.setDisplayOrder(request.displayOrder());
    }

    private FaqDto toDto(Faq faq) {
        return new FaqDto(
                faq.getId(),
                faq.getQuestion(),
                faq.getAnswer(),
                faq.getCategory(),
                faq.isPublished(),
                faq.getDisplayOrder(),
                faq.getUpdatedAt()
        );
    }
}

