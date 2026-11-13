import React, { useEffect, useRef, useState } from 'react';
import { Compass, Layers, Cpu, Rocket, ChevronDown, RefreshCw } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { fetchFaqs } from '../../services/apiClient';

const fallbackFaqs = [
  {
    id: 'fallback-1',
    question: 'How do we kick off a new project with NexForever?',
    answer: 'Start using the Project Inquiry Wizard in our Contact section. Once you share your service needs, planning scope and project idea, we review requirements together during the Discover stage.',
  },
  {
    id: 'fallback-2',
    question: 'Can we combine multiple studio services or customize Launch, Grow & Elevate?',
    answer: 'Yes. Launch, Grow and Elevate act as flexible starting points — never rigid subscriptions — allowing you to combine Web Development, Video Production, Creative Design and Digital Marketing around your real goals.',
  },
  {
    id: 'fallback-3',
    question: 'How are scope, investment and schedule determined?',
    answer: 'Every project is scoped transparently around your objectives and deliverables during Strategize, rather than relying on one-size-fits-all templates or fixed assumptions.',
  },
  {
    id: 'fallback-4',
    question: 'Do you support responsive websites and interactive visual experiences?',
    answer: 'Every digital experience we engineer is built mobile-first, tested across modern screen sizes and crafted with accessibility and smooth performance in mind.',
  },
];

export default function Approach() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.25);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [faqError, setFaqError] = useState(null);

  const steps = [
    {
      number: '01',
      title: 'Discover',
      icon: Compass,
      text: 'Understanding your business, goals and project requirements.',
      focus: 'Audience insights, technical audit & project scope definition.',
    },
    {
      number: '02',
      title: 'Strategize',
      icon: Layers,
      text: 'Planning the right approach, architecture and defining the solution.',
      focus: 'System architecture, visual direction & creative roadmap.',
    },
    {
      number: '03',
      title: 'Create',
      icon: Cpu,
      text: 'Bringing ideas to life through development, design and production.',
      focus: 'Interactive engineering, visual content & iterative polish.',
    },
    {
      number: '04',
      title: 'Deliver',
      icon: Rocket,
      text: 'Providing the final polished solution with attention to quality and detail.',
      focus: 'Cross-device verification, optimization & smooth launch.',
    },
  ];

  const loadFaqs = async (signal) => {
    try {
      setFaqError(null);
      const data = await fetchFaqs({ signal });
      if (Array.isArray(data)) {
        setFaqs(data);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setFaqError('Unable to refresh live FAQs.');
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadFaqs(controller.signal);
    return () => controller.abort();
  }, []);

  // Scroll-driven timeline illumination across #approach section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.72 - rect.top) / (rect.height * 0.6);
      const clamped = Math.max(0, Math.min(1, raw));
      setScrollProgress(clamped);

      const stepIdx = Math.min(3, Math.floor(clamped * 3.99));
      if (clamped > 0.05) {
        setActiveStep(stepIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="section approach-section"
      aria-label="Our Approach"
    >
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title={<>From Idea to <span className="text-outline-mint">Impact.</span></>}
          subtitle="A structured four-stage workflow designed for clarity, craft and dependable delivery."
          align="center"
        />

        <div
          className="approach__timeline"
          role="list"
          style={{ '--timeline-progress': `${(scrollProgress * 100).toFixed(1)}%` }}
        >
          <div className="approach__track" aria-hidden="true">
            <div className="approach__track-fill" />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isReached = idx <= activeStep || scrollProgress >= idx / 3.4;

            return (
              <button
                key={step.number}
                type="button"
                className={`approach__step ${isReached ? 'approach__step--reached' : ''} ${isActive ? 'approach__step--active' : ''}`}
                role="listitem"
                onClick={() => setActiveStep(idx)}
                aria-pressed={isActive}
              >
                <div className="approach__node">
                  <span className="approach__number">{step.number}</span>
                  <span className="approach__node-icon" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                </div>
                <div className="approach__content">
                  <h3 className="approach__title">{step.title}</h3>
                  <p className="approach__text">{step.text}</p>
                  <span className="approach__focus">{step.focus}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Concise Studio FAQ Strip */}
        <div className="faq-block" aria-label="Frequently Asked Questions">
          <div className="faq-block__header">
            <span className="section-eyebrow">Common Questions</span>
            <h3 className="faq-block__heading">Before We Begin</h3>
          </div>

          {faqError && (
            <div className="status-notice status-notice--subtle" role="status">
              <span>{faqError}</span>
              <button type="button" className="status-notice__retry" onClick={() => loadFaqs()}>
                <RefreshCw size={13} aria-hidden="true" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {faqs.length === 0 ? (
            <p className="faq-empty">Studio FAQs will appear here once published.</p>
          ) : (
            <div className="faq-list">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.id || item.question} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                    <button
                      type="button"
                      className="faq-item__trigger"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <ChevronDown size={17} className="faq-item__chevron" aria-hidden="true" />
                    </button>
                    <div className="faq-item__panel">
                      <div className="faq-item__panel-inner">
                        <p className="faq-item__answer">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
