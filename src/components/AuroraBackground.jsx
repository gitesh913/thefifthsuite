import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../utils/hooks';

// Optimized dark theme orbs with deeper, more mystical colors
const orbs = [
  { id: 10, size: '70vw', top: '10%', left: '80%', color: '#1e1b4b', edge: '#312e81', duration: 25, opacity: 0.4 }, 
  { id: 1, size: '85vw', top: '40%', left: '20%', color: '#2e1065', edge: '#4c1d95', duration: 30, opacity: 0.3 }, 
  { id: 2, size: '60vw', top: '80%', left: '70%', color: '#4c0519', edge: '#881337', duration: 35, opacity: 0.2 },
  { id: 6, size: '75vw', top: '20%', left: '10%', color: '#0f172a', edge: '#1e293b', duration: 28, opacity: 0.4 },
  { id: 7, size: '65vw', top: '90%', right: '10%', color: '#111827', edge: '#1f2937', duration: 32, opacity: 0.3 },
];

const Orb = memo(({ orb, isMobile }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [orb.opacity * 0.7, orb.opacity, orb.opacity * 0.7],
      x: isMobile ? ['-1%', '1%', '-1%'] : ['-3%', '3%', '-3%'],
      y: isMobile ? ['-1%', '1%', '-1%'] : ['-3%', '3%', '-3%'],
    }}
    transition={{
      duration: isMobile ? orb.duration * 1.5 : orb.duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      position: 'absolute',
      top: orb.top,
      left: orb.left,
      width: isMobile ? '100vw' : orb.size,
      height: isMobile ? '100vw' : orb.size,
      maxWidth: isMobile ? '400px' : '800px',
      maxHeight: isMobile ? '400px' : '800px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${orb.color} 0%, ${orb.edge} 40%, transparent 80%)`,
      filter: isMobile ? 'blur(40px)' : 'blur(80px)',
      transform: 'translate(-50%, -50%)',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    }}
  />
));

function AuroraBackground() {
  const isMobile = useIsMobile();

  const visibleOrbs = isMobile ? orbs.slice(0, 2) : orbs;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#030305', // Deep Obsidian Base
        minHeight: '100%',
        contain: 'strict',
      }}
      aria-hidden="true"
    >
      {visibleOrbs.map((orb) => (
        <Orb key={orb.id} orb={orb} isMobile={isMobile} />
      ))}

      {/* Dark vignette overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, rgba(3, 3, 5, 0.7) 100%)',
        }} 
      />

      {/* Subtle Grain Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

export default memo(AuroraBackground);
