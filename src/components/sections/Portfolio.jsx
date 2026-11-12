import React, { useState } from 'react';
import { Image as ImageIcon, ArrowUpRight, FolderGit2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { projectsData, portfolioCategories } from '../../data/projects';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="section portfolio-section" aria-label="Portfolio Selected Work">
      <div className="container">
        <SectionHeading
          eyebrow="Our Work"
          title="Selected Work."
          subtitle="A collection of projects, ideas and digital experiences."
        />

        {/* Category Filter Buttons */}
        <div className="portfolio__filters" role="group" aria-label="Filter Projects">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              className={`portfolio__filter-btn ${activeCategory === cat ? 'portfolio__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid or Elegant Empty State */}
        {filteredProjects.length === 0 ? (
          <GlassCard className="portfolio__empty-state" hoverEffect={false}>
            <div className="portfolio__empty-icon" aria-hidden="true">
              <FolderGit2 size={44} />
            </div>
            <h3 className="portfolio__empty-title">
              {activeCategory === 'All' ? 'Projects Coming Soon' : `No ${activeCategory} Projects Yet`}
            </h3>
            <p className="portfolio__empty-text">
              {activeCategory === 'All'
                ? 'Portfolio projects will appear here once added. Edit src/data/projects.js to showcase your work.'
                : `${activeCategory} projects will appear here once added.`}
            </p>
          </GlassCard>
        ) : (
          <div className="portfolio__grid">
            {filteredProjects.map((project) => (
              <GlassCard key={project.id} className="project-card">
                <div className="project-card__thumb">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-card__placeholder">
                      <ImageIcon size={36} />
                    </div>
                  )}
                </div>
                <div className="project-card__info">
                  <span className="project-card__category">{project.category}</span>
                  <h4 className="project-card__title">{project.title}</h4>
                  <p className="project-card__desc">{project.description}</p>
                  {project.link && project.link !== '#' && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__link"
                    >
                      <span>View Project</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

