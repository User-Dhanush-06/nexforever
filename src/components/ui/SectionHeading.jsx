import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left', // 'left' | 'center'
  className = '',
}) {
  return (
    <div className={`section-header section-header--${align} ${className}`.trim()}>
      {eyebrow && (
        <span className="section-eyebrow">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="section-heading">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="section-subtext">
          {subtitle}
        </p>
      )}
    </div>
  );
}

