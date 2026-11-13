import React, { useEffect, useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import ProjectGallery from '../portfolio/ProjectGallery';
import ProjectModal from '../portfolio/ProjectModal';
import {
  projectsData as fallbackProjects,
  portfolioCategories,
} from '../../data/projects';
import {
  testimonialsData as fallbackTestimonials,
} from '../../data/testimonials';
import { fetchProjects, fetchTestimonials } from '../../services/apiClient';

export default function Portfolio() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadData = async (signal) => {
    try {
      setLoading(true);
      setLoadError(null);
      const [projectsRes, testimonialsRes] = await Promise.allSettled([
        fetchProjects({ signal }),
        fetchTestimonials({ signal }),
      ]);

      if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value)) {
        setProjects(projectsRes.value);
      }
      if (testimonialsRes.status === 'fulfilled' && Array.isArray(testimonialsRes.value)) {
        // Map backend DTO to component format if needed
        const mapped = testimonialsRes.value.map((t) => ({
          id: t.id,
          quote: t.quote,
          author: t.authorName,
          role: [t.authorRole, t.companyOrChannel].filter(Boolean).join(' • '),
        }));
        setTestimonials(mapped);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setLoadError('Unable to load live projects. Displaying offline showcase.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const selectedIndex = filteredProjects.findIndex((p) => p.id === selectedProjectId);
  const selectedProject = selectedIndex >= 0 ? filteredProjects[selectedIndex] : null;

  const handlePrev = () => {
    if (filteredProjects.length <= 1) return;
    const prevIdx = (selectedIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProjectId(filteredProjects[prevIdx].id);
  };

  const handleNext = () => {
    if (filteredProjects.length <= 1) return;
    const nextIdx = (selectedIndex + 1) % filteredProjects.length;
    setSelectedProjectId(filteredProjects[nextIdx].id);
  };

  return (
    <section
      id="portfolio"
      className="section portfolio-section"
      aria-label="Portfolio Selected Work"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Our Work"
          title="Selected Work."
          subtitle="A curated archive of digital platforms, creative productions, brand systems and campaigns."
        />

        {loadError && (
          <div className="status-notice status-notice--subtle" role="status">
            <span>{loadError}</span>
            <button
              type="button"
              className="status-notice__retry"
              onClick={() => loadData()}
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Category Filter Buttons */}
        <div className="portfolio__filters" role="group" aria-label="Filter Projects">
          {portfolioCategories.map((cat) => {
            const count =
              cat === 'All'
                ? projects.length
                : projects.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`portfolio__filter-btn ${activeCategory === cat ? 'portfolio__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                {projects.length > 0 && (
                  <span className="portfolio__filter-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        <ProjectGallery
          projects={filteredProjects}
          activeCategory={activeCategory}
          onSelectProject={(proj) => setSelectedProjectId(proj.id)}
        />

        {/* Verified Client Testimonials (renders only when real entries exist) */}
        {testimonials.length > 0 && (
          <div className="testimonials-strip" aria-label="Client Testimonials">
            <div className="testimonials-strip__header">
              <span className="section-eyebrow">Client Voices</span>
              <h3 className="testimonials-strip__title">Words from Collaborations</h3>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((item) => (
                <GlassCard key={item.id} className="testimonial-card" hoverEffect={false}>
                  <Quote size={18} className="testimonial-card__icon" aria-hidden="true" />
                  <p className="testimonial-card__quote">&ldquo;{item.quote}&rdquo;</p>
                  <div className="testimonial-card__author">
                    <strong>{item.author}</strong>
                    {item.role && <span>{item.role}</span>}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasMultiple={filteredProjects.length > 1}
      />
    </section>
  );
}
