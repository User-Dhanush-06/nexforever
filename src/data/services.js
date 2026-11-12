/**
 * NexForever — Services Data
 * ─────────────────────────────────────────────────────────────
 * HOW TO EDIT:
 * Modify titles, descriptions, deliverables (`items`), or expanded
 * execution notes (`details`) below. The Services section and Contact
 * form dropdown update automatically from this file.
 * ─────────────────────────────────────────────────────────────
 */

export const servicesData = [
  {
    number: '01',
    title: 'Web Development',
    tag: 'Engineering & Platforms',
    description:
      'Building modern, responsive and user-friendly websites and web applications that help businesses establish their digital presence.',
    details:
      'We craft fast, scalable interfaces with clean component architecture, accessible layouts and responsive performance across every screen size.',
    items: [
      'Business Websites',
      'Web Applications',
      'Landing Pages',
      'Business Dashboards',
      'Custom Digital Solutions',
    ],
    icon: 'Code2',
  },
  {
    number: '02',
    title: 'Video Production & Content Creation',
    tag: 'Motion & Storytelling',
    description:
      'Creating engaging visual stories that communicate your brand, capture attention and connect with your audience.',
    details:
      'From concept framing and cinematic shooting to pacing, color grading and crisp post-production designed for modern platforms.',
    items: [
      'Promotional Videos',
      'Content-Based Videos',
      'Personal Branding Videos',
      'Cinematic Videography',
      'Video Editing',
    ],
    icon: 'Video',
  },
  {
    number: '03',
    title: 'Creative Design & Branding',
    tag: 'Identity & Visual Systems',
    description:
      'Creating thoughtful visual identities and professional designs that help businesses communicate their brand.',
    details:
      'Consistent visual language across print and digital touchpoints — engineered for clarity, recall and strong brand presence.',
    items: [
      'Visiting Card Design',
      'Posters & Banners',
      'Social Media Creatives',
      'Brand Identity',
      'Graphic Design',
    ],
    icon: 'Palette',
  },
  {
    number: '04',
    title: 'Digital Marketing',
    tag: 'Growth & Distribution',
    description:
      'Helping businesses strengthen their online presence through consistent content, creative campaigns and digital strategies.',
    details:
      'Structured content calendars, campaign execution and optimization focused on helping brands stay visible and relevant online.',
    items: [
      'Social Media Management',
      'Content Planning',
      'Digital Promotions',
      'Social Media Optimization',
      'Brand Awareness Campaigns',
    ],
    icon: 'TrendingUp',
  },
];

export const audienceSolutionsData = [
  {
    id: 'businesses',
    eyebrow: '01 / FOR BUSINESSES & BRANDS',
    title: 'Businesses, Startups & Growing Brands',
    description:
      'End-to-end digital foundations that turn brand positioning into dependable websites, visual assets and consistent market visibility.',
    deliverables: [
      'Company websites, landing pages & custom web applications',
      'Brand identity systems, print assets & marketing creatives',
      'Promotional brand films & product storytelling',
      'Structured social presence & brand awareness campaigns',
    ],
    ctaLabel: 'Enquire for Your Business',
    audienceValue: 'Business / Brand',
  },
  {
    id: 'creators',
    eyebrow: '02 / FOR CREATORS & TALENT',
    title: 'Content Creators & Personal Brands',
    description:
      'Studio-grade production, custom digital hubs and cohesive visual identity systems designed to elevate independent voices.',
    deliverables: [
      'Personal brand websites, portfolios & collaboration hubs',
      'Cinematic personal branding videos, reels & video editing',
      'Consistent thumbnail systems, posters & social graphics',
      'Content planning & multi-platform social optimization',
    ],
    ctaLabel: 'Enquire as a Creator',
    audienceValue: 'Creator / Personal Brand',
  },
];

export const packagesData = [
  {
    name: 'Launch',
    tag: 'Customizable Scope',
    summary: 'For new businesses establishing their digital presence.',
    focus: [
      'Core website or digital landing hub',
      'Foundational visual identity & brand essentials',
      'Initial social launch creatives & content setup',
    ],
    recommendedService: 'Web Development',
  },
  {
    name: 'Grow',
    tag: 'Customizable Scope',
    summary: 'For businesses strengthening their online presence.',
    focus: [
      'Expanded multi-page web platform or content hub',
      'Cohesive video storytelling & social content assets',
      'Consistent digital marketing & audience engagement',
    ],
    recommendedService: 'Video Production & Content Creation',
    highlighted: true,
  },
  {
    name: 'Elevate',
    tag: 'Customizable Scope',
    summary: 'For brands requiring more comprehensive digital solutions.',
    focus: [
      'Custom interactive web applications & digital systems',
      'Integrated brand architecture & cinematic production',
      'Multi-channel campaign strategy & tailored deliverables',
    ],
    recommendedService: 'Creative Design & Branding',
  },
];
