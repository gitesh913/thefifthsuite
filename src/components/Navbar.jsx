import React, { useEffect, useState, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Sparkles, Moon, User, Book } from 'lucide-react'
import BookOfAnswers from './BookOfAnswers'
import { useIsMobile } from '../utils/hooks'

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Session', path: '/booking', icon: Sparkles },
  { label: 'Draw', path: '/daily-draw', icon: Moon },
]

function Navbar() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '12px', 
        left: 0, 
        width: '100%',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        willChange: 'transform',
      }}>
        <div style={{
          pointerEvents: 'auto',
          height: isMobile ? '80px' : '72px',
          background: isMobile ? 'rgba(10, 10, 15, 0.98)' : 'rgba(15, 15, 25, 0.7)',
          backdropFilter: isMobile ? 'blur(16px)' : 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: isMobile ? 'blur(16px)' : 'blur(24px) saturate(180%)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 24px' : '0 32px',
          margin: '0 auto',
          width: isMobile ? '92%' : '84%',
          maxWidth: 1176,
          position: 'relative',
          overflow: 'hidden',
          gap: isMobile ? '16px' : '40px'
        }}>
          {/* Boundary Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          }} />

          {/* Brand/Logo */}
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 3 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--aura-lavender), #4c1d95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.3)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? '10px' : 'clamp(12px, 3vw, 15px)',
            letterSpacing: '0.2em',
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'block',
          }}>
            The Fifth Suit
          </span>
        </Link>

        {/* Navigation Cluster - Aligned Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', zIndex: 3 }}>
          {/* Navigation Content - Desktop */}
          <div 
            className="hidden sm:flex"
            style={{ 
              gap: '4px', 
              alignItems: 'center',
            }}
          >
            {navLinks.map(link => {
              const isActive = location.pathname === link.path
              const Icon = link.icon
              
              return (
                <Link key={link.path} to={link.path} style={{
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  zIndex: 1,
                  borderRadius: 14,
                }}>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 14,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  
                  <Icon 
                    size={16} 
                    style={{ 
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.3s ease',
                    }} 
                  />
                  
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 600,
                  }} className="md:block hidden">
                    {link.label}
                  </span>
                </Link>
              )
            })}

            <button
              onClick={() => setBookOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px',
                position: 'relative',
              }}
            >
              {bookOpen && (
                <motion.div
                  layoutId="active-pill"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: -1,
                  }}
                />
              )}
              <Book size={16} style={{ color: bookOpen ? 'white' : 'rgba(255, 255, 255, 0.5)' }} />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: bookOpen ? 'white' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: 600,
              }} className="md:block hidden">
                Answers
              </span>
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
            }}
            className="sm:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>

      <AnimatePresence>
        {bookOpen && <BookOfAnswers isOpen={bookOpen} onClose={() => setBookOpen(false)} />}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(3, 3, 5, 0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                background: 'rgba(10, 10, 15, 0.98)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '-40px 0 100px rgba(0, 0, 0, 0.5)',
                padding: '100px 40px 40px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 32,
                  right: 32,
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 11,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'var(--aura-lavender)',
                  fontWeight: 600,
                }}>
                  Navigation
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 20,
                          fontFamily: 'var(--font-display)',
                          fontSize: 36,
                          color: location.pathname === link.path ? 'var(--aura-lavender)' : 'white',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        <link.icon size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() => {
                        setBookOpen(true)
                        setMobileOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontFamily: 'var(--font-display)',
                        fontSize: 36,
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <Book size={24} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                      Answers
                    </button>
                  </motion.div>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--aura-lavender), transparent)', opacity: 0.2, marginBottom: 32 }} />
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  The Fifth Suit
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Navbar)
