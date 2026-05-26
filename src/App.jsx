import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Error Boundary for Lazy Loading
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo)
    
    // Prevent infinite reload loop
    const lastReload = sessionStorage.getItem('last_lazy_reload')
    const now = Date.now()
    
    if (!lastReload || now - parseInt(lastReload) > 5000) {
      sessionStorage.setItem('last_lazy_reload', now.toString())
      window.location.reload()
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#030305', color: 'white', padding: 20, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Celestial Alignment Interrupted</h2>
          <p style={{ opacity: 0.6, marginBottom: 24 }}>The cosmic winds are heavy. Attempting to restore the sanctuary...</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'var(--aura-lavender)', border: 'none', borderRadius: 12, color: 'black', fontWeight: 700 }}>
            Retry Now
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const Home = lazy(() => import('./pages/Home'))
const BookingCategories = lazy(() => import('./pages/BookingCategories'))
const BookingForm = lazy(() => import('./pages/BookingForm'))
const DailyDraw = lazy(() => import('./pages/DailyDraw'))
const Login = lazy(() => import('./pages/Login'))
const MoonDetails = lazy(() => import('./pages/MoonDetails'))

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ 
      duration: 0.3, 
      ease: "linear",
    }}
    style={{ position: 'relative', willChange: 'opacity' }}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/booking" element={<PageWrapper><BookingCategories /></PageWrapper>} />
        <Route path="/booking/:categoryId" element={<PageWrapper><BookingForm /></PageWrapper>} />
        <Route path="/daily-draw" element={<PageWrapper><DailyDraw /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/moon-details" element={<PageWrapper><MoonDetails /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <LazyErrorBoundary>
        <Suspense fallback={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030305' }}>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ width: 40, height: 40, border: '2px solid rgba(167, 139, 250, 0.2)', borderTopColor: '#a78bfa', borderRadius: '50%' }}
            />
          </div>
        }>
          <AnimatedRoutes />
        </Suspense>
      </LazyErrorBoundary>
    </BrowserRouter>
  )
}

export default App
