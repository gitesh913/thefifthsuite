import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Eye, RotateCcw, X } from 'lucide-react'
import AuroraBackground from '../components/AuroraBackground'
import { tarotDeck } from '../data/tarotCards'
import { useIsMobile } from '../utils/hooks'

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
  let offset = 0
  if (card.suit === 'wands') offset = 22
  if (card.suit === 'cups') offset = 36
  if (card.suit === 'swords') offset = 50
  if (card.suit === 'pentacles') offset = 64
  
  const num = (card.id - offset + 1).toString().padStart(2, '0')
  return `${baseUrl}${suit}${num}.jpg`
}

const CardBack = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-violet-300 flex items-center justify-center overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 100 150" className="opacity-90">
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect x="5" y="5" width="90" height="140" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.5" />
      <rect x="8" y="8" width="84" height="134" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="0.3" />
      <circle cx="50" cy="75" r="28" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
      <circle cx="50" cy="75" r="22" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" />
      <path d="M50 30 L58 75 L50 120 L42 75 Z" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
      <path d="M15 75 L50 67 L85 75 L50 83 Z" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
      <circle cx="50" cy="75" r="3" fill="white" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/40 pointer-events-none" />
  </div>
))

const TarotCard = memo(({ card, isSelected, isFlipped, onClick, index, isShuffling, scatterPos, totalCards, isSpreading }) => {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)

  const angle = (index / totalCards) * Math.PI * 2
  const radius = isMobile ? 130 : 310 
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const baseRotation = (angle * 180) / Math.PI + 90

  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={() => !isShuffling && !isSpreading && onClick(card)}
      onHoverStart={() => !isShuffling && !isSpreading && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.5 }}
      animate={isShuffling && scatterPos ? {
        x: scatterPos.x,
        y: scatterPos.y,
        rotate: scatterPos.rotate,
        scale: isMobile ? 0.75 : 0.9,
        opacity: 0.6,
        zIndex: 0,
      } : isSelected ? {
        x: 0, y: 0, rotate: 0, scale: isMobile ? 1 : 1.2, opacity: 0, pointerEvents: 'none' 
      } : isSpreading ? {
        x: 0, y: 0, rotate: 0, scale: 0.8, opacity: 0.8, zIndex: 0
      } : {
        x, y,
        rotate: baseRotation,
        scale: hovered ? 1.15 : 1,
        opacity: 1,
        zIndex: hovered ? 100 : 1,
      }}
      transition={isShuffling
        ? { duration: 0.5, ease: "easeInOut" }
        : isSpreading
        ? { duration: 0.4, ease: "easeIn" }
        : { 
            type: 'spring', 
            stiffness: 120, 
            damping: 20, 
            delay: isSelected ? 0 : (index * 0.01),
            opacity: { duration: 0.3 }
          }
      }
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        width: isMobile ? 60 : 88,
        height: isMobile ? 96 : 144,
        marginLeft: isMobile ? -30 : -44,
        marginTop: isMobile ? -48 : -72,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative preserve-3d"
      >
        {/* FRONT OF CARD (Revealed Face) - Default rotation is 0 */}
        <div className="absolute inset-0 rounded-xl bg-violet-300 overflow-hidden backface-hidden flex flex-col items-center justify-center border border-white/40 shadow-xl">
          <img 
            src={getCardImage(card)} 
            alt={card.name} 
            className="w-full h-full object-cover opacity-95" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-center">
            <p className="font-heading text-[7px] md:text-[9px] text-white font-semibold tracking-wider leading-tight">
              {card.name}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        </div>
        
        {/* BACK OF CARD (Hidden Face) - Initial rotation is 180 so it shows when parent is rotated 180 */}
        <div className={`absolute inset-0 rounded-xl overflow-hidden backface-hidden rotate-y-180 border ${isSelected ? 'border-white border-2' : 'border-white/20'} shadow-lg`}>
          <CardBack />
        </div>
      </motion.div>

      {isSelected && !isFlipped && (
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-1 rounded-[14px] border-2 border-white pointer-events-none"
        />
      )}
    </motion.div>
  )
})

