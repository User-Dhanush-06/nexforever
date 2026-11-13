import React, { useState, useEffect } from 'react';
import {
  Code2,
  Video,
  Palette,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Building2,
  UserCheck,
  Check,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import {
  servicesData as fallbackServices,
  audienceSolutionsData,
  packagesData,
} from '../../data/services';
import { fetchServices } from '../../services/apiClient';

const iconMap = {
  Code2,
  Video,
  Palette,
  TrendingUp,
};

export default function Services({
  onEnquireService,
  onSelectAudience,
  onSelectPackage,
}) {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [expandedService, setExpandedService] = useState('01');

  const loadBackendServices = async (signal) => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await fetchServices({ signal });
      if (Array.isArray(data) && data.length > 0) {
        // Map backend DTO to component format
        const mapped = data.map((item) => ({
          number: item.serviceNumber || '01',
          slug: item.slug,
          title: item.title,
          tag: item.tag,
          description: item.description,
          details: item.details,
          items: Array.isArray(item.items) ? item.items : [],
          icon: item.icon || 'Code2',
        }));
        setServices(mapped);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Soft fallback to packaged services data
        setLoadError('Connecting to live studio services. Displaying cached baseline.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBackendServices(controller.signal);
    return () => controller.abort();
  }, []);

  const scrollToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnquire = (serviceTitle) => {
    if (onEnquireService) onEnquireService(serviceTitle);
    scrollToContact();
  };

  const handleAudienceEnquire = (audienceValue) => {
    if (onSelectAudience) onSelectAudience(audienceValue);
    scrollToContact();
  };

  const handlePackageSelect = (pkg) => {
    if (onSelectPackage) onSelectPackage(pkg.name);
    if (onEnquireService && pkg.recommendedService) {
      onEnquireService(pkg.recommendedService);
    }
    scrollToContact();
  };

  return (
    <section id="services" className="section services-section" aria-label="Our Services">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title={<>What We Bring<br />to the <span className="text-outline-mint">Table.</span></>}
          subtitle="Creative thinking meets technical execution. Explore our core capabilities and tap any card for deeper scope."
        />

        {loadError && (
          <div className="status-notice status-notice--subtle" role="status">
            <span>{loadError}</span>
            <button
              type="button"
              className="status-notice__retry"
              onClick={() => loadBackendServices()}
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div className="services-grid">
          {services.map((svc) => {
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

        {/* Dedicated Solutions for Businesses & Content Creators */}
        <div id="audience-solutions" className="studio-subblock">
          <div className="studio-subblock__header">
            <span className="section-eyebrow">Built For Two Primary Audiences</span>
            <h3 className="studio-subblock__title">
              Tailored Tracks for <span className="text-outline-mint">Businesses &amp; Creators.</span>
            </h3>
            <p className="studio-subblock__sub">
              One studio bringing engineering, design and content production together — adapted to how businesses operate and how creators grow.
            </p>
          </div>

          <div className="audience-tracks">
            {audienceSolutionsData.map((track) => {
              const TrackIcon = track.id === 'businesses' ? Building2 : UserCheck;
              return (
                <GlassCard key={track.id} className="audience-card" hoverEffect={false}>
                  <div className="audience-card__top">
                    <span className="audience-card__eyebrow">{track.eyebrow}</span>
                    <div className="service-card__icon" aria-hidden="true">
                      <TrackIcon size={20} />
                    </div>
                  </div>
                  <h4 className="audience-card__title">{track.title}</h4>
                  <p className="audience-card__desc">{track.description}</p>
                  <ul className="audience-card__list">
                    {track.deliverables.map((item) => (
                      <li key={item} className="audience-card__list-item">
                        <Check size={14} className="accent-mint" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="audience-card__footer">
                    <Button
                      variant="glass"
                      icon={ArrowRight}
                      className="audience-card__btn"
                      onClick={() => handleAudienceEnquire(track.audienceValue)}
                    >
                      {track.ctaLabel}
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Customizable Studio Packages: Launch, Grow, Elevate */}
        <div id="packages" className="studio-subblock">
          <div className="studio-subblock__header">
            <span className="section-eyebrow">Flexible Engagement Paths</span>
            <h3 className="studio-subblock__title">
              Launch. Grow. <span className="text-outline-mint">Elevate.</span>
            </h3>
            <p className="studio-subblock__sub">
              Starting frameworks tailored cleanly to your real deliverables and stage — never fixed subscriptions or rigid pricing templates.
            </p>
          </div>

          <div className="packages-grid">
            {packagesData.map((pkg) => (
              <GlassCard
                key={pkg.name}
                className={`package-card ${pkg.highlighted ? 'package-card--featured' : ''}`}
                hoverEffect={false}
              >
                <div className="package-card__top">
                  <h4 className="package-card__name">{pkg.name}</h4>
                  <span className="package-card__badge">
                    <SlidersHorizontal size={12} aria-hidden="true" />
                    <span>{pkg.tag}</span>
                  </span>
                </div>
                <p className="package-card__summary">{pkg.summary}</p>
                <ul className="package-card__list">
                  {pkg.focus.map((point) => (
                    <li key={point} className="package-card__item">
                      <span className="service-card__cap-bullet" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.highlighted ? 'primary' : 'glass'}
                  icon={ArrowRight}
                  className="package-card__btn"
                  onClick={() => handlePackageSelect(pkg)}
                >
                  Select {pkg.name} Scope
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
