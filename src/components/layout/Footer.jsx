import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe
} from 'lucide-react';
import { siteConfig } from '../../data/config';

export default function Footer() {
  const [logoMissing, setLogoMissing] = useState(false);
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    behance: Globe,
  };

  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Info */}
          <div className="footer__brand-col">
            <div className="footer__brand-row">
              {/* LOGO REPLACEMENT: Replace public/images/nexforever-logo.png with your official transparent PNG */}
              {!logoMissing ? (
                <img
                  src={siteConfig.brand.logo}
                  alt={siteConfig.brand.name}
                  className="footer__logo"
                  onError={() => setLogoMissing(true)}
                />
              ) : (
                <span className="logo-placeholder logo-placeholder--sm" aria-hidden="true" />
              )}
              <span className="footer__brand-name">{siteConfig.brand.name}</span>
            </div>
            <p className="footer__tagline">{siteConfig.brand.tagline}</p>
            <p className="footer__desc">{siteConfig.brand.description}</p>

            {/* Social Links */}
            <div className="footer__socials" aria-label="Social Media Links">
              {Object.entries(siteConfig.social).map(([key, item]) => {
                const IconComponent = socialIcons[key] || Globe;
                const hasUrl = item.url && !item.url.startsWith('[');
                return (
                  <a
                    key={key}
                    href={hasUrl ? item.url : '#'}
                    className="footer__social-btn"
                    aria-label={item.label}
                    target={hasUrl ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigate</h4>
            <ul className="footer__links" role="list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Our Work</a></li>
              <li><a href="#approach">Our Approach</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links" role="list">
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">Video Production</a></li>
              <li><a href="#services">Creative Design</a></li>
              <li><a href="#services">Digital Marketing</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <Mail size={15} className="footer__contact-icon" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="footer__contact-item">
                <MessageSquare size={15} className="footer__contact-icon" />
                <span>{siteConfig.contact.whatsapp}</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={15} className="footer__contact-icon" />
                <span>{siteConfig.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} {siteConfig.brand.name}. All rights reserved.
          </p>
          <p className="footer__bottom-motto">
            {siteConfig.brand.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
