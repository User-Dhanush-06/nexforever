/**
 * NexForever — Portfolio Projects Data
 * ─────────────────────────────────────────────────────────────
 * HOW TO ADD A PROJECT MANUALLY:
 * 1. Place your cover and gallery images in `public/images/projects/`.
 * 2. Copy the commented object inside `projectsData` below, uncomment it,
 *    and replace each field with your real project information.
 * 3. Save the file — the gallery, category filters, and interactive modal
 *    will automatically render your project.
 *
 * VALID CATEGORIES:
 *   'Web Development' | 'Video Production' | 'Creative Design' | 'Digital Marketing'
 *
 * NOTE: Leave `projectsData` empty until real studio projects are ready.
 * ─────────────────────────────────────────────────────────────
 */

export const portfolioCategories = [
  'All',
  'Web Development',
  'Video Production',
  'Creative Design',
  'Digital Marketing',
];

export const projectsData = [
  /* ── Project Template — Copy, uncomment, and fill in real details ────
  {
    id: 'project-1',
    title: 'Project Title',
    category: 'Web Development',
    shortDescription: 'A concise one-line summary of the project.',
    coverImage: '/images/projects/project-1-cover.jpg',
    images: [
      '/images/projects/project-1-cover.jpg',
      '/images/projects/project-1-detail.jpg',
    ],
    technologies: ['React', 'Three.js', 'CSS3'],
    overview:
      'Detailed description of the project scope, purpose, and creative direction.',
    challenges:
      'Key technical or creative challenges addressed during execution.',
    solutions:
      'How NexForever designed and engineered the solution.',
    results: '', // Optional outcome notes (omit or leave empty if not applicable)
    liveUrl: '', // Optional external live demo URL (e.g. 'https://example.com')
    sourceUrl: '', // Optional repository URL (e.g. 'https://github.com/...')
  },
  ────────────────────────────────────────────────────────────────────── */
];

/**
 * Backend-ready loader: Fetches projects from a configured API/CMS JSON
 * endpoint if provided in `siteConfig.api.projectsEndpoint`, falling back
 * cleanly to local `projectsData` when unset or unreachable.
 */
export async function loadPortfolioProjects(endpoint = '') {
  if (!endpoint) return projectsData;
  try {
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!res.ok) return projectsData;
    const remote = await res.json();
    if (Array.isArray(remote)) return remote;
    if (remote && Array.isArray(remote.projects)) return remote.projects;
    return projectsData;
  } catch {
    return projectsData;
  }
}
