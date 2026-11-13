-- NexForever Core Platform Schema (Phase 2)
-- Creates domain tables for admin authentication, services, portfolio projects & media,
-- uploaded media assets, enquiries, verified testimonials, FAQs, and site settings.

CREATE TABLE admins (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_admins_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE services (
    id BIGINT NOT NULL AUTO_INCREMENT,
    service_number VARCHAR(10) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    title VARCHAR(180) NOT NULL,
    tag VARCHAR(150) NULL,
    description TEXT NOT NULL,
    details TEXT NULL,
    items_json TEXT NOT NULL,
    icon_key VARCHAR(50) NOT NULL DEFAULT 'Code2',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_services_slug UNIQUE (slug),
    INDEX idx_services_published_order (published, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
    id BIGINT NOT NULL AUTO_INCREMENT,
    slug VARCHAR(180) NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL,
    client_name VARCHAR(160) NULL,
    short_description VARCHAR(400) NOT NULL,
    overview TEXT NULL,
    challenges TEXT NULL,
    solutions TEXT NULL,
    results_json TEXT NULL,
    technologies_json TEXT NULL,
    cover_image_url VARCHAR(500) NULL,
    live_url VARCHAR(500) NULL,
    source_url VARCHAR(500) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    published_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_projects_slug UNIQUE (slug),
    INDEX idx_projects_status_category (status, category),
    INDEX idx_projects_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE project_media (
    id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    media_type VARCHAR(30) NOT NULL DEFAULT 'IMAGE',
    url VARCHAR(500) NOT NULL,
    storage_key VARCHAR(255) NULL,
    alt_text VARCHAR(255) NULL,
    caption VARCHAR(300) NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_project_media_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE CASCADE,
    INDEX idx_project_media_project_order (project_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE media_assets (
    id BIGINT NOT NULL AUTO_INCREMENT,
    storage_key VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(120) NOT NULL,
    file_size BIGINT NOT NULL,
    public_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    uploaded_by_admin_id BIGINT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_media_assets_storage_key UNIQUE (storage_key),
    CONSTRAINT fk_media_assets_admin
        FOREIGN KEY (uploaded_by_admin_id) REFERENCES admins (id)
        ON DELETE SET NULL,
    INDEX idx_media_assets_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE enquiries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    reference_code VARCHAR(32) NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL,
    audience_profile VARCHAR(100) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    service_interest VARCHAR(180) NULL,
    budget_scope VARCHAR(120) NULL,
    planning_preference VARCHAR(120) NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    internal_notes TEXT NULL,
    source_ip_hash VARCHAR(64) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_enquiries_reference_code UNIQUE (reference_code),
    INDEX idx_enquiries_status_created (status, created_at),
    INDEX idx_enquiries_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE testimonials (
    id BIGINT NOT NULL AUTO_INCREMENT,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(180) NULL,
    company_or_channel VARCHAR(180) NULL,
    quote TEXT NOT NULL,
    category VARCHAR(80) NULL,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_testimonials_pub_order (approved, published, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faqs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    question VARCHAR(320) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'General',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_faqs_published_order (published, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
    id BIGINT AUTO_INCREMENT,
    setting_key VARCHAR(120) NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_site_settings_key UNIQUE (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

