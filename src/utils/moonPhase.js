const SYNODIC_PERIOD = 29.53059
const REFERENCE_NEW_MOON = new Date('2000-01-06T00:00:00Z')

export function getMoonPhase(date = new Date()) {
  const msPerDay = 1000 * 60 * 60 * 24
  const daysSinceReference = (date - REFERENCE_NEW_MOON) / msPerDay
  const cyclePosition = ((daysSinceReference % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD
  const illumination = Math.round((1 - Math.cos((cyclePosition / SYNODIC_PERIOD) * 2 * Math.PI)) / 2 * 100)

  let phaseName
  if (cyclePosition < 1.85) phaseName = 'New Moon'
  else if (cyclePosition < 7.38) phaseName = 'Waxing Crescent'
  else if (cyclePosition < 9.22) phaseName = 'First Quarter'
  else if (cyclePosition < 14.77) phaseName = 'Waxing Gibbous'
  else if (cyclePosition < 16.61) phaseName = 'Full Moon'
  else if (cyclePosition < 22.15) phaseName = 'Waning Gibbous'
  else if (cyclePosition < 23.99) phaseName = 'Last Quarter'
  else phaseName = 'Waning Crescent'

  return { phaseName, illumination, cyclePosition, moonAge: Math.floor(cyclePosition) }
}
