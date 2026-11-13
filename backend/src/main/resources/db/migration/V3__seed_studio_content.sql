-- Seed initial approved NexForever studio services, baseline FAQs, and configurable site settings.
-- Projects and testimonials remain intentionally empty until added/published by an administrator.

INSERT INTO services (service_number, slug, title, tag, description, details, items_json, icon_key, published, display_order)
VALUES
    (
        '01',
        'web-development',
        'Web Development',
        'Engineering & Platforms',
        'Building modern, responsive and user-friendly websites and web applications that help businesses establish their digital presence.',
        'We craft fast, scalable interfaces with clean component architecture, accessible layouts and responsive performance across every screen size.',
        '["Business Websites","Web Applications","Landing Pages","Business Dashboards","Custom Digital Solutions"]',
        'Code2',
        TRUE,
        1
    ),
    (
        '02',
        'video-production-content-creation',
        'Video Production & Content Creation',
        'Motion & Storytelling',
        'Creating engaging visual stories that communicate your brand, capture attention and connect with your audience.',
        'From concept framing and cinematic shooting to pacing, color grading and crisp post-production designed for modern platforms.',
        '["Promotional Videos","Content-Based Videos","Personal Branding Videos","Cinematic Videography","Video Editing"]',
        'Video',
        TRUE,
        2
    ),
    (
        '03',
        'creative-design-branding',
        'Creative Design & Branding',
        'Identity & Visual Systems',
        'Creating thoughtful visual identities and professional designs that help businesses communicate their brand.',
        'Consistent visual language across print and digital touchpoints — engineered for clarity, recall and strong brand presence.',
        '["Visiting Card Design","Posters & Banners","Social Media Creatives","Brand Identity","Graphic Design"]',
        'Palette',
        TRUE,
        3
    ),
    (
        '04',
        'digital-marketing',
        'Digital Marketing',
        'Growth & Distribution',
        'Helping businesses strengthen their online presence through consistent content, creative campaigns and digital strategies.',
        'Structured content calendars, campaign execution and optimization focused on helping brands stay visible and relevant online.',
        '["Social Media Management","Content Planning","Digital Promotions","Social Media Optimization","Brand Awareness Campaigns"]',
        'TrendingUp',
        TRUE,
        4
    );

INSERT INTO faqs (question, answer, category, published, display_order)
VALUES
    (
        'How do we kick off a new project with NexForever?',
        'Start using the Project Inquiry Wizard in our Contact section. Once you share your service needs, planning scope and project idea, we review requirements together during the Discover stage.',
        'Workflow',
        TRUE,
        1
    ),
    (
        'Can we combine multiple studio services or customize Launch, Grow & Elevate?',
        'Yes. Launch, Grow and Elevate act as flexible starting points — never rigid subscriptions — allowing you to combine Web Development, Video Production, Creative Design and Digital Marketing around your real goals.',
        'Packages',
        TRUE,
        2
    ),
    (
        'How are scope, investment and schedule determined?',
        'Every project is scoped transparently around your objectives and deliverables during Strategize, rather than relying on one-size-fits-all templates or fixed assumptions.',
        'Planning',
        TRUE,
        3
    ),
    (
        'Do you support responsive websites and interactive visual experiences?',
        'Every digital experience we engineer is built mobile-first, tested across modern screen sizes and crafted with accessibility and smooth performance in mind.',
        'Engineering',
        TRUE,
        4
    );

INSERT INTO site_settings (setting_key, setting_value)
VALUES
    ('brand.availability', 'Available for New Projects'),
    ('contact.email', ''),
    ('contact.whatsapp', ''),
    ('contact.instagram', ''),
    ('contact.location', 'India / Remote Worldwide'),
    ('social.instagram', ''),
    ('social.linkedin', ''),
    ('social.twitter', ''),
    ('social.youtube', ''),
    ('social.behance', '');

