import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useInfinityGeometry } from './InfinityGeometry';

export default function InfinityScene() {
  const meshRef = useRef();
  const groupRef = useRef();
  const particlesRef = useRef();
  const mintLightRef = useRef();
  const pointerRef = useRef({ x: 0, y: 0 });
  const { gl, scene, size, viewport } = useThree();
  const [reducedMotion, setReducedMotion] = useState(false);

  const isMobile = size.width < 640;
  const isTablet = size.width >= 640 && size.width < 1024;
  const isLaptop = size.width >= 1024 && size.width < 1280;

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Track mouse/pointer on window since canvas has pointer-events: none
  useEffect(() => {
    const onPointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onPointerLeave = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  // Custom Studio Environment Map (baked procedurally — instant, offline reliable)
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const w = 1024;
    const h = 512;
    const envCanvas = document.createElement('canvas');
    envCanvas.width = w;
    envCanvas.height = h;
    const ctx = envCanvas.getContext('2d');

    if (ctx) {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0.0, '#1e222b');
      bgGrad.addColorStop(0.35, '#0f1218');
      bgGrad.addColorStop(0.55, '#07080a');
      bgGrad.addColorStop(1.0, '#040507');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const paintSoftbox = (cx, cy, rw, rh, innerColor, midColor) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, rh / rw);
        const radGrad = ctx.createRadialGradient(0, 0, rw * 0.15, 0, 0, rw);
        radGrad.addColorStop(0, innerColor);
        radGrad.addColorStop(0.55, midColor);
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, rw, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // Overhead crisp white strip reflection
      paintSoftbox(w * 0.5, h * 0.16, 360, 75, 'rgba(255,255,255,1)', 'rgba(225,235,250,0.45)');
      // Upper-left key softbox
      paintSoftbox(w * 0.22, h * 0.30, 170, 110, 'rgba(255,255,255,0.95)', 'rgba(200,215,235,0.3)');
      // Right cool silver rim panel
      paintSoftbox(w * 0.80, h * 0.34, 150, 95, 'rgba(220,232,255,0.85)', 'rgba(140,170,220,0.22)');
      // Restrained mint accent reflection strip
      paintSoftbox(w * 0.68, h * 0.64, 170, 70, 'rgba(105,229,193,0.75)', 'rgba(105,229,193,0.15)');
      // Subtle lower cool bounce light
      paintSoftbox(w * 0.32, h * 0.78, 220, 60, 'rgba(175,195,220,0.28)', 'rgba(100,120,150,0.06)');

      const texture = new THREE.CanvasTexture(envCanvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      const renderTarget = pmremGenerator.fromEquirectangular(texture);
      scene.environment = renderTarget.texture;

      return () => {
        scene.environment = null;
        pmremGenerator.dispose();
        renderTarget.dispose();
        texture.dispose();
      };
    }
  }, [gl, scene]);

  // Subtle lightweight atmospheric dust particles around the 3D centerpiece
  const particleGeometry = useMemo(() => {
    const count = isMobile ? 36 : 72;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic golden-angle spread so layout is clean and repeatable
      const angle = i * 2.39996;
      const radius = 2.6 + ((i * 7) % 19) * 0.14;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (((i * 13) % 23) / 23 - 0.5) * 4.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.65 - 0.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [isMobile]);

  useEffect(() => {
    return () => {
      particleGeometry.dispose();
    };
  }, [particleGeometry]);

  // Balanced figure-8 dimensions
  const geometry = useInfinityGeometry({
    scaleX: 2.3,
    scaleY: 3.15,
    depthZ: 0.70,
    tubularSegments: isMobile ? 160 : 280,
    radius: isMobile ? 0.34 : 0.35,
    radialSegments: isMobile ? 20 : 32,
  });

  // Responsive viewport framing so neither edge clips and text stays clean
  const scale = isMobile
    ? Math.min(0.43, (viewport.width * 0.84) / 5.1)
    : isTablet
      ? 0.66
      : isLaptop
        ? 0.78
        : 0.90;

  const targetX = isMobile
    ? 0
    : isTablet
      ? 0
      : Math.min(viewport.width * 0.21, 1.85);

  const targetY = isMobile
    ? 1.24
    : isTablet
      ? 1.05
      : 0.05;

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointer = pointerRef.current;

    if (reducedMotion) {
      meshRef.current.rotation.set(0.22, 0.28, -0.10);
      groupRef.current.position.set(targetX, targetY, 0);
      return;
    }

    // Subtle scroll-linked architectural rotation while keeping Hero pose unmistakably figure-8
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollRatio = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);

    const baseRotY = 0.24 + Math.sin(time * 0.42) * 0.40 + scrollRatio * Math.PI * 1.25;
    const baseRotX = 0.20 + Math.cos(time * 0.34) * 0.14 + scrollRatio * 0.22;
    const baseRotZ = -0.10 + Math.sin(time * 0.28) * 0.07;

    // Subtle mouse-responsive orientation
    const parallaxX = pointer.x * 0.26;
    const parallaxY = -pointer.y * 0.16;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      baseRotY + parallaxX,
      0.06
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      baseRotX + parallaxY,
      0.06
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      baseRotZ,
      0.06
    );

    // Gentle floating motion
    meshRef.current.position.y = Math.sin(time * 0.65) * 0.08;

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.035;
      particlesRef.current.rotation.x = Math.sin(time * 0.08) * 0.04;
    }

    // Smoothly damp group position with slight mouse shift
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX + pointer.x * 0.12,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY + pointer.y * 0.08,
      0.05
    );

    if (mintLightRef.current) {
      mintLightRef.current.position.x = Math.sin(time * 0.7) * 3.8;
      mintLightRef.current.position.y = Math.cos(time * 0.5) * 2.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#ffffff" />
      <directionalLight position={[-5, 7, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[6, -1, 4]} intensity={1.4} color="#b8ccf0" />
      <directionalLight position={[0, 4, -7]} intensity={2.6} color="#ffffff" />

      <pointLight
        ref={mintLightRef}
        position={[-3, 1, 3.5]}
        intensity={3.0}
        color="#69E5C1"
        distance={16}
      />

      <pointLight position={[2, 4.5, 3]} intensity={1.8} color="#eef4ff" distance={14} />

      <group ref={groupRef} scale={scale} position={[targetX, targetY, 0]}>
        <mesh ref={meshRef} geometry={geometry} rotation={[0.22, 0.35, -0.12]}>
          <meshPhysicalMaterial
            color="#d8dde6"
            metalness={0.96}
            roughness={0.14}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            reflectivity={1.0}
            envMapIntensity={1.85}
          />
        </mesh>

        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            color="#69E5C1"
            size={isMobile ? 0.035 : 0.028}
            transparent
            opacity={0.45}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}
