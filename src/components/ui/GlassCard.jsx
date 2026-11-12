import React, { useRef } from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  tilt = false,
  tiltIntensity = 5,
  as: Component = 'div',
  onPointerMove,
  onPointerLeave,
  style,
  ...props
}) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    if (onPointerMove) onPointerMove(e);
    if (!tilt || e.pointerType === 'touch') return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * tiltIntensity * 2;
    const rotateX = (0.5 - py) * tiltIntensity * 2;

    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
  };

  const handlePointerLeave = (e) => {
    if (onPointerLeave) onPointerLeave(e);
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = '';
    cardRef.current.style.removeProperty('--mx');
    cardRef.current.style.removeProperty('--my');
  };

  const classes = [
    'glass-card',
    hoverEffect ? 'glass-card--hover' : '',
    tilt ? 'glass-card--tilt' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={cardRef}
      className={classes}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}
