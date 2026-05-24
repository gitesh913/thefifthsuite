import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuroraBackground from '../components/AuroraBackground'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4" />
      <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853" />
      <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05" />
      <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px 8px 0 0',
    padding: '14px 16px',
    color: 'var(--aura-white)',
    fontFamily: 'var(--font-body)',
    width: '100%',
    outline: 'none',
    fontSize: 14,
    backdropFilter: 'blur(8px)',
    marginBottom: 24,
  }

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 48,
          borderRadius: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, letterSpacing: '0.15em', color: 'var(--aura-lavender)', marginBottom: 10 }}>
            TheFifthSuite
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--aura-ghost)' }}>
            Sign in to continue your journey
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: 32,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {['signin', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--aura-lavender)' : '2px solid transparent',
                marginBottom: -1,
                color: tab === t ? 'white' : 'var(--aura-ghost)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Google button */}
        <motion.button
          whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.4)' }}
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            height: 52,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 12,
            color: 'white',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 28,
            transition: 'all 0.2s',
          }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--aura-ghost)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'signup' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--aura-lavender)', marginBottom: 8 }}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderBottomColor = 'var(--aura-lavender)' }}
                  onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--aura-lavender)', marginBottom: 8 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--aura-lavender)' }}
                onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--aura-lavender)', marginBottom: 8 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--aura-lavender)' }}
                onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
              />
            </div>
            {tab === 'signup' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--aura-lavender)', marginBottom: 8 }}>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderBottomColor = 'var(--aura-lavender)' }}
                  onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
                />
              </div>
            )}
            {tab === 'signin' && (
              <div style={{ textAlign: 'right', marginTop: -16, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--aura-ghost)', cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ boxShadow: '0 0 30px rgba(192,132,252,0.35)' }}
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(192,132,252,0.12)',
            border: '1px solid rgba(192,132,252,0.5)',
            borderRadius: 12,
            color: 'white',
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: 4,
          }}
        >
          {tab === 'signin' ? 'Sign In' : 'Create Account'}
        </motion.button>
      </motion.div>
    </div>
  )
}
