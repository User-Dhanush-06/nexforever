import React, { useEffect, useRef, useState } from 'react';
import {
  FolderGit2,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import ProjectCard from './ProjectCard';

export default function ProjectGallery({
  projects,
  activeCategory,
  onSelectProject,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, pointerId: null, moved: false });
  const suppressClickRef = useRef(false);

  // Adapt cards per slide cleanly based on viewport width
  useEffect(() => {
    const updateCount = () => {
      setVisibleCount(window.innerWidth >= 960 ? 2 : 1);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const maxIndex = Math.max(0, projects.length - visibleCount);

  // Reset slide position cleanly when category filter or count changes
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [activeCategory, maxIndex]);

  const goToSlide = (nextIdx) => {
    const clamped = Math.max(0, Math.min(maxIndex, nextIdx));
    setActiveIndex(clamped);
  };

  const handleKeyDown = (e) => {
    if (projects.length <= 1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(activeIndex - 1);
    }
  };

  const handlePointerDown = (e) => {
    if (projects.length <= 1) return;
    // Allow normal button clicks unless horizontal drag threshold is crossed
    dragStartRef.current = { x: e.clientX, pointerId: e.pointerId, moved: false };
    suppressClickRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartRef.current.x;
    if (Math.abs(delta) > 8) {
      dragStartRef.current.moved = true;
    }
    setDragOffset(delta);
  };

  const finishDrag = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartRef.current.x;
    setIsDragging(false);
    setDragOffset(0);

    if (dragStartRef.current.moved) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);

      if (delta < -48 && activeIndex < maxIndex) {
        goToSlide(activeIndex + 1);
      } else if (delta > 48 && activeIndex > 0) {
        goToSlide(activeIndex - 1);
      }
    }
  };

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
            <span>Horizontal Showcase Ready</span>
          </span>
        </div>

        <h3 className="portfolio__empty-title">
          {activeCategory === 'All'
            ? 'Selected Case Studies Launching Here'
            : `No ${activeCategory} Projects Yet`}
        </h3>

        <p className="portfolio__empty-text">
          {activeCategory === 'All'
            ? 'This interactive left-to-right project showcase automatically populates with slide controls, media galleries and technical breakdowns as soon as work is added in src/data/projects.js.'
            : `Case studies in ${activeCategory} will appear automatically in this horizontal showcase once added to src/data/projects.js.`}
        </p>

        <div className="portfolio__blueprint-row" aria-hidden="true">
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">01 / CAROUSEL</span>
            <span className="portfolio__slot-title">Drag, Swipe & Arrow Slides</span>
          </div>
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">02 / MEDIA</span>
            <span className="portfolio__slot-title">Multi-Image Showcase</span>
          </div>
          <div className="portfolio__blueprint-slot">
            <span className="portfolio__slot-code">03 / CASE STUDY</span>
            <span className="portfolio__slot-title">Interactive Detail Overlay</span>
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

  const totalStops = maxIndex + 1;
  const formattedCurrent = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalStops).padStart(2, '0');

  return (
    <div
      className="portfolio-carousel"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Project Gallery Carousel"
      onKeyDown={handleKeyDown}
    >
      {/* Carousel Controls Bar */}
      <div className="portfolio-carousel__toolbar">
        <div className="portfolio-carousel__status">
          <span className="portfolio-carousel__counter">
            {formattedCurrent} <span aria-hidden="true">/</span> {formattedTotal}
          </span>
          <span className="portfolio-carousel__hint">
            Drag, swipe or use arrows to browse
          </span>
        </div>

        <div className="portfolio-carousel__arrows">
          <button
            type="button"
            className="portfolio-carousel__arrow-btn"
            onClick={() => goToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project slide"
          >
            <ChevronLeft size={19} />
          </button>
          <button
            type="button"
            className="portfolio-carousel__arrow-btn"
            onClick={() => goToSlide(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            aria-label="Next project slide"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      {/* Horizontal Viewport & Sliding Track */}
      <div
        className={`portfolio-carousel__viewport ${isDragging ? 'portfolio-carousel__viewport--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div
          className="portfolio-carousel__track"
          style={{
            '--slide-index': activeIndex,
            '--visible-count': visibleCount,
            transform: `translate3d(calc(-1 * ${activeIndex} * (100% + 1.5rem) / ${visibleCount} + ${dragOffset}px), 0, 0)`,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="portfolio-carousel__slide"
              style={{
                flex: `0 0 calc((100% - (${visibleCount} - 1) * 1.5rem) / ${visibleCount})`,
              }}
            >
              <ProjectCard
                project={project}
                onSelect={onSelectProject}
                shouldSuppressClick={() => suppressClickRef.current}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicators */}
      {totalStops > 1 && (
        <div className="portfolio-carousel__dots" role="tablist" aria-label="Slide Pagination">
          {Array.from({ length: totalStops }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to slide ${idx + 1}`}
              className={`portfolio-carousel__dot ${idx === activeIndex ? 'portfolio-carousel__dot--active' : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
