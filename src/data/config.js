/**
 * NexForever — Global Brand, Contact & Social Configuration
 * ─────────────────────────────────────────────────────────────
 * HOW TO EDIT:
 * 1. Official Logo: Replace the image file at `public/images/nexforever-logo.png`
 *    (use a transparent white PNG for dark surfaces). Update `brand.logo` below
 *    only if you change the filename.
 * 2. Brand Details: Edit `brand.name`, `brand.tagline`, and `brand.availability`.
 * 3. Contact Info: Replace every `[ADD ...]` placeholder below with your real
 *    studio email, WhatsApp number, Instagram handle, and location.
 *    Note: Direct form submission activates once `contact.email` no longer starts with `[`.
 * 4. Social Links: Add full URLs inside `social.*.url`.
 * ─────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  brand: {
    name: 'NexForever',
    tagline: "Built for What's Next. Made to Last.",
    description:
      'A collaborative creative technology studio helping businesses, startups, brands and content creators build digital platforms, visual stories and strong online presence.',
    logo: '/images/nexforever-logo.png',
    availability: 'Available for New Projects',
  },
  api: {
    projectsEndpoint: '',     // Optional JSON endpoint returning an array of project objects
    testimonialsEndpoint: '', // Optional JSON endpoint returning verified client testimonials
  },
  contact: {
    email: '[ADD YOUR EMAIL]',           // e.g. hello@nexforever.studio
    whatsapp: '[ADD WHATSAPP NUMBER]',    // e.g. +91 98765 43210
    instagram: '[ADD INSTAGRAM URL]',     // e.g. https://instagram.com/nexforever
    location: '[ADD BUSINESS LOCATION]',  // e.g. Mumbai, India
  },
  social: {
    instagram: { url: '', label: 'Instagram' },
    linkedin: { url: '', label: 'LinkedIn' },
    twitter: { url: '', label: 'Twitter / X' },
    youtube: { url: '', label: 'YouTube' },
    behance: { url: '', label: 'Behance' },
  },
};
