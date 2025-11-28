import React from 'react'
import Joyride from 'react-joyride'

export const OnboardingTour = () => {
  const steps = [
    { target: '.torqued-header', content: 'Welcome to Torqued!' },
    { target: '.kpi-section', content: 'Here are your key metrics' }
  ]
  return <Joyride steps={steps} continuous showSkipButton />
}
