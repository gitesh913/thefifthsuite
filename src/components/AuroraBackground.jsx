import React, { memo } from 'react';
import { motion } from 'framer-motion';

// Reducing count and complexity of orbs for performance
const orbs = [
  { id: 10, size: '70vw', top: '22%', left: '50%', color: '#FD6F88', edge: '#E84B6A', duration: 15, opacity: 0.8 }, 
  { id: 1, size: '80vw', top: '30%', left: '45%', color: '#D63D5A', edge: '#B4253D', duration: 20, opacity: 0.6 }, 
  { id: 2, size: '45vw', top: '15%', left: '15%', color: '#C5304B', edge: '#A31C32', duration: 25, opacity: 0.5 },
  { id: 6, size: '70vw', top: '75%', left: '20%', color: '#D63D5A', edge: '#B4253D', duration: 22, opacity: 0.6 },
  { id: 7, size: '60vw', top: '85%', right: '15%', color: '#C5304B', edge: '#A31C32', duration: 28, opacity: 0.5 },
];

const Orb = memo(({ orb }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [orb.opacity * 0.8, orb.opacity, orb.opacity * 0.8],
      x: ['-50%', '-48%', '-52%', '-50%'],
      y: ['-50%', '-52%', '-48%', '-50%'],
    }}
    transition={{
      duration: orb.duration,
      repeat: Infinity,
      ease: "linear", // Linear is cheaper than easeInOut for many objects
    }}
    style={{
      position: 'absolute',
      top: orb.top,
      left: orb.left,
      width: orb.size,
      height: orb.size,
      maxWidth: '800px',
      maxHeight: '800px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${orb.color} 0%, ${orb.edge} 40%, transparent 80%)`,
      filter: 'blur(80px)', // Reduced blur for better performance
      transform: 'translate(-50%, -50%)',
      willChange: 'transform, opacity', // GPU acceleration
    }}
  />
));

function AuroraBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#FCEAF0', 
        minHeight: '100%',
        contain: 'paint', // Layout optimization
      }}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <Orb key={orb.id} orb={orb} />
      ))}

      {/* Static gradient overlay is much cheaper than backdrop-filter */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(252, 234, 240, 0.4) 100%)',
        }} 
      />

      {/* Optimized static-like noise (lower frequency) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

export default memo(AuroraBackground);
