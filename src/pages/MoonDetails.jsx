import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, Info, Calendar, Sparkles, Zap, Shield, Heart, Compass } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import { getMoonPhase } from '../utils/moonPhase'

const lunarRituals = {
  'New Moon': [
    { icon: Sparkles, title: 'Intention Setting', text: 'Write down 3 goals for this lunar cycle and light a white candle.' },
    { icon: Compass, title: 'Cleanse Your Space', text: 'Use sage or palo santo to clear stagnant energy from your sanctuary.' }
  ],
  'Waxing Crescent': [
    { icon: Zap, title: 'Build Momentum', text: 'Take one concrete step toward a goal you set during the New Moon.' },
    { icon: Heart, title: 'Self-Affirmation', text: 'Stand before a mirror and speak your strengths aloud.' }
  ],
  'First Quarter': [
    { icon: Shield, title: 'Boundaries', text: 'Identify what is draining your energy and practice saying "no" with grace.' },
    { icon: Zap, title: 'Active Meditation', text: 'Focus your breath on your solar plexus to ignite your inner fire.' }
  ],
  'Waxing Gibbous': [
    { icon: Compass, title: 'Refinement', text: 'Review your progress and adjust your sails. Polish the details.' },
    { icon: Sparkles, title: 'Gratitude Journal', text: 'Note five things that are already manifesting in your life.' }
  ],
  'Full Moon': [
    { icon: Sparkles, title: 'Moon Bathing', text: 'Let the light of the full moon wash over you to recharge your spirit.' },
    { icon: Heart, title: 'Forgiveness Ritual', text: 'Write down what you wish to release and safely burn the paper.' }
  ],
  'Waning Gibbous': [
    { icon: Heart, title: 'Sharing Wisdom', text: 'Reach out to a friend or mentor to share an insight you have gained.' },
    { icon: Compass, title: 'Inventory', text: 'Assess your harvest. What did you learn from this peak of energy?' }
  ],
  'Last Quarter': [
    { icon: Shield, title: 'Declutter', text: 'Physically clean a drawer or a digital space to symbolize mental clearing.' },
    { icon: Sparkles, title: 'Cord Cutting', text: 'Visualize silver threads connecting you to the past being gently severed.' }
  ],
  'Waning Crescent': [
    { icon: Heart, title: 'Sacred Rest', text: 'Prioritize sleep and dreaming. The void is where magic is born.' },
    { icon: Compass, title: 'Introspection', text: 'Quiet the mind and listen to the whispers of your intuition.' }
  ],
}

const crystalAffinities = {
  'New Moon': { name: 'Labradorite', benefit: 'Magical transformation and intuition.' },
  'Waxing Crescent': { name: 'Carnelian', benefit: 'Motivation and creative courage.' },
  'First Quarter': { name: 'Tiger\'s Eye', benefit: 'Willpower and clear decision making.' },
  'Waxing Gibbous': { name: 'Amethyst', benefit: 'Spiritual clarity and peace.' },
  'Full Moon': { name: 'Moonstone', benefit: 'Divine feminine energy and peak power.' },
  'Waning Gibbous': { name: 'Rose Quartz', benefit: 'Self-love and gentle transition.' },
  'Last Quarter': { name: 'Black Tourmaline', benefit: 'Protection and release of negativity.' },
  'Waning Crescent': { name: 'Selenite', benefit: 'Aura cleansing and deep peace.' },
}

const phaseDescriptions = {
  'New Moon': 'A clean slate. Ideal for setting new intentions, starting projects, and quiet reflection.',
  'Waxing Crescent': 'Planting seeds. Focus on growth, taking initial actions, and building momentum.',
  'First Quarter': 'Overcoming obstacles. A time for decision-making, taking action, and showing strength.',
  'Waxing Gibbous': 'Refining details. Perfect for polishing plans, organizing, and preparing for completion.',
  'Full Moon': 'Peak power and realization. Celebrate achievements, harvest results, and practice forgiveness.',
  'Waning Gibbous': 'Sharing and gratitude. Disseminate knowledge, give thanks, and begin to look inward.',
  'Last Quarter': 'Release and let go. Shed old habits, clear clutter, and break ties with what no longer serves.',
  'Waning Crescent': 'Deep rest and surrender. Prepare for the next cycle, practice meditation, and dream.',
}

function StarField() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const stars = useMemo(() => {
    const count = isMobile ? 25 : 60
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
  }, [isMobile])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            background: 'var(--aura-angel-pink)',
            borderRadius: '50%',
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  )
}

function MoonSmallIcon({ phase, illumination }) {
  const isWaxing = phase.includes('Waxing') || phase === 'New Moon'
  const isFull = phase === 'Full Moon'
  const isNew = phase === 'New Moon'

  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#07060f',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#FD6F88',
        clipPath: isNew ? 'circle(0%)' : isFull ? 'circle(100%)' : isWaxing ? `inset(0 0 0 ${100 - illumination}%)` : `inset(0 ${100 - illumination}% 0 0)`,
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
      }} />
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

function RealisticMoon({ phase, illumination, size = 220 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, marginBottom: 40 }}>
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: -size * 0.2,
          borderRadius: '50%',
          background: 'rgba(253, 111, 136, 0.3)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: '#07060f',
        overflow: 'hidden',
        boxShadow: '0 0 50px rgba(253, 111, 136, 0.1), inset 0 0 40px rgba(0,0,0,0.9)',
        zIndex: 1,
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9,
          filter: 'brightness(0.9) contrast(1.1)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(2px)',
          clipPath: getRealisticClipPath(phase, illumination),
          zIndex: 2,
        }} />
      </div>
    </div>
  )
}

