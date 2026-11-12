/**
 * NexForever — Verified Client Testimonials Data
 * ─────────────────────────────────────────────────────────────
 * POLICY: Leave `testimonialsData` empty until real, verified client
 * feedback is received. Do not add invented quotes or placeholder reviews.
 *
 * TEMPLATE ENTRY:
 * {
 *   id: 'testimonial-1',
 *   quote: 'Verified client quote describing the collaboration and outcome.',
 *   author: 'Client Full Name',
 *   role: 'Role / Company or Channel Name',
 *   category: 'Web Development',
 * }
 * ─────────────────────────────────────────────────────────────
 */

export const testimonialsData = [];

export async function loadTestimonials(endpoint = '') {
  if (!endpoint) return testimonialsData;
  try {
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) return testimonialsData;
    const remote = await res.json();
    if (Array.isArray(remote)) return remote;
    if (remote && Array.isArray(remote.testimonials)) return remote.testimonials;
    return testimonialsData;
  } catch {
    return testimonialsData;
  }
}

