import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RotateCcw, Wand2, BookOpen } from 'lucide-react';
import { useIsMobile } from '../utils/hooks';

const answers = [
  { title: "STRONG YES", text: "The path is fully aligned in your favor. Move forward with confidence and trust." },
  { title: "YES", text: "The signs are positive. Your desire carries strong potential for success." },
  { title: "MOSTLY POSITIVE", text: "The energy supports your wish, though patience and effort remain important." },
  { title: "PROMISING BUT DELAYED", text: "What you seek may arrive later than expected, but the outcome remains favorable." },
  { title: "PROCEED WITH CAUTION", text: "The door is open, but hidden challenges require awareness and wisdom." },
  { title: "UNCLEAR", text: "The answer is clouded right now. More clarity and time are needed." },
  { title: "NOT THE RIGHT TIME", text: "The moment has not yet arrived. Waiting may bring a better outcome." },
  { title: "DOUBTFUL OUTCOME", text: "The current energy weakens the possibility of success. Reconsider carefully." },
  { title: "NO", text: "The path does not appear favorable at this time." },
  { title: "STRONG NO", text: "This direction may lead to disappointment or imbalance. Avoid proceeding." }
];

export default function BookOfAnswers({ isOpen, onClose }) {
  const [phase, setPhase] = useState('opening'); // opening, ready, flipping, result
  const [answer, setAnswer] = useState(null);
  const isMobile = useIsMobile();

  // Transition from opening cover to ready for interaction
  useEffect(() => {
    if (isOpen) {
      setPhase('opening');
      const timer = setTimeout(() => setPhase('ready'), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFindAnswer = () => {
    setPhase('flipping');
    setTimeout(() => {
      const randomAns = answers[Math.floor(Math.random() * answers.length)];
      setAnswer(randomAns);
      setPhase('result');
    }, 3000);
  };

  const handleRetry = () => {
    setPhase('ready');
    setAnswer(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 3, 5, 0.98)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
        backdropFilter: isMobile ? 'blur(12px)' : 'blur(40px)',
        padding: isMobile ? '80px 20px 40px' : '40px',
      }}
    >
      {/* Background Ambience */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '100vw', height: '100vh',
          background: 'radial-gradient(circle at center, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: isMobile ? 'blur(60px)' : 'blur(120px)',
        }} />
      </div>

      {/* Header / Actions */}
      <div style={{ position: 'fixed', top: isMobile ? 20 : 40, left: isMobile ? 20 : 40, right: isMobile ? 20 : 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BookOpen color="var(--aura-lavender)" size={isMobile ? 20 : 24} />
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--aura-lavender)', letterSpacing: '0.3em', fontSize: isMobile ? 10 : 14, textTransform: 'uppercase', fontWeight: 600 }}>
            Book Of Answers
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '16px', width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
          }}
        >
          <X size={isMobile ? 20 : 24} />
        </motion.button>
      </div>

      {/* THE BOOK ASSEMBLY */}
      <div style={{ 
        position: 'relative', 
        width: 'min(100%, 880px)', 
        height: 'auto',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
      }}>
        
        {/* PHYSICAL SPREAD */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%', 
            minHeight: isMobile ? 'auto' : '560px',
            background: '#fcf8f0',
            borderRadius: isMobile ? 24 : 16,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(167, 139, 250, 0.1)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")',
            position: 'relative',
          }}
        >
          {/* Central Gutter / Spine Shadow */}
          <div style={{ 
            position: 'absolute', 
            left: isMobile ? 0 : '50%', 
            top: isMobile ? '50%' : 0, 
            right: 0,
            bottom: 0,
            width: isMobile ? '100%' : 60,
            height: isMobile ? 40 : 'auto',
            transform: isMobile ? 'translateY(-50%)' : 'translateX(-50%)',
            background: isMobile 
              ? 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.06), rgba(0,0,0,0.12), rgba(0,0,0,0.06), transparent)'
              : 'linear-gradient(to right, transparent, rgba(0,0,0,0.06), rgba(0,0,0,0.12), rgba(0,0,0,0.06), transparent)',
            zIndex: 10
          }} />

          {/* LEFT PAGE - Content */}
          <div style={{ 
            flex: 1, 
            padding: isMobile ? '48px 24px' : '60px', 
            borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.05)', 
            borderBottom: isMobile ? '1px solid rgba(0,0,0,0.05)' : 'none',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center' 
          }}>
            <AnimatePresence mode="wait">
              {phase === 'ready' ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 36px)', color: '#1a1a1f', marginBottom: 20, lineHeight: 1.1 }}>The Journey Begins</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 4vw, 18px)', color: '#4a4a4f', lineHeight: 1.6, fontWeight: 500 }}>
                    Relax. Take a deep breath.<br/>
                    Think of your wish clearly 3 times.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, background: '#000' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFindAnswer}
                    style={{
                      marginTop: 32, padding: '18px 40px', borderRadius: 16,
                      background: '#1a1a1f', color: '#fcf8f0', border: 'none',
                      fontFamily: 'var(--font-heading)', fontSize: 12, textTransform: 'uppercase', cursor: 'pointer',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 12, margin: '32px auto 0',
                      letterSpacing: '0.1em', fontWeight: 700
                    }}
                  >
                    <Wand2 size={16} /> Consult Oracle
                  </motion.button>
                </motion.div>
              ) : (
                <div style={{ opacity: 0.2 }}>
                  <Sparkles size={isMobile ? 48 : 64} color="#6366f1" />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PAGE - Result */}
          <div style={{ flex: 1, padding: isMobile ? '48px 24px' : '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              {phase === 'result' ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: 'var(--aura-lavender)', letterSpacing: '0.3em', marginBottom: 20, fontWeight: 700 }}>✦ THE REVELATION ✦</p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 8vw, 56px)', color: '#1a1a1f', marginBottom: 16, lineHeight: 1 }}>{answer?.title}</h2>
                  <div style={{ width: 40, height: 2, background: 'var(--aura-lavender)', margin: '0 auto 24px', opacity: 0.4, borderRadius: 1 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 4.5vw, 20px)', color: '#3a3a3f', fontStyle: 'italic', lineHeight: 1.7, fontWeight: 500 }}>"{answer?.text}"</p>
                  <motion.button
                    whileHover={{ scale: 1.05, color: '#1a1a1f' }}
                    onClick={handleRetry}
                    style={{
                      marginTop: 40, background: 'none', border: '1px solid rgba(0,0,0,0.1)',
                      padding: '12px 28px', borderRadius: 14, color: '#6a6a6f',
                      fontFamily: 'var(--font-heading)', fontSize: 11, cursor: 'pointer',
                      fontWeight: 700, letterSpacing: '0.1em'
                    }}
                  >
                    <RotateCcw size={12} style={{ marginRight: 8, display: 'inline' }} /> ASK AGAIN
                  </motion.button>
                </motion.div>
              ) : phase === 'flipping' ? (
                <motion.div
                  key="flipping"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={40} color="var(--aura-lavender)" />
                  </motion.div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: '#8a8a8f', letterSpacing: '0.25em', marginTop: 20, fontWeight: 600 }}>
                    SHUFFLING THE COSMOS...
                  </p>
                </motion.div>
              ) : phase === 'opening' ? (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: '#8a8a8f', letterSpacing: '0.25em', fontWeight: 600 }}
                 >
                   UNSEALING THE GRIMOIRE...
                 </motion.p>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#8a8a8f', opacity: 0.5, fontWeight: 500 }}>Aligning with your energy...</p>
              )}
            </AnimatePresence>
          </div>

          {/* VISUAL FLIPPING LAYER (Animation only) */}
          <AnimatePresence>
            {phase === 'flipping' && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{ duration: 0.4 + (i * 0.1), repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                    style={{
                      position: 'absolute', left: 0, width: '50%', height: '100%',
                      background: '#fcf8f0', transformOrigin: 'right center',
                      boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.05)',
                      backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")',
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* INITIAL COVER (Opening Animation) */}
        <AnimatePresence>
          {phase === 'opening' && (
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -170 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1] }}
              style={{
                position: 'absolute', inset: 0, width: '50%',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #030305 100%)',
                borderRadius: '12px 0 0 12px',
                transformOrigin: 'right center',
                zIndex: 100,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)',
                backfaceVisibility: 'hidden',
              }}
            >
              <Sparkles size={isMobile ? 48 : 64} color="var(--aura-lavender)" style={{ marginBottom: 24, filter: 'drop-shadow(0 0 15px rgba(167,139,250,0.4))' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: isMobile ? 24 : 36, letterSpacing: '0.25em', textAlign: 'center', lineHeight: 1.3 }}>
                Book Of<br/>Answers
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Vignette */}
      {!isMobile && <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.9)', zIndex: 5 }} />}
    </motion.div>
  );
}
