import React, { useState } from 'react'
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

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 24, left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: 1200,
        height: 72,
        zIndex: 100,
        // Premium Light Glassmorphism
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 24,
        border: '1px solid rgba(253, 111, 136, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(253, 111, 136, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        gap: 8,
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
            fontSize: 16,
            letterSpacing: '0.15em',
            color: '#0a0a0c',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            TheFifthSuite
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            const Icon = link.icon
            
            return (
              <Link key={link.path} to={link.path} style={{
                textDecoration: 'none',
                position: 'relative',
                padding: '10px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                zIndex: 1,
                borderRadius: 16,
                minWidth: 70,
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
                      boxShadow: '0 4px 12px rgba(253, 111, 136, 0.05)',
                      zIndex: -1,
                    }}
                  />
                )}
                
                <Icon 
                  size={18} 
                  style={{ 
                    color: isActive ? '#D63D5A' : 'rgba(10, 10, 12, 0.6)',
                    transition: 'color 0.3s',
                  }} 
                />
                
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isActive ? '#D63D5A' : 'rgba(10, 10, 12, 0.6)',
                  transition: 'color 0.3s',
                }}>
                  {link.label}
                </span>
              </Link>
            )
          })}

          {/* Book Of Answers Trigger */}
          <button
            onClick={() => setBookOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 20px', minWidth: 70,
            }}
          >
            <Book size={18} style={{ color: 'rgba(10, 10, 12, 0.6)' }} />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(10, 10, 12, 0.6)',
            }}>
              Answers
            </span>
          </button>

          <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)', margin: '0 8px' }} />

          <Link to="/login" style={{
            textDecoration: 'none',
            padding: '10px 24px',
            borderRadius: 12,
            background: '#0a0a0c',
            color: 'white',
            fontFamily: 'var(--font-heading)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Login
          </Link>
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
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(252, 234, 240, 0.98)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 40,
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 24,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#FD6F88',
              }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 24,
                    letterSpacing: '0.1em',
                    color: location.pathname === link.path ? '#D63D5A' : '#0a0a0c',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
