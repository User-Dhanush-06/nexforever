import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
} from 'lucide-react';
import { siteConfig } from '../../data/config';
import {
  isConfiguredValue,
  sanitizeExternalUrl,
  formatInstagramUrl,
  formatWhatsAppUrl,
  formatEmailHref,
} from '../../utils/linkHelpers';

const socialMeta = {
  instagram: { label: 'Instagram', Icon: Instagram },
  linkedin: { label: 'LinkedIn', Icon: Linkedin },
  twitter: { label: 'X / Twitter', Icon: Twitter },
  youtube: { label: 'YouTube', Icon: Youtube },
  behance: { label: 'Behance', Icon: Globe },
};

export default function Footer({ publicSettings }) {
  const [logoMissing, setLogoMissing] = useState(false);
  const currentYear = new Date().getFullYear();

  const brandName = publicSettings?.brand?.name || siteConfig.brand.name;
  const tagline = publicSettings?.brand?.tagline || siteConfig.brand.tagline;
  const emailVal = publicSettings?.contact?.email || '';
  const whatsappVal = publicSettings?.contact?.whatsapp || '';
  const locationVal = publicSettings?.contact?.location || siteConfig.contact.location;
  const locationMapUrl = publicSettings?.contact?.locationMapUrl || '';

  const emailHref = formatEmailHref(emailVal);
  const whatsappHref = formatWhatsAppUrl(whatsappVal, `Hi ${brandName}, I would like to enquire about a project.`);
  const locationMapHref = sanitizeExternalUrl(locationMapUrl);

  const socialSource = publicSettings?.social || {};

  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Info */}
          <div className="footer__brand-col">
            <div className="footer__brand-row">
              {!logoMissing ? (
                <img
                  src={siteConfig.brand.logo}
                  alt={brandName}
                  className="footer__logo"
                  onError={() => setLogoMissing(true)}
                />
              ) : (
                <span className="logo-placeholder logo-placeholder--sm" aria-hidden="true" />
              )}
              <span className="footer__brand-name">{brandName}</span>
            </div>
            <p className="footer__tagline">{tagline}</p>
            <p className="footer__desc">{siteConfig.brand.description}</p>

            {/* Social Links (only active configured URLs; no dead or placeholder buttons) */}
            <div className="footer__socials" aria-label="Social Media Links">
              {Object.entries(socialMeta)
                .filter(([key]) => {
                  const rawUrl = socialSource[key] ?? siteConfig.social[key]?.url ?? '';
                  const safeUrl = key === 'instagram' ? formatInstagramUrl(rawUrl) : sanitizeExternalUrl(rawUrl);
                  return Boolean(safeUrl);
                })
                .map(([key, meta]) => {
                  const IconComponent = meta.Icon;
                  const rawUrl = socialSource[key] ?? siteConfig.social[key]?.url ?? '';
                  const safeUrl = key === 'instagram' ? formatInstagramUrl(rawUrl) : sanitizeExternalUrl(rawUrl);

                  return (
                    <a
                      key={key}
                      href={safeUrl}
                      className="footer__social-btn"
                      aria-label={meta.label}
                      target="_blank"
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
                {emailHref ? (
                  <a href={emailHref}>{emailVal}</a>
                ) : (
                  <span>{isConfiguredValue(emailVal) ? emailVal : 'Direct Inquiry Form'}</span>
                )}
              </div>
              <div className="footer__contact-item">
                <MessageSquare size={15} className="footer__contact-icon" />
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    {whatsappVal}
                  </a>
                ) : (
                  <span>{isConfiguredValue(whatsappVal) ? whatsappVal : 'Studio Consultation'}</span>
                )}
              </div>
              <div className="footer__contact-item">
                <MapPin size={15} className="footer__contact-icon" />
                {locationMapHref ? (
                  <a href={locationMapHref} target="_blank" rel="noopener noreferrer">
                    {locationVal}
                  </a>
                ) : (
                  <span>{locationVal}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar (Public clean bar without exposed Admin link) */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} {brandName}. All rights reserved.
          </p>
          <p className="footer__bottom-motto">{tagline}</p>
        </div>
      </div>
    </footer>
  );
}
