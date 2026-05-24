import React, { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
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
  if (!form.time) errors.time = 'Please select a preferred time'
  return errors
}

export default function BookingForm() {
  const { categoryId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const category = location.state?.category ||
    bookingCategories.find(c => c.id === categoryId) ||
    defaultCategory

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    readingType: location.state?.bookingType ? readingTypes[['urgent','oneday','weekly','monthly'].indexOf(location.state.bookingType)] || '' : '',
    date: '', time: '',
  })
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
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1600))
    setSubmitting(false)
    setSuccess(true)
  }

  const inputStyle = (field) => ({
    background: 'rgba(255,255,255,0.04)',
    border: 'none',
    borderBottom: `1px solid ${errors[field] ? 'rgba(249,168,212,0.6)' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: '8px 8px 0 0',
    padding: '14px 16px',
    color: 'var(--aura-white)',
    fontFamily: 'var(--font-body)',
    width: '100%',
    outline: 'none',
    fontSize: 14,
    backdropFilter: 'blur(8px)',
    transition: 'border-color 0.2s',
  })

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh' }}>
      <AuroraBackground accentColor={category.auroraColor} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 100, paddingBottom: 80, padding: '100px 24px 80px' }}>
        {/* Breadcrumb */}
        <div className="container-max" style={{ maxWidth: 700 }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--aura-ghost)' }}>
              <Link to="/booking" style={{ color: 'var(--aura-ghost)', textDecoration: 'none' }}>Bookings</Link>
              {' → '}
              <span style={{ color: 'white' }}>{category.title}</span>
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 5vw, 56px)',
              color: category.color,
              marginBottom: 12,
            }}>
              {category.title} Reading
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--aura-ghost)' }}>
              {category.subtitle}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass"
                style={{
                  padding: 48,
                  border: `1px solid ${category.color}3F`,
                  boxShadow: `0 0 60px ${category.color}1A, var(--glass-shadow)`,
                }}
              >
                {/* Reading type pills */}
                <div style={{ marginBottom: 40 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: category.color, marginBottom: 12 }}>
                    Reading Type
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {readingTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleChange('readingType', type)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: 50,
                          border: `1px solid ${form.readingType === type ? category.color : 'rgba(255,255,255,0.2)'}`,
                          background: form.readingType === type ? `${category.color}1A` : 'transparent',
                          color: form.readingType === type ? category.color : 'var(--aura-ghost)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.readingType && <span className="field-error">{errors.readingType}</span>}
                </div>

                {/* Fields */}
                {[
                  { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your full name' },
                  { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                  { label: 'Email Address', field: 'email', type: 'email', placeholder: 'you@example.com' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} style={{ marginBottom: 32 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: category.color, marginBottom: 8 }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      placeholder={placeholder}
                      style={inputStyle(field)}
                      onFocus={e => { e.target.style.borderBottomColor = category.color; e.target.style.boxShadow = `0 2px 0 ${category.color}` }}
                      onBlur={e => { e.target.style.borderBottomColor = errors[field] ? 'rgba(249,168,212,0.6)' : 'rgba(255,255,255,0.2)'; e.target.style.boxShadow = 'none' }}
                    />
                    {errors[field] && <span className="field-error">{errors[field]}</span>}
                  </div>
                ))}

                {/* Date + Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: category.color, marginBottom: 8 }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => handleChange('date', e.target.value)}
                      style={{ ...inputStyle('date'), colorScheme: 'dark' }}
                      onFocus={e => { e.target.style.borderBottomColor = category.color }}
                      onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
                    />
                    {errors.date && <span className="field-error">{errors.date}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: category.color, marginBottom: 8 }}>
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={e => handleChange('time', e.target.value)}
                      style={{ ...inputStyle('time'), colorScheme: 'dark' }}
                      onFocus={e => { e.target.style.borderBottomColor = category.color }}
                      onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)' }}
                    />
                    {errors.time && <span className="field-error">{errors.time}</span>}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ background: `${category.color}33` }}
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    height: 56,
                    background: `${category.color}1A`,
                    border: `1px solid ${category.color}7A`,
                    borderRadius: 12,
                    color: 'white',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 14,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                  }}
                >
                  {submitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Loader size={18} />
                      </motion.div>
                      <span>Sending your request...</span>
                    </>
                  ) : 'Request Your Reading'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{
                  padding: 64,
                  textAlign: 'center',
                  border: `1px solid ${category.color}3F`,
                  boxShadow: `0 0 60px ${category.color}1A`,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  style={{ marginBottom: 32 }}
                >
                  <CheckCircle size={72} style={{ color: category.color, margin: '0 auto' }} />
                </motion.div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 36, color: 'white', marginBottom: 16 }}>
                  Your request has been received.
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--aura-ghost)', marginBottom: 40, lineHeight: 1.7 }}>
                  The reader will confirm your session personally. Check your email for next steps.
                </p>
                <motion.button
                  whileHover={{ y: -3 }}
                  onClick={() => navigate('/')}
                  style={{
                    padding: '14px 32px',
                    background: `${category.color}1A`,
                    border: `1px solid ${category.color}7A`,
                    borderRadius: 12,
                    color: 'white',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 13,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Return Home
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
