import React, { useEffect, useRef, useState } from 'react';
import { Compass, Layers, Cpu, Rocket } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

export default function Approach() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.25);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Discover',
      icon: Compass,
      text: 'Understanding your business, goals and project requirements.',
      focus: 'Audience insights, technical audit & project scope definition.',
    },
    {
      number: '02',
      title: 'Strategize',
      icon: Layers,
      text: 'Planning the right approach, architecture and defining the solution.',
      focus: 'System architecture, visual direction & creative roadmap.',
    },
    {
      number: '03',
      title: 'Create',
      icon: Cpu,
      text: 'Bringing ideas to life through development, design and production.',
      focus: 'Interactive engineering, visual content & iterative polish.',
    },
    {
      number: '04',
      title: 'Deliver',
      icon: Rocket,
      text: 'Providing the final polished solution with attention to quality and detail.',
      focus: 'Cross-device verification, optimization & smooth launch.',
    },
  ];

  // Scroll-driven timeline illumination across #approach section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Map section progression across viewport into 0..1
      const raw = (vh * 0.72 - rect.top) / (rect.height * 0.75);
      const clamped = Math.max(0, Math.min(1, raw));
      setScrollProgress(clamped);

      const stepIdx = Math.min(3, Math.floor(clamped * 3.99));
      if (clamped > 0.05) {
        setActiveStep(stepIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="section approach-section"
      aria-label="Our Approach"
    >
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="From Idea to Impact."
          subtitle="A structured four-stage workflow designed for clarity, craft and dependable delivery."
          align="center"
        />

        <div
          className="approach__timeline"
          role="list"
          style={{ '--timeline-progress': `${(scrollProgress * 100).toFixed(1)}%` }}
        >
          <div className="approach__track" aria-hidden="true">
            <div className="approach__track-fill" />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isReached = idx <= activeStep || scrollProgress >= idx / 3.4;

            return (
              <button
                key={step.number}
                type="button"
                className={`approach__step ${isReached ? 'approach__step--reached' : ''} ${isActive ? 'approach__step--active' : ''}`}
                role="listitem"
                onClick={() => setActiveStep(idx)}
                aria-pressed={isActive}
              >
                <div className="approach__node">
                  <span className="approach__number">{step.number}</span>
                  <span className="approach__node-icon" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                </div>
                <div className="approach__content">
                  <h3 className="approach__title">{step.title}</h3>
                  <p className="approach__text">{step.text}</p>
                  <span className="approach__focus">{step.focus}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
