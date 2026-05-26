import React, { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import CelestialCalendar from '../components/CelestialCalendar'
import { bookingCategories } from '../data/bookingTypes'

const defaultCategory = {
  id: 'love',
  title: 'General',
  subtitle: 'A personal reading for you',
  color: '#c084fc',
  glow: 'rgba(192,132,252,0.25)',
  auroraColor: '#7c3aed',
}

const readingTypes = ['Urgent', 'One Day Prior', 'Weekly', 'Monthly']

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid phone number required (min 10 digits)'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email address required'
  if (!form.readingType) errors.readingType = 'Please select a reading type'
  if (!form.date) errors.date = 'Please select a preferred date'
  return errors
}

// Mock data for already booked days
const initialBookedDays = [
  `${new Date().toISOString().split('T')[0]}`,
]

export default function BookingForm() {
  const { categoryId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const category = location.state?.category ||
    bookingCategories.find(c => c.id === categoryId) ||
    defaultCategory

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    readingType: location.state?.bookingType ? readingTypes[['urgent','oneday','weekly','monthly'].indexOf(location.state.bookingType)] || '' : '',
    date: '',
  })
  
  const [bookedDays, setBookedDays] = useState(initialBookedDays)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async () => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    
    // Final Availability Check
    if (bookedDays.includes(form.date)) {
      setErrors({ date: 'This celestial day was just aligned by another soul.' })
      return
    }
    
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    
    setBookedDays(prev => [...prev, form.date])
    
    setSubmitting(false)
    setSuccess(true)
  }

  const inputStyle = (field) => ({
    background: 'rgba(255, 255, 255, 0.4)',
    border: 'none',
    borderBottom: `1px solid ${errors[field] ? 'var(--aura-lavender)' : 'rgba(10, 10, 12, 0.1)'}`,
    borderRadius: '12px 12px 0 0',
    padding: '16px 20px',
    color: '#0a0a0c',
    fontFamily: 'var(--font-body)',
    width: '100%',
    outline: 'none',
    fontSize: 15,
    backdropFilter: isMobile ? 'none' : 'blur(12px)',
    WebkitBackdropFilter: isMobile ? 'none' : 'blur(12px)',
    transition: 'all 0.3s ease',
  })

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', transition: 'background 1s ease' }}>
      <AuroraBackground accentColor={category.auroraColor} />

      {/* Dynamic Background Overlay based on Category */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        style={{ 
          position: 'fixed', inset: 0, 
          background: category.color, 
          pointerEvents: 'none', 
          zIndex: 0,
          filter: isMobile ? 'blur(40px)' : 'blur(100px)'
        }} 
      />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(80px, 10vh, 120px)', paddingBottom: 80, paddingLeft: 'min(24px, 5vw)', paddingRight: 'min(24px, 5vw)' }}>
        <div className="container-max" style={{ maxWidth: 720 }}>
          {/* Breadcrumb with category tint */}
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10, 10, 12, 0.5)' }}>
              <Link to="/booking" style={{ color: 'inherit', textDecoration: 'none' }}>The Sanctuary</Link>
              {' '} • {' '}
              <span style={{ color: category.color, fontWeight: 700 }}>{category.title}</span>
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: 'rgba(255, 255, 255, 0.5)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                color: category.color,
                boxShadow: `0 8px 20px ${category.glow}`
              }}>
                ✦
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(32px, 8vw, 64px)',
                color: '#0a0a0c',
                lineHeight: 1,
              }}>
                {category.title}
              </h1>
            </div>
            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: 'clamp(16px, 4vw, 18px)', 
              color: 'rgba(10, 10, 12, 0.7)', 
              fontWeight: 450,
              maxWidth: 500
            }}>
              {category.subtitle}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass"
                style={{
                  padding: 'clamp(24px, 6vw, 56px) clamp(20px, 5vw, 48px)',
                  borderRadius: 32,
                  background: category.gradient,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: `0 30px 70px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.8)`,
                }}
              >
                {/* Reading type selection */}
                <div style={{ marginBottom: 48 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0a0a0c', marginBottom: 20, fontWeight: 700 }}>
                    Select Your Intent
                  </label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: window.innerWidth < 640 ? 'center' : 'flex-start' }}>
                    {readingTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleChange('readingType', type)}
                        style={{
                          padding: window.innerWidth < 640 ? '10px 16px' : '12px 24px',
                          borderRadius: 14,
                          border: `1px solid ${form.readingType === type ? '#0a0a0c' : 'rgba(10, 10, 12, 0.1)'}`,
                          background: form.readingType === type ? '#0a0a0c' : 'rgba(255, 255, 255, 0.3)',
                          color: form.readingType === type ? 'white' : 'rgba(10, 10, 12, 0.6)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: window.innerWidth < 640 ? 10 : 12,
                          letterSpacing: '0.05em',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: form.readingType === type ? `0 10px 20px rgba(0,0,0,0.1)` : 'none',
                          flex: window.innerWidth < 640 ? '1 1 calc(50% - 10px)' : 'none',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.readingType && <span className="field-error">{errors.readingType}</span>}
                </div>

                {/* Main Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {[
                    { label: 'Name on the Stars', field: 'name', type: 'text', placeholder: 'Enter your full name' },
                    { label: 'Contact Channel', field: 'phone', type: 'tel', placeholder: '+91 00000 00000' },
                    { label: 'Electronic Scroll', field: 'email', type: 'email', placeholder: 'your@essence.com' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0a0a0c', marginBottom: 10, fontWeight: 700 }}>
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        style={inputStyle(field)}
                        onFocus={e => { 
                          e.target.style.borderBottomColor = category.color; 
                          e.target.style.boxShadow = `0 1px 0 ${category.color}`;
                          e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                        }}
                        onBlur={e => { 
                          e.target.style.borderBottomColor = errors[field] ? 'var(--aura-lavender)' : 'rgba(10, 10, 12, 0.1)'; 
                          e.target.style.boxShadow = 'none';
                          e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                        }}
                      />
                      {errors[field] && <span className="field-error">{errors[field]}</span>}
                    </div>
                  ))}

                  {/* Date Selection - Celestial Calendar */}
                  <div style={{ marginTop: 16 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0a0a0c', marginBottom: 20, fontWeight: 700 }}>
                      Consult the Alignment
                    </label>
                    <CelestialCalendar 
                      selectedDate={form.date}
                      onDateChange={(date) => handleChange('date', date)}
                      themeColor={category.color}
                      themeGradient={category.gradient}
                      unavailableSlots={bookedDays}
                    />
                    {errors.date && (
                      <div style={{ marginTop: 12 }}>
                        <span className="field-error">{errors.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Call */}
                <motion.button
                  whileHover={{ scale: 1.02, background: '#0a0a0c', boxShadow: `0 15px 30px rgba(0,0,0,0.2)` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    marginTop: 56,
                    width: '100%',
                    height: 64,
                    background: '#0a0a0c',
                    border: 'none',
                    borderRadius: 16,
                    color: 'white',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 15,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                >
                  {submitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Loader size={20} />
                      </motion.div>
                      <span>Aligning Stars...</span>
                    </>
                  ) : `Request ${category.title} Reading`}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{
                  padding: 80,
                  textAlign: 'center',
                  borderRadius: 40,
                  background: category.gradient,
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: `0 40px 100px rgba(0,0,0,0.1), 0 0 40px ${category.glow}`,
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  style={{ marginBottom: 40 }}
                >
                  <div style={{ 
                    width: 100, height: 100, 
                    borderRadius: '50%', 
                    background: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: `0 20px 40px rgba(0,0,0,0.05)`
                  }}>
                    <CheckCircle size={56} style={{ color: category.color }} />
                  </div>
                </motion.div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 42, color: '#0a0a0c', marginBottom: 20 }}>
                  Destiny Shared
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'rgba(10, 10, 12, 0.7)', marginBottom: 48, lineHeight: 1.8, fontWeight: 450, maxWidth: 500, margin: '0 auto 48px' }}>
                  Seraphina has received your intent for a <strong>{category.title}</strong> session. A confirmation scroll will reach your inbox shortly.
                </p>
                <motion.button
                  whileHover={{ y: -4, background: '#1a1a1a', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  onClick={() => navigate('/')}
                  style={{
                    padding: '20px 48px',
                    background: '#0a0a0c',
                    border: 'none',
                    borderRadius: 16,
                    color: 'white',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 14,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Return to Sanctuary
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
