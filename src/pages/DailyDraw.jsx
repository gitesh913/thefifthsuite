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

function getCardImage(card) {
  const baseUrl = 'https://raw.githubusercontent.com/searge/tarot/master/assets/img/big/'
  if (card.arcana === 'major') {
    const num = card.id.toString().padStart(2, '0')
    return `${baseUrl}maj${num}.jpg`
  }
  
  const suitMap = { wands: 'wands', cups: 'cups', swords: 'swords', pentacles: 'pents' }
  const suit = suitMap[card.suit]
  // Minor IDs start at 22, 36, 50, 64. Map to 01-14.
  let offset = 0
  if (card.suit === 'wands') offset = 22
  if (card.suit === 'cups') offset = 36
  if (card.suit === 'swords') offset = 50
  if (card.suit === 'pentacles') offset = 64
  
  const num = (card.id - offset + 1).toString().padStart(2, '0')
  return `${baseUrl}${suit}${num}.jpg`
}

function getCardGradient(card) {
  const schemes = [
    'radial-gradient(circle at center, #4A148C 0%, #8E24AA 40%, #F3E5F5 100%)', // Deep Purple Aura
    'radial-gradient(circle at center, #1A237E 0%, #1976D2 40%, #E3F2FD 100%)', // Deep Blue Aura
    'radial-gradient(circle at center, #B71C1C 0%, #D32F2F 40%, #FFEBEE 100%)', // Deep Red Aura
    'radial-gradient(circle at center, #F57F17 0%, #FBC02D 40%, #FFFDE7 100%)', // Deep Yellow/Gold Aura
    'radial-gradient(circle at center, #1B5E20 0%, #388E3C 40%, #E8F5E9 100%)', // Deep Green Aura
    'radial-gradient(circle at center, #E65100 0%, #FB8C00 40%, #FFF3E0 100%)', // Deep Orange Aura
  ]
  return schemes[card.id % schemes.length]
}

// SVG mandala back pattern
function CardBackSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 130" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
      <g stroke="#FD6F88" strokeWidth="0.5" fill="none">
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

