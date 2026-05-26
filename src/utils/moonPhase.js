/**
 * Precise Moon Phase Calculation
 * Reference: https://en.wikipedia.org/wiki/Lunar_phase
 * Synodic Period: ~29.530588853 days
 */

const SYNODIC_PERIOD = 29.530588853
const REFERENCE_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime() // Julian date reference point

export function getMoonPhase(date = new Date()) {
  const msPerDay = 1000 * 60 * 60 * 24
  const time = date.getTime()
  
  // Days since reference new moon
  const daysSince = (time - REFERENCE_NEW_MOON) / msPerDay
  
  // Current cycle position (0 to 29.53...)
  const cyclePosition = ((daysSince % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD
  
  // Phase Name Logic (based on cycle division)
  let phaseName
  if (cyclePosition < 1) phaseName = 'New Moon'
  else if (cyclePosition < 6.38) phaseName = 'Waxing Crescent'
  else if (cyclePosition < 8.38) phaseName = 'First Quarter'
  else if (cyclePosition < 13.77) phaseName = 'Waxing Gibbous'
  else if (cyclePosition < 15.77) phaseName = 'Full Moon'
  else if (cyclePosition < 21.15) phaseName = 'Waning Gibbous'
  else if (cyclePosition < 23.15) phaseName = 'Last Quarter'
  else if (cyclePosition < 28.53) phaseName = 'Waning Crescent'
  else phaseName = 'New Moon'

  /**
   * Illumination calculation:
   * 0% at New Moon (cycle 0)
   * 100% at Full Moon (cycle ~14.76)
   */
  const illumination = Math.round((1 - Math.cos((cyclePosition / SYNODIC_PERIOD) * 2 * Math.PI)) / 2 * 100)

  return { 
    phaseName, 
    illumination, 
    cyclePosition, 
    moonAge: Math.floor(cyclePosition) 
  }
}
