import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
  style = {},
  hover = true,
  onClick,
  glowColor,
  padding = '32px',
  borderRadius = '20px',
}) {
  return (
    <motion.div
      className={`glass ${hover ? 'glass-hover' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      style={{
        padding,
        borderRadius,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: glowColor
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 40px ${glowColor}, var(--glass-inset)`
          : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
