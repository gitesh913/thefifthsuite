import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Shuffle, Eye, RotateCcw, X } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import { tarotDeck } from '../data/tarotCards'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getCardGradient(card) {
  if (card.arcana === 'major') return 'linear-gradient(135deg, #2d1b69, #1a0f40)'
  if (card.suit === 'wands') return 'linear-gradient(135deg, #7c2d12, #1c0a00)'
  if (card.suit === 'cups') return 'linear-gradient(135deg, #1e3a5f, #0a1628)'
  if (card.suit === 'swords') return 'linear-gradient(135deg, #1f2937, #0f172a)'
  return 'linear-gradient(135deg, #14532d, #052e16)'
}

// SVG mandala back pattern
function CardBackSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 130" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
      <g stroke="#c084fc" strokeWidth="0.5" fill="none">
        <circle cx="40" cy="65" r="20" />
        <circle cx="40" cy="65" r="14" />
        <circle cx="40" cy="65" r="8" />
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <line
            key={i}
            x1={40 + 8 * Math.cos(angle * Math.PI / 180)}
            y1={65 + 8 * Math.sin(angle * Math.PI / 180)}
            x2={40 + 20 * Math.cos(angle * Math.PI / 180)}
            y2={65 + 20 * Math.sin(angle * Math.PI / 180)}
          />
        ))}
        <polygon points="40,45 53,72 27,72" strokeWidth="0.6" />
        <polygon points="40,85 27,58 53,58" strokeWidth="0.6" />
        <rect x="24" y="49" width="32" height="32" transform="rotate(45 40 65)" strokeWidth="0.4" />
      </g>
    </svg>
  )
}

function TarotCard({ card, isSelected, isFlipped, onClick, index, isShuffling, scatterPos }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layout
      layoutId={`card-${card.id}`}
      onClick={() => !isShuffling && onClick(card)}
      onHoverStart={() => !isShuffling && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={isShuffling && scatterPos ? {
        x: scatterPos.x,
        y: scatterPos.y,
        rotate: scatterPos.rotate,
        scale: 0.85,
        opacity: 0.7,
      } : {
        x: 0, y: 0, rotate: 0,
        scale: hovered && !isSelected ? 1.05 : 1,
        opacity: 1,
        y: hovered && !isSelected ? -8 : 0,
      }}
      transition={isShuffling
        ? { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        : { type: 'spring', stiffness: 200, damping: 25 }
      }
      style={{
        width: 56,
        height: 90,
        borderRadius: 8,
        cursor: isShuffling ? 'default' : 'pointer',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* Back face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #1e1040, #0f0828)',
          border: isSelected ? '1px solid rgba(192,132,252,0.8)' : '1px solid rgba(255,255,255,0.15)',
          boxShadow: isSelected
            ? '0 0 20px rgba(192,132,252,0.6), 0 4px 20px rgba(0,0,0,0.5)'
            : '0 4px 12px rgba(0,0,0,0.4)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overflow: 'hidden',
        }}>
          <CardBackSVG />
          {/* Shimmer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          }} />
        </div>

        {/* Front face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 8,
          background: getCardGradient(card),
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          overflow: 'hidden',
        }}>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 5,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
          }}>
            {card.name}
          </p>
        </div>
      </motion.div>

      {/* Selected pulse ring */}
      {isSelected && !isFlipped && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: 10,
            border: '2px solid rgba(192,132,252,0.7)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  )
}

function SelectedSlot({ card, position, label }) {
  const labels = ['Past', 'Present', 'Future']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 80,
        height: 130,
        borderRadius: 12,
        border: card ? '1px solid rgba(192,132,252,0.6)' : '1px dashed rgba(255,255,255,0.2)',
        background: card ? getCardGradient(card) : 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
      }}>
        {card ? (
          <div style={{ padding: 6, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 7, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>
              {card.name}
            </p>
          </div>
        ) : (
          <span style={{ fontSize: 20, opacity: 0.2 }}>✦</span>
        )}
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--aura-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {labels[position]}
      </span>
    </div>
  )
}

function EnergyGauge({ rating }) {
  const circumference = 2 * Math.PI * 54
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.15em', color: 'var(--aura-ghost)', textTransform: 'uppercase' }}>
        Today's Energy
      </p>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="url(#energyGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (rating / 10) * circumference }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'white', lineHeight: 1 }}
          >
            {rating}
          </motion.span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--aura-ghost)' }}>/10</span>
        </div>
      </div>
    </div>
  )
}

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}

