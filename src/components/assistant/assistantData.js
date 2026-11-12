/**
 * NexForever — CHITTI Robot Assistant Knowledge & Section Prompts
 * ─────────────────────────────────────────────────────────────
 * Structured local FAQ and contextual section prompts for CHITTI.
 * NOTE: Uses deterministic local studio guidance (no external AI backend).
 * ─────────────────────────────────────────────────────────────
 */

export const sectionWelcomePrompts = {
  home: "Hey! I'm CHITTI. Looking to build something extraordinary?",
  about: 'Curious how NexForever unites code, design and visual storytelling?',
  services: 'Need a website, creative video or digital branding?',
  portfolio: 'Want to explore our horizontal showcase & upcoming work?',
  approach: 'See how CHITTI & our studio guide projects from idea to impact.',
  contact: 'Ready to configure your project enquiry?',
};

export const assistantSuggestions = [
  {
    id: 'intro',
    question: 'Who is NexForever?',
    answer:
      'NexForever is a small, collaborative creative technology studio combining web development, video production, creative design and digital marketing with flexible, tailored execution.',
    action: { label: 'About NexForever', target: '#about' },
  },
  {
    id: 'audience',
    question: 'Who do you work with?',
    answer:
      'We serve two primary audiences under one roof: businesses, startups & growing brands building strong market presence, plus content creators & personal brands crafting cohesive platforms and visual stories.',
    action: { label: 'Explore Solutions', target: '#audience-solutions' },
  },
  {
    id: 'services',
    question: 'What services do you offer?',
    answer:
      'We focus on four core capabilities: Web Development, Video Production & Content Creation, Creative Design & Branding, and Digital Marketing.',
    action: { label: 'Explore Services', target: '#services' },
  },
  {
    id: 'packages',
    question: 'Tell me about Launch, Grow & Elevate',
    answer:
      'Launch helps new businesses establish a presence, Grow strengthens existing online presence, and Elevate delivers comprehensive brand & platform solutions — all customizable around your real project scope.',
    action: { label: 'View Packages', target: '#packages' },
  },
  {
    id: 'work',
    question: 'How does Our Work gallery work?',
    answer:
      'Our Work uses an interactive horizontal carousel supporting category filters, drag/swipe navigation and full case-study modal overlays as projects are published.',
    action: { label: 'Go to Our Work', target: '#portfolio' },
  },
  {
    id: 'contact',
    question: 'How can I start an enquiry?',
    answer:
      'Use our 3-step Project Inquiry Wizard in Contact to pick your audience track, package or service, planning preferences and project brief.',
    action: { label: 'Open Inquiry Wizard', target: '#contact' },
  },
];
