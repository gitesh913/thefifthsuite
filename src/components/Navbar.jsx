import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Sparkles, Moon, User, Book } from 'lucide-react'
import BookOfAnswers from './BookOfAnswers'

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Book', path: '/booking', icon: Sparkles },
  { label: 'Draw', path: '/daily-draw', icon: Moon },
]

export default function Navbar() {
  const location = useLocation()
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
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        zIndex: 100,
      }}>
        <div style={{
          height: '64px',
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 24,
          border: '1px solid rgba(253, 111, 136, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(253, 111, 136, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          margin: '0 auto',
          maxWidth: 1200,
        }}>
          {/* Brand/Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FD6F88, #F8D9E4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(253, 111, 136, 0.3)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(12px, 3vw, 16px)',
            letterSpacing: '0.15em',
            color: '#0a0a0c',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'block',
          }} className="sm:block hidden">
            TheFifthSuit
          </span>
        </Link>

        <div 
          className="hidden sm:flex"
          style={{ 
            gap: 'clamp(2px, 0.5vw, 6px)', 
            alignItems: 'center' 
          }}
        >
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            const Icon = link.icon
            
            return (
              <Link key={link.path} to={link.path} style={{
                textDecoration: 'none',
                position: 'relative',
                padding: '8px clamp(10px, 1.5vw, 18px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                zIndex: 1,
                borderRadius: 16,
                minWidth: 'clamp(60px, 10vw, 80px)',
              }}>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(253, 111, 136, 0.1)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 16,
                      border: '1px solid rgba(253, 111, 136, 0.2)',
                      zIndex: -1,
                    }}
                  />
                )}
                
                <Icon 
                  size={isActive ? 18 : 17} 
                  style={{ 
                    color: isActive ? '#D63D5A' : 'rgba(10, 10, 12, 0.75)',
                    transition: 'all 0.3s ease',
                  }} 
                />
                
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isActive ? '#D63D5A' : 'rgba(10, 10, 12, 0.75)',
                  fontWeight: 700,
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
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px clamp(10px, 1.5vw, 18px)', minWidth: 'clamp(60px, 10vw, 80px)',
            }}
          >
            <Book size={17} style={{ color: 'rgba(10, 10, 12, 0.75)' }} />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(10, 10, 12, 0.75)',
              fontWeight: 700,
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
            borderRadius: '50%',
            border: '1px solid rgba(253, 111, 136, 0.2)',
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 8px 20px rgba(253, 111, 136, 0.12)',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D63D5A',
            cursor: 'pointer',
          }}
          className="flex sm:hidden"
        >
          <Menu size={22} />
        </button>
      </div>
    </nav>

      <AnimatePresence>
        {bookOpen && <BookOfAnswers isOpen={bookOpen} onClose={() => setBookOpen(false)} />}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(252, 234, 240, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: 'min(86vw, 360px)',
                height: '100%',
                background: 'rgba(255, 252, 253, 0.95)',
                borderLeft: '1px solid rgba(253, 111, 136, 0.14)',
                boxShadow: '-20px 0 50px rgba(253, 111, 136, 0.12)',
                borderRadius: '28px 0 0 28px',
                padding: '92px 24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(253, 111, 136, 0.08)',
                  border: '1px solid rgba(253, 111, 136, 0.16)',
                  cursor: 'pointer',
                  color: '#D63D5A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(10, 10, 12, 0.45)',
                }}>
                  Navigation
                </p>

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontFamily: 'var(--font-heading)',
                        fontSize: 22,
                        letterSpacing: '0.08em',
                        color: location.pathname === link.path ? '#D63D5A' : '#0a0a0c',
                      }}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => {
                    setBookOpen(true)
                    setMobileOpen(false)
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 18px',
                    background: 'rgba(253, 111, 136, 0.1)',
                    color: '#D63D5A',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Answers
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
