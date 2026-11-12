import React from 'react';
import SectionHeading from '../ui/SectionHeading';

export default function Approach() {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      text: 'Understanding your business, goals and project requirements.'
    },
    {
      number: '02',
      title: 'Strategize',
      text: 'Planning the right approach, architecture and defining the solution.'
    },
    {
      number: '03',
      title: 'Create',
      text: 'Bringing ideas to life through development, design and production.'
    },
    {
      number: '04',
      title: 'Deliver',
      text: 'Providing the final polished solution with attention to quality and detail.'
    }
  ];

  return (
    <section id="approach" className="section approach-section" aria-label="Our Approach">
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="From Idea to Impact."
          align="center"
        />

        <div className="approach__timeline" role="list">
          {steps.map((step) => (
            <div key={step.number} className="approach__step" role="listitem">
              <div className="approach__node">
                <span className="approach__number">{step.number}</span>
              </div>
              <div className="approach__content">
                <h3 className="approach__title">{step.title}</h3>
                <p className="approach__text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

