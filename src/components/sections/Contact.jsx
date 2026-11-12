import React, { useState } from 'react';
import { Mail, MessageSquare, Instagram, MapPin, Send, AlertCircle } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { siteConfig } from '../../data/config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  const isEmailConfigured = siteConfig.contact.email && !siteConfig.contact.email.startsWith('[');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please enter a message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!isEmailConfigured) {
      setStatusMessage({
        type: 'warning',
        text: 'The contact form is not yet configured. Add your email address in src/data/config.js to activate mailto submissions.'
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
      text: 'Opening your default email client to complete your message.'
    });
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
                  <a
                    href={isEmailConfigured ? `mailto:${siteConfig.contact.email}` : '#'}
                    className="contact__item-val"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <span className="contact__item-label">WhatsApp</span>
                  <span className="contact__item-val">
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
                  <span className="contact__item-val">
                    {siteConfig.contact.instagram}
                  </span>
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
                  <strong>Setup required:</strong> Add your email in <code>src/data/config.js</code> to activate direct submissions.
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="">Select a service (optional)</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Video Production & Content Creation">Video Production & Content Creation</option>
                  <option value="Creative Design & Branding">Creative Design & Branding</option>
                  <option value="Digital Marketing">Digital Marketing</option>
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
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <Button type="submit" variant="primary" icon={Send} className="btn-submit">
                Send Message
              </Button>

              {statusMessage && (
                <div
                  className={`contact__status contact__status--${statusMessage.type}`}
                  role="status"
                >
                  {statusMessage.text}
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
