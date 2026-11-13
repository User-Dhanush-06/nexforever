-- ============================================================================
-- NexForever Platform Database Migration
-- V4__add_brand_identity_settings.sql
-- Purpose: Seed brand identity and location map setting keys into site_settings
-- ============================================================================

INSERT INTO site_settings (setting_key, setting_value)
VALUES
    ('brand.name', 'NexForever'),
    ('brand.tagline', 'Built for What\'s Next. Made to Last.'),
    ('contact.location_map_url', '')
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value);

