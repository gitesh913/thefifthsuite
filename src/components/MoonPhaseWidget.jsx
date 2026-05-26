import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMoonPhase } from '../utils/moonPhase'
import { ChevronRight } from 'lucide-react'
import { useIsMobile } from '../utils/hooks'

function MoonIcon({ phase, illumination, size = 80 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, marginBottom: 16 }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'rgba(167, 139, 250, 0.25)',
        filter: 'blur(16px)',
      }} />

      {/* The Moon Sphere */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: '#030305',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)',
      }}>
        {/* Photographic Texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=400")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          filter: 'grayscale(0.5) brightness(0.9)',
        }} />

        {/* Shadow Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(1px)',
          clipPath: getRealisticClipPath(phase, illumination),
        }} />
      </div>
    </div>
  )
}

function getRealisticClipPath(phase, illumination) {
  if (phase === 'New Moon') return 'circle(100% at 50% 50%)'
  if (phase === 'Full Moon') return 'circle(0% at 50% 50%)'
  const pct = illumination
  if (phase.includes('Waxing')) {
    return `inset(0 ${pct}% 0 0)`
  } else {
    return `inset(0 0 0 ${pct}%)`
  }
}

const phaseDescriptions = {
  'New Moon': 'A time for new beginnings and setting intentions.',
  'Waxing Crescent': 'Focus on your goals and take the first steps.',
  'First Quarter': 'Face challenges with strength and determination.',
  'Waxing Gibbous': 'Refine your plans and prepare for fruition.',
  'Full Moon': 'A peak of energy. Celebrate and release.',
  'Waning Gibbous': 'Share your wisdom and express gratitude.',
  'Last Quarter': 'Let go of what no longer serves you.',
  'Waning Crescent': 'Rest, reflect, and surrender to the void.',
}

function MoonPhaseWidget({ compact = false, className = '', style = {} }) {
  const isMobile = useIsMobile()
  const { phaseName, illumination, moonAge } = getMoonPhase()

  return (
    <Link to="/moon-details" style={{ textDecoration: 'none', ...style }} className={className}>
      <motion.div
        whileHover={isMobile ? {} : (compact ? { scale: 1.03 } : { scale: 1.02, y: -4 })}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: compact ? 'row' : 'column',
          alignItems: compact ? 'center' : 'center',
          gap: compact ? 12 : 0,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: compact ? 22 : 28,
          padding: compact ? '14px 18px 14px 14px' : '32px 24px',
          width: compact ? 'auto' : 220,
          minWidth: compact ? 0 : 220,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <MoonIcon phase={phaseName} illumination={illumination} size={compact ? 52 : 90} />

        {compact && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 10,
              color: 'rgba(10, 10, 12, 0.45)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Moon
            </p>

            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              color: '#0a0a0c',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 3,
            }}>
              {phaseName}
            </h4>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--aura-lavender)',
              fontWeight: 700,
              marginBottom: 2,
            }}>
              {illumination}% illuminated
            </p>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-heading)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(10, 10, 12, 0.6)',
            }}>
              Open
              <ChevronRight size={11} />
            </span>
          </div>
        )}

        {!compact && (
          <>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 16,
              color: '#0a0a0c',
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
              {phaseName}
            </h4>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--aura-lavender)',
              fontWeight: 700,
              marginBottom: 6,
            }}>
              {illumination}% Illuminated
            </p>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'rgba(10, 10, 12, 0.6)',
              fontWeight: 500,
              marginBottom: 16,
              letterSpacing: '0.05em',
            }}>
              Moon Age: {moonAge} days
            </p>

            <div style={{
              width: 40,
              height: 1,
              background: 'rgba(167, 139, 250, 0.3)',
              margin: '0 auto 16px',
            }} />

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              lineHeight: 1.6,
              color: '#0a0a0c',
              fontWeight: 450,
              fontStyle: 'italic',
            }}>
              {phaseDescriptions[phaseName] || 'The cosmos is in motion.'}
            </p>

            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                marginTop: 16,
                fontSize: 10,
                fontFamily: 'var(--font-heading)',
                color: 'var(--aura-lavender)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              View Lunar Cycle →
            </motion.span>
          </>
        )}
      </motion.div>
    </Link>
  )
}

export default memo(MoonPhaseWidget);
