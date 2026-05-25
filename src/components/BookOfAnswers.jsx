import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RotateCcw, Wand2, BookOpen } from 'lucide-react';

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
        background: 'rgba(7, 6, 12, 0.98)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '100vw', height: '100vh',
          background: 'radial-gradient(circle at center, rgba(253, 111, 136, 0.15) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.9) 100%)'
        }} />
      </div>

      {/* Header / Actions */}
      <div style={{ position: 'absolute', top: 40, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BookOpen color="#FD6F88" size={24} />
          <span style={{ fontFamily: 'var(--font-heading)', color: '#FD6F88', letterSpacing: '0.3em', fontSize: 14, textTransform: 'uppercase' }}>
            Book Of Answers
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(253, 111, 136, 0.3)',
            borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', color: '#FD6F88',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={24} />
        </motion.button>
      </div>

      {/* THE BOOK ASSEMBLY */}
      <div style={{ 
        position: 'relative', 
        width: 'min(94vw, 880px)', 
        height: 'auto',
        minHeight: 'min(75vh, 600px)',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        
        {/* PHYSICAL SPREAD */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: 'flex', 
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            width: '100%', 
            height: '100%',
            background: '#f4e4d4',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 30px rgba(253, 111, 136, 0.15)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-map.png")',
            position: 'relative',
          }}
        >
          {/* Central Gutter / Spine Shadow */}
          <div style={{ 
            position: 'absolute', 
            left: window.innerWidth < 768 ? 0 : '50%', 
            top: window.innerWidth < 768 ? '50%' : 0, 
            right: 0,
            bottom: 0,
            width: window.innerWidth < 768 ? '100%' : 60,
            height: window.innerWidth < 768 ? 40 : 'auto',
            transform: window.innerWidth < 768 ? 'translateY(-50%)' : 'translateX(-50%)',
            background: window.innerWidth < 768 
              ? 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.08), rgba(0,0,0,0.15), rgba(0,0,0,0.08), transparent)'
              : 'linear-gradient(to right, transparent, rgba(0,0,0,0.08), rgba(0,0,0,0.15), rgba(0,0,0,0.08), transparent)',
            zIndex: 10
          }} />

          {/* LEFT PAGE - Content */}
          <div style={{ 
            flex: 1, 
            padding: 'clamp(40px, 8vw, 60px)', 
            borderRight: window.innerWidth < 768 ? 'none' : '1px solid rgba(0,0,0,0.05)', 
            borderBottom: window.innerWidth < 768 ? '1px solid rgba(0,0,0,0.05)' : 'none',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center' 
          }}>
            <AnimatePresence mode="wait">
              {phase === 'ready' ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 32px)', color: '#1a0f0f', marginBottom: 20 }}>The Journey Begins</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 3.5vw, 18px)', color: '#2a1a1a', lineHeight: 1.6 }}>
                    Relax. Take a deep breath.<br/>
                    Think of your wish clearly 3 times.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, background: '#1a0f0f' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFindAnswer}
                    style={{
                      marginTop: 32, padding: '16px 32px', borderRadius: 50,
                      background: '#2a1a1a', color: '#f4e4d4', border: 'none',
                      fontFamily: 'var(--font-heading)', fontSize: 13, textTransform: 'uppercase', cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10, margin: '32px auto 0'
                    }}
                  >
                    <Wand2 size={16} /> Consult Oracle
                  </motion.button>
                </motion.div>
              ) : (
                <div style={{ opacity: 0.3 }}>
                  <Sparkles size={48} color="#8b5e3c" />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PAGE - Result */}
          <div style={{ flex: 1, padding: 'clamp(40px, 8vw, 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              {phase === 'result' ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, color: '#8b5e3c', letterSpacing: '0.25em', marginBottom: 16 }}>✦ THE TRUTH REVEALED ✦</p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8vw, 48px)', color: '#1a0f0f', marginBottom: 16 }}>{answer?.title}</h2>
                  <div style={{ width: 60, height: 1, background: '#8b5e3c', margin: '0 auto 24px', opacity: 0.3 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 4vw, 19px)', color: '#2a1a1a', fontStyle: 'italic', lineHeight: 1.6 }}>"{answer?.text}"</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleRetry}
                    style={{
                      marginTop: 40, background: 'none', border: '1px solid #8b5e3c',
                      padding: '10px 20px', borderRadius: 50, color: '#8b5e3c',
                      fontFamily: 'var(--font-heading)', fontSize: 10, cursor: 'pointer'
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
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={32} color="#D63D5A" />
                  </motion.div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: '#8b5e3c', letterSpacing: '0.2em', marginTop: 16 }}>
                    CONSULTING THE VOID...
                  </p>
                </motion.div>
              ) : phase === 'opening' ? (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: '#8b5e3c', letterSpacing: '0.25em' }}
                 >
                   OPENING THE GRIMOIRE...
                 </motion.p>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#8b5e3c', opacity: 0.5 }}>Waiting for alignment...</p>
              )}
            </AnimatePresence>
          </div>

          {/* VISUAL FLIPPING LAYER (Animation only, no blocking) */}
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
                      background: '#f4e4d4', transformOrigin: 'right center',
                      boxShadow: 'inset -15px 0 30px rgba(0,0,0,0.1)',
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
                background: 'linear-gradient(135deg, #3d2626 0%, #1a0f0f 100%)',
                borderRadius: '8px 0 0 8px',
                transformOrigin: 'right center',
                zIndex: 100,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #1a0f0f',
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
                backfaceVisibility: 'hidden',
              }}
            >
              <Sparkles size={64} color="#d4af37" style={{ marginBottom: 20 }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', color: '#d4af37', fontSize: 32, letterSpacing: '0.2em', textAlign: 'center' }}>
                Book Of<br/>Answers
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.98)', zIndex: 5 }} />
    </motion.div>
  );
}
