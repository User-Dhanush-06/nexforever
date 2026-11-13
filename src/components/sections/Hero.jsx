import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import Button from '../ui/Button';
import { siteConfig } from '../../data/config';

export default function Hero({ publicSettings }) {
  const heroRef = useRef(null);
  const availabilityText =
    publicSettings?.brand?.availability || siteConfig.brand.availability;

  const marqueeItems = [
    'Web Development',
    'Video Production',
    'Creative Design',
    'Digital Marketing',
    'Brand Identity',
    'Web Applications',
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        y: 36,
        opacity: 0,
        duration: 1.0,
        stagger: 0.13,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="home" className="hero-section" aria-label="Hero Introduction">
      <div className="container hero-container">
        <div className="hero__grid">
          {/* Left Editorial Content (Dedicated Text Column) */}
          <div className="hero__content">
            <div className="hero__eyebrow-row hero-anim">
              <span className="hero__eyebrow">
                Creative Technology Studio
              </span>
              <span className="hero__status-pill">
                <span className="hero__status-dot" aria-hidden="true" />
                <span>{availabilityText}</span>
              </span>
            </div>

            <h1 className="hero__title hero-anim">
              Built for
              <br />
              <span className="text-outline-mint hero__nowrap">What's Next.</span>
              <br />
              <span className="hero__nowrap">Made to Last.</span>
            </h1>

            <p className="hero__description hero-anim">
              A collaborative creative technology studio uniting web engineering,
              visual storytelling, brand design and growth strategy for businesses,
              startups and content creators.
            </p>

            <div className="hero__actions hero-anim">
              <Button href="#portfolio" variant="primary" icon={ArrowRight}>
                Explore Our Work
              </Button>
              <Button href="#contact" variant="glass">
                Let's Talk
              </Button>
            </div>

            {/* Moving Services Marquee Ticker */}
            <div className="hero__marquee hero-anim" aria-label="Core Capabilities">
              <div className="hero__marquee-track">
                {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                  <span
                    key={`${item}-${idx}`}
                    className="hero__marquee-item"
                    aria-hidden={idx >= marqueeItems.length}
                  >
                    <span className="hero__marquee-dot" aria-hidden="true" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Stage: Dedicated space for 3D Chrome Infinity Sculpture */}
          <div className="hero__visual" aria-hidden="true" />
        </div>

        {/* Scroll Cue Indicator */}
        <div className="hero__scroll-cue hero-anim" aria-hidden="true">
          <span className="hero__scroll-text">Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