const SelectedSlot = memo(({ card, position }) => {
  const isMobile = useIsMobile()
  const labels = ['Past', 'Present', 'Future']
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      <div className={`
        relative overflow-hidden rounded-2xl transition-all duration-500
        ${card ? 'border-2 border-lavender shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(167,139,250,0.15)]' : 'border border-dashed border-white/10 bg-white/2'}
        ${isMobile ? 'w-20 h-32' : 'w-32 h-48'}
      `}>
        {card ? (
          <div className="w-full h-full relative">
            <img 
              src={getCardImage(card)} 
              alt={card.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 md:p-3">
              <p className="font-heading text-[8px] md:text-[10px] text-white font-semibold text-center uppercase tracking-wider">
                {card.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl md:text-2xl text-lavender/20">✦</span>
          </div>
        )}
      </div>
      <span className="font-heading text-[9px] md:text-[11px] text-white/40 tracking-widest uppercase font-semibold">
        {labels[position]}
      </span>
    </div>
  )
})

function EnergyGauge({ rating, light = false }) {
  const circumference = 2 * Math.PI * 54
  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`font-heading text-xs tracking-[0.3em] uppercase ${light ? 'text-[#1a1a1f]/50' : 'text-white/50'}`}>
        Today's Energy
      </p>
      <div className="relative w-32 h-32 md:w-36 md:h-36">
        <svg width="100%" height="100%" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke={light ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)"} strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="url(#energyGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (rating / 10) * circumference }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--aura-lavender)" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`font-display text-4xl md:text-5xl leading-none ${light ? 'text-[#1a1a1f]' : 'text-white'}`}
          >
            {rating}
          </motion.span>
          <span className={`font-body text-xs ${light ? 'text-[#1a1a1f]/40' : 'text-white/40'}`}>/10</span>
        </div>
      </div>
    </div>
  )
}

