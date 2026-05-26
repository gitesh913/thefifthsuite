import React, { useMemo, useRef, useState, useEffect, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Zap, Clock, Calendar, CalendarRange, Quote, Sparkles, Star, Users, Globe } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import MoonPhaseWidget from '../components/MoonPhaseWidget'
import { useIsMobile } from '../utils/hooks'

const readerImage = "/assets/janvi.jpeg";
const fallbackImage = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop";

const iconMap = { Zap, Clock, Calendar, CalendarRange };

// --- ENHANCED COMPONENTS ---

function SpectralTiltCard({ children, className = '', style = {}, tintColor = '#fff', bgGradient = 'rgba(255, 255, 255, 0.03)' }) {
  const isMobile = useIsMobile()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Reflection tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

  // Dynamic light reflection position
  const reflectX = useSpring(mouseX)
  const reflectY = useSpring(mouseY)

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    const posX = e.clientX - rect.left
    const posY = e.clientY - rect.top
    
    const xPct = posX / width - 0.5
    const yPct = posY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
    
    // Set reflection coords
    mouseX.set((posX / width) * 100)
    mouseY.set((posY / height) * 100)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
      whileHover={isMobile ? { scale: 1.01 } : { 
        scale: 1.02,
        y: -8,
        borderColor: 'rgba(255,255,255,0.2)',
        boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 30px ${tintColor}15`,
      }}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`glass ${className}`}
    >
      {/* Dynamic Light Reflection Layer */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            borderRadius: 'inherit',
            background: useTransform(
              [reflectX, reflectY],
              ([cx, cy]) => `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
            ),
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sweep Shine Effect on Hover */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
            zIndex: 2,
            opacity: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
          whileHover={{ opacity: 1, left: ['-100%', '100%'] }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      
      {/* Background glass saturation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: bgGradient,
        backdropFilter: isMobile ? 'blur(16px)' : 'blur(30px)',
        WebkitBackdropFilter: isMobile ? 'blur(16px)' : 'blur(30px)',
        border: isMobile ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: -1,
        borderRadius: 'inherit',
      }} />

      {/* Persistent Specular Tint */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '40%',
        background: `linear-gradient(135deg, ${tintColor}15 0%, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: 'inherit',
      }} />
      
      {/* Content */}
      <div style={{ transform: isMobile ? 'none' : 'translateZ(40px)', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        {children}
      </div>
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

const SolarSystemBackground = memo(() => {
  const isMobile = useIsMobile()
  const { scrollY } = useScroll()
  const yParallaxRaw = useTransform(scrollY, [0, 2000], [0, 400])
  const yParallax = useSpring(yParallaxRaw, { stiffness: 100, damping: 30 })
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 1.1])

  if (isMobile) return null

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
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', contain: 'strict' }}>
      <motion.div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        y: yParallax,
        scale: scaleParallax,
        opacity: 0.6,
        willChange: 'transform',
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
    </div>
  )
})

const StarField = memo(() => {
  const isMobile = useIsMobile()

  const stars = useMemo(() => {
    const count = isMobile ? 30 : 120
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
      color: Math.random() > 0.8 ? 'var(--aura-lavender)' : Math.random() > 0.9 ? 'var(--aura-teal)' : 'white'
    }))
  }, [isMobile])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          animate={isMobile ? { opacity: [0.3, 0.6, 0.3] } : { opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            background: star.color,
            borderRadius: '50%',
            willChange: 'opacity',
          }}
        />
      ))}
      {!isMobile && <ShootingStar />}
    </div>
  )
})

const SectionHeading = memo(({ subtitle, title, centered = false }) => {
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
})

const bookingTypesData = [
  { 
    id: 'urgent', 
    name: 'Urgent Reading', 
    description: 'Immediate clarity when the path is uncertain. Same-day availability.', 
    icon: 'Zap', 
    price: '₹ 2,500', 
    tint: '#FD6F88',
  },
  { 
    id: 'oneday', 
    name: 'One Day Prior', 
    description: 'Thoughtful preparation for the journey ahead. Scheduled with intent.', 
    icon: 'Clock', 
    price: '₹ 2,000', 
    tint: '#8E9AAF',
  },
  { 
    id: 'weekly', 
    name: 'Weekly Reading', 
    description: 'Your spiritual compass for the seven days ahead. Deep alignment.', 
    icon: 'Calendar', 
    price: '₹ 6,000', 
    tint: '#B28DFF',
  },
  { 
    id: 'monthly', 
    name: 'Monthly Reading', 
    description: 'Exhaustive life review. Mapping the lunar currents of your soul.', 
    icon: 'CalendarRange', 
    price: '₹ 10,000', 
    tint: '#E3BB76',
  },
]


export default function Home() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

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
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        textAlign: isMobile ? 'center' : 'left',
        padding: isMobile ? '160px 6% 80px' : '140px 8% 100px',
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

        <div style={{ position: 'absolute', right: isMobile ? '-20%' : '-10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 'clamp(300px, 80vw, 1000px)', 
              height: 'clamp(300px, 80vw, 1000px)',
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
          ✦ Tarot Readings
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(48px, 14vw, 120px)',
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: 0.85,
            marginBottom: 32,
            textShadow: '0 0 50px rgba(167, 139, 250, 0.3)',
            wordBreak: 'break-word',
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
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: 48,
            maxWidth: isMobile ? '100%' : 500,
            lineHeight: 1.6,
          }}
        >
          Navigate the liminal spaces. <br className="hidden sm:block"/>
          <span style={{ color: 'var(--aura-lavender)', fontWeight: 500 }}>Where the cards meet your destiny.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', width: isMobile ? '100%' : 'auto' }}
        >
          <Link to="/booking" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
            <motion.button
              whileHover={isMobile ? {} : { y: -5, background: 'white', color: 'black' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: 16,
                padding: isMobile ? '18px 0' : '20px 40px',
                width: isMobile ? '100%' : 'auto',
                color: 'black',
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Book a Reading
            </motion.button>
          </Link>
          <Link to="/daily-draw" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
            <motion.button
              whileHover={isMobile ? {} : { y: -5, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 16,
                padding: isMobile ? '18px 0' : '20px 40px',
                width: isMobile ? '100%' : 'auto',
                color: 'white',
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Daily Draw
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { icon: Users, val: '5,000+', label: 'Souls Guided' },
            { icon: Star, val: '4.9/5', label: 'Celestial Rating' },
            { icon: Sparkles, val: '15yrs', label: 'Ethereal Experience' },
            { icon: Globe, val: 'Worldwide', label: 'Spiritual Reach' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <stat.icon size={18} style={{ color: 'var(--aura-lavender)', marginBottom: 12, margin: '0 auto 12px', opacity: 0.8 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'white', marginBottom: 2 }}>{stat.val}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '80px 0' : '120px 0' }}>
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center', order: isMobile ? 2 : 1 }}
            >
              <div style={{ position: 'relative', width: 'min(100%, 380px)', aspectRatio: '340/480' }}>
                <div style={{ position: 'absolute', inset: -15, border: '1px solid rgba(255,255,255,0.03)', borderRadius: 32, transform: 'rotate(-3deg)' }} />
                <div style={{ position: 'absolute', inset: -15, border: '1px solid rgba(255,255,255,0.03)', borderRadius: 32, transform: 'rotate(2deg)' }} />
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 32,
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      height: '100%', 
                      zIndex: 1 
                    }}
                  >
                    <img 
                      src={readerImage} 
                      alt="Janvi Gakher - Tarot Reader" 
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(1.1) brightness(0.9)',
                      }}
                    />
                  </motion.div>
                  
                  {/* Subtle overlay to blend the image */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(10, 10, 15, 0.4))',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }} />
                  
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      height: '100%', 
                      background: 'radial-gradient(circle, var(--aura-lavender) 0%, transparent 70%)', 
                      filter: 'blur(80px)',
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <div style={{ order: isMobile ? 1 : 2, textAlign: isMobile ? 'center' : 'left' }}>
              <SectionHeading subtitle="The Reader" title="Janvi Gakher" centered={isMobile} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 24, fontWeight: 400 }}>
                I’m Janvi Gakher — an intuitive tarot reader offering guidance for life clarity, spiritual growth, emotional healing, and self-reflection.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 40, fontWeight: 400 }}>
               I believe tarot is not about fear or fixed destiny. Tarot is a tool for guidance, reflection, and deeper awareness — not absolute prediction. Your choices, intuition, and personal journey will always matter the most.
              </p>
              <motion.button
                whileHover={isMobile ? {} : { x: 10, color: 'white' }}
                style={{ background: 'none', border: 'none', color: 'var(--aura-lavender)', fontFamily: 'var(--font-heading)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', gap: 12, fontWeight: 700, width: isMobile ? '100%' : 'auto' }}
              >
                Our Sacred Craft →
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING TYPES */}
      <section style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.01)', padding: isMobile ? '80px 0' : '120px 0', marginBottom: 60 }}>
        <div className="container-max">
          <SectionHeading subtitle="Our Offerings" title="Choose Your Reading" centered />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: isMobile ? 20 : 40,
            marginTop: isMobile ? 32 : 80,
          }}>
            {bookingTypesData.map((type, i) => {
              const Icon = iconMap[type.icon]
              return (
                <SpectralTiltCard
                  key={type.id}
                  tintColor={type.tint}
                  bgGradient={isMobile 
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)`
                    : `linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, ${type.tint}05 100%)`
                  }
                  style={{ 
                    padding: isMobile ? '32px 24px' : '48px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: isMobile ? 20 : 24, 
                    border: isMobile ? '1px solid rgba(255, 255, 255, 1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    height: '100%',
                    borderRadius: 24,
                    boxShadow: isMobile ? '0 20px 40px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  <div style={{
                    width: isMobile ? 56 : 64, 
                    height: isMobile ? 56 : 64,
                    background: isMobile ? 'white' : 'rgba(255,255,255,0.7)',
                    borderRadius: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: type.tint,
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                  }}>
                    {Icon && <Icon size={isMobile ? 28 : 32} />}
                  </div>
                  <h3 style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: isMobile ? 20 : 22, 
                    color: '#0a0a0c', 
                    fontWeight: 700,
                    letterSpacing: '0.02em'
                  }}>
                    {type.name}
                  </h3>
                  <p style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: 16, 
                    color: isMobile ? 'rgba(10, 10, 12, 0.8)' : 'rgba(10, 10, 12, 0.6)', 
                    lineHeight: 1.6, 
                    flex: 1, 
                    fontWeight: isMobile ? 500 : 450 
                  }}>
                    {type.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 24 : 28, color: '#0a0a0c', fontWeight: 600 }}>{type.price}</p>
                    <motion.button
                      onClick={() => navigate('/booking', { state: { bookingType: type.id } })}
                      whileHover={isMobile ? {} : { scale: 1.05, background: '#0a0a0c', color: 'white' }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '12px 24px',
                        background: '#0a0a0c',
                        border: 'none',
                        borderRadius: 12,
                        color: 'white',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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

      {/* DAILY DRAW CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: isMobile ? '60px 0 100px' : '100px 0 160px' }}>
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: isMobile ? 32 : 48,
              padding: isMobile ? '80px 24px' : '120px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--aura-lavender) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}
            />
            
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(32px, 8vw, 80px)', marginBottom: 24, position: 'relative', color: 'white', lineHeight: 1.1 }}>
              ✦ Your Daily Draw Awaits ✦
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? 16 : 18, color: 'rgba(255, 255, 255, 0.5)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.8, position: 'relative', fontWeight: 400 }}>
              Shuffle the 78 cards of the Rider-Waite deck. <br/>
              Let three cards reveal the currents of your day.
            </p>
            <Link to="/daily-draw" style={{ textDecoration: 'none', position: 'relative', display: 'inline-block', width: isMobile ? '100%' : 'auto' }}>
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.05, background: 'white', color: 'black' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: 16,
                  padding: isMobile ? '20px 0' : '24px 64px',
                  width: isMobile ? '100%' : 'auto',
                  color: 'black',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontWeight: 700,
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
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '100px 24px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, letterSpacing: '0.3em', color: 'white', opacity: 0.9, marginBottom: 16, fontWeight: 600, textTransform: 'uppercase' }}>
          The Fifth Suit
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
          Where the intuition meet your destiny
        </p>
      </footer>
    </div>
  )
}

