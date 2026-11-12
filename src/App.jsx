import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import SceneBackground from './components/scene/SceneBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Portfolio from './components/sections/Portfolio';
import Approach from './components/sections/Approach';
import Contact from './components/sections/Contact';
import { useScrollProgress } from './hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const shellRef = useRef(null);
  const { progress, showBackToTop, scrollToTop } = useScrollProgress();

  // Initialize Lenis smooth scroll & GSAP ScrollTrigger reveals
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Scroll-triggered reveals for sections
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.section-header, .about__text-col, .contact__info').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.about__values-grid, .services-grid, .approach__timeline').forEach((grid) => {
        const items = grid.children;
        gsap.from(items, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, shellRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={shellRef} className="site-shell">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* 3D WebGL Background Scene (Three.js + R3F) */}
      <SceneBackground />

      {/* Cinematic Ambient Overlay */}
      <div className="ambient-overlay" aria-hidden="true" />

      {/* Main Website Content Layer */}
      <div className="website-content">
        <Navbar />

        <main id="main-content">
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Approach />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Back to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top-btn ${showBackToTop ? 'back-to-top-btn--visible' : ''}`}
        aria-label="Back to Top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
