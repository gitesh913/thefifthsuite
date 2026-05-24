import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Zap, Clock, Calendar, CalendarRange, Quote, Sparkles, Star, Users, Globe } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'

const iconMap = { Zap, Clock, Calendar, CalendarRange }

// --- ENHANCED COMPONENTS ---

function SpectralTiltCard({ children, className = '', style = {}, tintColor = '#fff' }) {
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
        borderColor: tintColor,
        boxShadow: `0 25px 50px rgba(0,0,0,0.1), 0 0 25px ${tintColor}66`,
      }}
      className={`glass ${className}`}
    >
      {/* Intense Reflection Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${tintColor}44 0%, ${tintColor}11 40%, transparent 60%, ${tintColor}33 100%)`,
          zIndex: 0,
          borderRadius: 'inherit',
        }}
        whileHover={{ background: `linear-gradient(135deg, ${tintColor}66 0%, ${tintColor}22 40%, transparent 60%, ${tintColor}44 100%)` }}
      />
      
      {/* Background glass saturation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px) saturate(200%)',
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
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 50%, transparent 55%)',
          zIndex: 1,
          opacity: 0,
          borderRadius: 'inherit',
        }}
        whileHover={{ opacity: 0.3, left: ['-100%', '100%'] }}
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
  { id: 'urgent', name: 'Urgent Reading', description: 'Immediate clarity when the path is uncertain. Same-day availability.', icon: 'Zap', price: '₹ 2,500', color: '#f28482' }, // Red/Coral
  { id: 'oneday', name: 'One Day Prior', description: 'Thoughtful preparation for the journey ahead. Scheduled with intent.', icon: 'Clock', price: '₹ 2,000', color: '#84a59d' }, // Green/Sage
  { id: 'weekly', name: 'Weekly Reading', description: 'Your spiritual compass for the seven days ahead. Deep alignment.', icon: 'Calendar', price: '₹ 6,000', color: '#f5cac3' }, // Orange/Peach
  { id: 'monthly', name: 'Monthly Reading', description: 'Exhaustive life review. Mapping the lunar currents of your soul.', icon: 'CalendarRange', price: '₹ 10,000', color: '#f7ede2' }, // Yellow/Cream
]


export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper" style={{ position: 'relative', background: 'var(--bg-void)' }}>
      <AuroraBackground />
      <StarField />
      <SolarSystemBackground />

      {/* HERO */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        textAlign: 'left',
        padding: '0 8%',
        maxWidth: 1400,
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, pointerEvents: 'none' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 800, height: 800,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: '80%', height: '80%', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '100%', height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', width: 1, height: '100%', background: 'rgba(255,255,255,0.1)' }} />
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
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--aura-lavender)',
            marginBottom: 32,
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
            fontSize: 'clamp(56px, 10vw, 120px)',
            color: '#0a0a0c', // Pure dark for visibility
            letterSpacing: '0.02em',
            lineHeight: 1,
            marginBottom: 24,
            textShadow: '0 0 30px rgba(255,255,255,0.4)', // Subtle halo for extra pop
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
            fontWeight: 400, // Slightly bolder for legibility
            fontSize: 18,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(10, 10, 12, 0.8)', // Higher contrast
            marginBottom: 40,
            maxWidth: 600,
          }}
        >
          Navigate the liminal spaces. <br/>
          <span style={{ color: '#D63D5A', opacity: 1, fontWeight: 500 }}>Where the cards meet your destiny.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
        >
          <Link to="/booking" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '18px 40px',
                color: 'var(--aura-white)',
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
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
              whileHover={{ y: -5, background: 'rgba(255,255,255,0.08)' }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 14,
                padding: '18px 40px',
                color: 'var(--aura-white)',
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
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
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container-max" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { icon: Users, val: '5,000+', label: 'Souls Guided' },
            { icon: Star, val: '4.9/5', label: 'Celestial Rating' },
            { icon: Sparkles, val: '15yrs', label: 'Ethereal Experience' },
            { icon: Globe, val: 'Worldwide', label: 'Spiritual Reach' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <stat.icon size={24} style={{ color: 'var(--aura-lavender)', marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--aura-white)', marginBottom: 4 }}>{stat.val}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--aura-ghost)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container-max">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 80,
            alignItems: 'center',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ position: 'relative', width: 340, height: 440 }}>
                <div style={{ position: 'absolute', inset: -20, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, transform: 'rotate(-3deg)' }} />
                <div style={{ position: 'absolute', inset: -20, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, transform: 'rotate(2deg)' }} />
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, var(--aura-rose) 0%, transparent 70%)', filter: 'blur(60px)' }}
                  />
                  <span style={{ fontSize: 96, opacity: 0.2 }}>✦</span>
                </div>
              </div>
            </motion.div>

            <div>
              <SectionHeading subtitle="About the Reader" title="Seraphina Vael" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, color: '#0a0a0c', marginBottom: 24, fontWeight: 450 }}>
                For fifteen years, I have walked the liminal spaces between the seen and the unseen. The cards found me during a time of profound transformation, and they have been my companions, teachers, and mirrors ever since.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, color: '#0a0a0c', marginBottom: 32, fontWeight: 450 }}>
                Each reading at TheFifthSuite is a sacred conversation — between you, the cards, and the deeper currents of your own knowing. I do not predict your future. I illuminate the present so clearly that the path forward reveals itself.
              </p>
              <motion.button
                whileHover={{ x: 10 }}
                style={{ background: 'none', border: 'none', color: '#D63D5A', fontFamily: 'var(--font-heading)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600 }}
              >
                Learn More about the Craft →
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
                  style={{ 
                    padding: 40, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 20, 
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.05)'
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
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, letterSpacing: '0.2em', color: '#0a0a0c', opacity: 0.8, marginBottom: 12, fontWeight: 600 }}>
          TheFifthSuite
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(10, 10, 12, 0.5)', opacity: 1, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
          Where the cards meet your destiny
        </p>
      </footer>
    </div>
  )
}
