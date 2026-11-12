import React from 'react';
import { Image as ImageIcon, ArrowUpRight, Layers } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ProjectCard({ project, onSelect }) {
  const thumb = project.coverImage || project.image;
  const summary = project.shortDescription || project.description;
  const techs = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <GlassCard
      className="project-card"
      tilt
      tiltIntensity={4}
      as="article"
    >
      <button
        type="button"
        className="project-card__trigger"
        onClick={() => onSelect(project)}
        aria-label={`View details for ${project.title}`}
      >
        <div className="project-card__thumb">
          {thumb ? (
            <img src={thumb} alt={project.title} loading="lazy" />
          ) : (
            <div className="project-card__placeholder">
              <ImageIcon size={34} aria-hidden="true" />
              <span>{project.category}</span>
            </div>
          )}
          <span className="project-card__badge">{project.category}</span>
        </div>

        <div className="project-card__info">
          <div className="project-card__header-row">
            <h4 className="project-card__title">{project.title}</h4>
            <span className="project-card__arrow" aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </div>

          {summary && <p className="project-card__desc">{summary}</p>}

          {techs.length > 0 && (
            <div className="project-card__tags" aria-label="Technologies">
              {techs.slice(0, 3).map((tech) => (
                <span key={tech} className="project-card__tag">
                  {tech}
                </span>
              ))}
              {techs.length > 3 && (
                <span className="project-card__tag project-card__tag--more">
                  +{techs.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="project-card__footer">
            <span className="project-card__cta">
              <Layers size={14} aria-hidden="true" />
              <span>Inspect Project</span>
            </span>
          </div>
        </div>
      </button>
    </GlassCard>
  );
}

