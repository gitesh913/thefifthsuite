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

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', position: 'relative' }}>
      <AuroraBackground accentColor={hoveredColor} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--aura-lavender)',
              marginBottom: 20,
            }}>
              ✦ Choose Your Path
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(40px, 6vw, 64px)',
              color: 'white',
              marginBottom: 16,
            }}>
              What does your heart seek?
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--aura-ghost)',
              letterSpacing: '0.08em',
            }}>
              Choose the realm of your reading
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {bookingCategories.map((cat, i) => {
              const Icon = iconMap[cat.icon]
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onHoverStart={() => setHoveredColor(cat.auroraColor)}
                  onHoverEnd={() => setHoveredColor(null)}
                  onClick={() => navigate(`/booking/${cat.id}`, { state: { category: cat } })}
                  whileHover={{ y: -6 }}
                  style={{
                    position: 'relative',
                    background: cat.gradient,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${cat.color}4D`,
                    borderRadius: 20,
                    padding: 32,
                    minHeight: 280,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 0 40px ${cat.glow}`
                    e.currentTarget.style.borderColor = `${cat.color}7A`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = `${cat.color}4D`
                  }}
                >
                  {/* Specular highlight */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    borderRadius: '20px 20px 0 0',
                    pointerEvents: 'none',
                  }} />

                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    style={{
                      width: 56, height: 56,
                      background: `${cat.color}1A`,
                      borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${cat.color}33`,
                    }}
                  >
                    {Icon && <Icon size={28} style={{ color: cat.color }} />}
                  </motion.div>

                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    color: 'white',
                    letterSpacing: '0.04em',
                  }}>
                    {cat.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--aura-ghost)',
                    lineHeight: 1.6,
                    flex: 1,
                  }}>
                    {cat.subtitle}
                  </p>

                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: cat.color,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    Begin Reading →
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
