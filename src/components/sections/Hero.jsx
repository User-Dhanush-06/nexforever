import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import Button from '../ui/Button';

export default function Hero() {
  const heroRef = useRef(null);

  const capabilities = [
    'Web Development',
    'Video Production',
    'Creative Design',
    'Digital Marketing'
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        y: 36,
        opacity: 0,
        duration: 1.0,
        stagger: 0.14,
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
          {/* Left Editorial Content */}
          <div className="hero__content">
            <div className="hero__eyebrow-wrap hero-anim">
              <span className="hero__eyebrow">
                Creative Technology Studio
              </span>
            </div>

            <h1 className="hero__title hero-anim">
              Built for
              <br />
              <span className="accent-mint hero__nowrap">What's Next.</span>
              <br />
              <span className="hero__nowrap">Made to Last.</span>
            </h1>

            <p className="hero__description hero-anim">
              We bring ideas to life through technology, creativity and digital
              experiences that help businesses move forward.
            </p>

            <div className="hero__actions hero-anim">
              <Button href="#portfolio" variant="primary" icon={ArrowRight}>
                Explore Our Work
              </Button>
              <Button href="#contact" variant="glass">
                Let's Talk
              </Button>
            </div>

            {/* Service Capability Strip */}
            <div className="hero__capabilities hero-anim" aria-label="Core Capabilities">
              {capabilities.map((cap, i) => (
                <React.Fragment key={cap}>
                  <span className="hero__cap-item">{cap}</span>
                  {i < capabilities.length - 1 && (
                    <span className="hero__cap-separator" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Visual Area: Space allowing the 3D infinity sculpture to breathe */}
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
