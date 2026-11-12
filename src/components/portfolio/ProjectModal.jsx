import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Code,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import Button from '../ui/Button';

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  hasMultiple,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const gallery = (() => {
    if (!project) return [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    if (project.coverImage || project.image) {
      return [project.coverImage || project.image];
    }
    return [];
  })();

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') onPrev();
      if (hasMultiple && e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onPrev, onNext, hasMultiple]);

  if (!project) return null;

  const activeImage = gallery[activeImageIndex] || null;
  const overview = project.overview || project.shortDescription || project.description;
  const liveUrl =
    project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : project.link && project.link !== '#' ? project.link : '';
  const sourceUrl = project.sourceUrl && project.sourceUrl !== '#' ? project.sourceUrl : '';
  const techs = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <div
      className="project-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="project-modal__topbar">
          <span className="project-modal__category">{project.category}</span>
          <div className="project-modal__controls">
            {hasMultiple && (
              <div className="project-modal__nav-group" role="group" aria-label="Switch Project">
                <button
                  type="button"
                  className="project-modal__icon-btn"
                  onClick={onPrev}
                  aria-label="Previous project"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="project-modal__icon-btn"
                  onClick={onNext}
                  aria-label="Next project"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            <button
              type="button"
              className="project-modal__icon-btn project-modal__close"
              onClick={onClose}
              aria-label="Close project details"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="project-modal__body">
          {/* Media Preview & Thumbnail Switcher */}
          <div className="project-modal__media">
            <div className="project-modal__stage">
              {activeImage ? (
                <img src={activeImage} alt={`${project.title} preview ${activeImageIndex + 1}`} />
              ) : (
                <div className="project-modal__stage-placeholder">
                  <ImageIcon size={44} aria-hidden="true" />
                  <span>Visual preview coming soon</span>
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="project-modal__thumbs" role="list" aria-label="Project screenshots">
                {gallery.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    className={`project-modal__thumb ${idx === activeImageIndex ? 'project-modal__thumb--active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Narrative & Metadata */}
          <div className="project-modal__content">
            <h3 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h3>

            {overview && (
              <div className="project-modal__block">
                <span className="project-modal__label">Overview</span>
                <p className="project-modal__text">{overview}</p>
              </div>
            )}

            {(project.challenges || project.solutions) && (
              <div className="project-modal__grid">
                {project.challenges && (
                  <div className="project-modal__subcard">
                    <span className="project-modal__label">Challenge</span>
                    <p className="project-modal__text">{project.challenges}</p>
                  </div>
                )}
                {project.solutions && (
                  <div className="project-modal__subcard">
                    <span className="project-modal__label">Solution</span>
                    <p className="project-modal__text">{project.solutions}</p>
                  </div>
                )}
              </div>
            )}

            {project.results && (
              <div className="project-modal__results">
                <span className="project-modal__label">Outcomes</span>
                {Array.isArray(project.results) ? (
                  <ul className="project-modal__result-list">
                    {project.results.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={15} className="accent-mint" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="project-modal__text">{project.results}</p>
                )}
              </div>
            )}

            {techs.length > 0 && (
              <div className="project-modal__block">
                <span className="project-modal__label">Technologies</span>
                <div className="project-modal__techs">
                  {techs.map((tech) => (
                    <span key={tech} className="project-modal__tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Action Links */}
            {(liveUrl || sourceUrl) && (
              <div className="project-modal__actions">
                {liveUrl && (
                  <Button
                    href={liveUrl}
                    target="_blank"
                    variant="primary"
                    icon={ExternalLink}
                  >
                    Live Demo
                  </Button>
                )}
                {sourceUrl && (
                  <Button
                    href={sourceUrl}
                    target="_blank"
                    variant="glass"
                    icon={Code}
                  >
                    Source Code
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

