import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Briefcase, Sparkles, Navigation, Leaf, Clock } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import { bookingCategories } from '../data/bookingTypes'

const iconMap = { Heart, Briefcase, Sparkles, Navigation, Leaf, Clock }

export default function BookingCategories() {
  const navigate = useNavigate()
  const [hoveredColor, setHoveredColor] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', position: 'relative' }}>
      <AuroraBackground accentColor={hoveredColor} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(80px, 12vh, 120px)', paddingBottom: 80 }}>
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vh, 64px)' }}
          >
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--aura-lavender)',
              marginBottom: 16,
              fontWeight: 700,
            }}>
              ✦ Choose Your Path
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 8vw, 64px)',
              color: '#0a0a0c',
              marginBottom: 16,
              lineHeight: 1.1,
            }}>
              What does your heart seek?
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2vw, 15px)',
              color: 'rgba(10, 10, 12, 0.6)',
              letterSpacing: '0.08em',
              fontWeight: 450,
            }}>
              Choose the realm of your reading
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {bookingCategories.map((cat, i) => {
              const Icon = iconMap[cat.icon]
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  onHoverStart={() => setHoveredColor(cat.auroraColor)}
                  onHoverEnd={() => setHoveredColor(null)}
                  onClick={() => navigate(`/booking/${cat.id}`, { state: { category: cat } })}
                  whileHover={isMobile ? {} : { 
                    y: -8, 
                    scale: 1.02,
                  }}
                  style={{
                    position: 'relative',
                    background: isMobile ? 'rgba(255, 255, 255, 0.8)' : cat.gradient,
                    backdropFilter: isMobile ? 'blur(10px)' : 'blur(32px)',
                    WebkitBackdropFilter: isMobile ? 'blur(10px)' : 'blur(32px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 24,
                    padding: 'clamp(24px, 5vw, 40px)',
                    minHeight: 'clamp(280px, 40vh, 340px)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    boxShadow: `
                      0 10px 40px rgba(0,0,0,0.06), 
                      inset 0 1px 2px rgba(255,255,255,0.6),
                      inset 0 -2px 10px rgba(0,0,0,0.02)
                    `,
                  }}
                >
                  {/* Enhanced Specular Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, transparent 60%, rgba(0,0,0,0.02) 100%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }} />

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 20 }}>
                    <motion.div
                      style={{
                        width: 56, height: 56,
                        background: 'rgba(255, 255, 255, 0.4)',
                        borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        color: cat.color,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      }}
                    >
                      {Icon && <Icon size={24} />}
                    </motion.div>

                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(18px, 3vw, 22px)',
                        color: '#0a0a0c',
                        letterSpacing: '0.02em',
                        marginBottom: 6,
                        fontWeight: 700,
                      }}>
                        {cat.title}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 9,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: cat.color,
                        fontWeight: 700,
                      }}>
                        {cat.theme}
                      </p>
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      color: 'rgba(10, 10, 12, 0.7)',
                      lineHeight: 1.6,
                      flex: 1,
                      fontWeight: 450,
                    }}>
                      {cat.subtitle}
                    </p>

                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 11,
                      color: '#0a0a0c',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 700,
                    }}>
                      Begin Journey <span>→</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.15 }}
                    style={{
                      position: 'absolute',
                      bottom: -20,
                      right: -20,
                      width: 120,
                      height: 120,
                      background: cat.color,
                      filter: 'blur(40px)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
