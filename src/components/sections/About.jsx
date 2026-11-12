import React from 'react';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';

export default function About() {
  const values = [
    {
      number: '01',
      title: 'Innovation',
      description: 'Exploring better ways to turn ideas into practical digital solutions.'
    },
    {
      number: '02',
      title: 'Creativity',
      description: 'Combining thoughtful design and storytelling to create memorable experiences.'
    },
    {
      number: '03',
      title: 'Quality',
      description: 'Focusing on details, reliability and delivering work that matters.'
    }
  ];

  return (
    <section id="about" className="section about-section" aria-label="About NexForever">
      <div className="container">
        <div className="about__intro-grid">
          <div className="about__heading-col">
            <SectionHeading
              eyebrow="Who We Are"
              title={<>More Than<br />Just Digital.</>}
            />
          </div>

          <div className="about__text-col">
            <p className="about__lead">
              We bring technology and creativity together to build digital experiences that make an impact.
            </p>
            <p className="about__body">
              At NexForever, we believe every great idea deserves the right execution. We bring together
              technology, creativity and thoughtful design to help businesses build a stronger digital presence.
            </p>
            <p className="about__body">
              From developing digital platforms to creating engaging visual content, our focus is on delivering
              meaningful solutions that make an impact.
            </p>
          </div>
        </div>

        {/* 3 Values Cards */}
        <div className="about__values-grid">
          {values.map((val) => (
            <GlassCard key={val.number} className="value-card">
              <span className="value-card__number">{val.number}</span>
              <h3 className="value-card__title">{val.title}</h3>
              <p className="value-card__desc">{val.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