export default function DailyDraw() {
  const [cards, setCards] = useState(() => shuffle(tarotDeck))
  const [isShuffling, setIsShuffling] = useState(false)
  const [selectedCards, setSelectedCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [scatterPositions, setScatterPositions] = useState({})
  const [showReading, setShowReading] = useState(false)
  const [readingText, setReadingText] = useState('')
  const [loadingReading, setLoadingReading] = useState(false)
  const [energyRating, setEnergyRating] = useState(null)

  const doShuffle = useCallback(async () => {
    if (isShuffling) return
    setIsShuffling(true)
    setSelectedCards([])
    setFlippedCards([])
    setShowReading(false)
    setReadingText('')
    setEnergyRating(null)

    // Generate scatter positions
    const pos = {}
    tarotDeck.forEach(card => {
      pos[card.id] = {
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 200,
        rotate: (Math.random() - 0.5) * 180,
      }
    })
    setScatterPositions(pos)

    await new Promise(r => setTimeout(r, 700))
    setCards(shuffle(tarotDeck))
    await new Promise(r => setTimeout(r, 600))
    setScatterPositions({})
    await new Promise(r => setTimeout(r, 400))
    setIsShuffling(false)
  }, [isShuffling])

  const handleCardClick = useCallback((card) => {
    if (isShuffling) return
    if (flippedCards.includes(card.id)) return

    if (selectedCards.find(c => c.id === card.id)) {
      // Deselect
      setSelectedCards(prev => prev.filter(c => c.id !== card.id))
      return
    }

    if (selectedCards.length >= 3) return

    setSelectedCards(prev => [...prev, card])
    // Flip the card
    setTimeout(() => {
      setFlippedCards(prev => [...prev, card.id])
    }, 150)
  }, [isShuffling, selectedCards, flippedCards])

  const fetchReading = async () => {
    setLoadingReading(true)
    setShowReading(true)

    const cardNames = selectedCards.map(c => c.name).join(', ')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are TheFifthSuite, a mystical and poetic tarot reader. The user has drawn three cards: ${cardNames}. Give a personal, beautiful, insightful reading of these three cards as Past, Present, Future. Use poetic, mystical language. Be warm and empowering. End with a one-sentence "Today's Energy" summary. Keep total response under 200 words. Also on the very last line, output only "ENERGY:X.X" where X.X is a number from 1.0 to 10.0 rating today's energy.`,
          }],
        }),
      })

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const lines = text.split('\n')
      const energyLine = lines.find(l => l.startsWith('ENERGY:'))
      const rating = energyLine ? parseFloat(energyLine.replace('ENERGY:', '').trim()) : null
      const cleanText = lines.filter(l => !l.startsWith('ENERGY:')).join('\n').trim()

      setReadingText(cleanText)
      setEnergyRating(rating || (6 + Math.random() * 3))
    } catch (err) {
      // Mock fallback
      const mockReadings = [
        `**Past:** ${selectedCards[0]?.name} speaks of a journey that has shaped you more deeply than you know. Old patterns dissolve like morning mist.\n\n**Present:** ${selectedCards[1]?.name} arrives with quiet power. The present moment asks you to stand fully in your own truth.\n\n**Future:** ${selectedCards[2]?.name} illuminates the path ahead — one of expansion, of becoming. Trust what is unfolding.\n\n*Today's Energy: You are standing at a threshold. Step through with your whole heart.*`,
      ]
      setReadingText(mockReadings[0])
      setEnergyRating(7 + Math.random() * 2)
    }

    setLoadingReading(false)
  }

  const reset = () => {
    setSelectedCards([])
    setFlippedCards([])
    setShowReading(false)
    setReadingText('')
    setEnergyRating(null)
    setCards(shuffle(tarotDeck))
  }

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', position: 'relative' }}>
      <AuroraBackground />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '32px 24px 24px' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--aura-lavender)', textTransform: 'uppercase', marginBottom: 12 }}
          >
            ✦ Daily Draw
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(32px, 5vw, 52px)', color: 'white', marginBottom: 12 }}
          >
            Let the Cards Speak
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--aura-ghost)' }}
          >
            {selectedCards.length === 0
              ? 'Shuffle, then choose three cards that call to you'
              : selectedCards.length < 3
              ? `${3 - selectedCards.length} more card${3 - selectedCards.length === 1 ? '' : 's'} to select`
              : 'Your three cards are chosen'}
          </motion.p>
        </div>

        {/* Selection tray */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          padding: '16px 24px 24px',
        }}>
          {[0, 1, 2].map(i => (
            <SelectedSlot key={i} card={selectedCards[i]} position={i} />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '0 24px 24px' }}>
          <motion.button
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(192,132,252,0.3)' }}
            whileTap={{ scale: 0.96 }}
            onClick={doShuffle}
            disabled={isShuffling}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'rgba(192,132,252,0.1)',
              border: '1px solid rgba(192,132,252,0.4)',
              borderRadius: 12,
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: isShuffling ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <motion.div
              animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
              transition={isShuffling ? { duration: 0.6, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Shuffle size={16} />
            </motion.div>
            Shuffle
          </motion.button>

          {selectedCards.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2 }}
              onClick={reset}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                color: 'var(--aura-ghost)',
                fontFamily: 'var(--font-heading)',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <RotateCcw size={16} />
              Reset
            </motion.button>
          )}
        </div>

        {/* Reveal button */}
        <AnimatePresence>
          {selectedCards.length === 3 && !showReading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'center', padding: '0 24px 24px' }}
            >
              <motion.button
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(192,132,252,0.5)' }}
                onClick={fetchReading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '16px 40px',
                  background: 'rgba(192,132,252,0.15)',
                  border: '1px solid rgba(192,132,252,0.7)',
                  borderRadius: 14,
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(192,132,252,0.2)',
                  transition: 'all 0.2s',
                }}
              >
                <Eye size={18} />
                Reveal Your Reading
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card grid */}
        <div style={{
          padding: '0 16px 120px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {cards.map((card, index) => (
            <TarotCard
              key={card.id}
              card={card}
              isSelected={selectedCards.some(c => c.id === card.id)}
              isFlipped={flippedCards.includes(card.id)}
              onClick={handleCardClick}
              index={index}
              isShuffling={isShuffling}
              scatterPos={scatterPositions[card.id]}
            />
          ))}
        </div>
      </div>

      {/* Reading panel overlay */}
      <AnimatePresence>
        {showReading && (
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              overflowY: 'auto',
              background: 'rgba(7,6,15,0.92)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              padding: '80px 24px 60px',
            }}
          >
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              {/* Close */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowReading(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 50,
                    padding: 8,
                    color: 'var(--aura-ghost)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 42, textAlign: 'center', marginBottom: 40, color: 'white' }}>
                  Your Reading
                </h2>

                {/* Three cards display */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 48 }}>
                  {selectedCards.map((card, i) => (
                    <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 90,
                        height: 148,
                        borderRadius: 12,
                        background: getCardGradient(card),
                        border: '1px solid rgba(192,132,252,0.4)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192,132,252,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                      }}>
                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 8, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.3 }}>
                          {card.name}
                        </p>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--aura-lavender)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {['Past', 'Present', 'Future'][i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reading text */}
                <div className="glass" style={{ padding: 40, marginBottom: 40 }}>
                  {loadingReading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[100, 85, 70, 90, 60].map((w, i) => (
                        <div key={i} className="shimmer" style={{ height: 16, borderRadius: 8, width: `${w}%` }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.9, color: 'var(--aura-ghost)' }}>
                      <TypewriterText text={readingText} />
                    </div>
                  )}
                </div>

                {/* Energy gauge */}
                {!loadingReading && energyRating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass"
                    style={{ padding: 32, display: 'flex', justifyContent: 'center' }}
                  >
                    <EnergyGauge rating={Math.round(energyRating * 10) / 10} />
                  </motion.div>
                )}

                {/* Footer buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setShowReading(false)}
                    style={{
                      padding: '12px 28px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      color: 'var(--aura-ghost)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 12,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Close Reading
                  </motion.button>
                  <button
                    disabled
                    style={{
                      padding: '12px 28px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.2)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 12,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'not-allowed',
                    }}
                  >
                    Return Tomorrow ✦
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
