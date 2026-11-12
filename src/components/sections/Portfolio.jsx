import React, { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import ProjectGallery from '../portfolio/ProjectGallery';
import ProjectModal from '../portfolio/ProjectModal';
import { projectsData, portfolioCategories } from '../../data/projects';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const filteredProjects =
    activeCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

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

        {/* Category Filter Buttons */}
        <div className="portfolio__filters" role="group" aria-label="Filter Projects">
          {portfolioCategories.map((cat) => {
            const count =
              cat === 'All'
                ? projectsData.length
                : projectsData.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`portfolio__filter-btn ${activeCategory === cat ? 'portfolio__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                {projectsData.length > 0 && (
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
