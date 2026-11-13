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
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { siteConfig } from '../../data/config';
import { servicesData, packagesData } from '../../data/services';
import { submitEnquiry } from '../../services/apiClient';
import {
  isConfiguredValue,
  sanitizeExternalUrl,
  formatInstagramUrl,
  formatWhatsAppUrl,
  formatEmailHref,
} from '../../utils/linkHelpers';

export default function Contact({
  preselectedService = '',
  preselectedAudience = '',
  preselectedPackage = '',
  publicSettings,
}) {
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    audience: 'Business / Brand',
    packageName: 'Custom Scope',
    service: '',
    budget: 'Flexible / To Be Discussed',
    timeline: 'Flexible / To Be Discussed',
    message: '',
    website: '', // Anti-spam honeypot field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const audienceChoices = [
    'Business / Brand',
    'Creator / Personal Brand',
    'Startup / Founder',
    'Other / Exploring',
  ];

  const packageChoices = [
    ...packagesData.map((p) => p.name),
    'Custom Scope',
  ];

  const budgetOptions = [
    'Flexible / To Be Discussed',
    'Starter Scope',
    'Standard Studio Scope',
    'Comprehensive / Custom',
  ];

  const timelineOptions = [
    'Flexible / To Be Discussed',
    'Priority Launch Goal',
    'Standard Planning Window',
    'Phased Collaboration',
  ];

  const serviceChoices = [
    ...servicesData.map((s) => s.title),
    'Other / General Enquiry',
  ];

  // Sync selections triggered from Services, Audience Tracks, or Packages
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedAudience) {
      setFormData((prev) => ({ ...prev, audience: preselectedAudience }));
    }
  }, [preselectedAudience]);

  useEffect(() => {
    if (preselectedPackage) {
      setFormData((prev) => ({ ...prev, packageName: preselectedPackage }));
    }
  }, [preselectedPackage]);

  const contactData = {
    email: publicSettings?.contact?.email || '',
    whatsapp: publicSettings?.contact?.whatsapp || '',
    instagram: publicSettings?.contact?.instagram || '',
    location: publicSettings?.contact?.location || siteConfig.contact.location,
    locationMapUrl: publicSettings?.contact?.locationMapUrl || '',
  };

  const emailHref = formatEmailHref(contactData.email);
  const whatsappMsg = `Hi NexForever, I'd like to discuss a project. Profile: ${formData.audience}. Package: ${formData.packageName}.${formData.service ? ` Service: ${formData.service}.` : ''}${formData.budget ? ` Scope: ${formData.budget}.` : ''}`;
  const whatsappHref = formatWhatsAppUrl(contactData.whatsapp, whatsappMsg);
  const instagramHref = formatInstagramUrl(contactData.instagram);
  const instagramDisplay = isConfiguredValue(contactData.instagram)
    ? (contactData.instagram.startsWith('@')
        ? contactData.instagram
        : contactData.instagram.includes('/')
          ? '@' + contactData.instagram.split('/').filter(Boolean).pop()
          : '@' + contactData.instagram)
    : 'Direct Studio Channel';
  const locationMapHref = sanitizeExternalUrl(contactData.locationMapUrl);

  const validateField = (field, value) => {
    if (field === 'name' && !value.trim()) return 'Please enter your name.';
    if (field === 'email') {
      if (!value.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return 'Please enter a valid email address.';
      }
    }
    if (field === 'message' && !value.trim()) return 'Please describe your project or idea.';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validateAll()) {
      setWizardStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        audienceProfile: formData.audience,
        packageName: formData.packageName,
        serviceInterest: formData.service || 'General Enquiry',
        budgetScope: formData.budget,
        planningPreference: formData.timeline,
        message: formData.message.trim(),
        website: formData.website,
      });

      setStatusMessage({
        type: 'success',
        text: `Enquiry received and saved${saved?.referenceCode ? ` (Ref: ${saved.referenceCode})` : ''}. Our studio team will follow up shortly.`,
      });
      setFormData((prev) => ({
        ...prev,
        name: '',
        email: '',
        message: '',
        website: '',
      }));
      setErrors({});
    } catch (err) {
      if (err?.errors && typeof err.errors === 'object') {
        setErrors(err.errors);
      }
      setStatusMessage({
        type: err?.status === 429 ? 'warning' : 'error',
        text: err?.message || 'Unable to submit your enquiry right now. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section" aria-label="Contact Us">
      <div className="container">
        <div className="contact__grid">
          {/* Left: Contact Info */}
          <div className="contact__info">
            <SectionHeading
              eyebrow="Get in Touch"
              title={<>Have an idea?<br /><span className="text-outline-mint">Let's build it.</span></>}
              subtitle="Use our quick Project Inquiry Wizard to share your service needs, planning scope and idea."
            />

            <div className="contact__details">
              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="contact__item-label">Email</span>
                  {emailHref ? (
                    <a
                      href={emailHref}
                      className="contact__item-val"
                    >
                      {contactData.email}
                    </a>
                  ) : (
                    <span className="contact__item-val">
                      {isConfiguredValue(contactData.email) ? contactData.email : 'Direct Studio Desk'}
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
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__item-val"
                    >
                      Chat on WhatsApp ({contactData.whatsapp})
                    </a>
                  ) : (
                    <span className="contact__item-val">
                      {isConfiguredValue(contactData.whatsapp) ? contactData.whatsapp : 'Direct Client Line'}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact__item">
                <div className="contact__item-icon" aria-hidden="true">
                  <Instagram size={18} />
                </div>
                <div>
                  <span className="contact__item-label">Instagram</span>
                  {instagramHref ? (
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__item-val"
                    >
                      {instagramDisplay}
                    </a>
                  ) : (
                    <span className="contact__item-val">
                      {instagramDisplay}
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
                  {locationMapHref ? (
                    <a
                      href={locationMapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__item-val"
                    >
                      {contactData.location}
                    </a>
                  ) : (
                    <span className="contact__item-val">
                      {contactData.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {whatsappHref && (
              <div className="contact__whatsapp-wrap">
                <Button
                  href={whatsappHref}
                  target="_blank"
                  variant="glass"
                  icon={MessageSquare}
                >
                  Direct WhatsApp Enquiry
                </Button>
              </div>
            )}
          </div>

          {/* Right: 3-Step Project Inquiry Wizard */}
          <GlassCard className="contact__form-card" hoverEffect={false}>
            {/* Wizard Step Progress Navigation */}
            <div className="wizard-steps" role="tablist" aria-label="Inquiry Wizard Steps">
              {[
                { id: 1, num: '01', label: 'Service' },
                { id: 2, num: '02', label: 'Planning' },
                { id: 3, num: '03', label: 'Details' },
              ].map((step) => {
                const isActive = wizardStep === step.id;
                const isDone = wizardStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`wizard-step-btn ${isActive ? 'wizard-step-btn--active' : ''} ${isDone ? 'wizard-step-btn--done' : ''}`}
                    onClick={() => setWizardStep(step.id)}
                  >
                    <span className="wizard-step-num">
                      {isDone ? <Check size={12} aria-hidden="true" /> : step.num}
                    </span>
                    <span className="wizard-step-label">{step.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} noValidate className="contact__form">
              {/* Anti-bot honeypot field - invisible to genuine users */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
              />
              {/* Step 1: Audience & Service Selection */}
              {wizardStep === 1 && (
                <div className="wizard-pane" role="tabpanel" aria-label="Step 1: Select Service">
                  <div className="wizard-pane__header">
                    <h3 className="wizard-pane__title">Who &amp; What Are We Building?</h3>
                    <p className="wizard-pane__sub">
                      Tell us whether you&apos;re inquiring for a brand or personal platform, and select a primary service.
                    </p>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Audience Profile</span>
                    <div className="wizard-options wizard-options--compact">
                      {audienceChoices.map((aud) => (
                        <button
                          key={aud}
                          type="button"
                          className={`wizard-option-pill ${formData.audience === aud ? 'wizard-option-pill--selected' : ''}`}
                          onClick={() => handleFieldChange('audience', aud)}
                          aria-pressed={formData.audience === aud}
                        >
                          {aud}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Primary Service</span>
                    <div className="wizard-options">
                      {serviceChoices.map((choice) => {
                        const selected = formData.service === choice;
                        return (
                          <button
                            key={choice}
                            type="button"
                            className={`wizard-option-pill ${selected ? 'wizard-option-pill--selected' : ''}`}
                            onClick={() => handleFieldChange('service', choice)}
                            aria-pressed={selected}
                          >
                            <span>{choice}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="wizard-nav">
                    <span className="wizard-nav__hint">
                      Selected: <strong>{formData.service || 'Optional'}</strong>
                    </span>
                    <Button
                      variant="primary"
                      icon={ArrowRight}
                      onClick={() => setWizardStep(2)}
                    >
                      Next: Planning
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Customizable Package & Planning Preferences */}
              {wizardStep === 2 && (
                <div className="wizard-pane" role="tabpanel" aria-label="Step 2: Package and Planning">
                  <div className="wizard-pane__header">
                    <h3 className="wizard-pane__title">Package &amp; Scope Preferences</h3>
                    <p className="wizard-pane__sub">
                      Packages are customizable starting points — never fixed subscriptions or templates.
                    </p>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Customizable Package Framework</span>
                    <div className="wizard-options wizard-options--compact">
                      {packageChoices.map((pkg) => (
                        <button
                          key={pkg}
                          type="button"
                          className={`wizard-option-pill ${formData.packageName === pkg ? 'wizard-option-pill--selected' : ''}`}
                          onClick={() => handleFieldChange('packageName', pkg)}
                          aria-pressed={formData.packageName === pkg}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Estimated Scope Range (Optional)</span>
                    <div className="wizard-options wizard-options--compact">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`wizard-option-pill ${formData.budget === opt ? 'wizard-option-pill--selected' : ''}`}
                          onClick={() => handleFieldChange('budget', opt)}
                          aria-pressed={formData.budget === opt}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Planning Preference (Optional)</span>
                    <div className="wizard-options wizard-options--compact">
                      {timelineOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`wizard-option-pill ${formData.timeline === opt ? 'wizard-option-pill--selected' : ''}`}
                          onClick={() => handleFieldChange('timeline', opt)}
                          aria-pressed={formData.timeline === opt}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="wizard-nav">
                    <Button
                      variant="glass"
                      icon={ArrowLeft}
                      onClick={() => setWizardStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      icon={ArrowRight}
                      onClick={() => setWizardStep(3)}
                    >
                      Next: Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Name, Email & Description */}
              {wizardStep === 3 && (
                <div className="wizard-pane" role="tabpanel" aria-label="Step 3: Contact Details">
                  {/* Selection Summary */}
                  <div className="wizard-summary">
                    <span className="wizard-summary__chip">{formData.audience}</span>
                    <span className="wizard-summary__chip">{formData.packageName}</span>
                    <span className="wizard-summary__chip">
                      {formData.service || 'General Enquiry'}
                    </span>
                    <span className="wizard-summary__chip">{formData.budget}</span>
                  </div>

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
                      Project Description <span className="accent-mint">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      className="form-textarea"
                      rows={4}
                      placeholder="Tell us about your project goals, target audience or idea..."
                      value={formData.message}
                      aria-invalid={Boolean(errors.message)}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <div className="wizard-nav wizard-nav--submit">
                    <Button
                      variant="glass"
                      icon={ArrowLeft}
                      onClick={() => setWizardStep(2)}
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      icon={isSubmitting ? Loader2 : Send}
                      className={`btn-submit ${isSubmitting ? 'btn-submit--loading' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending Enquiry...' : 'Send Enquiry'}
                    </Button>
                  </div>

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
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
