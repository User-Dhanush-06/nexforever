import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  as: Component = 'div',
  ...props
}) {
  const classes = `glass-card ${hoverEffect ? 'glass-card--hover' : ''} ${className}`.trim();
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

