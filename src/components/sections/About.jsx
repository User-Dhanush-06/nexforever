import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Plus, Minus, Compass } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';

export default function About() {
  const [expandedValue, setExpandedValue] = useState('01');

  const values = [
    {
      number: '01',
      title: 'Innovation',
      icon: Sparkles,
      description:
        'Exploring better ways to turn ideas into practical digital solutions.',
      detail:
        'We adopt modern architectures, interactive 3D visuals and purposeful engineering so products feel ahead of the curve without sacrificing stability.',
    },
    {
      number: '02',
      title: 'Creativity',
      icon: Layers,
      description:
        'Combining thoughtful design and storytelling to create memorable experiences.',
      detail:
        'From editorial typography and brand systems to cinematic motion, every visual frame is crafted to communicate clearly and stand apart.',
    },
    {
      number: '03',
      title: 'Quality',
      icon: ShieldCheck,
      description:
        'Focusing on details, reliability and delivering work that matters.',
      detail:
        'Clean code, responsive precision across devices and meticulous QA ensure everything we ship performs reliably over time.',
    },
  ];

  const pillars = [
    'Digital Platforms',
    'Visual Storytelling',
    'Brand Architecture',
    'Audience Growth',
  ];

  const partnerSectors = [
    'Startups & Founders',
    'Growing Businesses',
    'Creators & Personal Brands',
    'Digital-First Teams',
  ];

  return (
    <section id="about" className="section about-section" aria-label="About NexForever">
      <div className="container">
        <div className="about__intro-grid">
          <div className="about__heading-col">
            <SectionHeading
              eyebrow="Who We Are"
              title={<>More Than<br /><span className="text-outline-mint">Just Digital.</span></>}
            />

            {/* Visual Studio Synthesis Element */}
            <GlassCard className="about__visual-card" hoverEffect={false}>
              <div className="about__orbit-badge" aria-hidden="true">
                <span className="about__orbit-ring" />
                <Compass size={20} className="accent-mint" />
              </div>
              <div className="about__visual-copy">
                <span className="about__visual-label">Small Collaborative Studio</span>
                <p className="about__visual-text">
                  Accessible, flexible collaboration uniting web engineering, video production, brand design and digital marketing in one cohesive studio.
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="about__text-col">
            <p className="about__lead">
              Technology and creativity working closely together — tailored for growing brands and independent creators.
            </p>
            <p className="about__body">
              NexForever operates as a focused collaborative creative technology studio. We pair premium design craft with practical, adaptable solutions so ambitious businesses and creators can launch with confidence.
            </p>
            <p className="about__body">
              From custom digital platforms and brand systems to engaging visual production, everything we create is built to communicate value clearly and endure over time.
            </p>

            <div className="about__meta-block">
              <span className="about__meta-label">Core Disciplines</span>
              <div className="about__pillars" aria-label="Studio Focus Areas">
                {pillars.map((pillar) => (
                  <span key={pillar} className="about__pillar-pill">
                    {pillar}
                  </span>
                ))}
              </div>
            </div>

            <div className="about__meta-block">
              <span className="about__meta-label">Who We Build For</span>
              <div className="about__pillars" aria-label="Who We Serve">
                {partnerSectors.map((sector) => (
                  <span key={sector} className="about__pillar-pill about__pillar-pill--subtle">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Interactive Value Cards */}
        <div className="about__values-grid">
          {values.map((val) => {
            const Icon = val.icon;
            const isExpanded = expandedValue === val.number;
            return (
              <GlassCard
                key={val.number}
                tilt
                tiltIntensity={4}
                className={`value-card ${isExpanded ? 'value-card--active' : ''}`}
              >
                <button
                  type="button"
                  className="value-card__trigger"
                  onClick={() => setExpandedValue(isExpanded ? null : val.number)}
                  aria-expanded={isExpanded}
                >
                  <div className="value-card__top">
                    <span className="value-card__number">{val.number}</span>
                    <div className="value-card__icon-wrap" aria-hidden="true">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="value-card__title">{val.title}</h3>
                  <p className="value-card__desc">{val.description}</p>

                  <div className={`value-card__extra ${isExpanded ? 'value-card__extra--open' : ''}`}>
                    <p className="value-card__detail">{val.detail}</p>
                  </div>

                  <span className="value-card__toggle-hint">
                    {isExpanded ? <Minus size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                    <span>{isExpanded ? 'Show less' : 'Tap to explore'}</span>
                  </span>
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
