import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react';
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
import RobotAssistant from './components/assistant/RobotAssistant';
import { useScrollProgress } from './hooks/useScrollProgress';
import { fetchPublicSettings, fetchCurrentAdmin } from './services/apiClient';

const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const shellRef = useRef(null);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [publicSettings, setPublicSettings] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const { progress, showBackToTop, scrollToTop } = useScrollProgress();

  const isAdminRoute = currentPath.startsWith('/admin');

  const navigateTo = useCallback((path) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  }, []);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch public site settings whenever on or returning to public homepage
  useEffect(() => {
    if (isAdminRoute) return;
    const controller = new AbortController();
    fetchPublicSettings({ signal: controller.signal })
      .then((data) => {
        if (data) setPublicSettings(data);
      })
      .catch(() => {
        // Fallback smoothly to static defaults inside components
      });
    return () => controller.abort();
  }, [isAdminRoute]);

  // Verify admin session when navigating to /admin routes
  useEffect(() => {
    if (!isAdminRoute) return;
    if (adminUser) return;

    let active = true;
    setCheckingAuth(true);
    fetchCurrentAdmin()
      .then((user) => {
        if (active && user) {
          setAdminUser(user);
          if (currentPath === '/admin/login') {
            navigateTo('/admin');
          }
        }
      })
      .catch(() => {
        if (active) {
          setAdminUser(null);
          if (currentPath !== '/admin/login') {
            navigateTo('/admin/login');
          }
        }
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, [isAdminRoute, currentPath, adminUser, navigateTo]);

  // Initialize Lenis smooth scroll & GSAP ScrollTrigger reveals ONLY on public landing page
  useEffect(() => {
    if (isAdminRoute) return;
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
      gsap.utils.toArray('.section-header, .about__text-col, .contact__info, .about__visual-card').forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.85,
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
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.11,
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
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="admin-loading-shell">Loading NexForever Admin...</div>}>
        {checkingAuth ? (
          <div className="admin-loading-shell">Verifying Studio Session...</div>
        ) : currentPath === '/admin/login' || !adminUser ? (
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setAdminUser(user);
              navigateTo('/admin');
            }}
            onNavigate={navigateTo}
          />
        ) : (
          <AdminDashboardPage
            admin={adminUser}
            onLogout={() => setAdminUser(null)}
            onNavigate={navigateTo}
          />
        )}
      </Suspense>
    );
  }

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

      {/* Atmospheric Side Gradients, Architectural Grid & Vignette */}
      <div className="ambient-sides" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-overlay" aria-hidden="true" />

      {/* Main Website Content Layer */}
      <div className="website-content">
        <Navbar publicSettings={publicSettings} />

        <main id="main-content">
          <Hero publicSettings={publicSettings} />
          <About />
          <Services
            onEnquireService={setSelectedService}
            onSelectAudience={setSelectedAudience}
            onSelectPackage={setSelectedPackage}
          />
          <Portfolio />
          <Approach />
          <Contact
            preselectedService={selectedService}
            preselectedAudience={selectedAudience}
            preselectedPackage={selectedPackage}
            publicSettings={publicSettings}
          />
        </main>

        <Footer publicSettings={publicSettings} />
      </div>

      {/* Back to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top-btn ${showBackToTop ? 'back-to-top-btn--visible' : ''}`}
        aria-label="Back to Top"
      >
        <ArrowUp size={18} />
      </button>

      {/* Global Floating NexForever Studio Robot Assistant */}
      <RobotAssistant />
    </div>
  );
}
