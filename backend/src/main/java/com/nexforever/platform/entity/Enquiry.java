package com.nexforever.platform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code", nullable = false, unique = true, length = 32)
    private String referenceCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 190)
    private String email;

    @Column(name = "audience_profile", nullable = false, length = 100)
    private String audienceProfile;

    @Column(name = "package_name", nullable = false, length = 100)
    private String packageName;

    @Column(name = "service_interest", length = 180)
    private String serviceInterest;

    @Column(name = "budget_scope", length = 120)
    private String budgetScope;

    @Column(name = "planning_preference", length = 120)
    private String planningPreference;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EnquiryStatus status = EnquiryStatus.NEW;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Column(name = "source_ip_hash", length = 64)
    private String sourceIpHash;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (this.createdAt == null) this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAudienceProfile() { return audienceProfile; }
    public void setAudienceProfile(String audienceProfile) { this.audienceProfile = audienceProfile; }
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    public String getServiceInterest() { return serviceInterest; }
    public void setServiceInterest(String serviceInterest) { this.serviceInterest = serviceInterest; }
    public String getBudgetScope() { return budgetScope; }
    public void setBudgetScope(String budgetScope) { this.budgetScope = budgetScope; }
    public String getPlanningPreference() { return planningPreference; }
    public void setPlanningPreference(String planningPreference) { this.planningPreference = planningPreference; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public EnquiryStatus getStatus() { return status; }
    public void setStatus(EnquiryStatus status) { this.status = status; }
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    public String getSourceIpHash() { return sourceIpHash; }
    public void setSourceIpHash(String sourceIpHash) { this.sourceIpHash = sourceIpHash; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

