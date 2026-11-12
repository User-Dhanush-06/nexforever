import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../../data/config';
import Button from '../ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoMissing, setLogoMissing] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Our Work', href: '#portfolio', id: 'portfolio' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      const scrollPos = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.offsetTop <= scrollPos) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="site-header">
        <nav
          className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
          aria-label="Main Navigation"
        >
          <div className="nav__inner">
            {/* Brand Logo & Name */}
            <a href="#home" className="nav__brand" aria-label="NexForever Home">
              {/* LOGO REPLACEMENT: Replace public/images/nexforever-logo.png with your official transparent PNG */}
              {!logoMissing ? (
                <img
                  src={siteConfig.brand.logo}
                  alt={siteConfig.brand.name}
                  className="nav__logo"
                  onError={() => setLogoMissing(true)}
                />
              ) : (
                <span className="logo-placeholder" aria-hidden="true" />
              )}
              <span className="nav__name">{siteConfig.brand.name}</span>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="nav__links" role="list">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className={`nav__link ${activeSection === link.id ? 'nav__link--active' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA & Mobile Hamburger */}
            <div className="nav__actions">
              <Button href="#contact" variant="primary" className="nav__cta">
                Let's Talk
              </Button>
              <button
                className="nav__hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu__inner">
          <ul className="mobile-menu__links" role="list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`mobile-menu__link ${activeSection === link.id ? 'mobile-menu__link--active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__footer">
            <Button
              href="#contact"
              variant="primary"
              className="mobile-menu__cta"
              onClick={() => setMobileOpen(false)}
            >
              Let's Talk
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
