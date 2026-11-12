import React from 'react';
import { FolderGit2, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import ProjectCard from './ProjectCard';

export default function ProjectGallery({
  projects,
  activeCategory,
  onSelectProject,
}) {
  if (projects.length === 0) {
    return (
      <GlassCard className="portfolio__empty-state" hoverEffect={false}>
        <div className="portfolio__empty-grid-bg" aria-hidden="true" />

        <div className="portfolio__empty-top">
          <div className="portfolio__empty-icon" aria-hidden="true">
            <FolderGit2 size={34} />
          </div>
          <span className="portfolio__empty-pill">
            <Sparkles size={13} aria-hidden="true" />
            <span>Curated Studio Archive</span>
          </span>
        </div>

        <h3 className="portfolio__empty-title">
          {activeCategory === 'All'
            ? 'Selected Case Studies Launching Here'
            : `No ${activeCategory} Projects Yet`}
        </h3>

        <p className="portfolio__empty-text">
          {activeCategory === 'All'
            ? 'Our project archive is engineered to showcase live interactive demos, technical breakdowns, and media galleries. Add verified work anytime in src/data/projects.js.'
            : `Case studies in ${activeCategory} will appear automatically here once added to src/data/projects.js.`}
        </p>

        {/* Architectural blueprint slots indicating supported capabilities */}
        <div className="portfolio__blueprint-row" aria-hidden="true">
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">01 / CASE STUDY</span>
            <span className="portfolio__slot-title">Overview & Architecture</span>
          </div>
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">02 / MEDIA</span>
            <span className="portfolio__slot-title">Multi-Image Showcase</span>
          </div>
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">03 / DELIVERY</span>
            <span className="portfolio__slot-title">Live Demo & Stack</span>
          </div>
        </div>

        <div className="portfolio__empty-cta">
          <Button href="#contact" variant="primary" icon={ArrowRight}>
            Build the Next Project Together
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="portfolio__grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelectProject}
        />
      ))}
    </div>
  );
}

