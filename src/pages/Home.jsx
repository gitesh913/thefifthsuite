import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Zap, Clock, Calendar, CalendarRange, Quote, Sparkles, Star, Users, Globe } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import MoonPhaseWidget from '../components/MoonPhaseWidget'

const iconMap = { Zap, Clock, Calendar, CalendarRange }

// --- ENHANCED COMPONENTS ---

function SpectralTiltCard({ children, className = '', style = {}, tintColor = '#fff', bgGradient = 'rgba(255, 255, 255, 0.6)' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: `0 20px 40px rgba(0,0,0,0.08), 0 0 15px ${tintColor}44`,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`glass ${className}`}
    >
      {/* Intense Reflection Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, ${tintColor}22 100%)`,
          zIndex: 0,
          borderRadius: 'inherit',
        }}
      />
      
      {/* Background glass saturation - Luxury Aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: bgGradient,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 10px 30px rgba(0,0,0,0.05)',
        zIndex: -1,
        borderRadius: 'inherit',
      }} />
      
      {/* Content */}
      <div style={{ transform: 'translateZ(30px)', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        {children}
      </div>

      {/* Shine effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.6) 50%, transparent 55%)',
          zIndex: 1,
          opacity: 0,
          borderRadius: 'inherit',
        }}
        whileHover={{ opacity: 0.4, left: ['-100%', '100%'] }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

function ShootingStar() {
  const [coords, setCoords] = useState({ top: '20%', left: '20%' })
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCoords({
        top: `${Math.random() * 40}%`,
        left: `${Math.random() * 40}%`
      })
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      key={coords.top}
      initial={{ x: '-10%', y: '-10%', opacity: 0 }}
      animate={{ 
        x: ['0vw', '100vw'], 
        y: ['0vh', '100vh'], 
        opacity: [0, 0.4, 0] 
      }}
      transition={{ 
        duration: 1.5, 
        ease: "linear"
      }}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: 2,
        height: 2,
        background: 'var(--aura-lavender)',
        boxShadow: '0 0 20px 2px var(--aura-lavender)',
        zIndex: 0,
      }}
    />
  )
}

function SolarSystemBackground() {
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 2000], [0, 400])
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 1.1])

  const planets = [
    { name: 'Mercury', size: 4, dist: 100, speed: 12, color: '#A5A5A5' },
    { name: 'Venus', size: 10, dist: 140, speed: 18, color: '#E3BB76' },
    { name: 'Earth', size: 11, dist: 190, speed: 25, color: '#2271B3' },
    { name: 'Mars', size: 7, dist: 240, speed: 30, color: '#E27B58' },
    { name: 'Jupiter', size: 24, dist: 320, speed: 50, color: '#D39C7E' },
    { name: 'Saturn', size: 20, dist: 400, speed: 70, color: '#C5AB6E', hasRings: true },
    { name: 'Uranus', size: 14, dist: 470, speed: 90, color: '#B5E3E3' },
    { name: 'Neptune', size: 14, dist: 540, speed: 110, color: '#4B70DD' },
  ]

  return (
    <motion.div style={{ 
      position: 'absolute', 
      inset: 0, 
      zIndex: 0, 
      overflow: 'hidden', 
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      y: yParallax,
      scale: scaleParallax,
      opacity: 0.6,
    }}>
      <div style={{
        position: 'relative',
        width: 70, height: 70,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFFDE1 0%, #FFD700 50%, #FF8C00 100%)',
        boxShadow: '0 0 120px 30px rgba(255, 140, 0, 0.2), 0 0 60px rgba(255, 215, 0, 0.3)',
      }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', inset: -30, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,140,0,0.15) 0%, transparent 70%)',
            filter: 'blur(15px)',
          }}
        />
      </div>

      {planets.map((p, i) => (
        <React.Fragment key={p.name}>
          <div style={{
            position: 'absolute',
            width: p.dist * 2,
            height: p.dist * 2,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
          }} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: p.speed, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: p.dist * 2,
              height: p.dist * 2,
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: -p.size / 2,
              transform: 'translateY(-50%)',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${p.color} 0%, #000 100%)`,
              boxShadow: `inset -2px -2px 5px rgba(0,0,0,0.8), 0 0 10px ${p.color}33`,
            }}>
              {p.hasRings && (
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: p.size * 2.2,
                  height: p.size * 0.6,
                  border: '1px solid rgba(197, 171, 110, 0.2)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%) rotate(-25deg)',
                }} />
              )}
            </div>
          </motion.div>
        </React.Fragment>
      ))}
    </motion.div>
  )
}

function StarField() {
  const stars = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    color: Math.random() > 0.8 ? 'var(--aura-lavender)' : Math.random() > 0.9 ? 'var(--aura-teal)' : 'white'
  })), [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            background: star.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}
      <ShootingStar />
    </div>
  )
}

function SectionHeading({ subtitle, title, centered = false }) {
  return (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: 48 }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'var(--aura-lavender)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        ✦ {subtitle}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(32px, 5vw, 56px)',
          color: 'var(--aura-white)',
          lineHeight: 1.1,
        }}
      >
        {title}
      </motion.h2>
      {centered && <div className="divider" style={{ background: 'linear-gradient(90deg, transparent, var(--aura-lavender), transparent)', height: '1px', width: '60px', margin: '24px auto' }} />}
    </div>
  )
}

const bookingTypesData = [
  { 
    id: 'urgent', 
    name: 'Urgent Reading', 
    description: 'Immediate clarity when the path is uncertain. Same-day availability.', 
    icon: 'Zap', 
    price: '₹ 2,500', 
    color: 'rgba(253, 111, 136, 0.7)',
    bg: 'linear-gradient(145deg, rgba(255, 245, 247, 0.88), rgba(245, 220, 228, 0.78))' 
  },
  { 
    id: 'oneday', 
    name: 'One Day Prior', 
    description: 'Thoughtful preparation for the journey ahead. Scheduled with intent.', 
    icon: 'Clock', 
    price: '₹ 2,000', 
    color: 'rgba(142, 154, 175, 0.7)',
    bg: 'linear-gradient(145deg, rgba(240, 244, 255, 0.92), rgba(220, 228, 240, 0.82))' 
  },
  { 
    id: 'weekly', 
    name: 'Weekly Reading', 
    description: 'Your spiritual compass for the seven days ahead. Deep alignment.', 
    icon: 'Calendar', 
    price: '₹ 6,000', 
    color: 'rgba(178, 141, 255, 0.7)',
    bg: 'linear-gradient(145deg, rgba(248, 244, 255, 0.92), rgba(228, 218, 250, 0.82))' 
  },
  { 
    id: 'monthly', 
    name: 'Monthly Reading', 
    description: 'Exhaustive life review. Mapping the lunar currents of your soul.', 
    icon: 'CalendarRange', 
    price: '₹ 10,000', 
    color: 'rgba(227, 187, 118, 0.7)',
    bg: 'linear-gradient(145deg, rgba(255, 248, 238, 0.92), rgba(244, 226, 196, 0.82))' 
  },
]


export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper" style={{ position: 'relative', background: 'var(--bg-void)' }}>
      <AuroraBackground />
      <StarField />
      <SolarSystemBackground />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'fixed',
          right: 'clamp(12px, 3vw, 20px)',
          bottom: 'clamp(18px, 4vh, 28px)',
          zIndex: 30,
        }}
        className="sm:hidden"
      >
        <MoonPhaseWidget compact />
      </motion.div>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        textAlign: 'left',
        padding: '120px 8% 80px',
        maxWidth: 1400,
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: 'absolute',
            right: 'clamp(4%, 8vw, 8%)',
            top: 'clamp(15%, 20vh, 25%)',
            zIndex: 10,
          }}
          className="hidden sm:block"
        >
          <MoonPhaseWidget />
        </motion.div>

        <div style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, pointerEvents: 'none' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 'clamp(400px, 80vw, 800px)', 
              height: 'clamp(400px, 80vw, 800px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: '80%', height: '80%', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 50,
            padding: '8px 20px',
            fontFamily: 'var(--font-heading)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--aura-lavender)',
            marginBottom: 24,
          }}
        >
          ✦ Premium Tarot Readings
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(48px, 12vw, 120px)',
            color: '#0a0a0c',
            letterSpacing: '0.01em',
            lineHeight: 0.9,
            marginBottom: 24,
            textShadow: '0 0 30px rgba(255,255,255,0.3)',
          }}
        >
          The Fifth Suit
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'clamp(14px, 4vw, 18px)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(10, 10, 12, 0.8)',
            marginBottom: 40,
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          Navigate the liminal spaces. <br className="hidden sm:block"/>
          <span style={{ color: '#D63D5A', fontWeight: 600 }}>Where the cards meet your destiny.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <Link to="/booking" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              style={{
                background: '#0a0a0c',
                border: 'none',
                borderRadius: 14,
                padding: '18px 32px',
                color: 'white',
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Book a Reading
            </motion.button>
          </Link>
          <Link to="/daily-draw" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ y: -5, background: 'rgba(255,255,255,0.6)' }}
              style={{
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: 14,
                padding: '18px 32px',
                color: '#0a0a0c',
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Daily Draw
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
        <div className="container-max" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(4, 1fr)' }, // Note: Handled via Tailwind grid-cols
          gap: 'clamp(24px, 5vw, 40px)', 
          textAlign: 'center' 
        }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, val: '5,000+', label: 'Souls Guided' },
            { icon: Star, val: '4.9/5', label: 'Celestial Rating' },
            { icon: Sparkles, val: '15yrs', label: 'Ethereal Experience' },
            { icon: Globe, val: 'Worldwide', label: 'Spiritual Reach' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <stat.icon size={20} style={{ color: '#D63D5A', marginBottom: 12, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', color: '#0a0a0c', marginBottom: 4 }}>{stat.val}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(10, 10, 12, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ position: 'relative', width: 'min(100%, 340px)', aspectRatio: '340/440' }}>
                <div style={{ position: 'absolute', inset: -15, border: '1px solid rgba(10,10,12,0.05)', borderRadius: 24, transform: 'rotate(-2deg)' }} />
                <div style={{ position: 'absolute', inset: -15, border: '1px solid rgba(10,10,12,0.05)', borderRadius: 24, transform: 'rotate(1deg)' }} />
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(32px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, #D63D5A 0%, transparent 70%)', filter: 'blur(60px)' }}
                  />
                  <span style={{ fontSize: 96, opacity: 0.1 }}>✦</span>
                </div>
              </div>
            </motion.div>

            <div>
              <SectionHeading subtitle="The Reader" title="Seraphina Vael" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.8, color: 'rgba(10, 10, 12, 0.7)', marginBottom: 24, fontWeight: 450 }}>
                For fifteen years, I have walked the liminal spaces between the seen and the unseen. The cards found me during a time of profound transformation, and they have been my companions, teachers, and mirrors ever since.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 17px)', lineHeight: 1.8, color: 'rgba(10, 10, 12, 0.7)', marginBottom: 32, fontWeight: 450 }}>
                Each reading at TheFifthSuite is a sacred conversation. I do not predict your future. I illuminate the present so clearly that the path forward reveals itself.
              </p>
              <motion.button
                whileHover={{ x: 10 }}
                style={{ background: 'none', border: 'none', color: '#D63D5A', fontFamily: 'var(--font-heading)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}
              >
                Our Sacred Craft →
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING TYPES */}
      <section className="section-padding" style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.01)' }}>
        <div className="container-max">
          <SectionHeading subtitle="Our Offerings" title="Choose Your Reading" centered />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
            marginTop: 48,
          }}>
            {bookingTypesData.map((type, i) => {
              const Icon = iconMap[type.icon]
              return (
                <SpectralTiltCard
                  key={type.id}
                  tintColor={type.color}
                  bgGradient={type.bg}
                  style={{ 
                    padding: 40, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 20, 
                  }}
                >
                  <div style={{
                    width: 56, height: 56,
                    background: `${type.color}11`,
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: type.color,
                    border: `1px solid ${type.color}33`
                  }}>
                    {Icon && <Icon size={28} />}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#0a0a0c', fontWeight: 600 }}>{type.name}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(10, 10, 12, 0.7)', lineHeight: 1.6, flex: 1, fontWeight: 450 }}>{type.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#0a0a0c', fontWeight: 500 }}>{type.price}</p>
                    <motion.button
                      onClick={() => navigate('/booking', { state: { bookingType: type.id } })}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        padding: '10px 20px',
                        background: '#0a0a0c',
                        border: 'none',
                        borderRadius: 10,
                        color: 'white',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      Select
                    </motion.button>
                  </div>
                </SpectralTiltCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container-max">
          <SectionHeading subtitle="Voices from the Journey" title="Testimonials" centered />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(253, 111, 136, 0.2)',
              borderRadius: 32,
              padding: '100px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 24, position: 'relative', color: '#0a0a0c' }}>
              ✦ Your Daily Draw Awaits ✦
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'rgba(10, 10, 12, 0.7)', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.8, position: 'relative', fontWeight: 450 }}>
              Shuffle the 78 cards of the Rider-Waite deck. <br/>
              Let three cards reveal the currents of your day.
            </p>
            <Link to="/daily-draw" style={{ textDecoration: 'none', position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(253,111,136,0.3)' }}
                style={{
                  background: '#0a0a0c',
                  border: 'none',
                  borderRadius: 16,
                  padding: '20px 60px',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 15,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Begin Today's Draw
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(253,111,136,0.1)',
        padding: 'clamp(60px, 12vh, 120px) 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, letterSpacing: '0.2em', color: '#0a0a0c', opacity: 0.8, marginBottom: 16, fontWeight: 600 }}>
          TheFifthSuite
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(10, 10, 12, 0.5)', opacity: 1, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
          Where the cards meet your destiny
        </p>
      </footer>
    </div>
  )
}
