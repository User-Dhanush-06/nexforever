import React from 'react';

export default function Button({
  children,
  href,
  variant = 'primary', // 'primary' | 'glass' | 'outline'
  className = '',
  icon: Icon,
  onClick,
  type = 'button',
  target,
  rel,
  ...props
}) {
  const baseClass = `btn btn-${variant} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        className={baseClass}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        onClick={onClick}
        {...props}
      >
        <span>{children}</span>
        {Icon && <Icon className="btn-icon" size={16} aria-hidden="true" />}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      {Icon && <Icon className="btn-icon" size={16} aria-hidden="true" />}
    </button>
  );
}