function TarotCard({ card, isSelected, isFlipped, onClick, index, isShuffling, scatterPos, totalCards }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = window.innerWidth < 768

  // Calculate position in the circle
  const angle = (index / totalCards) * Math.PI * 2
  const radius = isMobile ? window.innerWidth * 0.35 : 360
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const baseRotation = (angle * 180) / Math.PI + 90

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
        scale: isMobile ? 0.7 : 0.85,
        opacity: 0.7,
        zIndex: 0,
      } : isSelected ? {
        x: 0, y: 0, rotate: 0, scale: isMobile ? 1 : 1.2, opacity: 0, pointerEvents: 'none' 
      } : {
        x, y,
        rotate: baseRotation,
        scale: hovered ? 1.15 : 1,
        opacity: 1,
        zIndex: hovered ? 100 : 1,
      }}
      transition={isShuffling
        ? { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        : { type: 'spring', stiffness: 150, damping: 20 }
      }
      style={{
        width: isMobile ? 60 : 80,
        height: isMobile ? 96 : 128,
        borderRadius: isMobile ? 8 : 10,
        cursor: isShuffling ? 'default' : 'pointer',
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: isMobile ? -30 : -40,
        marginTop: isMobile ? -48 : -64,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        whileTap={{ scale: 1.6, zIndex: 1000 }} // Zoom on click
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* Back face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: getCardGradient(card),
          border: isSelected ? '1.5px solid #FD6F88' : '1px solid rgba(253, 111, 136, 0.2)',
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.2)'
            : '0 4px 12px rgba(0,0,0,0.08)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overflow: 'hidden',
        }}>
          <CardBackSVG />
          {/* Shimmer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
          }} />
        </div>

        {/* Front face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: getCardGradient(card),
          border: '1px solid rgba(253, 111, 136, 0.2)',
          boxShadow: '0 4px 20px rgba(253, 111, 136, 0.1)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
        }}>
          <img 
            src={getCardImage(card)} 
            alt={card.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding: '8px 4px 4px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 7,
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.05em',
              lineHeight: 1.2,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}>
              {card.name}
            </p>
          </div>
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
            border: '2px solid #FD6F88',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  )
}

function SelectedSlot({ card, position, label }) {
  const isMobile = window.innerWidth < 768
  const labels = ['Past', 'Present', 'Future']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
      <div style={{
        width: isMobile ? 80 : 110,
        height: isMobile ? 128 : 176,
        borderRadius: isMobile ? 10 : 14,
        border: card ? '2px solid #FD6F88' : '1px dashed rgba(253, 111, 136, 0.3)',
        background: card ? getCardGradient(card) : 'radial-gradient(circle at center, rgba(0,0,0,0.05) 0%, rgba(255, 255, 255, 0.3) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: card ? '0 12px 40px rgba(0,0,0,0.15)' : 'none',
      }}>
        {card ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img 
              src={getCardImage(card)} 
              alt={card.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              padding: isMobile ? '8px 4px 4px' : '16px 8px 8px',
            }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: isMobile ? 7 : 9, color: 'white', fontWeight: 700, lineHeight: 1.3, textAlign: 'center' }}>
                {card.name}
              </p>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: isMobile ? 16 : 24, color: '#FD6F88', opacity: 0.3 }}>✦</span>
        )}
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? 10 : 12, color: '#1a0a0a', opacity: 0.6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
        {labels[position]}
      </span>
    </div>
  )
}

function EnergyGauge({ rating }) {
  const circumference = 2 * Math.PI * 54
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.15em', color: '#1a0a0a', opacity: 0.7, textTransform: 'uppercase' }}>
        Today's Energy
      </p>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(49, 27, 146, 0.1)" strokeWidth="8" />
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
              <stop offset="0%" stopColor="#8E24AA" />
              <stop offset="100%" stopColor="#1976D2" />
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
            style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#1a0a0a', lineHeight: 1 }}
          >
            {rating}
          </motion.span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#1a0a0a', opacity: 0.5 }}>/10</span>
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
            style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.2em', color: '#FD6F88', textTransform: 'uppercase', marginBottom: 12 }}
          >
            ✦ Daily Draw
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(32px, 5vw, 52px)', color: '#1a0a0a', marginBottom: 12 }}
          >
            Let the Cards Speak
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#1a0a0a', opacity: 0.7 }}
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
          gap: window.innerWidth < 768 ? 12 : 24,
          padding: window.innerWidth < 768 ? '12px 16px 20px' : '16px 24px 24px',
        }}>
          {[0, 1, 2].map(i => (
            <SelectedSlot key={i} card={selectedCards[i]} position={i} />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '0 24px 24px' }}>
          <motion.button
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(253,111,136,0.2)' }}
            whileTap={{ scale: 0.96 }}
            onClick={doShuffle}
            disabled={isShuffling}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'rgba(253,111,136,0.1)',
              border: '1px solid rgba(253,111,136,0.4)',
              borderRadius: 12,
              color: '#1a0a0a',
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
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(253, 111, 136, 0.2)',
                borderRadius: 12,
                color: '#1a0a0a',
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
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(253,111,136,0.3)' }}
                onClick={fetchReading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '16px 40px',
                  background: 'rgba(253,111,136,0.15)',
                  border: '1px solid rgba(253,111,136,0.6)',
                  borderRadius: 14,
                  color: '#1a0a0a',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 14,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(253,111,136,0.1)',
                  transition: 'all 0.2s',
                }}
              >
                <Eye size={18} />
                Reveal Your Reading
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Ring Container */}
        <div style={{
          height: window.innerWidth < 768 ? 420 : 850,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 2000,
          margin: window.innerWidth < 768 ? '20px auto 0' : '40px auto 0',
          width: '100%',
          overflow: 'hidden',
        }}>
          <motion.div
            animate={isShuffling ? { rotate: 0 } : { rotate: 360 }}
            transition={isShuffling ? { duration: 0.5 } : { duration: 180, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'relative',
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
            }}
          >
            {cards.map((card, index) => (
              <TarotCard
                key={card.id}
                card={card}
                isSelected={selectedCards.some(c => c.id === card.id)}
                isFlipped={flippedCards.includes(card.id)}
                onClick={handleCardClick}
                index={index}
                totalCards={cards.length}
                isShuffling={isShuffling}
                scatterPos={scatterPositions[card.id]}
              />
            ))}
          </motion.div>
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
              background: 'rgba(252, 234, 240, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
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
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(253, 111, 136, 0.2)',
                    borderRadius: 50,
                    padding: 8,
                    color: '#1a0a0a',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(32px, 8vw, 42px)', textAlign: 'center', marginBottom: 32, color: '#1a0a0a' }}>
                  Your Reading
                </h2>

                {/* Three cards display */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  alignItems: 'center',
                  justifyContent: 'center', 
                  gap: window.innerWidth < 768 ? 24 : 32, 
                  marginBottom: 48 
                }}>
                  {selectedCards.map((card, i) => (
                    <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: window.innerWidth < 768 ? 100 : 140,
                        height: window.innerWidth < 768 ? 160 : 224,
                        borderRadius: 16,
                        background: getCardGradient(card),
                        border: '2px solid #FD6F88',
                        boxShadow: '0 12px 48px rgba(253, 111, 136, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        <img 
                          src={getCardImage(card)} 
                          alt={card.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                          padding: '16px 6px 8px',
                        }}>
                          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, color: 'white', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                            {card.name}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#FD6F88', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                        {['Past', 'Present', 'Future'][i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reading text */}
                <div className="glass" style={{ padding: 'clamp(24px, 6vw, 40px)', marginBottom: 40, background: 'rgba(255, 255, 255, 0.6)' }}>
                  {loadingReading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[100, 85, 70, 90, 60].map((w, i) => (
                        <div key={i} className="shimmer" style={{ height: 16, borderRadius: 8, width: `${w}%`, background: 'rgba(253, 111, 136, 0.1)' }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 4vw, 15px)', lineHeight: 1.8, color: '#1a0a0a' }}>
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
                    style={{ padding: 32, display: 'flex', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.6)' }}
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
                      background: 'rgba(255, 255, 255, 0.6)',
                      border: '1px solid rgba(253, 111, 136, 0.2)',
                      borderRadius: 12,
                      color: '#1a0a0a',
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
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: 12,
                      color: 'rgba(0,0,0,0.3)',
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

