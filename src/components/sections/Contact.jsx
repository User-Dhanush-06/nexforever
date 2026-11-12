import React, { useEffect, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Instagram,
  MapPin,
  Send,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { siteConfig } from '../../data/config';
import { servicesData } from '../../data/services';

export default function Contact({ preselectedService = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Sync preselected service when user clicks "Enquire" from Services section
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const isEmailConfigured =
    siteConfig.contact.email && !siteConfig.contact.email.startsWith('[');
  const isWhatsappConfigured =
    siteConfig.contact.whatsapp && !siteConfig.contact.whatsapp.startsWith('[');
  const isInstagramConfigured =
    siteConfig.contact.instagram && !siteConfig.contact.instagram.startsWith('[');

  const validateField = (field, value) => {
    if (field === 'name' && !value.trim()) return 'Please enter your name.';
    if (field === 'email') {
      if (!value.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return 'Please enter a valid email address.';
      }
    }
    if (field === 'message' && !value.trim()) return 'Please enter a message.';
    return '';
  };

  const validateAll = () => {
    const errs = {};
    ['name', 'email', 'message'].forEach((field) => {
      const msg = validateField(field, formData[field]);
      if (msg) errs[field] = msg;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const nextErr = validateField(field, value);
      setErrors((prev) => {
        const copy = { ...prev };
        if (nextErr) copy[field] = nextErr;
        else delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validateAll()) return;

    const completeSubmission = () => {
      setIsSubmitting(false);
      if (!isEmailConfigured) {
        setStatusMessage({
          type: 'warning',
          text: 'Direct email dispatch requires configuring your email in src/data/config.js. Your enquiry details were validated locally.',
        });
        return;
      }

      const subject = encodeURIComponent(
        `NexForever Enquiry from ${formData.name}${formData.service ? ` (${formData.service})` : ''}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service || 'General Enquiry'}\n\nMessage:\n${formData.message}`
      );

      window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
      setStatusMessage({
        type: 'success',
        text: 'Validation passed — opening your default email client to complete and send your enquiry.',
      });
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      completeSubmission();
      return;
    }

    setIsSubmitting(true);
    setTimeout(completeSubmission, 360);
  };

  return (
    <section id="contact" className="section contact-section" aria-label="Contact Us">
      <div className="container">
        <div className="contact__grid">
          {/* Left: Contact Info */}
          <div className="contact__info">
            <SectionHeading
              eyebrow="Get in Touch"
              title={<>Have an idea?<br />Let's build it.</>}
              subtitle="Have a project in mind? Let's turn your ideas into something meaningful."
            />

            <div className="contact__details">
              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="contact__item-label">Email</span>
                  {isEmailConfigured ? (
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="contact__item-val"
                    >
                      {siteConfig.contact.email}
                    </a>
                  ) : (
                    <span className="contact__item-val contact__item-val--placeholder">
                      {siteConfig.contact.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <span className="contact__item-label">WhatsApp</span>
                  <span
                    className={`contact__item-val ${!isWhatsappConfigured ? 'contact__item-val--placeholder' : ''}`}
                  >
                    {siteConfig.contact.whatsapp}
                  </span>
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <Instagram size={18} />
                </div>
                <div>
                  <span className="contact__item-label">Instagram</span>
                  {isInstagramConfigured ? (
                    <a
                      href={siteConfig.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__item-val"
                    >
                      {siteConfig.contact.instagram}
                    </a>
                  ) : (
                    <span className="contact__item-val contact__item-val--placeholder">
                      {siteConfig.contact.instagram}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="contact__item-label">Location</span>
                  <span className="contact__item-val">
                    {siteConfig.contact.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Glass Contact Form */}
          <GlassCard className="contact__form-card" hoverEffect={false}>
            {!isEmailConfigured && (
              <div className="contact__notice" role="alert">
                <AlertCircle size={16} className="contact__notice-icon" />
                <span>
                  <strong>Setup required:</strong> Add your email in <code>src/data/config.js</code> to activate direct mailto submissions.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="contact__form">
              <div className="form-row">
                <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
                  <label htmlFor="contact-name" className="form-label">
                    Name <span className="accent-mint">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    className="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
                  <label htmlFor="contact-email" className="form-label">
                    Email <span className="accent-mint">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={formData.email}
                    aria-invalid={Boolean(errors.email)}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-service" className="form-label">
                  Service Interested In
                </label>
                <select
                  id="contact-service"
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => handleFieldChange('service', e.target.value)}
                >
                  <option value="">Select a service (optional)</option>
                  {servicesData.map((svc) => (
                    <option key={svc.number} value={svc.title}>
                      {svc.title}
                    </option>
                  ))}
                  <option value="Other / General Enquiry">Other / General Enquiry</option>
                </select>
              </div>

              <div className={`form-group ${errors.message ? 'form-group--error' : ''}`}>
                <label htmlFor="contact-message" className="form-label">
                  Message <span className="accent-mint">*</span>
                </label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  rows={5}
                  placeholder="Tell us about your project or idea..."
                  value={formData.message}
                  aria-invalid={Boolean(errors.message)}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <Button
                type="submit"
                variant="primary"
                icon={isSubmitting ? Loader2 : Send}
                className={`btn-submit ${isSubmitting ? 'btn-submit--loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Preparing Message...' : 'Send Message'}
              </Button>

              {statusMessage && (
                <div
                  className={`contact__status contact__status--${statusMessage.type}`}
                  role="status"
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <AlertCircle size={16} aria-hidden="true" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
