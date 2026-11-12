/**
 * NexForever — Studio Assistant ("Nex") Local Knowledge & Prompts
 * ─────────────────────────────────────────────────────────────
 * Structured local FAQ and contextual section prompts.
 * NOTE: This uses deterministic local studio guidance (no external AI backend).
 * ─────────────────────────────────────────────────────────────
 */

export const sectionWelcomePrompts = {
  home: 'Hey! Looking to build something extraordinary?',
  about: 'Curious how we unite technology and creative storytelling?',
  services: 'Need a website, creative video or digital branding?',
  portfolio: 'Want to explore what we can create together?',
  approach: 'See how we take projects from idea to impact.',
  contact: 'Ready to start your next project?',
};

export const assistantSuggestions = [
  {
    id: 'intro',
    question: 'What is NexForever?',
    answer:
      'NexForever is a creative technology studio focused on building digital experiences, developing websites and applications, producing visual content, and helping businesses grow their digital presence.',
    action: { label: 'About Our Studio', target: '#about' },
  },
  {
    id: 'services',
    question: 'What services do you offer?',
    answer:
      'We specialize in four core areas: Web Development (sites, web apps, dashboards), Video Production & Content Creation, Creative Design & Branding, and Digital Marketing campaigns.',
    action: { label: 'Explore Services', target: '#services' },
  },
  {
    id: 'work',
    question: 'Where can I see your work?',
    answer:
      'Our Selected Work archive supports category filters and full interactive project breakdowns. As new studio projects are added, you can inspect images, challenges, solutions and live links right inside the gallery.',
    action: { label: 'Go to Our Work', target: '#portfolio' },
  },
  {
    id: 'process',
    question: 'How does your workflow operate?',
    answer:
      'Every project follows our 4-stage methodology: 01 Discover (goals & requirements), 02 Strategize (architecture & planning), 03 Create (build & production), and 04 Deliver (polished launch).',
    action: { label: 'View Approach', target: '#approach' },
  },
  {
    id: 'contact',
    question: 'How do we start a project?',
    answer:
      'Head down to our Contact section to pick the service you need and share your idea, or connect via the studio contact details configured on this site.',
    action: { label: 'Start a Project', target: '#contact' },
  },
];

