import React from 'react';
import { Code2, Video, Palette, TrendingUp } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { servicesData } from '../../data/services';

const iconMap = {
  Code2,
  Video,
  Palette,
  TrendingUp,
};

export default function Services() {
  return (
    <section id="services" className="section services-section" aria-label="Our Services">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title={<>What We Bring<br />to the Table.</>}
          subtitle="Creative thinking meets technical execution. Explore the services we offer to help businesses grow and stand out."
        />

        <div className="services-grid">
          {servicesData.map((svc) => {
            const Icon = iconMap[svc.icon] || Code2;
            return (
              <GlassCard key={svc.number} className="service-card">
                <div className="service-card__top">
                  <span className="service-card__num">SERVICE {svc.number}</span>
                  <div className="service-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                </div>

                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__description">{svc.description}</p>

                <ul className="service-card__capabilities" aria-label={`${svc.title} Capabilities`}>
                  {svc.items.map((item) => (
                    <li key={item} className="service-card__cap-item">
                      <span className="service-card__cap-bullet" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
