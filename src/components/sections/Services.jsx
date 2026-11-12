import React, { useState } from 'react';
import { Code2, Video, Palette, TrendingUp, ChevronDown, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { servicesData } from '../../data/services';

const iconMap = {
  Code2,
  Video,
  Palette,
  TrendingUp,
};

export default function Services({ onEnquireService }) {
  const [expandedService, setExpandedService] = useState('01');

  const handleEnquire = (serviceTitle) => {
    if (onEnquireService) {
      onEnquireService(serviceTitle);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section services-section" aria-label="Our Services">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title={<>What We Bring<br />to the Table.</>}
          subtitle="Creative thinking meets technical execution. Explore our core capabilities and tap any card for deeper scope."
        />

        <div className="services-grid">
          {servicesData.map((svc) => {
            const Icon = iconMap[svc.icon] || Code2;
            const isExpanded = expandedService === svc.number;

            return (
              <GlassCard
                key={svc.number}
                tilt
                tiltIntensity={4}
                className={`service-card service-card--v${svc.number} ${isExpanded ? 'service-card--expanded' : ''}`}
              >
                <div className="service-card__top">
                  <div className="service-card__meta">
                    <span className="service-card__num">SERVICE {svc.number}</span>
                    {svc.tag && <span className="service-card__tag">{svc.tag}</span>}
                  </div>
                  <div className="service-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                </div>

                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__description">{svc.description}</p>

                <ul className="service-card__capabilities" aria-label={`${svc.title} Deliverables`}>
                  {svc.items.map((item) => (
                    <li key={item} className="service-card__cap-item">
                      <span className="service-card__cap-bullet" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Interactive Expandable Details */}
                <div className="service-card__footer">
                  <button
                    type="button"
                    className="service-card__expand-btn"
                    onClick={() => setExpandedService(isExpanded ? null : svc.number)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Approach' : 'How We Deliver'}</span>
                    <ChevronDown
                      size={15}
                      className={`service-card__chevron ${isExpanded ? 'service-card__chevron--rotated' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  <Button
                    variant="glass"
                    icon={ArrowRight}
                    className="service-card__enquire-btn"
                    onClick={() => handleEnquire(svc.title)}
                  >
                    Enquire
                  </Button>
                </div>

                {svc.details && (
                  <div className={`service-card__drawer ${isExpanded ? 'service-card__drawer--open' : ''}`}>
                    <p className="service-card__details-text">{svc.details}</p>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