function TypewriterText({ text, speed = 20 }) {
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
  const isMobile = useIsMobile()
  const [cards, setCards] = useState(() => shuffle(tarotDeck))
  const [isShuffling, setIsShuffling] = useState(false)
  const [isSpreading, setIsSpreading] = useState(false)
  const [selectedCards, setSelectedCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [scatterPositions, setScatterPositions] = useState({})
  const [showReading, setShowReading] = useState(false)
  const [readingText, setReadingText] = useState('')
  const [loadingReading, setLoadingReading] = useState(false)
  const [energyRating, setEnergyRating] = useState(null)

  useEffect(() => {
    setIsSpreading(true)
    const timer = setTimeout(() => setIsSpreading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const displayCards = useMemo(() => isMobile ? cards.slice(0, 28) : cards, [isMobile, cards])

  const doShuffle = useCallback(async () => {
    if (isShuffling) return
    setIsShuffling(true)
    setSelectedCards([])
    setFlippedCards([])
    setShowReading(false)
    setReadingText('')
    setEnergyRating(null)

    const pos = {}
    displayCards.forEach(card => {
      pos[card.id] = {
        x: (Math.random() - 0.5) * (isMobile ? 240 : 500),
        y: (Math.random() - 0.5) * (isMobile ? 320 : 400),
        rotate: (Math.random() - 0.5) * 360,
      }
    })
    setScatterPositions(pos)

    await new Promise(r => setTimeout(r, 800))
    setCards(shuffle(tarotDeck))
    await new Promise(r => setTimeout(r, 700))
    setScatterPositions({})
    
    setIsSpreading(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSpreading(false)
    setIsShuffling(false)
  }, [isShuffling, isMobile, displayCards])

  const handleCardClick = useCallback((card) => {
    if (isShuffling || isSpreading) return
    if (flippedCards.includes(card.id)) return
    if (selectedCards.find(c => c.id === card.id)) return
    if (selectedCards.length >= 3) return

    setSelectedCards(prev => [...prev, card])
    setTimeout(() => {
      setFlippedCards(prev => [...prev, card.id])
    }, 200)
  }, [isShuffling, isSpreading, selectedCards, flippedCards])

  const fetchReading = async () => {
    setLoadingReading(true)
    setShowReading(true)
    await new Promise(r => setTimeout(r, 2000))
    
    const mockReadings = [
      `**Past:** ${selectedCards[0]?.name} indicates a cycle of deep introspection that has finally come to a close. You have gathered the wisdom needed for your next evolution.\n\n**Present:** ${selectedCards[1]?.name} is the heart of your current journey. It signifies a moment of absolute clarity and the courage to act upon your intuition.\n\n**Future:** ${selectedCards[2]?.name} promises a flourishing of your creative and spiritual energy. A long-held intention is beginning to manifest in the physical realm.\n\n*Today's Energy: The universe is conspiring in your favor. Trust the silent whispers of your soul.*`,
    ]
    setReadingText(mockReadings[0])
    setEnergyRating(8.4)
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
    <div className="page-wrapper min-h-screen relative bg-void overflow-x-hidden">
      <AuroraBackground />

      <div className={`relative z-10 ${isMobile ? 'pt-32' : 'pt-20 md:pt-32'}`}>
        {/* Header */}
        <div className="text-center px-6 mb-8 md:mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-heading text-[10px] md:text-xs tracking-[0.4em] text-lavender uppercase mb-4"
          >
            ✦ The Oracle ✦
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-7xl text-white mb-4 leading-none"
          >
            Daily Draw
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-sm md:text-base text-white/50 max-w-md mx-auto"
          >
            {selectedCards.length === 0
              ? 'Shuffle the deck and select three cards to reveal the path ahead'
              : selectedCards.length < 3
              ? `Select ${3 - selectedCards.length} more card${3 - selectedCards.length === 1 ? '' : 's'}`
              : 'The cards have been aligned'}
          </motion.p>
        </div>

        {/* Selection tray */}
        <div className="flex justify-center gap-3 md:gap-8 px-4 mb-10">
          {[0, 1, 2].map(i => (
            <SelectedSlot key={i} card={selectedCards[i]} position={i} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 px-6 mb-8 relative z-20">
          <motion.button
            whileHover={isMobile ? {} : { y: -3, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            onClick={doShuffle}
            disabled={isShuffling}
            className="flex items-center gap-2 md:gap-3 px-5 md:px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-heading text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 disabled:opacity-50 flex-1 max-w-[180px]"
          >
            <motion.div
              animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
              transition={isShuffling ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Shuffle size={14} />
            </motion.div>
            {isMobile ? 'Shuffle' : 'Shuffle Deck'}
          </motion.button>

          {selectedCards.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={isMobile ? {} : { y: -3, color: 'white' }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="flex items-center gap-2 md:gap-3 px-5 md:px-8 py-4 border border-white/10 rounded-xl text-white/50 font-heading text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 flex-1 max-w-[180px]"
            >
              <RotateCcw size={14} />
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
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-center px-6 mb-12 relative z-20"
            >
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.05, backgroundColor: 'white', color: 'black' }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchReading}
                className="flex items-center gap-3 px-10 md:px-12 py-5 md:py-6 bg-white/95 text-black rounded-2xl font-heading text-xs md:text-sm tracking-[0.2em] uppercase font-bold shadow-[0_20px_50px_rgba(167,139,250,0.3)] transition-all duration-300 w-full max-w-[320px]"
              >
                <Eye size={18} />
                Reveal Destiny
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Ring Container */}
        <div className="relative h-[360px] md:h-[700px] flex items-center justify-center perspective-[2000px] w-full mt-10 md:mt-20 mb-24 overflow-visible">
          <motion.div
            animate={isShuffling ? { rotate: 0 } : { rotate: 360 }}
            transition={isShuffling ? { duration: 0.8 } : { duration: 240, repeat: Infinity, ease: 'linear' }}
            className="relative w-0 h-0 preserve-3d"
          >
            {displayCards.map((card, index) => (
              <TarotCard
                key={card.id}
                card={card}
                isSelected={selectedCards.some(c => c.id === card.id)}
                isFlipped={flippedCards.includes(card.id)}
                onClick={handleCardClick}
                index={index}
                totalCards={displayCards.length}
                isShuffling={isShuffling}
                isSpreading={isSpreading}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] overflow-y-auto bg-void/98 backdrop-blur-[40px] px-6 py-20 md:py-32"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-end mb-12">
                <motion.button
                  whileHover={{ rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => setShowReading(false)}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-300"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="text-center mb-16">
                  <p className="font-heading text-xs tracking-[0.4em] text-lavender uppercase mb-4">
                    ✦ Celestial Interpretation ✦
                  </p>
                  <h2 className="font-display text-5xl md:text-7xl text-white leading-tight">
                    The Reading
                  </h2>
                </div>

                {/* Three cards display */}
                <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 mb-20">
                  {selectedCards.map((card, i) => (
                    <div key={card.id} className="flex-1 flex flex-col items-center gap-5 w-full max-w-[200px] md:max-w-none">
                      <div className="w-full aspect-[160/256] rounded-3xl bg-violet-300 border-[3px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(167,139,250,0.15)] relative overflow-hidden">
                        <img 
                          src={getCardImage(card)} 
                          alt={card.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent pt-8 pb-4 px-3">
                          <p className="font-heading text-xs text-white font-semibold text-center uppercase tracking-wider">
                            {card.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="font-heading text-[10px] text-lavender tracking-[0.3em] uppercase font-bold block mb-1">
                          {['Past', 'Present', 'Future'][i]}
                        </span>
                        <div className="w-8 h-px bg-white/20 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reading text box */}
                <div className="relative bg-white/70 backdrop-blur-md border border-white/40 rounded-[32px] p-8 md:p-16 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-lavender/60" />
                  
                  {loadingReading ? (
                    <div className="flex flex-col gap-6">
                      {[100, 85, 95, 70, 80, 60].map((w, i) => (
                        <div key={i} className="shimmer h-4 rounded-full bg-black/5" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  ) : (
                    <div className="font-body text-lg md:text-xl leading-relaxed text-[#1a1a1f] font-medium tracking-wide">
                      <TypewriterText text={readingText} speed={15} />
                    </div>
                  )}
                </div>

                {/* Energy gauge & Footer */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                  {!loadingReading && energyRating && (
                    <div className="flex-1 w-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-3xl p-10 flex justify-center shadow-sm">
                      <EnergyGauge rating={energyRating} light />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#1a1a1f', color: 'white' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReading(false)}
                    className="flex-1 w-full md:w-auto py-6 px-12 bg-white/80 border border-white rounded-2xl text-[#1a1a1f] font-heading text-sm tracking-widest uppercase font-bold transition-all duration-300 shadow-md"
                  >
                    Return to Sanctuary
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