export default function MoonDetails() {
  const today = new Date()
  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return {
      date,
      ...getMoonPhase(date),
    }
  })

  const currentPhase = weekData[0]
  const rituals = lunarRituals[currentPhase.phaseName] || []
  const crystal = crystalAffinities[currentPhase.phaseName]

  return (
    <div className="page-wrapper" style={{ position: 'relative', minHeight: '100vh', paddingBottom: 120, background: '#FCEAF0' }}>
      <AuroraBackground />
      <StarField />
      
      <div className="container-max" style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ x: -4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#D63D5A',
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 40,
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.45)',
              borderRadius: 50,
              border: '1px solid rgba(253, 111, 136, 0.2)',
            }}
          >
            <ChevronLeft size={16} />
            Back to Sanctum
          </motion.div>
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          marginBottom: 80,
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                borderRadius: '50%',
                border: '1px dashed rgba(214, 61, 90, 0.3)',
              }}
            />

            <RealisticMoon phase={currentPhase.phaseName} illumination={currentPhase.illumination} />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: 400,
                color: '#0a0a0c',
                marginBottom: 12,
                letterSpacing: '0.05em',
              }}
            >
              {currentPhase.phaseName}
            </motion.h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255, 255, 255, 0.45)',
              padding: '8px 24px',
              borderRadius: 50,
              border: '1px solid rgba(253, 111, 136, 0.2)',
            }}>
              <span style={{ fontSize: 11, color: '#D63D5A', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                Age: {currentPhase.moonAge} Days
              </span>
              <div style={{ width: 1, height: 10, background: 'rgba(214, 61, 90, 0.3)' }} />
              <span style={{ fontSize: 11, color: '#D63D5A', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                {currentPhase.illumination}% Lit
              </span>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass"
              style={{ padding: 40, background: 'rgba(255, 255, 255, 0.45)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Info size={18} style={{ color: '#D63D5A' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: '#0a0a0c', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                  The Cosmic Current
                </h2>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 18,
                lineHeight: 1.8,
                color: '#0a0a0c',
                fontStyle: 'italic',
                fontWeight: 450,
                marginBottom: 0,
              }}>
                "{phaseDescriptions[currentPhase.phaseName]}"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass"
              style={{ 
                padding: 40, 
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(253, 111, 136, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Sparkles size={18} style={{ color: '#D63D5A' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#D63D5A', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Daily Affirmation
                </h2>
              </div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                lineHeight: 1.4,
                color: '#0a0a0c',
                fontWeight: 400,
              }}>
                "I am aligned with the divine rhythm of the universe. What I seek is already seeking me."
              </p>
            </motion.div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
          marginBottom: 80,
        }}>
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass"
            style={{ padding: 40, background: 'rgba(255, 255, 255, 0.4)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <Sparkles size={20} style={{ color: '#D63D5A' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#0a0a0c', letterSpacing: '0.1em', fontWeight: 700 }}>
                Lunar Rituals
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {rituals.map((ritual, idx) => {
                const RitualIcon = ritual.icon
                return (
                  <div key={idx} style={{ display: 'flex', gap: 20 }}>
                    <div style={{ 
                      flexShrink: 0, width: 44, height: 44, 
                      borderRadius: 12, background: 'rgba(253, 111, 136, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#D63D5A'
                    }}>
                      <RitualIcon size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#0a0a0c', marginBottom: 6, fontWeight: 700 }}>{ritual.title}</h4>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(10, 10, 12, 0.7)', lineHeight: 1.6, fontWeight: 450 }}>{ritual.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass"
            style={{ 
              padding: 40, 
              background: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ 
              width: 80, height: 80, 
              borderRadius: '50%', 
              background: 'rgba(253, 111, 136, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
              border: '1px solid rgba(253, 111, 136, 0.2)',
            }}>
              <Zap size={32} style={{ color: '#D63D5A' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'rgba(10, 10, 12, 0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
              Crystal Affinity
            </h2>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#0a0a0c', marginBottom: 8, fontWeight: 400 }}>
              {crystal?.name}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#D63D5A', fontStyle: 'italic', fontWeight: 500 }}>
              {crystal?.benefit}
            </p>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Calendar size={20} style={{ color: '#D63D5A' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#0a0a0c', letterSpacing: '0.1em', fontWeight: 700 }}>
                7-Day Lunar Journey
              </h2>
            </div>
            <div style={{ width: '40%', height: 1, background: 'linear-gradient(90deg, rgba(214, 61, 90, 0.3), transparent)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
          }}>
            {weekData.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  background: 'rgba(255, 255, 255, 0.65)', 
                  borderColor: 'rgba(253, 111, 136, 0.5)',
                  boxShadow: '0 20px 40px rgba(253, 111, 136, 0.15)'
                }}
                className="glass"
                style={{
                  padding: 24,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  background: 'rgba(255, 255, 255, 0.35)',
                  borderColor: i === 0 ? 'rgba(253, 111, 136, 0.6)' : 'rgba(253, 111, 136, 0.15)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, #FD6F88, #D63D5A)'
                  }} />
                )}
                
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 10,
                  color: i === 0 ? '#D63D5A' : 'rgba(10, 10, 12, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                }}>
                  {i === 0 ? 'Tonight' : day.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </p>
                
                <MoonSmallIcon phase={day.phaseName} illumination={day.illumination} />
                
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#0a0a0c', marginBottom: 4, fontWeight: 600 }}>
                    {day.phaseName}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#D63D5A', fontWeight: 700 }}>
                    {day.illumination}% lit
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
