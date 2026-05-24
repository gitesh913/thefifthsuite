import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import MoonPhaseWidget from './components/MoonPhaseWidget'

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
      duration: 0.4, 
      ease: "easeOut",
    }}
    style={{ position: 'relative' }}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <>
      <AnimatePresence>
        {location.pathname === '/' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              position: 'fixed',
              right: 48,
              top: '25%', 
              zIndex: 90,
            }}
          >
            <MoonPhaseWidget />
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07060f' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ width: 40, height: 40, border: '2px solid rgba(192,132,252,0.3)', borderTopColor: '#c084fc', borderRadius: '50%' }}
          />
        </div>
      }>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
