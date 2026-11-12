import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Custom 3D Lemniscate (Infinity) Curve
 * Traces a continuous closed figure-eight with smooth over-under 3D crossover.
 */
class InfinityCurve3D extends THREE.Curve {
  constructor(scaleX = 2.4, scaleY = 3.25, depthZ = 0.72) {
    super();
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.depthZ = depthZ;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const point = optionalTarget;
    const u = t * Math.PI * 2;
    const denom = 1 + Math.sin(u) * Math.sin(u);

    // Bernoulli lemniscate parametric equations
    const x = (this.scaleX * Math.cos(u)) / denom;
    const y = (this.scaleY * Math.sin(u) * Math.cos(u)) / denom;
    // Over-under clearance at crossover (when x=0, y=0 at u=π/2 and 3π/2)
    const z = this.depthZ * Math.sin(u);

    return point.set(x, y, z);
  }
}

export function useInfinityGeometry({
  scaleX = 2.4,
  scaleY = 3.25,
  depthZ = 0.72,
  tubularSegments = 260,
  radius = 0.36,
  radialSegments = 32
} = {}) {
  const geometry = useMemo(() => {
    const curve = new InfinityCurve3D(scaleX, scaleY, depthZ);
    return new THREE.TubeGeometry(
      curve,
      tubularSegments,
      radius,
      radialSegments,
      true // closed loop
    );
  }, [scaleX, scaleY, depthZ, tubularSegments, radius, radialSegments]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return geometry;
}
